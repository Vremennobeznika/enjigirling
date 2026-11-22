'use strict';
/**
 * Every <p> sentence-sized fragment in all 52 lessons must be represented
 * by an EXACT matching row in the track claim register.
 * This is a COVERAGE gate, NOT an independent truth/safety certification.
 */
const fs=require('node:fs');
const assert=require('node:assert/strict');

const sourceFiles=[
 'engineering-lessons.html',
 'academy-draft.html',
 'academy-draft-part2.html',
 'academy-draft-part3.html'
];
const groups=['B','E','A','C','M','Q'];
const strip=s=>s.replace(/<[^>]*>/g,' ')
 .replace(/&nbsp;|&#160;/g,' ')
 .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
 .replace(/&quot;/g,'"').replace(/&#39;/g,"'")
 .replace(/\s+/g,' ').trim();
const groupOf=id=>/^[EACMQ]/.test(id)?id[0]:'B';
const registers=new Map();
let passCount=0;
for(const g of groups) {
 const name='audit/academy-claim-register-'+g+'-2026-11-22.md';
 const data=fs.readFileSync(name,'utf8');
 const entries=new Map();
 for(const line of data.split('\n')) {
  if(!line.startsWith('| `'))continue;
  const cells=line.split(' | ');
  assert.equal(cells.length,4,'malformed register row: '+line.slice(0,70));
  const id=cells[0].match(/^\| `([^`]+)`$/)?.[1];
  assert.ok(id,'bad ID: '+line);
  assert.ok(!entries.has(id),'duplicate '+id);
  const status=cells[1],text=cells[2],source=cells[3].replace(/ \|$/,'');
  if(status.startsWith('PASS')) {
   assert.notEqual(source,'—','PASS without evidence: '+id);
   passCount++;
  }
  entries.set(id,{status,text,source});
 }
 registers.set(g,entries);
}
let lessons=0,rows=0;
for(const path of sourceFiles){
 const html=fs.readFileSync(path,'utf8');
 for(const m of html.matchAll(/<section class="lesson"([^>]*)>([\s\S]*?)<\/section>/g)){
  const id=m[1].match(/\bid="([^"]+)"/)?.[1];
  if(!id)continue;
  lessons++;
  const register=registers.get(groupOf(id));
  const paras=[...m[2].matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)]
   .map(x=>strip(x[1]));
  for(let p=0;p<paras.length;p++){
   const fragments=paras[p].split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z«0-9])/u)
    .filter(x=>x.trim().length>3);
   for(let s=0;s<fragments.length;s++){
    const fragment=fragments[s];
    if(fragment==='.'||fragment.length<=5)continue;
    const key=id+'.P'+String(p+1).padStart(2,'0')+
      '.S'+String(s+1).padStart(2,'0');
    const row=register.get(key);
    assert.ok(row,'missing claim-register row '+key+' in '+path);
    const escaped=fragment.replace(/\|/g,'\\|').replace(/`/g,'\\`');
    assert.equal(row.text,escaped,'stale fragment '+key);
    register.delete(key);
    rows++;
   }
  }
 }
}
assert.equal(lessons,52);
for(const [g,entries] of registers)assert.equal(entries.size,0,
  g+' contains stale/out-of-range rows: '+[...entries.keys()].slice(0,5).join(', '));
console.log('PASS: complete claim inventory '+lessons+' lessons, '+rows+
 ' text fragments; '+passCount+' narrow PASS. Subject/safety gates remain BLOCKED.');
