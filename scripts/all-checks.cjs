#!/usr/bin/env node
const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const rootJs=fs.readdirSync(root).filter(name=>name.endsWith('.js')||name.endsWith('.cjs'));
const scripts=fs.readdirSync(path.join(root,'scripts')).filter(name=>name.endsWith('.js')||name.endsWith('.cjs')).map(name=>'scripts/'+name);
const tests=fs.readdirSync(path.join(root,'tests')).filter(name=>name.endsWith('.js')||name.endsWith('.cjs')).map(name=>'tests/'+name);
const files=[...new Set([...rootJs,...scripts,...tests,'playwright.config.cjs'])];
const steps=[
 ['S00 JavaScript syntax across application and QA',()=>files.map(file=>['node',['--check',file]])],
 ['MEASUREMENT instruments assets',()=>[['node',['tests/measurement-lab.cjs']]]],
 ['RESOURCES catalog data and accessibility',()=>[['node',['tests/resources-catalog.cjs']]]],
 ['S01-S10 S16 HTML, navigation and editorial data',()=>[['node',['tests/site-check.cjs']]]],
 ['FULL P01-P06 D01-D09 A01-A03 S03',()=>[['node',['tests/full-matrix.cjs']],['node',['tests/engineering-lab-unit.cjs']]]],
 ['S11-S12 JSON exports and graph',()=>[['node',['scripts/build-knowledge.cjs','--check']]]],
 ['S13 source and claim references',()=>[['node',['scripts/check-evidence.cjs']]]],
 ['S15 deterministic quality metadata',()=>[['node',['scripts/build-quality.cjs','--check']]]],
 ['S14 evidence structural integrity and completeness report',()=>[['node',['scripts/audit-knowledge.cjs','--strict']]]]
];
let failures=0;
for(const [name,getCommands] of steps){
 console.log('\n=== '+name+' ===');
 let ok=true;
 for(const [command,args] of getCommands()){
  const r=spawnSync(command,args,{stdio:'inherit',cwd:root});
  if(r.error||r.status!==0){
   ok=false;
   console.error('FAIL: '+command+' '+args.join(' '));
  }
 }
 if(!ok)failures++;
 else console.log('PASS: '+name);
}
console.log('\nStatic QA: '+(steps.length-failures)+'/'+steps.length+' gates passed; '+files.length+' JavaScript files syntax-checked.');
if(failures)process.exitCode=1;
