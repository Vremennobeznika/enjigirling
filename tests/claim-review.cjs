// A narrow confirmation must become stale when the reviewed text changes.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const report=read('audit/individual-claim-review-2026-10-25.json');
const baseline=read('audit/claim-review-baseline-2026-10-25.json');
const registry=read('knowledge/source-registry.json');
const datasets=Object.fromEntries(['materials','processes'].map(t=>[t,new Map(read('knowledge/'+t+'.json').items.map(x=>[x.id,x]))]));
const key=e=>[e.recordType,e.recordId,e.claimPath,e.sourceId].join(':');
const recorded=new Map(registry.recordEvidence.map(e=>[key(e),e]));
const repairs=read('audit/source-link-repairs-2026-10-27.json');
const superseded=new Map(repairs.reviewedClaims.map(r=>[r.key,r]));
const sourceIds=new Set(report.sources.map(s=>s.sourceId));
assert.equal(baseline.remainingRecords.length,342,'original scope must remain reproducible');
assert.equal(new Set(baseline.remainingRecords.map(x=>x.join(':'))).size,342,'duplicate scope ID');
for(const [t,id] of baseline.remainingRecords)assert.ok(datasets[t]?.has(id),'missing baseline record '+id);
const seen=new Set();
for(const e of report.verifiedClaims){
 const k=key(e),item=datasets[e.recordType]?.get(e.recordId);
 assert.ok(item,'orphan reviewed record '+k);
 assert.ok(!seen.has(k),'duplicate reviewed claim '+k);seen.add(k);
 const replacement=superseded.get(k);
 if(replacement){
  assert.deepEqual(replacement.previous,e,'repair must preserve the exact original judgment');
  assert.equal(replacement.current.verifiedClaim,e.verifiedClaim,'repair must not broaden a claim');
  assert.equal(replacement.current.reviewedTextSha256,e.reviewedTextSha256,'repair must retain reviewed text hash');
  assert.equal(replacement.current.verificationStatus,'claim_checked');
  assert.equal(replacement.current.claimCheckedAt,'2026-10-27');
  assert.equal(registry.sources.find(s=>s.sourceId===e.sourceId).url,replacement.url);
 }
 assert.deepEqual(recorded.get(k),replacement?replacement.current:e,'registry and review differ: '+k);
 assert.ok(sourceIds.has(e.sourceId),'missing inspected source '+k);
 for(const field of ['verifiedClaim','sourceSection','reviewScope','claimCheckedAt'])assert.ok(e[field]?.trim(),'missing '+field+': '+k);
 assert.equal(typeof item[e.claimPath],'string','reviewed path must be a text field: '+k);
 assert.equal(createHash('sha256').update(item[e.claimPath]).digest('hex'),e.reviewedTextSha256,'text changed; source review required: '+k);
 assert.equal(e.verificationStatus,'claim_checked');
}
for(const c of report.changes)assert.deepEqual(datasets[c.type].get(c.id)[c.field],c.after,'reviewed correction regressed: '+c.id+'/'+c.field);
const scope=new Set(baseline.remainingRecords.map(x=>x.join(':')));
const reviewed=new Set(report.verifiedClaims.map(e=>[e.recordType,e.recordId].join(':')));
const remaining=[...scope].filter(k=>!reviewed.has(k)).sort();
assert.deepEqual(report.remainingBaselineRecords.map(x=>x.join(':')).sort(),remaining,'remaining queue differs from actual evidence');
assert.equal(report.summary.remainingFrom342,remaining.length);
assert.equal(report.summary.newlyCoveredFrom342,342-remaining.length);
assert.equal(report.summary.verifiedClaims,report.verifiedClaims.length);
assert.equal(report.summary.contentCorrections,report.changes.length);
assert.equal(report.summary.wholeCardVerification,'not_claimed');
const matrix=read('audit/card-verification-matrix-2026-10-25.json');
assert.equal(matrix.records.length,342);
assert.deepEqual(new Set(matrix.records.map(e=>[e.recordType,e.recordId].join(':'))),scope);
for(const row of matrix.records){
 assert.equal(row.wholeCardVerified,false,'narrow evidence cannot certify a card');
 for(const field of row.openFields)assert.deepEqual(field.currentValue,datasets[row.recordType].get(row.recordId)[field.path],'stale inventory '+row.recordId+'/'+field.path);
}
assert.deepEqual(datasets.processes.get('ground-penetrating-radar').materials,[]);
assert.deepEqual(datasets.processes.get('polymer-transfer-molding').materials,[]);
assert.deepEqual(datasets.processes.get('rubber-vulcanization').materials,[]);
console.log('PASS '+seen.size+' source-scoped confirmations, text fingerprints, '+report.changes.length+' corrections and 342 original scope IDs; no whole-card certification.');
