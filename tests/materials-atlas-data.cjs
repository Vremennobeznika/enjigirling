const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const read=path=>fs.readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const ctx={window:{}};
vm.runInNewContext(read('materials-data.js'),ctx,{timeout:5000});
vm.runInNewContext(read('processes-data.js'),ctx,{timeout:5000});
const materials=ctx.window.engineeringMaterials,processes=ctx.window.engineeringProcesses;
const groups=new Set(['metal','organic','inorganic','composite','functional']);
const industries=new Set(['metals','polymers','food','textiles','wood','electronics','chemicals','general','composites','construction','energy','water','ceramics','pharma','printing','mining']);
const processIds=new Set(processes.map(p=>p.id));
assert.ok(materials.length>=170,'Material coverage unexpectedly contracted');
assert.equal(new Set(materials.map(m=>m.id)).size,materials.length,'Material IDs must be unique');
for(const m of materials){
 assert.ok(m.name&&m.family&&m.detail&&m.uses&&m.note,m.id+' missing descriptive fields');
 assert.ok(groups.has(m.group),m.id+' invalid group');
 assert.ok(Array.isArray(m.industries)&&m.industries.length,m.id+' missing industries');
 assert.ok(m.industries.every(id=>industries.has(id)),m.id+' invalid industry');
 assert.ok((m.process||[]).every(id=>processIds.has(id)),m.id+' references missing process');
 assert.ok(m.sources?.length&&m.sources.every(s=>/^https:\/\/[^\s]+$/.test(s.url)&&s.title),m.id+' missing source URL');
 assert.ok(['context_only','partial_claim','source_located'].includes(m.evidence?.verificationStatus),m.id+' missing evidence status');
 assert.ok(m.evidence?.reviewScope&&m.evidence?.checkedAt,m.id+' unscoped source');
}
for(const industry of industries)assert.ok(materials.some(m=>m.industries.includes(industry)),industry+' empty');
assert.equal(materials.find(x=>x.id==='water-resin').process.length,0,'Do not confuse ion exchange with granular filtration');
for(const id of ['activated-alumina-adsorbent','osb-board','particleboard','glulam','clt','pcb-prepreg'])assert.equal(materials.find(x=>x.id===id).process.length,0,id+' invalid inferred link');
assert.ok(!materials.find(x=>x.id==='grain-wheat').industries.includes('mining'),'Grain is not mining material');
const html=read('materials.html');
assert.doesNotMatch(html,/Этот раздел для ИИ/,'Old full-site banner remains');
assert.ok(!html.includes('id="atlasAiPackage"')&&html.includes('href="ai.html"'),'AI downloads must live in the shared center');
for(const id of ['materialCategory','materialSearch','materialSort'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
const code=read('materials.js');
new Function(code);
assert.ok(read('atlas-ai-core.js').includes("sector==='all'"),'Export must select full industry data');
assert.ok(read('atlas-ai-download.js').includes('validKey(selector.value)'),'Export must validate industry selection');
const index=json('knowledge/search-index.json');
const knowledge=json('knowledge/materials.json');
const graph=json('knowledge/graph.json');
const quality=json('knowledge/quality.json');
const section=json('knowledge/sections/materials.json');
const registry=json('knowledge/source-registry.json');
assert.equal(knowledge.items.length,materials.length,'Canonical knowledge stale');
assert.equal(section.records.length,materials.length,'Section JSON stale');
assert.equal(index.records.filter(x=>x.type==='material').length,materials.length,'Search index stale');
assert.equal(graph.nodeCount,51+materials.length+processes.length,'Knowledge graph node count stale');
assert.equal(graph.edgeCount,graph.edges.length,'Knowledge graph edge count stale');
for(const m of materials){
 const expected=Array.from(m.process||[]); // Convert vm-realm arrays before strict prototype-sensitive comparison.
 const edges=graph.edges.filter(x=>x.from==='material:'+m.id&&x.relation==='processed_by').map(x=>x.to.slice(8));
 assert.equal(JSON.stringify(edges),JSON.stringify(expected),m.id+' graph differs from data');
}
const evidence=registry.recordEvidence.filter(x=>x.recordType==='materials');
assert.equal(new Set(evidence.map(x=>x.recordId)).size,materials.length,'Some materials lack evidence links');
assert.equal(quality.byDataset.materials.records,materials.length,'Quality metadata stale');
assert.equal(quality.byDataset.materials.recordsWithEvidenceLinks,materials.length,'Evidence coverage metadata stale');
assert.ok(read('ai-transfer.css').includes('@media(max-width:650px)'), 'Missing responsive material controls');
console.log('OK: '+materials.length+' materials, '+industries.size+' sectors, '+evidence.length+' evidence links; exports and graph match source data.');
