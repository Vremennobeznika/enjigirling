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
assert.match(salaryUi, /Основное значение — оценка без подтверждённой методики/, 'salary calculator lacks data quality notice');
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
  assert.match(row.sourceUrl, /^https:\/\/career\.hh\.ru\/profession\/\d+$/, row.id + ': invalid source');
  assert.ok(Number.isFinite(row.rangeMinRub) && row.rangeMinRub > 0, row.id + ': invalid lower bound');
  assert.ok(Number.isFinite(row.rangeMaxRub) && row.rangeMaxRub >= row.rangeMinRub, row.id + ': invalid upper bound');
}
assert.match(fs.readFileSync('index.html', 'utf8'), /src="salary-sources\.js"/);
assert.match(fs.readFileSync('calculator.html', 'utf8'), /src="salary-sources\.js"/);
console.log('OK: ' + audits.filter(x => x.status === 'source_snapshot').length + ' sourced salary records / ' + audits.length + ' professions');
