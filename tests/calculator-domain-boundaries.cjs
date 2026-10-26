const assert=require('node:assert/strict');
const {calculate,definitions}=require('../atlas-tools.js');
const defaults=id=>Object.fromEntries(definitions.find(d=>d.id===id).fields.map(f=>[f.key,f.value]));
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`);
assert.equal(calculate('g21-2',{volume:.14,cement:100,bag:7}).value,2);
assert.equal(calculate('g24-10',{confidence:10,z:1,error:1}).value,900);
for(const p of [0,100])assert.throws(()=>calculate('g24-10',{confidence:p,z:1.96,error:5}));
for(const id of ['g19-17','g20-11']){
 const a=calculate(id,{dt1:1e-10,dt2:1e12}).value,b=calculate(id,{dt1:1e12,dt2:1e-10}).value;
 close(a,(1e12-1e-10)/(22*Math.log(10)));assert.equal(a,b);
 close(calculate(id,{dt1:10,dt2:10}).value,10);
}
assert.throws(()=>calculate('g19-12',{temp:-45,rh:1}),/вне проверенного диапазона/);
close(calculate('g19-12',{temp:20,rh:100}).value,20);
assert.throws(()=>calculate('g19-16',{...defaults('g19-16'),temp1:-300}));
assert.throws(()=>calculate('g20-9',{...defaults('g20-9'),t1:-273.15}));
assert.throws(()=>calculate('g29-4',{x:'0;2;0;2',y:'0;2;2;0'}),/Самопересечение/);
assert.throws(()=>calculate('g29-4',{x:'0;1;2',y:'0;0;0'}));
assert.throws(()=>calculate('g29-4',{x:'0;2;1;2;0',y:'0;0;0;2;2'}),/накладываются|Самопересечение/);
close(calculate('g29-4',{x:'0;2;2;1;0',y:'0;0;2;1;2'}).value,3); // simple concave polygon
close(calculate('g29-4',{x:'0;1;1;0;0',y:'0;0;1;1;0'}).value,1); // optional closing vertex
close(calculate('g29-4',{x:'100000000000;100000000001;100000000001;100000000000',y:'100000000000;100000000000;100000000001;100000000001'}).value,1); // stable origin translation
assert.throws(()=>calculate('g32-1',{a:1e-320,b:-1,c:0}),/диапазона/); // finite primary, overflowing second root
close(calculate('g24-12',{averages:'-11;-10;-9',ranges:'2;2;2'}).value,-10);
for(const [id,spread] of [['g5-10','Cp'],['g12-21','Cp'],['g12-22','Pp'],['g24-6','Pp']]){
 const r=calculate(id,{low:0,high:10,average:7,sigma:1});close(r.value,1);assert.equal(r.details[0][0],spread);close(r.details[0][1],5/3);
}
console.log('PASS domain boundaries: symmetric LMTD, exact counts, applicability limits, simple-polygon topology, signed subgroup means, paired capability indices and auxiliary overflow');
