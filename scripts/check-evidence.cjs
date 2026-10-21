const fs=require('node:fs');
const assert=require('node:assert/strict');
const r=JSON.parse(fs.readFileSync('knowledge/source-registry.json','utf8'));
const kinds=['professions','materials','processes','dictionary'];
const ids={};
for(const type of kinds){
 const x=JSON.parse(fs.readFileSync('knowledge/'+type+'.json','utf8'));
 ids[type]=new Set(x.items.map(item=>type==='dictionary'?item.term:item.id));
}
const sourceIds=new Set();
for(const s of r.sources){
 assert.ok(s.sourceId&&s.title&&s.url&&s.publisher&&s.documentDate&&s.checkedAt&&s.appliesTo);
 assert.ok(s.url.startsWith('https://'));
 assert.ok(!sourceIds.has(s.sourceId));
 sourceIds.add(s.sourceId);
}
const allowed=new Set(r.policy.allowedVerificationStatuses);
for(const e of r.recordEvidence){
 assert.ok(ids[e.recordType]&&ids[e.recordType].has(e.recordId),'unknown record '+e.recordId);
 assert.ok(sourceIds.has(e.sourceId),'unknown source '+e.sourceId);
 assert.ok(e.claimPath&&allowed.has(e.verificationStatus));
}
console.log('Evidence links checked: '+r.sources.length+' sources, '+r.recordEvidence.length+' record links');
