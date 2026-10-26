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
 ['CALENDAR date and evidence matrix',()=>[['node',['tests/calendar-rules.cjs']]]],
 ['ROBOTICS independent interactive lab and formula limits',()=>[['node',['tests/robotics-lab.cjs']]]],
 ['NAV standalone labs, coding split, low-end source budgets',()=>[['node',['tests/navigation-promotion.cjs']]]],
 ['PAGES all HTML and nested local resource references',()=>[['node',['tests/all-html-assets.cjs']]]],
 ['S00 JavaScript syntax across application and QA',()=>files.map(file=>['node',['--check',file]])],
 ['PERF start-up payload budgets and deferred home search',()=>[['node',['tests/performance-budget.cjs']]]],
 ['CAREER 51 occupation-specific government standard scopes',()=>[['node',['tests/normative-51.cjs']]]],
 ['CAREER sequential 51-card user-prompt audit',()=>[['node',['tests/career-51-review.cjs']]]],
 ['LEARNING education directory and section preservation',()=>[['node',['tests/learning-ux.cjs']]]],
 ['PERSONAL calendar, backups, multi-device conflict safety',()=>[['node',['tests/life-sync.cjs']]]],
 ['MEASUREMENT instruments assets',()=>[['node',['tests/measurement-lab.cjs']]]],
 ['RESOURCES catalog data and accessibility',()=>[['node',['tests/resources-catalog.cjs']]]],
 ['RELEASE engineering sources, author and social preview',()=>[['node',['tests/release-editorial.cjs']]]],
 ['S01-S10 S16 HTML, navigation and editorial data',()=>[['node',['tests/site-check.cjs']]]],
 ['FULL P01-P06 D01-D09 A01-A03 S03',()=>[['node',['tests/full-matrix.cjs']],['node',['tests/engineering-lab-unit.cjs']],['node',['tests/practical-calculator-unit.cjs']]]],
 ['SAFETY marine, industrial, electrical and numeric matrix',()=>[['node',['tests/engineering-safety-matrix.cjs']]]],
 ['S11-S12 JSON exports and graph',()=>[['node',['scripts/build-knowledge.cjs','--check']]]],
 ['PROCESS ATLAS 208 integrity and evidence scope',()=>[['node',['tests/process-atlas-data.cjs']]]],
 ['MATERIAL ATLAS sector coverage and source boundaries',()=>[['node',['tests/materials-atlas-data.cjs']]]],
 ['ATLAS each of 380 cards audit state',()=>[['node',['scripts/audit-atlas-cards.cjs','--check']]]],
 ['ATLAS executable-code budget and duplicate exporter guard',()=>[['node',['tests/atlas-code-size.cjs']]]],
 ['ATLAS joint processes/materials/AI exports and ZIP checks',()=>[['node',['tests/atlas-dual-ai.cjs']]]],
 ['S13 source and claim references',()=>[['node',['scripts/check-evidence.cjs']],['node',['tests/claim-review.cjs']]]],
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
