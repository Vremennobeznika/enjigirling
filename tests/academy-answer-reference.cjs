'use strict';
// Independently recalculated expected numeric outcomes from the 49 draft lesson scenarios.
// This is arithmetic QA, NOT validation of normative statements or operational safety.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const expected={
 'academy-draft.js':{
 E01:[2500,4.7],E03:[450,100],E04:[0.2,1],E06:[1,1],E07:[50,50],
 A01:[6,-12],A02:[0,1],C01:[60,40],C05:[65,50.3],M02:[10,40],
 M09:[95,92.5],Q01:[1,0],Q04:[7,2]
 },
 'academy-draft-part2.js':{
 E05:[1250,0.75],E08:[12,4],E09:[19.9,20.2],A04:[100,0],
 A05:[100,100],A06:[2,0],C02:[5,9],C06:[0.3,0.2],
 M01:[27,39],M03:[90,120],Q02:[-2,0.5],Q05:[3,28]
 },
 'academy-draft-part3.js':{
 E10:[0.2,4.8],A07:[1,2],A08:[3,5],A09:[4,48],A10:[85,9],
 A11:[10,11],A12:[50,10],C04:[0.1,-0.1],C07:[2,1],
 C08:[3,10],C09:[16,25],C10:[40.3,39.7],M04:[100,20],
 M05:[0.2,0.3],M06:[65,20],M07:[2,3],M08:[2000,10000],
 M10:[120,120],Q03:[5,10],Q06:[14,10],Q07:[5,75],
 Q08:[8,40],Q09:[5,5],Q10:[5,114]
 }
};
let verified=0;
for(const [file,lessons] of Object.entries(expected)){
 const source=fs.readFileSync(file,'utf8');
 const match=source.match(/const answers=(\\{[^;]+\\});/);
 assert.ok(match,'answer map missing in '+file);
 const actual=JSON.parse(match[1]);
 const reference={};
 for(const [lesson,values] of Object.entries(lessons)){
  assert.equal(values.length,2,lesson+' requires two independent reference results');
  for(let i=0;i<2;i++)reference[lesson+'-'+(i+1)]=values[i];
 }
 assert.deepEqual(Object.keys(actual).sort(),Object.keys(reference).sort(),file+' keys');
 for(const [id,value] of Object.entries(reference)){
  assert.equal(actual[id],value,file+' incorrect answer for '+id);
  verified++;
 }
}
assert.equal(verified,98);
console.log('PASS: 98 numeric answer keys match independently recalculated reference values. Subject-source attestation remains separate.');
