const assert=require('node:assert/strict');
const fixture=require('./fixtures/calculator-domain-reference.json');
const {calculate}=require('../atlas-tools.js');
const close=(actual,expected,tolerance,label)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),`${label}: ${actual} != ${expected}`);
for(const c of fixture.cases){
 const r=calculate(c.model,c.inputs);close(r.value,c.expected,c.tolerance,c.model+' '+JSON.stringify(c.inputs));
 for(const [index,value] of Object.entries(c.details))assert.ok(Number.isFinite(r.details[+index][1])&&Math.abs(r.details[+index][1]-value)<=c.tolerance*Math.max(Math.abs(value),1e-300),c.model+' details '+index+' tail probability');
}
console.log(`PASS ${fixture.cases.length} independent domain-reference cases across ${new Set(fixture.cases.map(c=>c.model)).size} models (SciPy/NumPy/Decimal/stdlib oracles)`);
