'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const expected={E:[1,3,4,5,6,7,8,9,10],A:[1,2,4,5,6,7,8,9,10,11,12],C:[1,2,4,5,6,7,8,9,10],M:[1,2,3,4,5,6,7,8,9,10],Q:[1,2,3,4,5,6,7,8,9,10]};
const ids=Object.entries(expected).flatMap(([prefix,nums])=>nums.map(n=>prefix+String(n).padStart(2,'0')));
assert.equal(ids.length,49,'expected 49 lessons');
const path='academy-attestation.json';
if(!fs.existsSync(path)){console.error('BLOCKED: no independent lesson attestation evidence file');process.exit(1)}
const data=JSON.parse(fs.readFileSync(path,'utf8'));
assert.equal(data.schema,1);
assert.deepEqual(Object.keys(data.lessons||{}).sort(),ids.sort(),'must attest exactly 49 lessons');
for(const id of ids){
 const row=data.lessons[id];
 assert.equal(row.status,'PASS',id+' not attested');
 assert.ok(row.commit_sha&&/^[a-f0-9]{40}$/.test(row.commit_sha),id+' missing pinned content SHA');
 assert.ok(Array.isArray(row.claims)&&row.claims.length>=1,id+' missing claims');
 for(const claim of row.claims){
  assert.ok(typeof claim.statement==='string'&&claim.statement.length>10,id+' claim text');
  assert.ok(typeof claim.source_url==='string'&&claim.source_url.startsWith('https://'),id+' source');
  assert.ok(typeof claim.source_section==='string'&&claim.source_section.length>2,id+' exact section');
  assert.equal(claim.verdict,'supported',id+' unsupported claim');
 }
 assert.ok(Array.isArray(row.exercise_evidence)&&row.exercise_evidence.length===2,id+' two exercises');
 assert.ok(row.safety_review&&row.safety_review.status==='PASS',id+' safety review');
 assert.ok(row.reviewer&&row.reviewed_at,id+' provenance');
}
console.log('PASS: all 49 lessons have structured attestation evidence; manual source authenticity still requires independent review.');
