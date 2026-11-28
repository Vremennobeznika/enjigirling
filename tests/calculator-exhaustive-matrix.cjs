'use strict';
const assert=require('node:assert/strict');
const {definitions,calculate}=require('../atlas-tools.js');
const failures=[];let checks=0;
function check(id,name,fn){checks++;try{fn()}catch(e){failures.push({id,check:name,error:e.message})}}
const finite=v=>typeof v==='number'?Number.isFinite(v):Array.isArray(v)?v.every(finite):v&&typeof v==='object'?Object.values(v).every(finite):true;
assert.equal(definitions.length,734);
assert.equal(new Set(definitions.map(d=>d.id)).size,734);
for(const d of definitions){
 const defaults=Object.fromEntries(d.fields.map(f=>[f.key,f.value]));
 check(d.id,'metadata',()=>{for(const key of ['topic','formula','note','group'])assert.ok(typeof d[key]==='string'&&d[key].trim(),key+' missing');assert.ok(d.fields.length);assert.equal(new Set(d.fields.map(f=>f.key)).size,d.fields.length);for(const f of d.fields)assert.ok(f.label&&f.key)});
 check(d.id,'default result',()=>{const r=calculate(d.id,defaults);assert.ok(Number.isFinite(r.value)&&finite(r));assert.equal(typeof r.unit,'string');assert.deepEqual(calculate(d.id,defaults),r)});
 for(const f of d.fields){
  const reject=(label,value)=>check(d.id,f.key+' '+label,()=>assert.throws(()=>calculate(d.id,{...defaults,[f.key]:value})));
  reject('missing',undefined);reject('empty','');
  if(f.text){reject('oversized','x'.repeat(257));continue}
  if(f.matrix){reject('one row','1;2');reject('invalid cell','1;2\n3;NaN');continue}
  if(f.list){reject('invalid item','1;NaN');continue}
  for(const v of ['NaN','Infinity','-Infinity','1e-999','1e999','1,2,3','0x10',true])reject('invalid '+String(v),v);
  if(f.positive)reject('zero',0);
  if(!f.signed&&(f.min??0)>=0)reject('negative',-1);
  if(f.integer)reject('fraction',0.5);
  if(f.max!==undefined)reject('above max',f.max+Math.max(1,Math.abs(f.max)*.01));
  if(f.min!==undefined)reject('below min',f.min-Math.max(1,Math.abs(f.min)*.01));
  if(f.choices)reject('outside choices',Math.max(...f.choices)+1);
 }
}
console.log(JSON.stringify({models:definitions.length,checks,passed:checks-failures.length,failed:failures.length,failures},null,2));
if(failures.length)process.exitCode=1;
