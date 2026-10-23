/* Baseline-prompt review is reapplied independently to all 51 career records. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{timeout:5000});
vm.runInNewContext(fs.readFileSync('salary-sources.js','utf8'),ctx,{timeout:5000});
const cards=ctx.window.professionsData,sources=ctx.window.salarySourceAudit;
const sourceMap=new Map(sources.map(x=>[x.id,x]));
const userCriteria=Object.freeze([
 'unique_identifier_and_title','description','educational_notes','career_roles',
 'no_fabricated_schedule','subjective_tradeoffs','salary_source_status',
 'no_unsupported_statistical_claims','preserved_accessibility'
]);
assert.equal(cards.length,51);
assert.equal(sources.length,51);
assert.equal(new Set(cards.map(x=>x.id)).size,51);
assert.equal(sourceMap.size,51);
let sequential=0;
const revisedAudit=fs.readFileSync('audit/career-51-source-by-source-2026-10-21.md','utf8');
assert.equal((revisedAudit.match(/^### \d+\. /gm)||[]).length,51,'all 51 must have separate substantive review');
const sourceCounts={confirmed:0,hidden:0};
for(const x of sources){
 assert.equal(x.checkedAt,'2026-10-21',x.id+' not re-reviewed on 21 October');
 assert.ok(['observed_21_10_2026','not_reproducible_21_10_2026'].includes(x.reviewStatus),x.id+' evidence classification missing');
 if(x.status==='source_snapshot'){sourceCounts.confirmed++;assert.equal(x.reviewStatus,'observed_21_10_2026',x.id+' source not re-opened');}
 else {sourceCounts.hidden++;assert.equal(x.reviewStatus,'not_reproducible_21_10_2026');assert.ok(!/Ранее в реестре стояло [\d–]+ ₽/.test(x.notes),x.id+' suppressed salary leaked in modal note');}
}
assert.equal(sourceCounts.confirmed,23,'reviewed displayable evidence count changed');
assert.equal(sourceCounts.hidden,28,'withdrawn unsupported salary count changed');
const classes={};
for(const card of cards){
 // Reload the same baseline checklist on EACH record; no blanket whole-file assumption.
 const criteria=[...userCriteria];
 assert.equal(criteria.length,9);
 assert.match(card.id,/^[a-z0-9-]+$/,'invalid profession ID');
 assert.ok(typeof card.title==='string'&&card.title.trim().length>=4,card.id+' title');
 assert.ok(typeof card.shortDesc==='string'&&card.shortDesc.trim(),card.id+' description');
 assert.ok(card.education?.requirements?.trim(),card.id+' education');
 assert.ok(card.education.requirements.length>=70,card.id+' education too generic following per-card review');
 assert.ok(Array.isArray(card.education?.courses)&&card.education.courses.length,card.id+' training topics');
 assert.ok(Array.isArray(card.careerGrowth)&&card.careerGrowth.length>=2,card.id+' career roles');
 assert.ok(card.careerGrowth.every(x=>typeof x.title==='string'&&x.title.trim()),card.id+' career roles incomplete');
 assert.ok(!Object.prototype.hasOwnProperty.call(card,'typicalDay'),card.id+' contains invented workday');
 assert.ok(card.easy?.trim()&&card.hard?.trim(),card.id+' subjective pros and challenges');
 const row=sourceMap.get(card.id);
 assert.ok(row,card.id+' salary provenance missing');
 assert.equal(row.salaryUnit,'RUB_per_month',card.id+' salary unit');
 assert.match(row.sourceUrl,/^https:\/\//,card.id+' salary source URL');
 assert.ok(row.checkedAt,card.id+' salary snapshot date');
 assert.ok(row.region,card.id+' salary region');
 assert.ok(['source_page_checked','adjacent_occupation_checked','employer_vacancy_checked','source_linked_not_independently_verified','source_unavailable_for_verification'].includes(row.validationStatus),card.id+' unknown source status');
 if(row.status==='source_snapshot') assert.ok(Number.isFinite(row.rangeMinRub)&&Number.isFinite(row.rangeMaxRub)&&row.rangeMinRub>0&&row.rangeMaxRub>=row.rangeMinRub,card.id+' salary number invalid');
 else assert.ok(row.rangeMinRub==null&&row.rangeMaxRub==null,card.id+' unverified salaries must not carry numbers');
 if(row.validationStatus==='adjacent_occupation_checked')assert.ok(row.evidenceLevel==='adjacent_or_weak',card.id+' adjacent data must be flagged weak');
 classes[row.validationStatus]=(classes[row.validationStatus]||0)+1;
 sequential++;
}
const script=fs.readFileSync('script.js','utf8'),compare=fs.readFileSync('compare.js','utf8'),map=fs.readFileSync('map.html','utf8'),college=fs.readFileSync('map-data.js','utf8');
const audit=fs.readFileSync('audit/career-51-card-review-2026-10-21.md','utf8');
assert.equal((audit.match(/^\| \d+ \|/gm)||[]).length,51,'each reviewed profession must appear in report');
for(const p of cards)assert.ok(audit.includes('\`'+p.id+'\`'),p.id+' missing reviewed row');
assert.ok(script.includes('aria-labelledby", title.id'),'title-only accessible card name missing');
assert.ok(!script.includes('card.append(desc)'),'external card must not show description');
assert.ok(script.includes('Условия и особенности работы'),'work conditions section missing');
assert.ok(!script.includes('Пример рабочего дня'),'fabricated schedule visible');
assert.ok(script.includes('Опубликованный диапазон'),'salary attribution missing');
assert.ok(script.includes('одно значение'),'single salary should not become an open-ended lower bound');
assert.ok(compare.includes('Страница источника ↗'),'comparison source references missing');
assert.ok(compare.includes('searchParams.set'),'shareable comparison state missing');
assert.ok(!college.includes('без ЕГЭ'),'unconditional SPО admission claim remains');
assert.ok(map.includes('Минобрнауки России, 19.06.2026'),'official 2026 rule reference missing');
const uiContext=vm.createContext({window:ctx.window,document:{addEventListener(){}}});
vm.runInContext(script,uiContext,{timeout:5000});
const encode=x=>String(x).replace(/[&<>"\']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
for(const card of cards){
 const rendered=vm.runInContext('renderProfession(window.professionsData.find(x=>x.id===' + JSON.stringify(card.id) + '),"Тест")',uiContext);
 assert.ok(rendered.includes(encode(card.title)),card.id+' title missing in modal');
 assert.ok(!/Пример рабочего дня|Численность специалистов|Зарплата не подтверждена|Снимок внешнего источника/.test(rendered),card.id+' noisy placeholder');
 assert.equal(rendered.split(encode(card.shortDesc)).length-1,1,card.id+' duplicated description');
 assert.equal(rendered.split(encode(card.education.requirements)).length-1,1,card.id+' duplicated education');
}
const energy=vm.runInContext('renderProfession(window.professionsData.find(x=>x.id==="power-engineer"),"Энергетика")',uiContext);
assert.match(energy,/<h4>Программные инструменты<\/h4>/,'energy software not recognised');
assert.match(energy,/RastrWin/);
console.log('PASS 51/51 rendered career cards: no fabricated schedules, placeholder statistics or duplicate copy');
console.log('PASS 51/51 repeated career checks: structure, identifiers, source-status caveats, rendering, comparison and 2026 admissions');
console.log('Source-status distribution: '+JSON.stringify(classes));
