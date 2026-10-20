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
  for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
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
console.log('OK: ' + salaryEntries.length + ' salary records with required fields and visible limitations');

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
assert.match(fs.readFileSync('calculator.html', 'utf8'), /src="salary-sources\.js"/);
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
  assert.match(html, /style\.css/, page + ': stylesheet missing');
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
const hexColors=[...designCSS.matchAll(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/g)].map(x=>x[1]);
for(const raw of hexColors){const rgb=raw.length===3?raw.split('').map(x=>parseInt(x+x,16)):[0,2,4].map(i=>parseInt(raw.slice(i,i+2),16));assert.ok(Math.max(...rgb)-Math.min(...rgb)<=8,'non-monochrome color in CSS: #'+raw);}
const home=fs.readFileSync('index.html','utf8');
for(const target of ['compare.html','processes.html','materials.html'])assert.equal(home.split('href="'+target+'"').length-1,1,'duplicate home navigation to '+target);
assert.match(designCSS,/--ui-control-height:54px/,'unified control height missing');
assert.match(designCSS,/\.site-page \.atlas-card a/,'reference button links missing');
assert.match(designCSS,/\.site-page \.eng-tabs \.eng-tab/,'navigation button style missing');
console.log('OK: monochrome palette, unique navigation, standardized controls and links');

const allPages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const page of allPages){
  const markup=fs.readFileSync(page,'utf8');
  const nav=markup.match(/<nav\\b[^>]*class="eng-tabs"[^>]*>[\\s\\S]*?<\\/nav>/i);
  assert.ok(nav,page+': missing shared navigation');
  for(const href of allPages) assert.equal(nav[0].split('href="'+href+'"').length-1,1,page+': missing or duplicated '+href);
  assert.match(markup,/<meta\\s+charset="(?:UTF-8|utf-8)"/i,page+': missing UTF-8 declaration');
}
assert.match(fs.readFileSync('index.html','utf8'),/<strong>9<\\/strong> разделов/,'homepage section count is stale');
console.log('OK: all nine pages retain complete navigation, UTF-8 declarations and accurate section count');
