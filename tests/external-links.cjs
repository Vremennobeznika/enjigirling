#!/usr/bin/env node
// Audit external URLs without changing or deleting editorial resources.
// Network errors and anti-bot responses are reported as unverified, not broken.
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const sources=['resources-data.js','data.js','map-data.js'];
const links=new Map();
function add(url,source){
 if(typeof url!=='string'||!/^https?:\/\//i.test(url))return;
 if(!links.has(url))links.set(url,new Set());
 links.get(url).add(source);
}
for(const file of sources){
 if(!fs.existsSync(file))continue;
 const code=fs.readFileSync(file,'utf8');
 const sandbox={window:{}};
 try{
   vm.runInNewContext(code,sandbox,{timeout:3000});
   const walk=(v,depth=0)=>{
     if(depth>12||v==null)return;
     if(typeof v==='string'){add(v,file);return;}
     if(Array.isArray(v)){for(const x of v)walk(x,depth+1);return;}
     if(typeof v==='object')for(const x of Object.values(v))walk(x,depth+1);
   };
   walk(sandbox.window);
   if(file==='resources-data.js')walk(vm.runInNewContext(code+'\nresources',{}, {timeout:3000}));
 }catch(e){console.error('Cannot parse '+file+': '+e.message);process.exitCode=1;}
}
for(const file of fs.readdirSync('.').filter(x=>x.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');
 for(const m of html.matchAll(/(?:href|src)\s*=\s*["'](https?:[^"']+)["']/g))add(m[1],file);
}
const results=[];
const urls=[...links.keys()];
let cursor=0;
async function check(url){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),12000);
 try{
   const response=await fetch(url,{method:'GET',redirect:'follow',signal:controller.signal,headers:{'User-Agent':'ENJIGIRLING-link-audit/1.0'}});
   const status=response.status;
   if(response.body)await response.body.cancel().catch(()=>{});
   return {url,status,result:status>=200&&status<400?'ok':status===404||status===410?'broken':'unverified',sources:[...links.get(url)]};
 }catch(e){return {url,status:null,result:'unverified',reason:String(e.message||e).slice(0,140),sources:[...links.get(url)]};}
 finally{clearTimeout(timer);}
}
async function worker(){while(cursor<urls.length){const i=cursor++;results[i]=await check(urls[i]);}}
(async()=>{
 await Promise.all(Array.from({length:5},worker));
 const summary={checked:results.length,ok:results.filter(x=>x.result==='ok').length,broken:results.filter(x=>x.result==='broken').length,unverified:results.filter(x=>x.result==='unverified').length,generatedAt:new Date().toISOString()};
 fs.mkdirSync('audit',{recursive:true});
 fs.writeFileSync('audit/external-links.json',JSON.stringify({summary,results},null,2)+'\n');
 const report=['# External link audit','',...Object.entries(summary).map(([k,v])=>'- '+k+': '+v),'','## Broken (HTTP 404 / 410)','',...results.filter(x=>x.result==='broken').map(x=>'- '+x.status+' '+x.url+' ('+x.sources.join(', ')+')'),'','## Unverified (network errors, anti-bot or other HTTP status)','',...results.filter(x=>x.result==='unverified').map(x=>'- '+(x.status||x.reason)+' '+x.url)];
 fs.writeFileSync('audit/external-links.md',report.join('\n')+'\n');
 console.log(JSON.stringify(summary));
 if(summary.broken)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
