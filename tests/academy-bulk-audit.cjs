'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const pages=['academy-draft.html','academy-draft-part2.html','academy-draft-part3.html'];
const rows=[];
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 for(const [,id,body] of html.matchAll(/<section class="lesson" id="([^"]+)">([\s\S]*?)<\/section>/g)){
  const forms=[...body.matchAll(/<form data-id="([^"]+)"/g)].map(x=>x[1]);
  const links=[...body.matchAll(/href="(https?:[^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(forms,[id+'-1',id+'-2'],id+' exercise IDs');
  assert.ok((body.match(/<details>/g)||[]).length>=2,id+' two solution blocks');
  assert.ok(body.includes('class="worked-example"'),id+' worked example');
  assert.ok(body.includes('class="learning-check"'),id+' learning objectives');
  assert.ok(links.length>=1,id+' source candidate');
  rows.push({id,file,forms:forms.length,sources:links.length});
 }
}
assert.equal(rows.length,49,'49 lessons');
assert.equal(new Set(rows.map(x=>x.id)).size,49,'unique lesson IDs');
assert.equal(rows.reduce((n,x)=>n+x.forms,0),98,'98 exercises');
const index=fs.readFileSync('academy-index-draft.html','utf8');
assert.match(index,/<meta name="robots" content="noindex,nofollow">/,'draft catalogue must remain noindex');
assert.match(index,/НЕ ПУБЛИКОВАТЬ/,'draft catalogue must warn against release');
for(const file of pages)assert.match(fs.readFileSync(file,'utf8'),/НЕ ПУБЛИКОВАТЬ/,'draft '+file+' must retain release warning');
const release='academy-attestation.json';
if(fs.existsSync(release)){
 const data=JSON.parse(fs.readFileSync(release,'utf8'));
 const approved=Object.values(data.lessons||{}).filter(x=>x.status==='PASS').length;
 console.log('Attestation claims: '+approved+'/49 (must also pass independent evidence audit)');
}else console.log('Attestation: BLOCKED — no academy-attestation.json; draft-only checks may pass.');
console.log('PASS bulk structural audit: 49 unique lessons, 98 exercises, candidate links, examples and release isolation. NOT factual certification.');
