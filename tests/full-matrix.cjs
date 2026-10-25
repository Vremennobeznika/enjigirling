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
 assert.ok(build>=0&&precheck>build,'generated knowledge snapshots must be checked after regeneration');
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
  if(page==='calculator.html'||page==='resources.html'){
   assert.ok(!markup.includes('fonts.googleapis.com')&&!markup.includes('fonts.gstatic.com'),page+' should use system fonts without remote requests');
   continue;
  }
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
  ['materials.html','materialGuideTitle','processes.html#cutting'],
  ['processes.html','processGuideTitle','materials.html#09g2s'],
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
 for(const src of ['calculator-loader.js','calculator-lab.css'])
  assert.ok(html.includes('src="'+src+'"')||html.includes('href="'+src+'"'),'missing calculator boot/style '+src);
 assert.ok(!html.includes('src="engineer-calculators.js"'),'legacy engine must not block initial page load');
 assert.ok(!html.includes('src="calculator-practical.js"'),'practical calculator must load only when opened');
 assert.doesNotMatch(html,/<script src="(?:data|salary-sources)\.js"/,'calculator downloads unused salary data');
 for(const id of ['convCategory','numInput','maCurrent','maResultValue'])
  assert.ok(html.includes('id="'+id+'"'),'existing calculator removed: '+id);
 const loader=fs.readFileSync('calculator-loader.js','utf8');
 assert.ok(loader.includes("panel.addEventListener('toggle'"),'advanced code should be lazy');
 assert.ok(loader.includes("script('engineering-lab-core.js')"),'math engine must load on demand');
 assert.ok(loader.includes("script('engineer-calculators.js')"),'legacy engine must load on demand');
 assert.ok(loader.includes("script('calculator-practical-core.js')"),'practical engine must load on demand');
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
 assert.deepEqual(sections,['ieee','extra','production','sewing','moreSewing','marine','moreMarine'],'wrong lazy workshop panels');
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


check('fabric and maritime calculators have groups, sources and independent formulae', () => {
 const html=fs.readFileSync('calculator.html','utf8');
 for(const name of ['Цифровые данные','Электротехника','Производство','Швейное дело','Море и суда','Единицы'])assert.ok(html.includes(name),'missing group '+name);
 for(const id of ['labSewing','labMarine','markerArea','fabricLength','threadSeam','lineGood','passageNm','fuelNm','hullLwl','draftMass'])assert.ok(html.includes('id="'+id+'"'),'missing calculator '+id);
 for(const source of ['coats.com/en/info-hub/thread-consumption-guide/','oceanservice.noaa.gov/facts/nautical-mile-knot.html','tc.canada.ca/en/marine-transportation/publications/tp-14609-study-guide-applicants-fourth-class-engineer-certificate-stcw-endorsement'])
  assert.ok(html.includes(source),'missing source '+source);
 const core=fs.readFileSync('engineering-lab-core.js','utf8');
 const ui=fs.readFileSync('engineering-lab-ui.js','utf8');
 for(const fn of ['markerEfficiency','fabricBooking','threadBooking','sewingEfficiency','marinePassage','marineFuel','hullSpeed','draftByTPC'])
  assert.ok(core.includes('function '+fn+'('),'missing formula '+fn);
 for(const mode of ['sewing','marine'])assert.ok(ui.includes("if(which==='"+mode+"')"),'lazy module missing '+mode);
 assert.ok(fs.readFileSync('calculator-lab.css','utf8').includes('.calculator-groups'),'category layout missing');
});

check('virtual instrument and extra textile maritime calculation catalog',()=> {
 const h=fs.readFileSync('calculator.html','utf8');
 for(const id of ['labMoreSewing','labMoreMarine','shrinkBefore','balanceOps','dispLength','currentShip'])
  assert.ok(h.includes('id="'+id+'"'),'missing '+id);
 const core=fs.readFileSync('engineering-lab-core.js','utf8');
 for(const fn of ['shrinkage','layLength','lineBalance','displacement','currentVector','vernier'])
  assert.ok(core.includes('function '+fn+'('),'missing '+fn);
  assert.ok(!h.includes('id="labCaliper"'),'duplicate virtual caliper prohibited');
  assert.ok(fs.readFileSync('measurement-lab.html','utf8').includes('id="embeddedInstruments"'),'measurement lab missing calipers');
});


check('734 unique calculator concepts across 34 research groups have honest statuses',()=>{
 const data=fs.readFileSync('calculator-atlas-data.js','utf8');
 const groups=JSON.parse(data.slice(data.indexOf('=')+1).trim().replace(/;\s*$/,''));
 assert.equal(groups.length,34,'atlas category count');
 const names=groups.flatMap(g=>g.items);
 assert.equal(names.length,734,'catalog topic count');
 assert.equal(new Set(names.map(x=>x.toLocaleLowerCase('ru-RU'))).size,names.length,'duplicate calculator proposals');
 for(const group of groups){
  assert.ok(group.title&&group.id&&group.source.startsWith('https://'),group.id+' invalid metadata');
  assert.ok(group.items.length>=10,group.id+' has too few topics');
 }
 const page=fs.readFileSync('calculator-atlas.html','utf8');
 assert.ok(page.includes('734 темы'),'atlas must label topics as ideas');
 assert.ok(page.includes('не 734 якобы работающих калькулятора'),'atlas must not mislead');
 for(const filename of ['calculator-atlas.js','calculator-atlas-data.js','calculator-atlas.css','calculator-atlas.csv'])
   assert.ok(page.includes(filename),'atlas missing '+filename);
 assert.ok(fs.readFileSync('calculator.html','utf8').includes('href="calculator-atlas.html"'),'calculator section has no catalog link');
 const csv=fs.readFileSync('calculator-atlas.csv','utf8');
 assert.ok(csv.startsWith('\uFEFF'),'CSV must be UTF-8 with BOM');
 assert.equal(csv.trimEnd().split('\n').length,735,'CSV rows');
 assert.ok(fs.existsSync('tests/calculator-atlas.spec.cjs'),'atlas browser regressions missing');
});


check('calculator workshop layout embeds every tool in seven groups',()=>{
 const h=fs.readFileSync('calculator.html','utf8');
 const g=[
  ['group-digital',['labIEEE','calcBases']],
  ['group-electrical',['labElectronics','calcSignal']],
  ['group-production',['labProduction']],
  ['group-practical',['labPractical']],
  ['group-sewing',['labSewing','labMoreSewing']],
  ['group-marine',['labMarine','labMoreMarine']],
  ['group-measurements',['calcUnits']]
 ];
 const points=g.map(([id])=>h.indexOf('id="'+id+'"'));
 assert.ok(points.every(x=>x>=0),'workshop group heading missing');
 assert.deepEqual([...points].sort((a,b)=>a-b),points,'workshop categories out of order');
 for(let i=0;i<g.length;i++){
  const [id,panels]=g[i];
  const block=h.slice(points[i],points[i+1]||h.indexOf('</main>'));
  const found=[...block.matchAll(/<details class="calc-lab[^"]*" id="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(found,panels,id+' missing/misplaced calculators');
 }
 for(const id of ['calcUnits','calcBases','calcSignal']){
  assert.equal((h.match(new RegExp('id="'+id+'"','g'))||[]).length,1,'duplicate old calculator id '+id);
  assert.ok(h.includes('class="calc-lab calc-legacy" id="'+id+'"'),'legacy tool left ungrouped '+id);
 }
 assert.ok(h.includes('id="signalGuideTitle"'),'4–20 mA explanation lost');
 const css=fs.readFileSync('calculator-lab.css','utf8');
 assert.ok(css.includes('.calculator-workshop-grid'),'unified workshop styling missing');
 assert.ok(css.includes('.calc-legacy .calc-section'),'original calculator integration styling missing');
 const loader=fs.readFileSync('calculator-loader.js','utf8');
 assert.ok(loader.includes("panel.matches('details.calc-lab')"),'old hash links no longer open panels');
});


check('AI training packs expose nine main sections plus the code library',()=>{
 const slug=['professions','calendar','resources','dictionary','learning','calculators','compare','processes','materials'];
 const pages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
 const hub=fs.readFileSync('ai.html','utf8');
 assert.equal((hub.match(/class="ai-hub-card"/g)||[]).length,10,'AI hub must list the nine main sections and AI code library');
 assert.ok(hub.includes('id="aiPrompt"'),'AI instruction prompt missing');
 const registry=json('knowledge/sections/index.json');
 assert.deepEqual(registry.sections.map(x=>x.id),['professions','calendar','resources','ai-code-library','dictionary','learning','calculators','compare','processes','materials']);
 const all=fs.readFileSync('knowledge/sections/all.md','utf8');
 for(let i=0;i<slug.length;i++){
  const id=slug[i],p=fs.readFileSync(pages[i],'utf8');
  assert.ok(p.includes('href="ai.html?section='+id+'"'),pages[i]+' no AI navigation');
  if(id==='processes'||id==='materials'){
   for(const ext of ['Md','Json'])assert.ok(p.includes('id="atlasAi'+ext+'"'),pages[i]+' missing unified AI '+ext+' control');
  }else for(const ext of ['md','json'])assert.ok(p.includes('href="knowledge/sections/'+id+'.'+ext+'"'),pages[i]+' no '+ext+' download');
  const md=fs.readFileSync('knowledge/sections/'+id+'.md','utf8');
  const pack=json('knowledge/sections/'+id+'.json');
  assert.ok(md.includes('## Текст и описание раздела')&&md.length>500,id+' incomplete Markdown');
  assert.equal(pack.sectionId,id);
  assert.equal(pack.recordsCount,pack.records.length);
  assert.ok(pack.staticPageText.length>100,id+' missing page text');
  assert.ok(all.includes('# ENJIGIRLING — '+registry.sections.find(x=>x.id===id).title),id+' absent from all.md');
 }
 const codePack=json('knowledge/sections/ai-code-library.json');
 assert.equal(codePack.recordsCount,25,'AI code library must contain exactly 25 resources');
 assert.ok(codePack.records.every(x=>x.type==='Библиотека программирования для ИИ'));
 assert.ok(all.includes('# ENJIGIRLING — Библиотека программирования для ИИ'));
 assert.equal(json('knowledge/sections/professions.json').recordsCount,51);
 assert.equal(json('knowledge/sections/dictionary.json').recordsCount,551);
 assert.ok(json('knowledge/sections/calendar.json').recordsCount>0);
 assert.ok(json('knowledge/sections/resources.json').recordsCount>0);
 assert.equal(json('knowledge/sections/calculators.json').recordsCount,34);
 assert.ok(fs.existsSync('scripts/build-ai-packs.cjs'));
});

check('education catalogue: 80 entries, eight districts, evidence consistency', () => {
 const vm=require('node:vm');
 const raw=fs.readFileSync('map-data.js','utf8');
 const districts=vm.runInNewContext(raw+'\n;federalDistricts');
 assert.equal(districts.length,8,'federal district count');
 const seenDistrict=new Set(),seenSchools=new Set();
 let total=0;
 for(const district of districts){
  assert.ok(!seenDistrict.has(district.id),'duplicate district '+district.id);
  seenDistrict.add(district.id);
  assert.ok(district.name&&district.short&&district.path,'district metadata');
  for(const type of ['universities','colleges']){
   assert.ok(Array.isArray(district[type]),district.id+' missing '+type);
   for(const card of district[type]){
    total++;
    const key=(card.name+'|'+card.city).toLocaleLowerCase('ru-RU');
    assert.ok(!seenSchools.has(key),'duplicate card '+key);
    seenSchools.add(key);
    assert.ok(card.name&&card.city&&card.focus,'incomplete card '+key);
    assert.ok(card.sourceUrl&&/^https:\/\//.test(card.sourceUrl),'source link missing '+key);
    assert.ok(card.verifiedScope,'source limitations missing '+key);
    if(card.reviewDate!==undefined)assert.match(card.reviewDate,/^\d{4}-\d{2}-\d{2}$/,'invalid review date '+key);
    assert.ok(card.reviewMethod,'review method missing '+key);
    assert.ok(['program_verified','program_verified_with_access_limit','program_source_recorded','program_documents_pending'].includes(card.reviewStatus),'unknown review status '+key);
    assert.ok(['fetched','fetch_failed','not_retrieved'].includes(card.sourceFetchStatus),'unknown fetch status '+key);
    const programs=card.verifiedPrograms||[];
    assert.ok(Array.isArray(programs),'invalid programs '+key);
    if(card.reviewStatus==='program_documents_pending')assert.equal(programs.length,0,'pending card declares program '+key);
    else assert.ok(programs.length>0,'reviewed card has no program '+key);
    for(const p of programs){
     assert.match(p.code||'',/^[0-9]{2}[.][0-9]{2}[.][0-9]{2}$/,'invalid code '+key);
     assert.ok(p.name&&p.year&&(p.sourceUrl?.startsWith('https://')||p.sourceUrl?.startsWith('http://gaskk-mck.ru/')),'incomplete program '+key);
     for(const field of ['budgetPlaces','paidPlaces','tuitionAnnualRub','tuitionSemesterRub']){
      if(p[field]!==undefined)assert.ok(Number.isFinite(p[field])&&p[field]>=0,'invalid '+field+' '+key);
     }
    }
   }
  }
 }
 assert.equal(total,80,'catalogue count changed: review editorial claim in map.html');
 const html=fs.readFileSync('map.html','utf8');
 assert.ok(html.includes('map-data.js')&&html.includes('map.js'),'catalogue scripts not loaded');
 const script=fs.readFileSync('map.js','utf8');
 assert.ok(script.includes('escapeHtml('),'unsafe output templating');
 assert.ok(script.includes('label.addEventListener(\'click\''),'district labels not clickable');
});


check('resource catalogue: protected friends, free education, uniqueness, no duplicate caliper',()=>{
 const vm=require('node:vm');
 const items=vm.runInNewContext(fs.readFileSync('resources-data.js','utf8')+'\nresources',Object.create(null));
 assert.ok(items.length>=175,'unexpected catalogue shrinkage');
 const ids=new Set(), urls=new Set();
 for(const item of items){
  assert.ok(item.id&&item.name&&item.desc&&item.type&&item.link,'incomplete resource '+item.id);
  assert.match(item.link,/^https?:\/\//,'invalid URL '+item.id);
  assert.ok(!ids.has(item.id),'duplicate resource ID '+item.id); ids.add(item.id);
  const canonical=new URL(item.link).href.replace(/\/$/,'').toLowerCase();
  assert.ok(!urls.has(canonical),'duplicate URL '+canonical);urls.add(canonical);
 }
 const friends=items.filter(x=>x.type==='Дружественные каналы').map(x=>[x.id,x.name,x.desc,x.link]);
 assert.equal(friends.length,11,'do not alter friendly channels');
 const snapshot=JSON.stringify(items.filter(x=>x.type==='Дружественные каналы'));
 let friendlyHash=2166136261;
 for(let i=0;i<snapshot.length;i++){friendlyHash^=snapshot.charCodeAt(i);friendlyHash=Math.imul(friendlyHash,16777619);}
 assert.equal(friendlyHash>>>0,2266693070,'friendly channels changed: names, order, links or descriptions');
 for(const [id] of friends)assert.ok(id.startsWith('fr-'),'invalid friendly ID');
 const free=new Set(['learn-mit-ocw','learn-nptel','learn-teachengineering','learn-freecodecamp','learn-odin','learn-openlearn','learn-mit-open-library','learn-arduino','learn-allaboutcircuits']);
 const courses=items.filter(x=>x.type==='Обучение и курсы');
 assert.ok(courses.length>=9);
 for(const x of courses)assert.ok(free.has(x.id),'learning resources must be reviewed for free access: '+x.id);
 const calculator=fs.readFileSync('calculator.html','utf8');
 assert.ok(!calculator.includes('id="labCaliper"'),'duplicate virtual caliper in calculators');
 assert.ok(calculator.includes('id="calcUnits"'),'unit converter should remain');
 assert.ok(fs.readFileSync('measurement-lab.html','utf8').includes('id="embeddedInstruments"'),'measurement lab must keep calipers');
});

console.log('Matrix: '+count+' PASS, '+errors.length+' FAIL ('+pages.length+' pages, '+datasets.length+' datasets)');
if(errors.length)process.exitCode=1;
