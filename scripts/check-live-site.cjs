#!/usr/bin/env node
// Read-only smoke test for the deployed static knowledge base.
const assert=require('node:assert/strict');
const base=(process.env.SITE_URL||'https://vremennobeznika.github.io/enjigirling/').replace(/\/+$/,'')+'/';
const paths=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html','llms.txt','knowledge-manifest.json','knowledge/search-index.json','knowledge/graph.json','knowledge/source-registry.json','knowledge/ai-context.md'];
async function get(path){
 const url=new URL(path,base);
 const response=await fetch(url,{signal:AbortSignal.timeout(20000),redirect:'follow',headers:{'accept':'text/html,application/json,text/plain;q=0.9'}});
 assert.equal(response.status,200,path+' returned '+response.status);
 assert.ok(!response.url.includes('/login'),'unexpected login redirect');
 return response.text();
}
async function run(){
 const responses=await Promise.all(paths.map(async p=>[p,await get(p)]));
 const files=Object.fromEntries(responses);
 for(const name of paths.filter(p=>p.endsWith('.html'))){
  assert.ok(files[name].includes('<main'),name+' missing main landmark');
  assert.ok(files[name].includes('navigation.js'),name+' missing shared navigation');
 }
 const manifest=JSON.parse(files['knowledge-manifest.json']);
 assert.equal(manifest.type,'engineering-knowledge-base');
 const index=JSON.parse(files['knowledge/search-index.json']);
 assert.equal(index.recordCount,index.records.length);
 assert.ok(index.records.length>0,'knowledge index is empty');
 const graph=JSON.parse(files['knowledge/graph.json']);
 assert.equal(graph.edgeCount,graph.edges.length);
 const sources=JSON.parse(files['knowledge/source-registry.json']);
 assert.ok(Array.isArray(sources.sources)&&Array.isArray(sources.recordEvidence));
 assert.ok(files['knowledge/ai-context.md'].includes('## Краткий каталог ('+index.records.length+' записей)'),'AI context and index record counts disagree');
 const listed=(files['knowledge/ai-context.md'].match(/^- \*\*.+\*\* — /gm)||[]).length;
 assert.equal(listed,index.records.length,'AI context does not contain every indexed record');
 assert.ok(files['llms.txt'].includes('knowledge-manifest.json'),'AI entrypoint does not mention manifest');
 console.log('LIVE PASS: '+paths.length+' HTTP endpoints, '+index.recordCount+' records, '+graph.edgeCount+' graph edges');
}
async function main(){
 let last;
 for(let i=1;i<=4;i++){
  try{await run();return;}catch(err){
   last=err;
   console.error('Live check attempt '+i+'/4: '+err.message);
   if(i<4)await new Promise(resolve=>setTimeout(resolve,10000));
  }
 }
 throw last;
}
main().catch(err=>{console.error('LIVE FAIL:',err.message);process.exitCode=1;});
