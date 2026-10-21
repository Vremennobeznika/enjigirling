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
  assert.ok(h.includes('class="skip-link" href="#main-content"'),name+' missing skip link');
  assert.ok(h.includes('id="main-content"'),name+' missing main target');
  assert.equal((h.match(/class="eng-tab(?: active)?"/g)||[]).length,9,name+' navigation');
  const ids = [...h.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,name+' duplicate DOM id');
 }
});
check('basic HTML security and accessible form labels', () => {
 for (const name of pages) {
  const h=fs.readFileSync(name,'utf8');
  assert.doesNotMatch(h,/\son(?:click|load|error|mouseover)\s*=/i,name+' inline event handler');
  assert.doesNotMatch(h,/javascript:/i,name+' javascript URL');
  assert.doesNotMatch(h,/<script\b[^>]*\bsrc=["']https?:/i,name+' unreviewed remote script');
  const labels=new Set([...h.matchAll(/<label\b[^>]*\bfor=["']([^"']+)["']/gi)].map(m=>m[1]));
  for(const match of h.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)){
   const tag=match[0];
   if(/\btype=["']hidden["']/i.test(tag))continue;
   const id=tag.match(/\bid=["']([^"']+)["']/i)?.[1];
   assert.ok(/\baria-label(?:ledby)?=/.test(tag)||(id&&labels.has(id)),name+' unlabeled form control '+tag);
  }
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
check('canonical URLs uniquely identify all nine sections', () => {
 for (const page of pages) {
  const markup=fs.readFileSync(page,'utf8');
  const matches=[...markup.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)];
  assert.equal(matches.length,1,page+' must have one canonical');
  const expected=base+(page==='index.html'?'':page);
  assert.equal(matches[0][1],expected,page+' canonical mismatch');
 }
});
check('nine static nav shells prevent postpaint reparenting', () => {
 for(const page of pages){
  const html=fs.readFileSync(page,'utf8');
  assert.equal(html.split('class="site-nav-wrap"').length-1,1,page+' static nav wrapper missing');
  assert.equal(html.split('class="site-nav-toggle"').length-1,1,page+' static nav toggle missing');
  assert.equal(html.split('id="site-main-navigation"').length-1,1,page+' stable nav identifier missing');
  assert.ok(html.includes('<noscript>'),page+' missing no-JS navigation fallback');
 }
 const navigation=fs.readFileSync('navigation.js','utf8');
 assert.ok(navigation.includes("nav.parentElement.classList.contains('site-nav-wrap')"),'JS must reuse pre-rendered wrapper');
 assert.ok(navigation.includes("wrapper.querySelector('.site-nav-toggle')"),'JS must reuse pre-rendered toggle');
});

check('parallel font loading and nonduplicated main CI checks', () => {
 const fontUrl='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap';
 for(const page of pages){
  const markup=fs.readFileSync(page,'utf8');
  assert.ok(markup.includes('rel="preconnect" href="https://fonts.googleapis.com"'),page+' missing font preconnect');
  assert.ok(markup.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'),page+' missing font host preconnect');
  assert.ok(markup.includes(fontUrl),page+' missing font stylesheet');
 }
 for(const file of ['style-core.min.css','style-reference.min.css','style.min.css']){
  assert.ok(!fs.readFileSync(file,'utf8').includes("@import url('https://fonts.googleapis.com"),file+' has blocking font import');
 }
 const workflow=fs.readFileSync('.github/workflows/site-check.yml','utf8');
 assert.doesNotMatch(workflow,/^  push:/m,'main branch runs duplicate test workflows');
 assert.match(workflow,/^  pull_request:/m,'PR checks must remain enabled');
 assert.match(fs.readFileSync('.github/workflows/knowledge-pages.yml','utf8'),/npx playwright test/,'main deploy must gate browser tests');
});


check('five navigation groups preserve all nine original page routes', () => {
 const expectedGroups=['Карьера','Технологии','Инструменты','База знаний','Сообщество'];
 for(const page of pages){
  const markup=fs.readFileSync(page,'utf8');
  const match=markup.match(/<nav id="site-main-navigation"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(match,page+' navigation missing');
  const groups=[...match[1].matchAll(/class="nav-cluster" role="group" aria-label="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(groups,expectedGroups,page+' incorrect navigation groups');
  const hrefs=[...match[1].matchAll(/<a href="([^"]+)" class="eng-tab(?: active)?"/g)].map(x=>x[1]);
  assert.equal(hrefs.length,9,page+' must retain exactly nine links');
  assert.equal(new Set(hrefs).size,9,page+' repeated nav destinations');
  assert.deepEqual(new Set(hrefs),new Set(pages),page+' old route missing');
 }
 const home=fs.readFileSync('index.html','utf8');
 assert.ok(home.includes('class="learning-paths"'),'landing task routes missing');
 assert.equal((home.match(/class="learning-path-card"/g)||[]).length,3,'three task routes expected');
 const source=fs.readFileSync('script.js','utf8');
 assert.ok(source.includes('function renderRelatedTechnology('),'reverse profession-to-process links missing');
 assert.ok(source.includes('href="processes.html#'),'profession process deep link missing');
 assert.ok(source.includes('href="materials.html#'),'profession material deep link missing');
});


check('editorial guides are available in technologies and calculators', () => {
 const places=[
  ['materials.html','materialGuideTitle','processes.html#casting'],
  ['processes.html','processGuideTitle','materials.html#steel-20'],
  ['calculator.html','signalGuideTitle','(12 − 4) / 16 = 0,5']
 ];
 for(const [page,id,evidence] of places){
  const markup=fs.readFileSync(page,'utf8');
  assert.ok(markup.includes('aria-labelledby="'+id+'"'),page+' missing accessible guide');
  assert.ok(markup.includes(evidence),page+' missing linked practical example');
 }
 const css=fs.readFileSync('section-ui.css','utf8');
 assert.ok(css.includes('.field-guide a:visited'),'guide links must inherit monochrome style');
});


check('combined technology search, static header and reusable CSV audit forms', () => {
 for(const page of ['materials.html','processes.html']){
  const h=fs.readFileSync(page,'utf8');
  assert.ok(h.includes('id="technologySearch"'),page+' shared search input missing');
  assert.ok(h.includes('src="technology-search.js"'),page+' shared search logic missing');
  assert.ok(h.includes('id="technologySearchResults"'),page+' search results missing');
 }
 const search=fs.readFileSync('technology-search.js','utf8');
 assert.ok(search.includes('window.engineeringProcesses'),'processes missing from combined search');
 assert.ok(search.includes('window.engineeringMaterials'),'materials missing from combined search');
 assert.ok(search.includes('encodeURIComponent(x.id)'),'search deep links are not encoded');
 for(const page of ['calendar.html','resources.html','dictionary.html','map.html','calculator.html']){
  const html=fs.readFileSync(page,'utf8');
  assert.equal((html.match(/class="site-topbar site-topbar--shared"/g)||[]).length,1,page+' needs one pre-rendered header');
  assert.equal((html.match(/id="themeToggle"/g)||[]).length,1,page+' duplicate theme control');
 }
 for(const js of ['materials.js','processes.js']){
  assert.ok(fs.readFileSync(js,'utf8').includes("root.dataset.ready='true'"),js+' does not resolve catalog placeholder');
 }
 for(const file of ['templates/production-defect-review.csv','templates/material-evidence-register.csv']){
  const text=fs.readFileSync(file,'utf8');
  assert.ok(text.startsWith('\uFEFF'),file+' must have UTF-8 BOM for Excel');
  const rows=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/).map(x=>x.split(';').length);
  assert.ok(rows.every(x=>x===rows[0]),file+' CSV column counts differ');
 }
 const m=fs.readFileSync('materials.html','utf8'),p=fs.readFileSync('processes.html','utf8');
 assert.ok(m.includes('templates/material-evidence-register.csv'),'materials download missing');
 assert.ok(p.includes('templates/production-defect-review.csv'),'processes download missing');
});


check('independent lazy engineering calculators and original tools preserved', () => {
 const html=fs.readFileSync('calculator.html','utf8');
 for(const id of ['labIEEE','labElectronics','ieeeFormat','ieeeMode','ieeeInput','ieeeBits','ohmMode','dividerU','rcR','toleranceRows','modbusFirst','modbusSecond']){
  assert.ok(html.includes('id="'+id+'"'),'calculator missing '+id);
 }
 for(const src of ['engineer-calculators.js','calculator-loader.js','calculator-lab.css'])
  assert.ok(html.includes('src="'+src+'"')||html.includes('href="'+src+'"'),'missing calculator asset '+src);
 assert.doesNotMatch(html,/<script src="(?:data|salary-sources)\.js"/,'calculator downloads unused salary data');
 for(const id of ['convCategory','numInput','maCurrent','maResultValue'])
  assert.ok(html.includes('id="'+id+'"'),'existing calculator removed: '+id);
 const loader=fs.readFileSync('calculator-loader.js','utf8');
 assert.ok(loader.includes("panel.addEventListener('toggle'"),'advanced code should be lazy');
 assert.ok(loader.includes("script('engineering-lab-core.js')"),'math engine must load on demand');
 const core=fs.readFileSync('engineering-lab-core.js','utf8');
 assert.ok(core.includes('DataView'),'float implementation must operate on actual bits');
 assert.ok(core.includes('roundEven'),'half precision must use ties-to-even');
 assert.ok(core.includes('BigInt'),'exact decimal error is required');
 assert.ok(fs.existsSync('tests/engineering-lab-unit.cjs'),'unit vectors absent');
 assert.ok(fs.existsSync('tests/engineering-lab.spec.cjs'),'browser checks absent');
});


check('originally named workshops and six dimensioned production tools', () => {
 const html=fs.readFileSync('calculator.html','utf8');
 for(const label of ['Битоскоп','Электроцех','Цеховой расчёт','Мастерская расчётов ENJIGIRLING']){
  assert.ok(html.includes(label),'missing named tool '+label);
 }
 const sections=[...html.matchAll(/data-lab="([^"]+)"/g)].map(x=>x[1]);
 assert.deepEqual(sections,['ieee','extra','production'],'wrong lazy workshop panels');
 for(const id of ['taktAvailable','taktDemand','oeePlan','oeeRun','oeeTotal','oeeGood','oeeIdeal','massDensity','massLength','massWidth','massHeight','thermalLength','thermalAlpha','thermalDelta','cutMode','cutDiameter','cutQuantity','flowDiameter','flowSpeed']){
  assert.ok(html.includes('id="'+id+'"'),'production input missing '+id);
 }
 const core=fs.readFileSync('engineering-lab-core.js','utf8');
 const ui=fs.readFileSync('engineering-lab-ui.js','utf8');
 for(const method of ['takt','oee','billetMass','thermalLength','cutSpeed','pipeFlow']){
  assert.ok(core.includes('function '+method+'('),'missing mathematical implementation '+method);
 }
 assert.ok(ui.includes('function productionInit()'),'production UI missing');
 assert.ok(ui.includes("if(which==='production')productionInit()"),'production lazy initialization missing');
 assert.ok(html.includes('class="calc-lab production-panel"'),'production panel styling hook missing');
 assert.ok(fs.readFileSync('calculator-lab.css','utf8').includes('.production-panel .calc-lab-sub'),'production panel styles missing');
 assert.ok(fs.readFileSync('tests/engineering-lab.spec.cjs','utf8').includes('renamed original workbench names'));
});

console.log('Matrix: '+count+' PASS, '+errors.length+' FAIL ('+pages.length+' pages, '+datasets.length+' datasets)');
if(errors.length)process.exitCode=1;
