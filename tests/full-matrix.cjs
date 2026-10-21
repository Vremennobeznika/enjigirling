const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const pages = ['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
const datasets = ['professions','materials','processes','dictionary'];
const errors = [];
let count = 0;
const check = (label,fn) => { try { fn(); count++; console.log('PASS '+label); } catch (error) { errors.push(label+': '+error.message); console.error('FAIL '+label+': '+error.message); } };
const json = name => JSON.parse(fs.readFileSync(name,'utf8'));
const base = 'https://vremennobeznika.github.io/enjigirling/';
check('all nine HTML pages and shared navigation', () => {
 for (const name of pages) {
  const h = fs.readFileSync(name,'utf8');
  assert.match(h,/<title>[^<]+<\/title>/i,name+' title');
  assert.equal((h.match(/<main\b/gi)||[]).length,1,name+' main');
  assert.equal((h.match(/class="eng-tab(?: active)?"/g)||[]).length,9,name+' navigation');
  const ids = [...h.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,name+' duplicate DOM id');
 }
});
check('local HTML assets and links', () => {
 for (const name of pages) {
  const h = fs.readFileSync(name,'utf8');
  const attrs = [...h.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map(m=>m[1]);
  for (const raw of attrs) {
   if (/^(?:https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(raw)) continue;
   const relative = raw.split('#')[0].split('?')[0];
   if (!relative || relative.includes('{{') || relative.includes('${')) continue;
   const disk = path.normalize(path.join(path.dirname(name),decodeURIComponent(relative)));
   assert.ok(fs.existsSync(disk),name+': missing '+raw);
  }
 }
});
check('external link window isolation', () => {
 for (const name of pages) {
  const h=fs.readFileSync(name,'utf8');
  for(const a of h.matchAll(/<a\b[^>]*>/gi)){
   if(!/target=["']_blank["']/i.test(a[0])) continue;
   assert.match(a[0],/rel=["'][^"']*noopener/i,name+' blank link without noopener');
  }
 }
});
const data={};
check('JSON dataset identifiers', () => {
 for (const type of datasets) {
  const payload=json('knowledge/'+type+'.json');
  assert.ok(Array.isArray(payload.items)&&payload.items.length,type+' missing items');
  const field=type==='dictionary'?'term':'id';
  const keys=payload.items.map(item=>String(item[field]||'').trim().toLocaleLowerCase('ru').replace(/ё/g,'е'));
  assert.ok(keys.every(Boolean),type+' missing identifier');
  assert.equal(keys.length,new Set(keys).size,type+' duplicate identifier');
  data[type]=payload.items;
 }
});
check('search index completeness and uniqueness', () => {
 const index=json('knowledge/search-index.json');
 const total=datasets.reduce((s,type)=>s+data[type].length,0);
 assert.equal(index.recordCount,total);
 assert.equal(index.records.length,total);
 const ids=new Set();
 for(const row of index.records){
  assert.ok(row.id&&row.title&&row.type&&row.url&&row.dataset,'incomplete index entry');
  assert.ok(row.url.startsWith(base),'external record URL '+row.id);
  assert.ok(!ids.has(row.id),'duplicate search index id '+row.id);
  ids.add(row.id);
 }
 const expected={profession:data.professions.length,material:data.materials.length,process:data.processes.length,term:data.dictionary.length};
 for(const [type,n] of Object.entries(expected)) assert.equal(index.records.filter(x=>x.type===type).length,n,type+' count mismatch');
});
check('material, process and profession references', () => {
 const ids={};
 for(const type of datasets) ids[type]=new Set(data[type].map(row=>row.id));
 for(const m of data.materials) for(const id of m.process||[]) assert.ok(ids.processes.has(id),'unknown process '+id);
 for(const p of data.processes){
  for(const id of p.materials||[]) assert.ok(ids.materials.has(id),'unknown material '+id);
  assert.ok(ids.professions.has(p.profession),'unknown profession '+p.profession);
 }
});
check('graph counts and endpoint references', () => {
 const g=json('knowledge/graph.json');
 const valid=new Set();
 for(const type of ['materials','processes','professions'])
  for(const r of data[type]) valid.add(({materials:'material',processes:'process',professions:'profession'})[type]+':'+r.id);
 assert.equal(g.nodeCount,valid.size);
 assert.equal(g.edgeCount,g.edges.length);
 for(const edge of g.edges){
  assert.ok(valid.has(edge.from),'missing source node '+edge.from);
  assert.ok(valid.has(edge.to),'missing target node '+edge.to);
 }
});
check('evidence source and claim paths', () => {
 const registry=json('knowledge/source-registry.json');
 const sources=new Set();
 for(const s of registry.sources){
  for(const field of registry.policy.requiredFields) assert.ok(s[field],'missing source field '+field);
  assert.equal(new URL(s.url).protocol,'https:');
  assert.ok(!sources.has(s.sourceId),'duplicate source id');
  sources.add(s.sourceId);
 }
 const keys=new Set();
 for(const e of registry.recordEvidence){
  assert.ok(sources.has(e.sourceId),'unknown source '+e.sourceId);
  assert.ok(datasets.includes(e.recordType),'bad record type');
  const field=e.recordType==='dictionary'?'term':'id';
  const record=data[e.recordType].find(x=>x[field]===e.recordId);
  assert.ok(record,'unknown record '+e.recordId);
  assert.ok(Object.hasOwn(record,e.claimPath),'missing claim field '+e.claimPath);
  assert.ok(registry.policy.allowedVerificationStatuses.includes(e.verificationStatus),'bad status');
  const key=[e.recordType,e.recordId,e.sourceId,e.claimPath].join('|');
  assert.ok(!keys.has(key),'duplicate evidence link');
  keys.add(key);
 }
});
check('machine-readable quality report matches indexed evidence', () => {
 const q=json('knowledge/quality.json');
 const idx=json('knowledge/search-index.json');
 const registry=json('knowledge/source-registry.json');
 assert.equal(q.totalRecords,idx.recordCount);
 assert.equal(q.totalEvidenceLinks,registry.recordEvidence.length);
 assert.equal(q.totalRegisteredSources,registry.sources.length);
 const linked=new Set(registry.recordEvidence.map(e=>e.recordType+'/'+e.recordId));
 const checked=new Set(registry.recordEvidence.filter(e=>e.verificationStatus==='claim_checked').map(e=>e.recordType+'/'+e.recordId));
 assert.equal(q.recordsWithEvidenceLinks,linked.size);
 assert.equal(q.recordsWithClaimCheckedLinks,checked.size);
 for(const type of datasets)assert.equal(q.byDataset[type].records,data[type].length);
 assert.equal(q.scope,'metadata_integrity_only');
});
check('sitemap and AI entrypoints', () => {
 const xml=fs.readFileSync('sitemap.xml','utf8');
 const robots=fs.readFileSync('robots.txt','utf8');
 assert.ok(robots.includes(base+'sitemap.xml'));
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,new Set(urls).size,'duplicate sitemap URL');
 for(const url of urls){
  assert.ok(url.startsWith(base),'invalid sitemap domain');
  assert.ok(fs.existsSync(decodeURIComponent(url.slice(base.length))),'missing sitemap path '+url);
 }
 for(const p of ['llms.txt','knowledge-manifest.json','knowledge-base.md','knowledge/source-registry.json']) assert.ok(fs.existsSync(p),p+' missing');
 const manifest=json('knowledge-manifest.json');
 for(const p of manifest.jsonApi.datasets) assert.ok(fs.existsSync(p),'missing manifest dataset '+p);
 assert.ok(fs.readFileSync('index.html','utf8').includes('"@type":"DataCatalog"'),'homepage has no JSON-LD catalog');
});

check('CI cannot hide static QA failures behind tee', () => {
 for(const filename of ['.github/workflows/site-check.yml','.github/workflows/knowledge-pages.yml']){
  const workflow=fs.readFileSync(filename,'utf8');
  const pipe=workflow.indexOf('node scripts/all-checks.cjs 2>&1 | tee static-qa.log');
  assert.ok(pipe>=0,filename+' missing static QA transcript');
  const step=workflow.slice(Math.max(0,pipe-180),pipe);
  assert.match(step,/set -o pipefail/,filename+' masks failing static tests');
 }
});
check('Pages deploy performs checkout before running local smoke script', () => {
 const workflow=fs.readFileSync('.github/workflows/knowledge-pages.yml','utf8');
 const precheck=workflow.indexOf('node scripts/build-knowledge.cjs --check');
 const build=workflow.indexOf('run: node scripts/build-knowledge.cjs\n');
 assert.ok(precheck>=0&&build>precheck,'committed knowledge snapshots must be checked before regeneration');
 const deploy=workflow.split('\n  deploy:\n')[1];
 assert.ok(deploy,'missing deployment job');
 const checkout=deploy.indexOf('uses: actions/checkout@');
 const deployAction=deploy.indexOf('uses: actions/deploy-pages@');
 const smoke=deploy.indexOf('node scripts/check-live-site.cjs');
 assert.ok(checkout>=0&&deployAction>checkout&&smoke>deployAction,
  'deploy job must check out sources before postdeploy smoke');
 const smokeScript=fs.readFileSync('scripts/check-live-site.cjs','utf8');
 assert.ok(smokeScript.includes("compareExact"),'deployed data integrity verification absent');
 assert.ok(smokeScript.includes("missingAssets"),'live linked asset validation absent');
});
console.log('Matrix: '+count+' PASS, '+errors.length+' FAIL ('+pages.length+' pages, '+datasets.length+' datasets)');
if(errors.length)process.exitCode=1;
