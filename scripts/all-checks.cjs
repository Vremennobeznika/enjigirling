#!/usr/bin/env node
const {spawnSync}=require('node:child_process');
const steps=[
 ['S01-S10 S16 HTML, navigation and editorial data','node',['tests/site-check.cjs']],
 ['S11-S12 JSON exports and graph','node',['scripts/build-knowledge.cjs','--check']],
 ['S13 source and claim references','node',['scripts/check-evidence.cjs']],
 ['S14 evidence completeness report','node',['scripts/audit-knowledge.cjs']]
];
let failures=0;
for(const [name,command,args] of steps){
 console.log('\n=== '+name+' ===');
 const r=spawnSync(command,args,{stdio:'inherit',cwd:require('node:path').resolve(__dirname,'..')});
 if(r.error||r.status!==0){failures++;console.error('FAIL: '+name);}
 else console.log('PASS: '+name);
}
console.log('\nStatic QA: '+(steps.length-failures)+'/'+steps.length+' checks passed.');
if(failures)process.exitCode=1;
