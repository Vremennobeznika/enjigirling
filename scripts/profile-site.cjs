#!/usr/bin/env node
// Local diagnostics: HTTP concurrency is not a capacity test of GitHub Pages.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {createHash}=require('node:crypto');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(process.env.PROFILE_ROOT||path.join(__dirname,'..'));
const base=process.env.PROFILE_BASE_URL||'http://127.0.0.1:8777/';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw Error('Only a local server may be load-tested');
const output=path.resolve(process.env.PROFILE_OUTPUT||path.join(root,'test-results/site-profile.json'));
const knownPages=['index','calendar','resources','dictionary','map','calculator','compare','processes','materials'];
const pages=process.env.PROFILE_PAGES?process.env.PROFILE_PAGES.split(','):knownPages;
if(!pages.length||pages.some(name=>!knownPages.includes(name)))throw Error('Unknown profile page');
const percentile=(xs,q)=>[...xs].sort((a,b)=>a-b)[Math.max(0,Math.ceil(xs.length*q)-1)];
const hash=data=>createHash('sha256').update(data).digest('hex');
const report={checkedAt:new Date().toISOString(),base,environment:{platform:process.platform,node:process.version,cpus:os.cpus().length},limits:['Synthetic local measurements; not real-user UX research','HTTP capacity belongs to the local Python server, not the production CDN','6x CPU slowdown and shaped network are emulation, not a physical low-end device'],navigation:[],interaction:[],catalogStress:[],httpLoad:[]};
async function browserProfile(){
 const browser=await chromium.launch();
 report.environment.browser=browser.version();
 try{
  for(const slow of [false,true])for(const name of pages)for(const sample of Array.from({length:slow&&['index','processes','materials'].includes(name)?3:1},(_,i)=>i+1)){
   const context=await browser.newContext({viewport:{width:slow?375:1440,height:900}}),page=await context.newPage();
   const cdp=await context.newCDPSession(page),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
   if(slow){await cdp.send('Emulation.setCPUThrottlingRate',{rate:6});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});}
   await page.addInitScript(()=>{
    window.profileMetrics={longTasks:[],lcp:0,cls:0};
    for(const type of ['longtask','largest-contentful-paint','layout-shift'])try{new PerformanceObserver(list=>{for(const e of list.getEntries()){
     if(type==='longtask')window.profileMetrics.longTasks.push(e.duration);
     if(type==='largest-contentful-paint')window.profileMetrics.lcp=e.startTime;
     if(type==='layout-shift'&&!e.hadRecentInput)window.profileMetrics.cls+=e.value;
    }}).observe({type,buffered:true});}catch{}
   });
   await page.goto(base+name+'.html',{waitUntil:'networkidle',timeout:60000});
   const values=await page.evaluate(()=>{
    const n=performance.getEntriesByType('navigation')[0],rs=performance.getEntriesByType('resource');
    return {...window.profileMetrics,domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd,domNodes:document.querySelectorAll('*').length,resourceBytes:rs.reduce((s,r)=>s+r.decodedBodySize,0),largestResources:rs.map(r=>({path:new URL(r.name).pathname,bytes:r.decodedBodySize,durationMs:r.duration})).sort((a,b)=>b.bytes-a.bytes).slice(0,5)};
   });
   report.navigation.push({page:name,sample,mode:slow?'cpu6x-network1.6Mbps-150ms':'desktop-local',...values,errors});
   console.log('PROFILE',name,slow?'slow':'desktop','LCP',Math.round(values.lcp),'ms','long task max',Math.round(Math.max(0,...values.longTasks)),'ms');
   if(sample===1&&['materials','processes','index'].includes(name)){
    const image=path.join(root,'test-results','profile-'+name+(slow?'-mobile':'-desktop')+'.png');
    fs.mkdirSync(path.dirname(image),{recursive:true});await page.screenshot({path:image});
   }
   if(slow&&sample===1&&['materials','processes','index'].includes(name)){
    const selector=name==='index'?'#globalSearch':name==='materials'?'#materialSearch':'#processSearch';
    await page.locator(selector).fill('сталь');await page.waitForTimeout(500);
    const timings=await page.evaluate(async selector=>{
     const node=document.querySelector(selector),times=[];
     for(let i=0;i<30;i++){
      const t=performance.now();node.value=['сталь','вода','__нет_совпадений__','','текстиль'][i%5];node.dispatchEvent(new Event('input',{bubbles:true}));
      const handlerMs=performance.now()-t;
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      times.push({handlerMs,paintMs:performance.now()-t});
     }
     return times;
    },selector);
    report.interaction.push({page:name,samples:timings.length,handlerP95Ms:percentile(timings.map(x=>x.handlerMs),.95),paintP95Ms:percentile(timings.map(x=>x.paintMs),.95),timings});
    if(name!=='index')report.catalogStress.push({page:name,...await page.evaluate(async selector=>{
     const node=document.querySelector(selector);node.value='';node.dispatchEvent(new Event('input',{bubbles:true}));
     await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
     const more=document.querySelector('.process-show-more'),steps=[];
     while(!more.hidden&&steps.length<20){const t=performance.now();more.click();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));steps.push(performance.now()-t);}
     return {paginationClicks:steps.length,paginationPaintMs:steps,domNodes:document.querySelectorAll('*').length,cards:document.querySelectorAll('#materialGrid > article,#processGrid > article').length,allShown:more.hidden};
    },selector)});
   }
   await context.close();
  }
 }finally{await browser.close();}
}
async function httpLoad(){
 const routes=['index.html','materials.html','processes.html','materials-data.js','processes-data.js','styles.css'].filter(p=>fs.existsSync(path.join(root,p)));
 const expected=new Map(routes.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]));
 for(const concurrency of [1,8,32]){
  let next=0,bytes=0;const samples=[],errors=[];const start=performance.now(),requests=120;
  await Promise.all(Array.from({length:concurrency},async()=>{
   while(next<requests){const index=next++,route=routes[index%routes.length],t=performance.now();try{
    const response=await fetch(base+route,{signal:AbortSignal.timeout(10000)}),body=Buffer.from(await response.arrayBuffer());
    if(response.status!==200||hash(body)!==expected.get(route))throw Error('status or body mismatch');
    bytes+=body.length;samples.push(performance.now()-t);
   }catch(e){errors.push({route,message:e.message});}}
  }));
  const durationMs=performance.now()-start;
  report.httpLoad.push({concurrency,requests,completed:samples.length,bytes,durationMs,requestsPerSecond:samples.length*1000/durationMs,p50Ms:percentile(samples,.5),p95Ms:percentile(samples,.95),maxMs:Math.max(0,...samples),errors});
  console.log('LOAD',concurrency,'clients',samples.length+'/'+requests,'p95',Math.round(percentile(samples,.95)),'ms','errors',errors.length);
 }
}
(async()=>{
 let server;
 try{
  try{await fetch(base,{signal:AbortSignal.timeout(500)});}catch{
   server=spawn('python3',['-m','http.server',new URL(base).port||'80','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
   let ready=false;
   for(let i=0;i<50&&!ready;i++){await new Promise(resolve=>setTimeout(resolve,100));try{ready=(await fetch(base,{signal:AbortSignal.timeout(500)})).ok;}catch{}}
   if(!ready)throw Error('Local server did not start');
  }
  await browserProfile();await httpLoad();
 }catch(e){report.error=e.stack;process.exitCode=1;}
 finally{server?.kill();fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log('SAVED',output);}
 if(report.navigation.some(x=>x.errors.length)||report.httpLoad.some(x=>x.errors.length))process.exitCode=1;
})();
