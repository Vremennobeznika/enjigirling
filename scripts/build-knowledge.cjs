#!/usr/bin/env node
// Deterministic static knowledge exports for GitHub Pages.
// Usage: node scripts/build-knowledge.cjs [--check]
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = 'https://vremennobeznika.github.io/enjigirling/';
const check = process.argv.includes('--check');
const sources = [
  ['professions','data.js','professionsData','index.html#profession='],
  ['materials','materials-data.js','engineeringMaterials','materials.html#'],
  ['processes','processes-data.js','engineeringProcesses','processes.html#'],
  ['dictionary','dictionary-data.js','dictionary','dictionary.html?q=']
];
function load(file, variable) {
  const code = fs.readFileSync(path.join(root,file),'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code + '\n;window.__exported = '+(variable==='dictionary'?'dictionary':'window.'+variable)+';', sandbox, {filename:file,timeout:5000});
  const data = JSON.parse(JSON.stringify(sandbox.window.__exported));
  assert.ok(Array.isArray(data) && data.length, file+' has no records');
  return data;
}
const datasets = Object.fromEntries(sources.map(([type,file,key])=>[type,load(file,key)]));
const ids = name => new Set(datasets[name].map(item => item.id));
const professionIds=ids('professions'), materialIds=ids('materials'), processIds=ids('processes');
for(const [name,set] of [['professions',professionIds],['materials',materialIds],['processes',processIds]]) {
  assert.equal(set.size,datasets[name].length,'duplicate IDs in '+name);
}
for(const material of datasets.materials) for(const p of material.process||[]) assert.ok(processIds.has(p),'unknown process '+p);
for(const process of datasets.processes) {
  for(const m of process.materials||[]) assert.ok(materialIds.has(m),'unknown material '+m);
  assert.ok(professionIds.has(process.profession),'unknown profession '+process.profession);
}
const writes = new Map();
const graph = [];
const addEdge = (from,to,relation) => graph.push({from,to,relation});
for (const m of datasets.materials) for (const id of m.process || []) addEdge('material:'+m.id,'process:'+id,'processed_by');
for (const p of datasets.processes) {
  for (const id of p.materials || []) addEdge('process:'+p.id,'material:'+id,'uses_material');
  addEdge('process:'+p.id,'profession:'+p.profession,'associated_profession');
}

function serialize(value){return JSON.stringify(value,null,2)+'\n';}
const index=[];
for (const [type,file,,page] of sources) {
  const rows=datasets[type];
  const items=rows.map(row=>({
    ...row,
    knowledgeMeta:{
      verificationStatus:'requires_source_review',
      sourceRecord:file,
      recordUrl:base+page+encodeURIComponent(type==='dictionary'?row.term:row.id)
    }
  }));
  writes.set('knowledge/'+type+'.json',serialize({
    schemaVersion:'1.0',dataset:type,language:'ru',
    quality:'editorial_not_independently_verified',
    sourceFile:file,sourceUrl:base+file,items
  }));
  for(let i=0;i<rows.length;i++){
    const x=rows[i];
    if(type==='professions') index.push({id:'profession:'+x.id,type:'profession',title:x.title,description:x.shortDesc||'',url:base+page+encodeURIComponent(x.id),dataset:'knowledge/professions.json'});
    if(type==='materials') index.push({id:'material:'+x.id,type:'material',title:x.name,description:[x.family,x.detail,x.uses].join(' '),url:base+page+encodeURIComponent(x.id),dataset:'knowledge/materials.json',relatedProcesses:x.process||[]});
    if(type==='processes') index.push({id:'process:'+x.id,type:'process',title:x.name,description:[x.description,x.steps,x.checks].join(' '),url:base+page+encodeURIComponent(x.id),dataset:'knowledge/processes.json',relatedMaterials:x.materials||[],relatedProfession:x.profession||null});
    if(type==='dictionary') index.push({id:'term:'+i,type:'term',title:x.term,description:x.def,url:base+page+encodeURIComponent(x.term),dataset:'knowledge/dictionary.json'});
  }
}
writes.set('knowledge/search-index.json',serialize({
 schemaVersion:'1.0',language:'ru',generatedFrom:'repository editorial datasets',recordCount:index.length,records:index
}));

function cleanAiText(value){
 return String(value??'').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').replace(/\|/g,'/').trim();
}
function aiContext(entries){
 const lines=[
  '# ENJIGIRLING — инженерный справочник для ИИ','',
  'Язык: русский. Тип: редакционный инженерный каталог, НЕ проверенная нормативная база.',
  'Дата файла не является датой проверки технических утверждений.',
  'Используйте первичные стандарты, технические паспорта и применимые редакции при ответах на инженерные вопросы.','',
  '## Машиночитаемые наборы','',
  '- Манифест: knowledge-manifest.json',
  '- Индекс: knowledge/search-index.json',
  '- Профессии: knowledge/professions.json',
  '- Материалы: knowledge/materials.json',
  '- Процессы: knowledge/processes.json',
  '- Словарь: knowledge/dictionary.json',
  '- Граф связей: knowledge/graph.json',
  '- Реестр доказательств: knowledge/source-registry.json',
  '- Данные о зарплатах и статусах: knowledge/salary-evidence.json','',
  '## Краткий каталог ('+entries.length+' записей)',''
 ];
 const labels={profession:'Профессии',material:'Материалы',process:'Процессы',term:'Термины'};
 for(const type of ['profession','material','process','term']){
  lines.push('### '+labels[type]);
  for(const x of entries.filter(e=>e.type===type)){
   const description=cleanAiText(x.description);
   lines.push('- **'+cleanAiText(x.title)+'** — '+description.slice(0,200)+(description.length>200?'…':'')+'. Подробнее: '+x.url);
  }
  lines.push('');
 }
 return lines.join('\n')+'\n';
}
writes.set('knowledge/ai-context.md',aiContext(index));
writes.set('knowledge/graph.json',serialize({schemaVersion:'1.0',language:'ru',status:'editorial_relationships',nodeCount:datasets.professions.length+datasets.materials.length+datasets.processes.length,edgeCount:graph.length,edges:graph}));
// Preserve existing salary-source evidence separately from editorial profession descriptions.
// A source snapshot is not a general endorsement of a salary estimate.
const salaryAudit=load('salary-sources.js','salarySourceAudit');
assert.equal(salaryAudit.length,datasets.professions.length,'salary evidence must cover every profession');
assert.equal(new Set(salaryAudit.map(x=>x.id)).size,salaryAudit.length,'duplicate salary evidence IDs');
for(const entry of salaryAudit){
 assert.ok(professionIds.has(entry.id),'orphan salary evidence: '+entry.id);
 assert.ok(['source_snapshot','unverified'].includes(entry.status),'invalid salary evidence status');
 if(entry.status==='unverified')assert.ok(entry.rangeMinRub==null && entry.rangeMaxRub==null,'unverified salary amounts must be hidden');
 if(entry.sourceUrl)assert.match(entry.sourceUrl,/^https:\/\/[^\s]+$/,'invalid evidence URL for '+entry.id);
}
writes.set('knowledge/salary-evidence.json',serialize({
 schemaVersion:'1.0',dataset:'salary-evidence',language:'ru',
 evidenceScope:'Salary observations, not independently validated occupational averages',
 sourceFile:'salary-sources.js',sourceUrl:base+'salary-sources.js',
 records:salaryAudit.map(x=>({
  ...x,
  professionId:x.id,
  recordUrl:base+'index.html#profession='+encodeURIComponent(x.id),
  caution:'Source scope, role match, geography and snapshot date may limit comparability.'
 }))
}));
let stale=false;
for (const [name,content] of writes){
 const target=path.join(root,name);
 if(check){
   if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==content){
     console.error('OUT OF DATE: '+name); stale=true;
   }
 } else {
   fs.mkdirSync(path.dirname(target),{recursive:true});
   fs.writeFileSync(target,content);
   console.log('GENERATED '+name);
 }
}
if(stale)process.exitCode=1;
else console.log('OK: '+index.length+' knowledge records, cross-links valid'+(check?', exports current':''));
