// Compare the current branch against the main branch rendered in the same CI run.
const {chromium}=require('@playwright/test');
const {PNG}=require('pngjs');
const fs=require('node:fs');
// calendar.html intentionally changed; its dedicated Playwright tests validate the new UI.
// Compare all other sections to ensure no cross-site visual regressions.
const pages=['index.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 let failures=[];
 fs.mkdirSync('visual-diff',{recursive:true});
 try {
  for(const theme of ['light','dark']) for(const width of [390,1440]) for(const name of pages){
   const capture=async(port)=>{
    const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    await page.addInitScript(selected=>localStorage.setItem('theme',selected),theme);
    await page.goto('http://127.0.0.1:'+port+'/'+name,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const image=PNG.sync.read(await page.screenshot({fullPage:true,animations:'disabled'}));
    await page.close();
    return image;
   };
   const base=await capture(8766),current=await capture(8765);
   let changed=0,total=0;
   if(base.width!==current.width||base.height!==current.height){failures.push(name+' '+theme+' '+width+': dimension mismatch '+base.width+'x'+base.height+' vs '+current.width+'x'+current.height);continue;}
   const diff=new PNG({width:base.width,height:base.height});
   for(let i=0;i<base.data.length;i+=4){
    const delta=Math.max(Math.abs(base.data[i]-current.data[i]),Math.abs(base.data[i+1]-current.data[i+1]),Math.abs(base.data[i+2]-current.data[i+2]));
    const bad=delta>45;
    if(bad)changed++;
    total++;
    diff.data[i]=bad?255:current.data[i];
    diff.data[i+1]=bad?0:current.data[i+1];
    diff.data[i+2]=bad?0:current.data[i+2];
    diff.data[i+3]=255;
   }
   const percent=100*changed/total;
   console.log(name,theme,width,percent.toFixed(3)+'% pixels changed');
   if(percent>0.75){
    failures.push(name+' '+theme+' '+width+': '+percent.toFixed(3)+'% changed');
    fs.writeFileSync('visual-diff/'+name.replace('.html','')+'-'+theme+'-'+width+'.png',PNG.sync.write(diff));
   }
  }
 }finally{await browser.close();}
 if(failures.length){console.error('Visual differences over tolerance:\n'+failures.join('\n'));process.exitCode=1;}
 else console.log('PASS: 32 unchanged-section comparisons against main; calendar covered by browser tests');
})().catch(e=>{console.error(e);process.exitCode=1;});
