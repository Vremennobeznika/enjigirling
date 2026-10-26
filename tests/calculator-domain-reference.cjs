const assert=require('node:assert/strict');
const fixture=require('./fixtures/calculator-domain-reference.json');
const {calculate,definitions}=require('../atlas-tools.js');
const covered=new Set(fixture.cases.map(c=>c.model));
assert.equal(covered.size,734,'Independent numerical evidence must cover all 734 models');
for(const d of definitions)assert.ok(covered.has(d.id),'Missing independent reference: '+d.id);
// Ensure coverage is not supplied solely by replaying the application's default inputs.
const normalize=(v,f)=>f.matrix?(Array.isArray(v)?v:String(v).split('\n')).map(r=>normalize(r,{list:true})):f.list?(Array.isArray(v)?v:String(v).split(/[;\n]/)).map(Number):f.text?String(v):Number(v);
for(const d of definitions)assert.ok(fixture.cases.some(c=>c.model===d.id&&d.fields.some(f=>JSON.stringify(normalize(c.inputs[f.key],f))!==JSON.stringify(normalize(f.value,f)))),'Missing non-default independent problem: '+d.id);
const close=(actual,expected,tolerance,label)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),`${label}: ${actual} != ${expected}`);
for(const c of fixture.cases){
 const r=calculate(c.model,c.inputs);close(r.value,c.expected,c.tolerance,c.model+' '+JSON.stringify(c.inputs));
 for(const [index,value] of Object.entries(c.details)){
  const actual=r.details?.[+index]?.[1];
  if(typeof value==='number')assert.ok(Number.isFinite(actual)&&Math.abs(actual-value)<=c.tolerance*Math.max(Math.abs(value),1e-300),c.model+' details '+index+' numeric reference');
  else assert.equal(actual,value,c.model+' details '+index+' text/code reference');
 }
}
console.log(`PASS ${fixture.cases.length} independent domain-reference cases across ${new Set(fixture.cases.map(c=>c.model)).size} models (SciPy/NumPy/Decimal/stdlib oracles)`);
