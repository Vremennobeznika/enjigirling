#!/usr/bin/env node
// Conservative automated source-content audit. A lexical match is NOT fact checking.
// Contents may be dynamic, blocked, misleading or unrelated to the named occupation.
const fs=require('node:fs');
const vm=require('node:vm');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('salary-sources.js','utf8'),sandbox,{timeout:5000});
const rows=sandbox.window.salarySourceAudit;
if(!Array.isArray(rows)||rows.length!==51)throw Error('Expected all 51 professions');
const results=Array(rows.length);
let cursor=0;
async function verify(entry){
  const base={id:entry.id,title:entry.title,sourceUrl:entry.sourceUrl,evidenceLevel:entry.evidenceLevel,validationStatus:entry.validationStatus,sourceStatus:entry.status};
  if(entry.status!=='source_snapshot')return {...base,result:'not_claimed',reason:'No public numeric salary claim'};
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try {
    const response=await fetch(entry.sourceUrl,{signal:controller.signal,redirect:'follow',headers:{'User-Agent':'Mozilla/5.0 (compatible; ENJIGIRLING-QA/1.0)'}});
    const status=response.status;
    if(!(status>=200&&status<400))return {...base,status,result:status===404||status===410?'broken':'unverified',reason:'HTTP status'};
    const type=response.headers.get('content-type')||'';
    if(!/html|text\//i.test(type))return {...base,status,result:'unverified',reason:'Not parseable HTML/text'};
    const raw=(await response.text()).slice(0,2000000);
    const visible=raw.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,' ')
      .replace(/<[^>]+>/g,' ')
      .replace(/&(?:nbsp|#160|#xA0);/gi,' ')
      .replace(/[\s\u00a0\u202f]/g,'');
    const min=visible.includes(String(entry.rangeMinRub));
    const max=visible.includes(String(entry.rangeMaxRub));
    return {...base,status,result:min&&max?'amounts_present':min||max?'one_amount_present':'amounts_not_found',minPresent:min,maxPresent:max,reason:'Lexical presence only; not verified attribution, relevance or accuracy'};
  }catch(e){return {...base,status:null,result:'unverified',reason:String(e.message||e).slice(0,130)};}
  finally{clearTimeout(timer);}
}
async function worker(){while(cursor<rows.length){const i=cursor++;results[i]=await verify(rows[i]);}}
(async()=>{
 await Promise.all(Array.from({length:5},worker));
 const kinds=['amounts_present','one_amount_present','amounts_not_found','unverified','broken','not_claimed'];
 const summary={total:rows.length,numericClaims:rows.filter(x=>x.status==='source_snapshot').length,generatedAt:new Date().toISOString()};
 for(const kind of kinds)summary[kind]=results.filter(x=>x.result===kind).length;
 fs.mkdirSync('audit',{recursive:true});
 fs.writeFileSync('audit/salary-content-audit.json',JSON.stringify({summary,results},null,2)+'\n');
 const md=['# Salary source-content QA','',...Object.entries(summary).map(([k,v])=>'- '+k+': '+v),'','**A match only means both digit sequences occur somewhere in the downloaded HTML text. It does not validate the salary, methodology, occupation, date or source reliability.**','','| ID | Result | HTTP | Evidence class | Source |','|---|---|---|---|---|',...results.map(x=>`| ${x.id} | ${x.result} | ${x.status??'—'} | ${x.evidenceLevel} | ${x.sourceUrl} |`)];
 fs.writeFileSync('audit/salary-content-audit.md',md.join('\n')+'\n');
 console.log(JSON.stringify(summary));
 for(const x of results.filter(x=>x.result==='broken'))console.error('BROKEN SALARY SOURCE',x.id,x.status,x.sourceUrl);
 if(summary.broken)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
