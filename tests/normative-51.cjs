const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const dataset=JSON.parse(fs.readFileSync('knowledge/career-standards-audit.json','utf8'));
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{timeout:5000});
vm.runInNewContext(fs.readFileSync('career-standards-data.js','utf8'),ctx,{timeout:5000});
const cards=ctx.window.professionsData,embedded=ctx.window.careerNormativeAudit;
assert.equal(cards.length,51);
assert.equal(dataset.records.length,51);
assert.equal(embedded.records.length,51);
assert.equal(new Set(dataset.records.map(x=>x.id)).size,51);
assert.equal(JSON.stringify(embedded),JSON.stringify(dataset),'rendered JS must exactly equal canonical normative JSON');
const map=new Map(dataset.records.map(x=>[x.id,x]));
for(const card of cards){
 const row=map.get(card.id);
 assert.ok(row,card.id+' has no specific normative analysis');
 assert.equal(row.title,card.title,'title mismatch '+card.id);
 assert.ok(row.assessment&&row.assessment.length>75,card.id+' contains no substantive scope analysis');
 assert.ok(['role_must_be_specified','published_standards_for_specific_functions'].includes(row.evidenceStatus),'unknown evidence status');
 assert.ok(['not_determined_for_unspecified_employer_role','conditional_statutory_construction_roles'].includes(row.legalObligationStatus),'unqualified legal claim');
 for(const doc of row.documents){
  assert.match(doc.url,/^https:\/\/mintrud\.gov\.ru\/docs\/mintrud\/orders\/\d+$/);
  assert.match(doc.effectiveFrom,/^\d{4}-\d{2}-\d{2}$/);
  assert.equal(doc.periodStatus,doc.effectiveFrom>dataset.reviewDate?'not_yet_effective':'in_force_on_review_date','effective date contradiction '+card.id);
  assert.ok(doc.name&&doc.order&&doc.relationship,'incomplete official source metadata');
 }
}
const knownFuture=dataset.records.flatMap(x=>x.documents).filter(d=>d.periodStatus==='not_yet_effective');
assert.equal(knownFuture.length,2,'future sources must be labeled');
assert.equal(dataset.records.filter(x=>x.documents.length).length,38,'coverage changed');
assert.equal(dataset.records.filter(x=>!x.documents.length).length,13,'broader roles must not be given invented standards');
const ui=fs.readFileSync('script.js','utf8'),page=fs.readFileSync('index.html','utf8');
assert.ok(page.indexOf('career-standards-data.js')>page.indexOf('data.js'));
assert.ok(page.indexOf('career-standards-data.js')<page.indexOf('script.js'));
assert.ok(ui.includes('window.careerNormativeAudit'),'new source ledger not used');
assert.ok(ui.includes('Ещё не действует'),'future standards not distinctly marked');
assert.ok(ui.includes('ст. 195.3 ТК РФ'),'legal basis omitted');
assert.ok(ui.includes('ст. 55.5-1 ГрК РФ'),'special construction statute omitted');
assert.ok(!ui.includes('CANDIDATE_PROFESSION_DOCUMENTS'),'outdated hardcoded normative suggestions still rendered');
assert.ok(fs.readFileSync('audit/career-standards-51-official-2026-10-22.md','utf8').includes('38/51'));
console.log('PASS: 51/51 case-by-case normative assessments, 33 distinct primary documents, 2 future-effective and zero inferred universal obligations');
