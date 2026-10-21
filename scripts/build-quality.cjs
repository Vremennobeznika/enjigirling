#!/usr/bin/env node
// Deterministic quality and evidence coverage metadata, not a certification.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const types=['professions','materials','processes','dictionary'];
const datasets=Object.fromEntries(types.map(type=>[type,read('knowledge/'+type+'.json').items]));
const registry=read('knowledge/source-registry.json');
const summary={};
for(const type of types){
 const key=type==='dictionary'?'term':'id';
 const keys=new Set(datasets[type].map(row=>row[key]));
 assert.equal(keys.size,datasets[type].length,'duplicate IDs in '+type);
 const linkedIds=new Set(registry.recordEvidence.filter(row=>row.recordType===type).map(row=>row.recordId));
 const checkedIds=new Set(registry.recordEvidence.filter(row=>row.recordType===type&&row.verificationStatus==='claim_checked').map(row=>row.recordId));
 for(const id of linkedIds)assert.ok(keys.has(id),'unknown evidence link: '+type+'/'+id);
 summary[type]={records:keys.size,recordsWithEvidenceLinks:linkedIds.size,recordsWithClaimCheckedLinks:checkedIds.size};
}
const evidenceStatuses={};
for(const link of registry.recordEvidence)evidenceStatuses[link.verificationStatus]=(evidenceStatuses[link.verificationStatus]||0)+1;
const total=types.reduce((n,type)=>n+summary[type].records,0);
const withEvidence=types.reduce((n,type)=>n+summary[type].recordsWithEvidenceLinks,0);
const withChecked=types.reduce((n,type)=>n+summary[type].recordsWithClaimCheckedLinks,0);
const result={
 schemaVersion:'1.0',generatedFrom:'repository knowledge datasets and evidence registry',
 scope:'metadata_integrity_only',
 limitations:'A located source is not a verified claim. This report does not check source contents, technical compliance, website availability or browser performance.',
 totalRecords:total,recordsWithEvidenceLinks:withEvidence,recordsWithClaimCheckedLinks:withChecked,
 totalRegisteredSources:registry.sources.length,totalEvidenceLinks:registry.recordEvidence.length,
 evidenceStatuses,byDataset:summary
};
const filename=path.join(root,'knowledge/quality.json');
const expected=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check')){
 assert.ok(fs.existsSync(filename),'quality report not generated');
 assert.equal(fs.readFileSync(filename,'utf8'),expected,'quality report is stale');
 console.log('Quality metadata current: '+total+' records, '+withEvidence+' evidence-linked, '+withChecked+' claim-checked.');
}else{
 fs.writeFileSync(filename,expected);
 console.log('Generated quality report: '+total+' records.');
}
