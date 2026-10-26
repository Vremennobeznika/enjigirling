#!/usr/bin/env node
'use strict';
/* Executable acceptance matrix for BOTH engineering catalogs and their AI packages. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const core=require('../atlas-ai-core.js');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const sandbox={window:{}};
for(const p of ['materials-data.js','processes-data.js','data.js'])vm.runInNewContext(read(p),sandbox,{filename:p,timeout:8000});
const materials=JSON.parse(JSON.stringify(sandbox.window.engineeringMaterials));
const processes=JSON.parse(JSON.stringify(sandbox.window.engineeringProcesses));
const professions=new Set(sandbox.window.professionsData.map(x=>x.id));
const registry=json('knowledge/source-registry.json');
const quality=json('knowledge/quality.json');
const processIds=new Set(processes.map(x=>x.id));
const materialIds=new Set(materials.map(x=>x.id));
const keys=Object.keys(core.sectors);
let passed=0;
function gate(name,run){run();passed++;console.log('PASS '+name);}
gate('A01/A02 duplicate IDs, mandatory data, all 16 industries',()=>{
 assert.equal(processIds.size,processes.length);
 assert.equal(materialIds.size,materials.length);
 assert.equal(keys.length,16);
 for(const p of processes){
  for(const k of ['id','name','description','steps','checks','profession','industry','category'])assert.ok(p[k],p.id+' / '+k);
  assert.ok(Object.hasOwn(core.sectors,p.industry),p.id);
 }
 for(const m of materials){
  for(const k of ['id','name','family','detail','note','uses','group'])assert.ok(m[k],m.id+' / '+k);
  assert.ok(m.industries?.length&&m.industries.every(x=>Object.hasOwn(core.sectors,x)),m.id);
 }
 for(const key of keys){
  assert.ok(processes.some(p=>p.industry===key),'process sector '+key);
  assert.ok(materials.some(m=>m.industries.includes(key)),'material sector '+key);
 }
});
gate('L01-L05 cross references are resolvable and editorial',()=>{
 for(const p of processes){
  assert.ok(professions.has(p.profession),'unknown profession '+p.id);
  for(const id of p.materials||[])assert.ok(materialIds.has(id),'unknown material '+id);
  if(p.parentId)assert.ok(processIds.has(p.parentId),'unknown parent '+p.id);
 }
 for(const m of materials)for(const id of m.process||[])assert.ok(processIds.has(id),'unknown process '+id);
 for(const p of processes){
  const seen=new Set();let current=p;
  while(current.parentId){assert.ok(!seen.has(current.id),'parent cycle '+p.id);seen.add(current.id);current=processes.find(x=>x.id===current.parentId);assert.ok(current);}
 }
 assert.ok(/Редакцион|редакцион|навигацион|не подтвержда/.test(read('materials.js')+read('materials.html')));
 assert.ok(read('processes.js').includes('не подтверждение'));
});
gate('E01-E03 evidence scope, source IDs, truthful status',()=>{
 const sourceIds=new Set(registry.sources.map(s=>s.sourceId));
 const rowsByType={materials:new Map(),processes:new Map()};
 for(const x of registry.recordEvidence){
  if(!rowsByType[x.recordType])continue;
  assert.ok(sourceIds.has(x.sourceId),'source '+x.sourceId);
  const map=rowsByType[x.recordType];if(!map.has(x.recordId))map.set(x.recordId,[]);
  map.get(x.recordId).push(x);
 }
 for(const [kind,arr] of [['materials',materials],['processes',processes]]){
  for(const x of arr){
   assert.ok(rowsByType[kind].has(x.id),'no evidence link '+x.id);
   assert.ok(x.sources?.length,'no sources '+x.id);
   assert.ok(x.evidence?.reviewScope,'unscoped evidence '+x.id);
   for(const s of x.sources)assert.match(s.url,/^https:\/\/[^\s]+$/,'invalid source '+x.id);
   if(kind==='materials'&&x.evidence.verificationStatus==='partial_claim')
    assert.ok(rowsByType[kind].get(x.id).some(y=>y.verificationStatus==='claim_checked'),'unjustified partial claim '+x.id);
  }
 }
 assert.equal(quality.byDataset.materials.records,materials.length);
 assert.equal(quality.byDataset.processes.records,processes.length);
});
gate('D01-D03 canonical JSON, AI sections, index and graph',()=>{
 const knowledge=[['materials','materials-data.js',materials],['processes','processes-data.js',processes]];
 for(const [name,source,records] of knowledge){
  const canonical=json('knowledge/'+name+'.json');
  assert.equal(canonical.items.length,records.length);
  const byId=new Map(canonical.items.map(x=>[x.id,x]));
  for(const x of records){const {knowledgeMeta,...rest}=byId.get(x.id)||{};assert.deepEqual(rest,x,'canonical diff '+x.id);}
  const section=json('knowledge/sections/'+name+'.json');
  assert.equal(section.recordsCount,records.length);
  assert.equal(section.records.length,records.length);
 }
 const index=json('knowledge/search-index.json');
 assert.equal(index.recordCount,index.records.length);
 for(const [type,n] of [['process',processes.length],['material',materials.length]])assert.equal(index.records.filter(x=>x.type===type).length,n);
 const graph=json('knowledge/graph.json');
 assert.equal(graph.edgeCount,graph.edges.length);
 for(const m of materials){
  const ids=graph.edges.filter(e=>e.from==='material:'+m.id&&e.relation==='processed_by').map(e=>e.to.slice(8));
  assert.deepEqual(ids,m.process||[]);
 }
});
gate('AI01-AI03 16 sectors, scope switches, full unique catalogs',()=>{
 const all=core.build(materials,processes,'all');
 assert.equal(all.counts.total,materials.length+processes.length);
 assert.equal(all.counts.processes,processes.length);
 assert.equal(all.counts.materials,materials.length);
 for(const key of keys){
  const bundle=core.build(materials,processes,key);
  const expectedP=processes.filter(x=>x.industry===key);
  const expectedM=materials.filter(x=>x.industries.includes(key));
  assert.deepEqual(bundle.processes.map(x=>x.id).sort(),expectedP.map(x=>x.id).sort(),'process sector '+key);
  assert.deepEqual(bundle.materials.map(x=>x.id).sort(),expectedM.map(x=>x.id).sort(),'material sector '+key);
  const onlyP=core.build(materials,processes,key,'processes');
  const onlyM=core.build(materials,processes,key,'materials');
  assert.equal(onlyP.materials.length,0);assert.equal(onlyP.processes.length,expectedP.length);
  assert.equal(onlyM.processes.length,0);assert.equal(onlyM.materials.length,expectedM.length);
 }
 assert.throws(()=>core.build(materials,processes,'nonsense'),/Выберите отрасль/);
});
gate('AI04-AI06 Markdown/JSON/JSONL integrity and provenance',()=>{
 const all=core.build(materials,processes,'all');
 const md=core.markdown(all);
 assert.ok(md.includes('## Производственные процессы')&&md.includes('## Инженерные материалы'));
 assert.ok(md.includes('Предел проверки:')&&md.includes('Источники:'));
 assert.equal((md.match(/^### .+ \[[^\]]+\]$/gm)||[]).length,all.counts.total);
 assert.ok(md.includes('https://'));
 assert.deepEqual(JSON.parse(core.json(all)).counts,all.counts);
 const jl=core.jsonl(all).trimEnd().split('\n').map(JSON.parse);
 assert.equal(jl.length,all.counts.total);
 assert.equal(jl.filter(x=>x.recordType==='process').length,all.counts.processes);
 assert.equal(jl.filter(x=>x.recordType==='material').length,all.counts.materials);
 assert.ok(jl.every(x=>x.recordUrl?.startsWith('https://')&&x.notice&&x.evidence?.reviewScope));
 for(const key of keys){const b=core.build(materials,processes,key);assert.equal(core.jsonl(b).trimEnd().split('\n').length,b.counts.total);}
});
gate('AI08-AI12 browser controls and no API dependencies',()=>{
 for(const page of ['ai.html']){
  const h=read(page);
  for(const id of ['atlasAiPackage','atlasAiSector','atlasAiScope','atlasAiMd','atlasAiJson','atlasAiJsonl','atlasAiZip','atlasAiCopy','atlasAiStatus'])
   assert.ok(h.includes('id="'+id+'"'),page+': missing '+id);
  assert.ok(h.indexOf('atlas-ai-core.js')<h.indexOf('atlas-ai-download.js'),page+' order');
 }
 for(const page of ['materials.html','processes.html']) assert.ok(!read(page).includes('id="atlasAiPackage"'),page+' still duplicates AI exports');
 const ui=read('atlas-ai-download.js');
 assert.ok(!/fetch\s*\(|XMLHttpRequest|localStorage|apiKey|WebSocket/.test(ui));
 const css=read('ai-transfer.css');
 assert.ok(css.includes('.atlas-ai-pack')&&css.includes('max-width:550px'));
 assert.ok(read('docs/atlas-audit-matrix.md').includes('AI07'));
});
async function checkZip(){
 const {blob,files,manifest}=core.archive(materials,processes);
 assert.equal(files,37);
 assert.equal(manifest.industries.length,16);
 const bytes=Buffer.from(await blob.arrayBuffer());
 const checksum=(data)=>{
  let c=0xffffffff;for(const b of data){c^=b;for(let j=0;j<8;j++)c=(c&1)?((c>>>1)^0xedb88320):c>>>1;}
  return (c^0xffffffff)>>>0;
 };
 let offset=0;const names=[];
 while(offset+30<bytes.length&&bytes.readUInt32LE(offset)===0x04034b50){
  const crc=bytes.readUInt32LE(offset+14);
  const size=bytes.readUInt32LE(offset+18);
  const len=bytes.readUInt16LE(offset+26),extra=bytes.readUInt16LE(offset+28);
  const name=bytes.subarray(offset+30,offset+30+len).toString('utf8');
  const start=offset+30+len+extra;
  assert.equal(checksum(bytes.subarray(start,start+size)),crc,'ZIP CRC '+name);
  names.push(name);offset=start+size;
 }
 assert.equal(names.length,37);
 assert.ok(names.includes('README.md')&&names.includes('all.md')&&names.includes('all.json')&&names.includes('all.jsonl')&&names.includes('manifest.json'));
 for(const sector of keys)assert.ok(names.includes('sectors/'+sector+'.md')&&names.includes('sectors/'+sector+'.json'));
 assert.equal(bytes.readUInt32LE(bytes.length-22),0x06054b50,'missing ZIP end');
 console.log('PASS AI07 ZIP real byte-level validation ('+bytes.length+' bytes)');
}
checkZip().then(()=>console.log('ATLAS MATRIX PASS: '+(passed+1)+' / '+(passed+1)+' gates, '+keys.length+' sectors, '+(processes.length+materials.length)+' records')).catch(err=>{console.error(err);process.exitCode=1;});
