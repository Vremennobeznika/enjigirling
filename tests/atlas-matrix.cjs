const assert=require('node:assert/strict'),fs=require('node:fs');
const {definitions,calculate}=require('../atlas-tools.js');
const matrix=JSON.parse(fs.readFileSync('knowledge/atlas-implementation-matrix.json','utf8'));
assert.equal(matrix.items.length,734);
assert.equal(new Set(matrix.items.map(x=>x.id)).size,734);
assert.equal(matrix.stats.implemented,definitions.length);
for(const d of definitions){
 const row=matrix.items.find(x=>x.topic===d.topic);
 assert.equal(row.status,'implemented',d.id);assert.equal(row.calculatorId,d.id);assert.equal(row.reference.status,'passed');
 const data=Object.fromEntries(d.fields.map(f=>[f.key,f.value]));
 const result=calculate(d.id,data);assert.ok(Number.isFinite(result.value),d.id);
 for(const field of d.fields){
  for(const bad of ['',null,true,...(field.text?[]:[Infinity,'not-a-number'])])assert.throws(()=>calculate(d.id,{...data,[field.key]:bad}),d.id+'/'+field.key+' accepted '+bad);
  if(field.positive)assert.throws(()=>calculate(d.id,{...data,[field.key]:0}),d.id+' accepted zero '+field.key);
  if(field.integer)assert.throws(()=>calculate(d.id,{...data,[field.key]:1.5}),d.id+' accepted fractional count');
 }
}
for(const row of matrix.items.filter(x=>x.status!=='implemented'))assert.equal(row.href,null,'unfinished topic has a live link');
console.log('PASS: all '+definitions.length+' implemented models and every input validated; 734 matrix statuses accounted for');
