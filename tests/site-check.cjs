const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const htmlFiles = fs.readdirSync('.').filter(name => name.endsWith('.html'));
let checked = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  assert.match(html, /<html\b/i, file + ': missing html tag');
  assert.match(html, /<title>[^<]+<\/title>/i, file + ': missing title');
  // Only static HTML attributes are local assets. Ignore JS template strings
  // inside inline scripts, which can contain dynamic href/src expressions.
  const staticMarkup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const match of staticMarkup.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
    const link = match[1].split(/[?#]/)[0];
    if (!link || /^(?:https?:|mailto:|tel:|data:|\/\/|#)/i.test(link)) continue;
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(link));
    assert.ok(fs.existsSync(resolved), file + ': missing local asset ' + link);
    checked++;
  }
}
const context = {window: {}};
vm.runInNewContext(fs.readFileSync('data.js', 'utf8'), context, {timeout: 5000});
const professions = context.window.professionsData;
assert.ok(Array.isArray(professions) && professions.length > 0, 'profession data is empty');
const ids = professions.map(item => item.id);
assert.equal(new Set(ids).size, ids.length, 'duplicate profession IDs');
for (const item of professions) {
  assert.ok(typeof item.id === 'string' && item.id, 'profession missing id');
  assert.ok(typeof item.title === 'string' && item.title, item.id + ': missing title');
}
const script = fs.readFileSync('script.js', 'utf8');
const categoryPart = script.match(/const CATEGORY_PROFESSIONS = (\{[\s\S]*?\});/);
assert.ok(categoryPart, 'category map missing');
const categories = vm.runInNewContext('(' + categoryPart[1] + ')');
const referenced = Object.values(categories).flat();
assert.equal(new Set(referenced).size, referenced.length, 'profession appears in multiple categories');
for (const id of referenced) assert.ok(ids.includes(id), 'unknown profession in categories: ' + id);
console.log('OK: ' + htmlFiles.length + ' HTML pages, ' + checked + ' local asset references, ' + professions.length + ' professions');

const calculatorSource = fs.readFileSync('engineer-calculators.js', 'utf8');
const parseBody = calculatorSource.match(/const parseNumber = \(text\) => \{([\s\S]*?)\n    \};/);
assert.ok(parseBody, 'numeric parser missing');
const parseNumber = vm.runInNewContext('(text) => {' + parseBody[1] + '}');
assert.equal(parseNumber('100 000'), 100000, 'spaces in amounts');
assert.equal(parseNumber('2,5'), 2.5, 'decimal comma');
assert.equal(parseNumber('-273,15'), -273.15, 'negative temperature');
for (const value of ['', '12abc', '1.2.3', 'Infinity', '1e309']) {
  assert.ok(Number.isNaN(parseNumber(value)), 'invalid numeric input accepted: ' + value);
}
console.log('OK: numeric input validation scenarios');

const salaryEntries = professions.filter(p => p.salary);
for (const p of salaryEntries) {
  assert.ok(typeof p.salary === 'object', p.id + ': salary is not an object');
  if (p.salary.regions !== undefined) assert.ok(typeof p.salary.regions === 'object', p.id + ': invalid regions');
}
const salaryUi = fs.readFileSync('engineer-calculators.js', 'utf8');
assert.match(salaryUi, /Неподтверждённые суммы скрыты/, 'salary calculator must hide unsourced figures');
assert.match(salaryUi, /Фактическое удержание НДФЛ по месяцам может отличаться/, 'tax calculator lacks withholding caveat');
assert.match(salaryUi, /не учитывает упущенный заработок/, 'ROI calculator lacks opportunity-cost caveat');
assert.equal(salaryEntries.length,0,'legacy unsourced salaries must not return');
console.log('OK: legacy unsourced salary objects absent from all professions');

const salaryContext = {window: {}};
vm.runInNewContext(fs.readFileSync('salary-sources.js', 'utf8'), salaryContext);
const audits = salaryContext.window.salarySourceAudit;
assert.equal(audits.length, professions.length, 'salary audit must cover every profession');
assert.equal(new Set(audits.map(x => x.id)).size, audits.length, 'duplicate salary audit id');
for (const row of audits) {
  assert.ok(ids.includes(row.id), 'unknown salary audit id ' + row.id);
  if (row.status !== 'source_snapshot') continue;
  assert.match(row.sourceUrl, /^https:\/\/[^\s/]+\/\S+$/, row.id + ': invalid source URL');
  assert.ok(Number.isFinite(row.rangeMinRub) && row.rangeMinRub > 0, row.id + ': invalid lower bound');
  assert.ok(Number.isFinite(row.rangeMaxRub) && row.rangeMaxRub >= row.rangeMinRub, row.id + ': invalid upper bound');
}
assert.match(fs.readFileSync('index.html', 'utf8'), /src="salary-sources\.js"/);
assert.doesNotMatch(fs.readFileSync('calculator.html','utf8'), /src="(?:salary-sources|data)\.js"/, 'standalone calculators must not download profession and salary catalogs');
console.log('OK: ' + audits.filter(x => x.status === 'source_snapshot').length + ' sourced salary records / ' + audits.length + ' professions');

assert.match(fs.readFileSync('script.js', 'utf8'), /Непроверенные цифры скрыты/, 'profession cards must hide unsourced salaries');

assert.equal(audits.filter(x => x.status === 'source_snapshot').length + audits.filter(x => x.status === 'unverified').length, professions.length, 'every profession must have an explicit sourced or unverified status');
assert.ok(audits.filter(x => x.status === 'unverified').every(x => x.rangeMinRub === null && x.rangeMaxRub === null), 'unverified salary values must be hidden');

const allowedEvidenceLevels = new Set(['aggregate_or_range', 'single_observation', 'adjacent_or_weak', 'needs_manual_review']);
for (const row of audits) {
  assert.ok(allowedEvidenceLevels.has(row.evidenceLevel), row.id + ': evidence quality not classified');
  assert.ok(['source_linked_not_independently_verified', 'source_page_checked', 'employer_vacancy_checked', 'adjacent_occupation_checked', 'source_unavailable_for_verification'].includes(row.validationStatus), row.id + ': unknown validation status');
}
assert.match(fs.readFileSync('script.js', 'utf8'), /Тип данных:/, 'profession card missing evidence quality');
console.log('OK: evidence limitations classified for all professions');

assert.match(fs.readFileSync('script.js', 'utf8'), /Практика: задачи, знания и инструменты/, 'profession cards should include practical guidance');
assert.match(fs.readFileSync('script.js', 'utf8'), /Редакционная памятка/, 'practical guidance must be labelled as editorial');
assert.match(fs.readFileSync('script.js', 'utf8'), /Зарплата не подтверждена/, 'unsourced career step salaries must be hidden');
assert.doesNotMatch(fs.readFileSync('script.js', 'utf8'), /renderProfile\(profession\.stats\)/, 'unverified demographics must not be rendered');
console.log('OK: practical editorial guidance and numeric-data safeguards');

assert.match(fs.readFileSync('script.js', 'utf8'), /classifyLearningItems/, 'legacy learning items should be classified');
assert.match(fs.readFileSync('script.js', 'utf8'), /Методы, дисциплины и темы обучения/, 'methods must not be labelled software');
console.log('OK: software and learning topics distinguished');

for (const page of ['compare.html', 'processes.html', 'materials.html']) {
  const html = fs.readFileSync(page, 'utf8');
  assert.match(html, /theme\.js/, page + ': theme missing');
  assert.match(html, /style(?:-(?:core|reference))?(?:\.min)?\.css/, page + ': stylesheet missing');
}
assert.match(fs.readFileSync('index.html', 'utf8'), /href="compare\.html"/, 'comparison link missing');
assert.match(fs.readFileSync('index.html', 'utf8'), /href="processes\.html"/, 'processes link missing');
assert.match(fs.readFileSync('index.html', 'utf8'), /href="materials\.html"/, 'materials link missing');
assert.match(fs.readFileSync('compare.js', 'utf8'), /chosen\.length>=4/, 'comparison limit missing');
assert.match(fs.readFileSync('processes-data.js', 'utf8'), /Неразрушающий контроль/, 'process seed missing');
assert.match(fs.readFileSync('materials-data.js', 'utf8'), /Арамидная ткань/, 'materials seed missing');
console.log('OK: comparison, processes, materials navigation and seed checks');

const referenceContext={window:{}};
vm.runInNewContext(fs.readFileSync('materials-data.js','utf8'),referenceContext,{timeout:5000});
vm.runInNewContext(fs.readFileSync('processes-data.js','utf8'),referenceContext,{timeout:5000});
const materials=referenceContext.window.engineeringMaterials;
const processes=referenceContext.window.engineeringProcesses;
assert.ok(materials.length>=12,'insufficient material entries');
assert.ok(processes.length>=12,'insufficient process entries');
const materialIds=new Set(materials.map(x=>x.id));
const processIds=new Set(processes.map(x=>x.id));
assert.equal(materialIds.size,materials.length,'duplicate material IDs');
assert.equal(processIds.size,processes.length,'duplicate process IDs');
for(const m of materials){assert.ok(m.name&&m.detail&&m.note,m.id+': missing material content');for(const id of m.process)assert.ok(processIds.has(id),m.id+': unknown process '+id);}
for(const p of processes){assert.ok(p.name&&p.steps&&p.checks,p.id+': missing process content');for(const id of p.materials)assert.ok(materialIds.has(id),p.id+': unknown material '+id);assert.ok(ids.includes(p.profession),p.id+': unknown profession '+p.profession);}
for(const page of ['materials.html','processes.html']){const html=fs.readFileSync(page,'utf8');assert.match(html,/Category|Category|Category|id="(?:material|process)Category"/,page+': category selector missing');}
console.log('OK: '+materials.length+' material entries, '+processes.length+' process entries; cross-references validated');

const designCSS=fs.readFileSync('style.css','utf8');
const hexColors=[...designCSS.matchAll(/(?<![\w-])#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![\w-])/g)].map(x=>x[1]);
for(const raw of hexColors){const rgb=raw.length===3?raw.split('').map(x=>parseInt(x+x,16)):[0,2,4].map(i=>parseInt(raw.slice(i,i+2),16));assert.ok(Math.max(...rgb)-Math.min(...rgb)<=8,'non-monochrome color in CSS: #'+raw);}
const home=fs.readFileSync('index.html','utf8');
const homeNav=home.match(/<nav id="site-main-navigation"[\s\S]*?<\/nav>/)?.[0];
assert.ok(homeNav,'homepage main navigation missing');
for(const target of ['compare.html','processes.html','materials.html'])assert.equal(homeNav.split('href="'+target+'"').length-1,1,'duplicate home navigation to '+target);
assert.match(designCSS,/--ui-control-height:54px/,'unified control height missing');
assert.match(designCSS,/\.site-page \.atlas-card a/,'reference button links missing');
assert.match(designCSS,/\.site-page \.eng-tabs \.eng-tab/,'navigation button style missing');
console.log('OK: monochrome palette, unique navigation, standardized controls and links');

const allPages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const page of allPages){
  const markup=fs.readFileSync(page,'utf8');
  const navStart=markup.indexOf('<nav');
  const navEnd=markup.indexOf('</nav>',navStart);
  assert.ok(navStart>=0&&navEnd>navStart,page+': missing shared navigation');
  const nav=markup.slice(navStart,navEnd+6);
  assert.ok(nav.includes('class="eng-tabs"'),page+': navigation class missing');
  for(const href of allPages) assert.equal(nav.split('href="'+href+'"').length-1,1,page+': missing or duplicated '+href);
  assert.ok(markup.toLowerCase().includes('charset="utf-8"'),page+': missing UTF-8 declaration');
}
assert.ok(fs.readFileSync('index.html','utf8').includes('<strong>9</strong> разделов'),'homepage section count is stale');
console.log('OK: all nine pages retain complete navigation, UTF-8 declarations and accurate section count');

for(const page of allPages){
  const html=fs.readFileSync(page,'utf8');
  assert.equal(html.split('src="navigation.js"').length-1,1,page+': responsive navigation missing or duplicated');
}
const navigationJs=fs.readFileSync('navigation.js','utf8');
assert.match(navigationJs,/aria-expanded/,'mobile menu needs expanded state');
assert.match(navigationJs,/Escape/,'mobile menu needs Escape handling');
assert.match(fs.readFileSync('style.css','utf8'),/site-nav-open/,'mobile menu styling missing');
console.log('OK: responsive navigation enabled once on every page with keyboard handling');

for(const page of allPages){
 const html=fs.readFileSync(page,'utf8');
 assert.equal(html.split('src="site-shell.js"').length-1,1,page+': shared shell missing or duplicated');
}
const shell=fs.readFileSync('site-shell.js','utf8');
assert.ok(shell.includes('site-footer-links'),'shared footer links missing');
assert.ok(shell.includes('footer-theme .theme-toggle'),'legacy theme control must be preserved');
console.log('OK: shared header and footer script loaded on all nine pages');

for(const page of ['resources.js','dictionary.js','materials.js','processes.js']){
 const js=fs.readFileSync(page,'utf8');
 // Resources controls are now static HTML to prevent layout shifts before JS renders.
 const controls=page==='resources.js'?fs.readFileSync('resources.html','utf8'):js;
 assert.ok(controls.includes('filter-status'),page+': missing result counter');
 assert.ok(controls.includes('filter-reset'),page+': missing reset action');
}
assert.ok(fs.readFileSync('dictionary.js','utf8').includes('title.textContent=item.term'),'dictionary term must be rendered as text');
console.log('OK: resource, dictionary and atlas search counters and reset actions');

assert.ok(fs.readFileSync('processes.html','utf8').includes('src="materials-data.js"'),'process cross-reference labels require material data');
assert.ok(fs.readFileSync('processes.js','utf8').includes('materialNames[id]||id'),'process links should use material names');
console.log('OK: process cross-links display material names instead of technical IDs');

const linkIssues=[];
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/g)){
   const url=match[1];
   if(!url||/^(?:https?:|mailto:|tel:|data:|\/\/|#)/i.test(url))continue;
   const [relative,fragment]=url.split('#');
   if(!fragment||!relative||!relative.endsWith('.html'))continue;
   const target=path.resolve(path.dirname(file),relative.split('?')[0]);
   if(!fs.existsSync(target)){linkIssues.push(file+': '+url+' missing target');continue;}
   const targetHtml=fs.readFileSync(target,'utf8');
   const id=decodeURIComponent(fragment);
   if(!targetHtml.includes('id="'+id+'"')&&!targetHtml.includes("id='"+id+"'")){
     // Profession deep links resolve through the catalog's router, not static DOM IDs.
     const isKnownProfession = relative==='index.html' && id.startsWith('profession=') && ids.includes(id.slice('profession='.length));
     if(!isKnownProfession && !['materials.html','processes.html'].includes(relative))linkIssues.push(file+': '+url+' missing anchor');
   }
 }
}
assert.deepEqual(linkIssues,[],'broken internal anchor links');
console.log('OK: static internal page anchors resolve');

const externalScript=fs.readFileSync('tests/external-links.cjs','utf8');
assert.ok(externalScript.includes("result:'unverified'"),'network failures must not be called broken');
assert.ok(externalScript.includes('status===404||status===410'),'broken links need confirmed HTTP status');
const resourcesContext={};
vm.runInNewContext(fs.readFileSync('resources-data.js','utf8')+'\nthis.resourceList=resources',resourcesContext,{timeout:5000});
const resourceList=resourcesContext.resourceList;
assert.equal(new Set(resourceList.map(x=>x.id)).size,resourceList.length,'duplicate resource IDs');
assert.equal(new Set(resourceList.map(x=>x.link)).size,resourceList.length,'duplicate resource URLs');
for(const resource of resourceList){
 assert.ok(/^https?:\/\//.test(resource.link),'resource needs valid HTTP URL: '+resource.id);
 assert.ok(resource.name&&resource.type&&resource.desc,'resource metadata incomplete: '+resource.id);
}
assert.ok(fs.readFileSync('navigation.js','utf8').includes("aria-current"),'current page accessibility missing');
for(const file of ['materials.js','processes.js']){
 const js=fs.readFileSync(file,'utf8');
 assert.ok(js.includes("addEventListener('hashchange'"),file+': linked card hash navigation missing');
}
console.log('OK: unique community links, external audit script and accessible deep links');

const salaryCtx={window:{}};
vm.runInNewContext(fs.readFileSync('salary-sources.js','utf8'),salaryCtx,{timeout:5000});
const salaryEvidenceRows=salaryCtx.window.salarySourceAudit;
assert.equal(salaryEvidenceRows.length,professions.length,'every profession must have salary evidence status');
assert.equal(new Set(salaryEvidenceRows.map(x=>x.id)).size,professions.length,'duplicate or missing salary audit ID');
for(const entry of salaryEvidenceRows){
 assert.ok(ids.includes(entry.id),'unknown profession in salary audit: '+entry.id);
 assert.ok(/^https?:\/\//.test(entry.sourceUrl),'missing salary source URL: '+entry.id);
 assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(entry.checkedAt),'missing salary check date: '+entry.id);
 assert.ok(['source_page_checked','adjacent_occupation_checked','employer_vacancy_checked','source_linked_not_independently_verified'].includes(entry.validationStatus),'unknown salary evidence status: '+entry.id);
 if(entry.status==='unverified')assert.ok(entry.rangeMinRub===null&&entry.rangeMaxRub===null,'unverified salary must not have numeric range: '+entry.id);
 else assert.ok(Number.isFinite(entry.rangeMinRub)&&Number.isFinite(entry.rangeMaxRub)&&entry.rangeMinRub<=entry.rangeMaxRub,'invalid salary range: '+entry.id);
}
assert.ok(fs.readFileSync('compare.html','utf8').includes('src="salary-sources.js"'),'comparison salary source script missing');
assert.ok(fs.readFileSync('compare.js','utf8').includes('salaryById'),'comparison must use audited salary data');
console.log('OK: all 51 salary evidence records matched and comparable-source warnings enabled');

const careerUi=fs.readFileSync('script.js','utf8');
assert.ok(careerUi.includes('Последовательность условная; сроки зависят от работодателя'),'career timelines must not be presented as guaranteed');
assert.ok(!careerUi.includes('<small>${escapeHTML(step.period)}</small>'),'unsupported career duration still visible');
const comparisonUi=fs.readFileSync('compare.js','utf8');
assert.ok(comparisonUi.includes('без гарантированной последовательности и сроков'),'comparison must qualify career progression');
console.log('OK: unsupported career deadlines removed from all 51 engineer detail cards and comparisons');

const educationUi=fs.readFileSync('script.js','utf8');
assert.ok(educationUi.includes('Универсального срока для должности нет'),'unverified educational durations must be suppressed');
assert.ok(educationUi.includes('Рекомендуемые знания (не юридическое требование)'),'editorial skills must not be binding requirements');
const audit=fs.readFileSync('audit/professions-51-review-2026-10-20.md','utf8');
for(const p of professions)assert.ok(audit.includes(p.title),'missing profession in editorial audit: '+p.id);
console.log('OK: 51-profession editorial evidence inventory and educational qualification disclaimers');

assert.ok(!educationUi.includes('${escapeHTML(duration)}</p>'),'unsourced education durations must not appear in cards');
assert.ok(!comparisonUi.includes('p.education?.duration'),'unsourced education durations must not appear in comparisons');
console.log('OK: unsupported education durations suppressed throughout profession UI');

const normativeContext={window:{}};
vm.runInNewContext(fs.readFileSync('career-standards-data.js','utf8'),normativeContext,{timeout:5000});
const normative=normativeContext.window.careerNormativeAudit;
assert.ok(normative&&Array.isArray(normative.records),'normative audit data missing');
assert.equal(normative.records.length,51,'normative audit must cover all 51');
assert.equal(new Set(normative.records.map(x=>x.id)).size,51,'duplicate normative entry');
assert.deepEqual(new Set(normative.records.map(x=>x.id)),new Set(professions.map(p=>p.id)),'normative mapping misses a profession');
assert.match(educationUi,/Статус нормативной проверки:/,'normative status not visible');
assert.ok(educationUi.includes('ст. 195.3 ТК РФ'),'legal applicability basis missing');
assert.ok(educationUi.includes('ст. 55.5-1 ГрК РФ'),'special construction conditions missing');
assert.ok(educationUi.includes('Ещё не действует'),'future effective date should be labeled');
assert.ok(educationUi.includes('window.careerNormativeAudit'),'modals must read approved audit records');
assert.ok(!educationUi.includes('CANDIDATE_PROFESSION_DOCUMENTS'),'obsolete normative candidates must be replaced');
const links=normative.records.flatMap(x=>x.documents);
assert.ok(links.length>=40,'too few function-specific references');
assert.ok(links.every(x=>/^https:\/\/mintrud\.gov\.ru\/docs\/mintrud\/orders\/\d+$/.test(x.url)),'source URL must point to primary ministry order');
assert.ok(normative.records.some(x=>x.id==='environmental-engineer'&&x.documents.some(y=>y.periodStatus==='not_yet_effective')),'future environmental standard must be separated');
assert.ok(normative.records.some(x=>x.id==='biomedical-engineer'&&x.documents.some(y=>y.periodStatus==='not_yet_effective')),'future biomechanics standard must be separated');
assert.ok(normative.records.some(x=>x.id==='civil-engineer'&&x.legalObligationStatus==='conditional_statutory_construction_roles'),'construction obligations must be conditional');
assert.ok(normative.records.find(x=>x.id==='standardization-engineer').documents.some(x=>x.order.includes('346н')),'standardization standard missing');
assert.ok(normative.records.find(x=>x.id==='patent-engineer').documents.some(x=>x.order.includes('748н')),'patent standard missing');
assert.ok(normative.records.find(x=>x.id==='qa-engineer').documents.some(x=>x.order.includes('531н')),'QA standard missing');
assert.ok(normative.records.some(x=>x.evidenceStatus==='role_must_be_specified'),'universal normative applicability cannot be fabricated');
console.log('OK: all 51 career records have function-specific official normative judgments and legal limitations');

const matrix=fs.readFileSync('audit/full-51-evidence-matrix-2026-10-20.md','utf8');
const matrixRows=matrix.split('\n').filter(line=>/^\d+ \| /.test(line));
assert.equal(matrixRows.length,professions.length,'evidence matrix must cover all professions');
for(const p of professions)assert.equal(matrixRows.filter(row=>row.includes(' | '+p.id+' | ')).length,1,'missing or duplicated evidence row: '+p.id);
assert.ok(matrix.includes('Не проведены:'),'matrix must disclose unverified dimensions');
console.log('OK: all 51 professions have one evidence matrix row with explicit limitations');

for(const p of professions){
 assert.ok(!p.stats,'unverified demographic statistics must not remain: '+p.id);
 assert.ok(!p.education?.duration,'unsourced education duration must not remain: '+p.id);
 for(const role of p.careerGrowth||[]){
  assert.ok(!role.period,'unsourced career time must not remain: '+p.id);
  assert.ok(!role.salary,'unsourced career salary must not remain: '+p.id);
 }
}
console.log('OK: all 51 records omit unsourced demographic and career estimates');

const siteMatrix=fs.readFileSync('audit/site-verification-matrix-2026-10-20.md','utf8');
const siteMatrixRows=siteMatrix.split('\n').filter(x=>/^\| \d+ \| /.test(x));
assert.equal(siteMatrixRows.length,professions.length,'site verification matrix must cover all professions');
for(const p of professions)assert.equal(siteMatrixRows.filter(x=>x.includes(' | '+p.id+' | ')).length,1,'site matrix must have exactly one row for '+p.id);
for(const heading of ['Зарплатные источники','Профстандарты','Доступность','Производительность'])assert.ok(siteMatrix.includes(heading),'missing QA domain '+heading);
assert.ok(siteMatrix.includes('NOT VERIFIED'),'unverified evidence must remain explicitly labeled');
console.log('OK: site QA matrix covers all 51 professions and critical verification domains');

for(const p of professions)assert.ok(!Object.hasOwn(p,'salary'),'legacy unsourced salary data must be removed: '+p.id);
const salaryConsistency=fs.readFileSync('audit/salary-consistency-51-2026-10-20.md','utf8');
assert.ok(salaryConsistency.includes('36 из 51'),'salary inconsistency report must preserve the measured result');
console.log('OK: unsupported legacy salary data removed and discrepancies documented');

const rejectedEvidence=salaryEvidenceRows.find(row=>row.id==='automotive-engineer');
assert.equal(rejectedEvidence.status,'unverified','404 salary source must remain unverified');
assert.equal(rejectedEvidence.rangeMinRub,null,'broken source cannot expose numeric salary');
assert.ok(comparisonUi.includes("x.status!=='source_snapshot'"),'comparison must hide withdrawn salary ranges');
assert.ok(fs.readFileSync('map.html','utf8').includes('src="salary-sources.js"'),'map salary calculator must load source evidence');
assert.ok(!fs.readFileSync('map.html','utf8').includes('id="salaryRegion"'),'do not promise unsupported regional salary splits');
assert.ok(!salaryUi.includes('!p.salary'),'salary calculator must not require removed legacy data');
console.log('OK: confirmed 404 evidence quarantined and salary widgets remain accurate');

/* Cross-page accessibility and responsive-shell regression checks. */
const sharedShell = fs.readFileSync('site-shell.js', 'utf8');
const navigation = fs.readFileSync('navigation.js', 'utf8');
const sharedStyles = fs.readFileSync('section-ui.css', 'utf8');
for (const file of ['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html']) {
  const html = fs.readFileSync(file, 'utf8');
  assert.match(html, /<main\b/i, file + ': missing main landmark');
  assert.match(html, /src="site-shell\.js"/, file + ': missing common shell');
  assert.match(html, /src="navigation\.js"/, file + ': missing common navigation');
  assert.match(html, /href="section-ui\.css"/, file + ': missing shared responsive styles');
  const navItems = (html.match(/class="eng-tab(?: active)?"/g) || []).length;
  assert.equal(navItems, 9, file + ': expected exactly nine section tabs');
}
assert.match(sharedShell, /skip\.className='skip-link'/, 'site shell must add skip link where missing');
assert.match(navigation, /aria-expanded/, 'mobile menu must report expanded state');
assert.match(navigation, /document\.addEventListener\('click'/, 'mobile menu must close on outside click');
assert.match(sharedStyles, /focus-visible/, 'keyboard focus style missing');
assert.match(sharedStyles, /@media\(max-width:600px\)/, 'narrow-viewport rule missing');
console.log('OK: nine-page shared shell, navigation, focus and responsive checks');

/* Discoverability files should resolve to actual published resources. */
const sitemap = fs.readFileSync('sitemap.xml','utf8');
const robots = fs.readFileSync('robots.txt','utf8');
const homepage = fs.readFileSync('index.html','utf8');
const prefix='https://vremennobeznika.github.io/enjigirling/';
assert.match(robots,/Sitemap: https:\/\/vremennobeznika\.github\.io\/enjigirling\/sitemap\.xml/);
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  assert.ok(match[1].startsWith(prefix),'unexpected sitemap origin: '+match[1]);
  const local=decodeURIComponent(match[1].slice(prefix.length));
  assert.ok(fs.existsSync(local),'sitemap entry missing in repository: '+local);
}
assert.match(homepage, /type="application\/ld\+json"/, 'missing structured knowledge catalog');
const catalogMatch=homepage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(catalogMatch,'missing JSON-LD catalog');
const catalog=JSON.parse(catalogMatch[1]);
assert.equal(catalog['@type'],'DataCatalog');
assert.equal(catalog.dataset.length,4);
console.log('OK: sitemap, robots and JSON-LD engineering catalog');

/* Evidence ledger integrity: the export must preserve exact source statuses. */
const ledger = JSON.parse(fs.readFileSync('knowledge/salary-evidence.json','utf8'));
assert.equal(ledger.dataset, 'salary-evidence');
assert.equal(ledger.records.length, professions.length);
const ledgerIds = new Set();
for (const row of ledger.records) {
  assert.ok(ids.includes(row.professionId), 'orphan evidence for ' + row.professionId);
  assert.ok(!ledgerIds.has(row.professionId), 'duplicate evidence for ' + row.professionId);
  ledgerIds.add(row.professionId);
  assert.ok(['source_snapshot','unverified'].includes(row.status), 'unknown salary evidence status');
  if (row.status === 'unverified') {
    assert.equal(row.rangeMinRub,null, 'unverified minimum leaked');
    assert.equal(row.rangeMaxRub,null, 'unverified maximum leaked');
  }
}
console.log('OK: ' + ledger.records.length + ' explicit salary evidence records and source statuses');
