#!/usr/bin/env node
'use strict';
// Process atlas invariant gate: structural checks only, NOT independent scientific verification.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const ctx={window:{}};
for(const path of ['materials-data.js','data.js','processes-data.js'])vm.runInNewContext(fs.readFileSync(path,'utf8'),ctx,{timeout:5000,filename:path});
const processes=ctx.window.engineeringProcesses;
const professions=new Set(ctx.window.professionsData.map(x=>x.id));
const materials=new Set(ctx.window.engineeringMaterials.map(x=>x.id));
const ids=new Set(processes.map(x=>x.id));
const allowedIndustries=new Set(['metals','polymers','food','textiles','wood','electronics','chemicals','general','composites','construction','energy','water','ceramics','pharma','printing','mining']);
const allowedCategories=new Set(['forming','joining','treatment','inspection']);
assert.equal(processes.length,208,'process count changed: review expected coverage explicitly');
assert.equal(ids.size,processes.length,'duplicate process ID');
const html=fs.readFileSync('processes.html','utf8');
for(const industry of allowedIndustries)assert.ok(html.includes('value="'+industry+'"'),industry+' sector option missing');
const registry=JSON.parse(fs.readFileSync('knowledge/source-registry.json','utf8'));
const sourceIds=new Set(registry.sources.map(s=>s.sourceId));
const evidence=new Map();
for(const row of registry.recordEvidence.filter(x=>x.recordType==='processes')){
 assert.ok(ids.has(row.recordId),'orphan evidence '+row.recordId);
 assert.ok(sourceIds.has(row.sourceId),'unknown registered source '+row.sourceId);
 assert.ok(['source_located','claim_checked','disputed','superseded','unverified'].includes(row.verificationStatus),'invalid status');
 if(!evidence.has(row.recordId))evidence.set(row.recordId,[]);
 evidence.get(row.recordId).push(row);
}
const canonical=JSON.parse(fs.readFileSync('knowledge/processes.json','utf8'));
assert.equal(canonical.items.length,processes.length,'stale processes JSON');
const canonicalById=new Map(canonical.items.map(x=>[x.id,x]));
for(const x of processes){
 assert.match(x.id,/^[a-z0-9-]+$/,'bad ID');
 for(const field of ['name','description','steps','checks','industry','category','profession'])
  assert.ok(typeof x[field]==='string'&&x[field].trim(),x.id+' lacks '+field);
 assert.ok(allowedIndustries.has(x.industry),x.id+' unknown industry');
 assert.ok(allowedCategories.has(x.category),x.id+' unknown category');
 assert.ok(professions.has(x.profession),x.id+' unknown profession');
 for(const mat of x.materials||[])assert.ok(materials.has(mat),x.id+' unknown material '+mat);
 if(x.parentId)assert.ok(ids.has(x.parentId)&&x.parentId!==x.id,x.id+' invalid parent');
 assert.ok(Array.isArray(x.sources)&&x.sources.length,x.id+' has no sources');
 for(const s of x.sources){
  assert.ok(typeof s.title==='string'&&s.title.trim(),x.id+' missing source title');
  assert.match(s.url,/^https:\/\/[^\s]+$/i,x.id+' invalid source URL');
  assert.doesNotMatch(s.title,/Проверенный источник для|Техническое описание процесса/i,x.id+' misleading label');
 }
 assert.ok(x.evidence?.reviewScope?.trim(),x.id+' missing review limitation');
 assert.ok(evidence.has(x.id),x.id+' missing registered evidence (does not imply claim verification)');
 const exact=canonicalById.get(x.id);
 assert.ok(exact,x.id+' missing canonical record');
 const {knowledgeMeta,...base}=exact;
 assert.deepEqual(JSON.parse(JSON.stringify(base)),JSON.parse(JSON.stringify(x)),x.id+' stale canonical fields');
 assert.equal(knowledgeMeta.verificationStatus,'requires_source_review',x.id+' misleading verified status');
 if(x.reviewStatus==='source_located'||x.evidence?.verificationStatus==='source_located'){
  assert.equal(x.evidence.verificationStatus,'source_located',x.id+' inconsistent source status');
  assert.ok(evidence.get(x.id).some(y=>y.verificationStatus==='source_located'),x.id+' unlinked source');
 }
}
for(const process of processes){
 const seen=new Set();let cursor=process;
 while(cursor.parentId){
  assert.ok(!seen.has(cursor.id),'parent cycle at '+process.id);
  seen.add(cursor.id);
  cursor=processes.find(x=>x.id===cursor.parentId);
  assert.ok(cursor,'broken parent at '+process.id);
 }
}
const section=JSON.parse(fs.readFileSync('knowledge/sections/processes.json','utf8'));
assert.equal(section.recordsCount,processes.length,'stale AI section record count');
assert.equal(section.records.length,processes.length,'stale AI section JSON');
const headings=fs.readFileSync('knowledge/sections/processes.md','utf8');
assert.ok(headings.includes('('+processes.length+' записей/групп)'), 'stale AI Markdown process count');
console.log('PASS: '+processes.length+' unique processes, '+allowedIndustries.size+' industries, all parent/material/profession/source links, canonical and AI exports structurally consistent.');
console.log('LIMITATION: structure and evidence-link coverage do not confirm individual process claims or compliance.');
