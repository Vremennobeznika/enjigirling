#!/usr/bin/env node
// Read-only smoke test for the deployed static knowledge base.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const compareExact=['ai.html','ai-transfer.css','ai-transfer.js','atlas-ai-core.js','atlas-ai-download.js','knowledge/sections/index.json','knowledge/sections/all.md','knowledge/sections/professions.md','knowledge/sections/professions.json','knowledge/sections/calendar.md','knowledge/sections/calendar.json','knowledge/sections/resources.md','knowledge/sections/resources.json','knowledge/sections/ai-code-library.md','knowledge/sections/ai-code-library.json','knowledge/ai-code-library-links.txt','knowledge/sections/dictionary.md','knowledge/sections/dictionary.json','knowledge/sections/learning.md','knowledge/sections/learning.json','knowledge/sections/calculators.md','knowledge/sections/calculators.json','knowledge/sections/compare.md','knowledge/sections/compare.json','knowledge/sections/processes.md','knowledge/sections/processes.json','knowledge/sections/materials.md','knowledge/sections/materials.json','knowledge-base.md','knowledge/professions.json','knowledge/materials.json','knowledge/processes.json','knowledge/dictionary.json','knowledge/salary-evidence.json','index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','calculator-atlas.html','calculator-atlas-data.js','calculator-atlas.js','calculator-atlas.css','calculator-atlas.csv','compare.html','processes.html','materials.html','knowledge-manifest.json','knowledge/search-index.json','knowledge/graph.json','knowledge/source-registry.json','knowledge/ai-context.md','knowledge/quality.json','llms.txt'];
const extraPages=["ai-training.html","articles/utopia-math-analysis.html","calendar/index.html","chroma/index.html","everyday/index.html","life/index.html","life/planner/index.html","mood-layers/index.html","plants/index.html","shopping/index.html"];
const digest=value=>crypto.createHash('sha256').update(value,'utf8').digest('hex');
const base=(process.env.SITE_URL||'https://vremennobeznika.github.io/enjigirling/').replace(/\/+$/,'')+'/';
const paths=['ai.html','ai-transfer.css','ai-transfer.js','atlas-ai-core.js','atlas-ai-download.js','knowledge/sections/index.json','knowledge/sections/all.md','knowledge/sections/professions.md','knowledge/sections/professions.json','knowledge/sections/calendar.md','knowledge/sections/calendar.json','knowledge/sections/resources.md','knowledge/sections/resources.json','knowledge/sections/ai-code-library.md','knowledge/sections/ai-code-library.json','knowledge/ai-code-library-links.txt','knowledge/sections/dictionary.md','knowledge/sections/dictionary.json','knowledge/sections/learning.md','knowledge/sections/learning.json','knowledge/sections/calculators.md','knowledge/sections/calculators.json','knowledge/sections/compare.md','knowledge/sections/compare.json','knowledge/sections/processes.md','knowledge/sections/processes.json','knowledge/sections/materials.md','knowledge/sections/materials.json','knowledge-base.md','knowledge/professions.json','knowledge/materials.json','knowledge/processes.json','knowledge/dictionary.json','knowledge/salary-evidence.json','index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','calculator-atlas.html','calculator-atlas-data.js','calculator-atlas.js','calculator-atlas.css','calculator-atlas.csv','compare.html','processes.html','materials.html','llms.txt','knowledge-manifest.json','knowledge/search-index.json','knowledge/graph.json','knowledge/source-registry.json','knowledge/ai-context.md','knowledge/quality.json'];
async function get(path){
 const url=new URL(path,base);
 const response=await fetch(url,{signal:AbortSignal.timeout(20000),redirect:'follow',headers:{'accept':'text/html,application/json,text/plain;q=0.9'}});
 assert.equal(response.status,200,path+' returned '+response.status);
 assert.ok(!response.url.includes('/login'),'unexpected login redirect');
 return response.text();
}
async function run(){
 const responses=await Promise.all([...paths,...extraPages].map(async p=>[p,await get(p)]));
 const files=Object.fromEntries(responses);
 // Check production resources actually linked from each of the nine HTML pages.
 const assets=new Set();
 for(const name of [...paths.filter(p=>p.endsWith('.html')), ...extraPages]){
  for(const match of files[name].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/g)){
   const href=match[1].split(/[?#]/)[0];
   if(!href||/^(https?:|mailto:|tel:|data:|\/\/|#)/i.test(href))continue;
   const origin=new URL(base);
   const target=new URL(href,new URL(name,base));
   if(target.origin!==origin.origin||!target.pathname.startsWith(origin.pathname))continue;
   assets.add(target.pathname.slice(origin.pathname.length));
  }
 }
 const missingAssets=[];
 for(const asset of assets){
  try{if(!files[asset])await get(asset);}catch(e){missingAssets.push(asset+': '+e.message);}
 }
 assert.deepEqual(missingAssets,[],'published HTML contains broken local assets');
 // A stale deployment can have valid JSON and identical record counts. Compare
 // published content against the exact repository revision deployed by Actions.
 for(const name of [...compareExact,...extraPages]){
  const expected=fs.readFileSync(path.join(root,name),'utf8');
  // Response.text() removes a UTF-8 BOM while fs.readFileSync('utf8') keeps it.
  // Preserve an exact text comparison after accounting solely for that decoding rule.
  const expectedText=name.endsWith('.csv')?expected.replace(/^\uFEFF/,''):expected;
  assert.equal(digest(files[name]),digest(expectedText),name+' is stale or differs from the checked-out commit');
 }
 for(const name of extraPages){
  assert.match(files[name],/<html/i,name+' missing HTML root');
  assert.match(files[name],/<title/i,name+' missing title');
 }
 for(const name of paths.filter(p=>p.endsWith('.html'))){
  assert.ok(files[name].includes('<main'),name+' missing main landmark');
  assert.ok(files[name].includes('navigation.js'),name+' missing shared navigation');
  const canonical=base+(name==='index.html'?'':name);
  assert.ok(files[name].includes('rel="canonical" href="'+canonical+'"'),name+' canonical URL missing or mismatched');
 }
 const packIndex=JSON.parse(files['knowledge/sections/index.json']);
 assert.equal(packIndex.sections.length,10,'ten AI catalog packages required');
 const codePack=packIndex.sections.find(x=>x.id==='ai-code-library');
 assert.ok(codePack,'standalone AI programming library not published');
 assert.equal(codePack.records,25,'AI programming library count mismatch');
 const onlyCode=JSON.parse(files['knowledge/sections/ai-code-library.json']);
 assert.equal(onlyCode.records.length,25);
 assert.ok(onlyCode.records.every(x=>x.type==='Библиотека программирования для ИИ'),'unrelated resources leaked into separate library');
 assert.equal(files['knowledge/ai-code-library-links.txt'].trim().split(/\r?\n/).length,25,'all 25 downloadable URLs required');
 for(const p of packIndex.sections){
  assert.ok(files[p.markdown]?.includes('## Текст и описание раздела'),'AI Markdown incomplete: '+p.id);
  const data=JSON.parse(files[p.json]);
  assert.equal(data.sectionId,p.id,'AI JSON has wrong section ID');
  assert.equal(data.records.length,data.recordsCount,'AI record count mismatch');
 }
 assert.ok(files['knowledge/sections/all.md'].includes('Календарь инженерных дат'),'full AI export missing calendar');
 assert.ok(files['ai.html'].includes('knowledge/ai-context.md'),'AI hub lacks overview Markdown');
 for(const id of ['atlasAiPackage','atlasAiSector','atlasAiMd','atlasAiJson','atlasAiJsonl','atlasAiZip'])
  assert.ok(files['ai.html'].includes('id="'+id+'"'),'AI hub missing combined export control: '+id);
 for(const page of ['processes.html','materials.html'])
  assert.ok(files[page].includes('id="atlasAiPackage"'),page+' missing combined atlas export');
 const manifest=JSON.parse(files['knowledge-manifest.json']);
 assert.equal(manifest.type,'engineering-knowledge-base');
 const index=JSON.parse(files['knowledge/search-index.json']);
 assert.equal(index.recordCount,index.records.length);
 const datasetSizes=Object.fromEntries(['professions','materials','processes','dictionary'].map(type=>[type,JSON.parse(fs.readFileSync(path.join(root,'knowledge/'+type+'.json'),'utf8')).items.length]));
 for(const [type,size] of Object.entries(datasetSizes)){
  const dataset=JSON.parse(files['knowledge/'+type+'.json']);
  assert.ok(Array.isArray(dataset.items),type+' deployed dataset missing items');
  assert.equal(dataset.items.length,size,type+' deployed dataset has unexpected count');
 }
 assert.equal(Object.values(datasetSizes).reduce((a,b)=>a+b,0),index.recordCount,'deployed index and dataset totals differ');
 assert.ok(index.records.length>0,'knowledge index is empty');
 const graph=JSON.parse(files['knowledge/graph.json']);
 assert.equal(graph.edgeCount,graph.edges.length);
 const quality=JSON.parse(files['knowledge/quality.json']);
 assert.equal(quality.totalRecords,index.recordCount,'deployed quality coverage total mismatches index');
 const sources=JSON.parse(files['knowledge/source-registry.json']);
 assert.ok(Array.isArray(sources.sources)&&Array.isArray(sources.recordEvidence));
 assert.ok(files['knowledge/ai-context.md'].includes('## Краткий каталог ('+index.records.length+' записей)'),'AI context and index record counts disagree');
 const listed=(files['knowledge/ai-context.md'].match(/^- \*\*.+\*\* — /gm)||[]).length;
 assert.equal(listed,index.records.length,'AI context does not contain every indexed record');
 assert.ok(files['llms.txt'].includes('knowledge-manifest.json'),'AI entrypoint does not mention manifest');
 console.log('LIVE PASS: '+(paths.length+extraPages.length)+' HTTP endpoints, '+assets.size+' local asset paths, '+(compareExact.length+extraPages.length)+' exact SHA-256 content matches, '+index.recordCount+' records, '+graph.edgeCount+' graph edges');
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
