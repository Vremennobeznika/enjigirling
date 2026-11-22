'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const batches=[
['academy-draft.html','academy-draft.js',13],
['academy-draft-part2.html','academy-draft-part2.js',12],
['academy-draft-part3.html','academy-draft-part3.js',24]
];
let total=0;
for(const [htmlFile,jsFile,lessons] of batches){
 const html=fs.readFileSync(htmlFile,'utf8');
 const js=fs.readFileSync(jsFile,'utf8');
 new vm.Script(js,{filename:jsFile});
 const ids=[...html.matchAll(/<form\b[^>]*\bdata-id="([^"]+)"/g)].map(m=>m[1]);
 const sectionIds=[...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(sectionIds.length,lessons,htmlFile+' lesson count');
 assert.equal(new Set(sectionIds).size,lessons,htmlFile+' duplicate lesson IDs');
 assert.equal(ids.length,lessons*2,htmlFile+' form count');
 assert.equal(new Set(ids).size,ids.length,htmlFile+' duplicate form IDs');
 assert.equal((html.match(/<\/form>/g)||[]).length,ids.length,htmlFile+' unclosed forms');
 assert.equal((html.match(/<\/section>/g)||[]).length,lessons,htmlFile+' unclosed sections');
 const match=js.match(/const answers=(\{[^;]+\});/);
 assert.ok(match,jsFile+' answer map');
 const answers=JSON.parse(match[1]);
 assert.deepEqual(Object.keys(answers).sort(),ids.slice().sort(),jsFile+' keys differ from forms');
 for(const [id,value] of Object.entries(answers)){
  assert.ok(Number.isFinite(value),id+' invalid answer');
  assert.ok(sectionIds.includes(id.replace(/-[12]$/,'')),id+' missing lesson');
 }
 assert.ok(html.includes('aria-live="polite"'),htmlFile+' inaccessible feedback');
 assert.ok(html.includes('name="answer"'),htmlFile+' input missing');
 assert.ok(html.includes('не')||html.includes('НЕ'),htmlFile+' missing draft warning');
 total+=ids.length;
 console.log('PASS',htmlFile,lessons,'lessons',ids.length,'exercises');
}
assert.equal(total,98);
console.log('PASS: 49 draft lessons, 98 answers. Structural tests only; browser and subject QA not covered.');

const index=fs.readFileSync('academy-index-draft.html','utf8');
const links=[...index.matchAll(/class="item" href="([^"]+)"/g)].map(m=>m[1]);
assert.equal(links.length,52,'academy index must contain all 52 lesson links');
assert.equal(new Set(links).size,52,'academy index duplicate lesson links');
for(const link of links){
 const [file,fragment]=link.split('#');
 assert.ok(fs.existsSync(file),'missing page: '+file);
 assert.ok(fs.readFileSync(file,'utf8').includes('id="'+decodeURIComponent(fragment)+'"'),'missing anchor: '+link);
}
assert.match(index,/\[hidden\]\{display:none!important\}/,'filtered cards must actually hide');
console.log('PASS: 52 indexed lesson links and targets');


const welding=fs.readFileSync('academy-draft-part3.html','utf8').match(/<section class="lesson" id="M08">([\s\S]*?)<\/section>/);
assert.ok(welding,'M08 welding lesson exists');
assert.ok(!/погонная энергия/i.test(welding[1]),'M08 must not label power or total energy as energy per unit length');
assert.match(welding[1],/мощность P=UI/,'M08 electrical power definition');
assert.match(welding[1],/энергия E=Pt/,'M08 electrical energy definition');
assert.ok(index.includes('Сварка: электрическая мощность и энергия (учебная модель)'),'index must use corrected M08 title');
console.log('PASS: welding energy and power terminology regression');


for(const [htmlFile,,lessons] of batches){
 const html=fs.readFileSync(htmlFile,'utf8');
 const references=[...html.matchAll(/(?:Первоисточник для предметной сверки|Источник для проверки модели цепи|Источник физической модели): <a href="(https:\/\/[^"]+)"/g)].map(m=>m[1]);
 assert.equal(references.length,lessons,htmlFile+' requires one source candidate per lesson');
 assert.ok(references.every(url=>/https:\/\/(?:[a-z0-9-]+\.)*(?:bipm\.org|nist\.gov|iec\.ch|iso\.org|modbus\.org|openstax\.org|analog\.com|asq\.org)\//.test(url)),htmlFile+' unapproved reference host');
 assert.equal((html.match(/Полная аттестация урока не выполнена\./g)||[]).length,lessons,htmlFile+' must not claim source attestation');
}
console.log('PASS: 49 lesson source-candidate links and honest attestation warnings');
