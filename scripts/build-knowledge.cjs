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
