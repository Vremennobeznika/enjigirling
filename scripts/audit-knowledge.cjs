#!/usr/bin/env node
// Content-quality diagnostics; reports missing evidence, never invents verification.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const catalog=[
  ['professions','knowledge/professions.json',x=>x.id,x=>x.title],
  ['materials','knowledge/materials.json',x=>x.id,x=>x.name],
  ['processes','knowledge/processes.json',x=>x.id,x=>x.name],
  ['dictionary','knowledge/dictionary.json',x=>x.term,x=>x.term]
];
const findings=[],summary={};
const registry=JSON.parse(fs.readFileSync(path.join(root,'knowledge/source-registry.json'),'utf8'));
const evidenceByRecord=new Map();
for(const link of registry.recordEvidence){
  const key=link.recordType+'/'+link.recordId;
  if(!evidenceByRecord.has(key))evidenceByRecord.set(key,[]);
  evidenceByRecord.get(key).push(link);
}
for(const [type,file,getId,getTitle] of catalog){
  const payload=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
  if(!Array.isArray(payload.items))throw Error(file+': items must be an array');
  const seen=new Set();
  let withoutEvidence=0,sourceLocated=0,claimChecked=0;
  for(const item of payload.items){
    const id=getId(item),title=getTitle(item);
    if(typeof id!=='string'||!id.trim())findings.push({type,id:String(id),issue:'missing_identifier'});
    if(typeof title!=='string'||!title.trim())findings.push({type,id:String(id),issue:'missing_title'});
    const key=String(id).trim().toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
    if(seen.has(key))findings.push({type,id:String(id),issue:'duplicate_normalized_identifier'});
    seen.add(key);
    if(item.knowledgeMeta?.verificationStatus!=='requires_source_review')
      findings.push({type,id:String(id),issue:'unsupported_verification_status'});
    const sources=Array.isArray(item.knowledgeMeta?.primarySources)?item.knowledgeMeta.primarySources:[];
    const links=evidenceByRecord.get(type+'/'+id)||[];
    if(links.some(link=>link.verificationStatus==='source_located'))sourceLocated++;
    if(links.some(link=>link.verificationStatus==='claim_checked'))claimChecked++;
    if(!sources.length&&!links.length)withoutEvidence++;
    for(const source of sources){
      if(!/^https:\/\/\S+/i.test(source.url||'')||!source.checkedAt||!source.title)
        findings.push({type,id:String(id),issue:'incomplete_primary_source'});
    }
  }
  summary[type]={records:payload.items.length,withoutEvidenceLinks:withoutEvidence,sourceLocatedRecords:sourceLocated,claimCheckedRecords:claimChecked};
}
const report={schemaVersion:'1.0',generatedAt:new Date().toISOString(),summary,findings,
  limitations:'This reports evidence-link coverage; source_located is not factual verification. Only claim_checked signals a claimed content review; validation of source claims still requires independent review.'};
if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
else{
  for(const [name,entry] of Object.entries(summary))
    console.log(name+': '+entry.records+' records, '+entry.sourceLocatedRecords+' source-located, '+entry.claimCheckedRecords+' claim-checked, '+entry.withoutEvidenceLinks+' without evidence links');
  console.log('Structural findings: '+findings.length);
  for(const row of findings.slice(0,30))console.log(row.type+': '+row.id+' — '+row.issue);
}
if(findings.length && process.argv.includes('--strict'))process.exitCode=1;
