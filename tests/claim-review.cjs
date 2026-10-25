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
const sourceIds=new Set(report.sources.map(s=>s.sourceId));
assert.equal(baseline.remainingRecords.length,342,'original scope must remain reproducible');
assert.equal(new Set(baseline.remainingRecords.map(x=>x.join(':'))).size,342,'duplicate scope ID');
for(const [t,id] of baseline.remainingRecords)assert.ok(datasets[t]?.has(id),'missing baseline record '+id);
const seen=new Set();
for(const e of report.verifiedClaims){
 const k=key(e),item=datasets[e.recordType]?.get(e.recordId);
 assert.ok(item,'orphan reviewed record '+k);
 assert.ok(!seen.has(k),'duplicate reviewed claim '+k);seen.add(k);
 assert.deepEqual(recorded.get(k),e,'registry and review differ: '+k);
 assert.ok(sourceIds.has(e.sourceId),'missing inspected source '+k);
 for(const field of ['verifiedClaim','sourceSection','reviewScope','claimCheckedAt'])assert.ok(e[field]?.trim(),'missing '+field+': '+k);
 assert.equal(typeof item[e.claimPath],'string','reviewed path must be a text field: '+k);
 assert.equal(createHash('sha256').update(item[e.claimPath]).digest('hex'),e.reviewedTextSha256,'text changed; source review required: '+k);
 assert.equal(e.verificationStatus,'claim_checked');
}
for(const c of report.changes)assert.deepEqual(datasets[c.type].get(c.id)[c.field],c.after,'reviewed correction regressed: '+c.id+'/'+c.field);
assert.deepEqual(datasets.processes.get('ground-penetrating-radar').materials,[]);
assert.deepEqual(datasets.processes.get('polymer-transfer-molding').materials,[]);
assert.deepEqual(datasets.processes.get('rubber-vulcanization').materials,[]);
console.log('PASS '+seen.size+' source-scoped confirmations, text fingerprints, '+report.changes.length+' corrections and 342 original scope IDs; no whole-card certification.');
