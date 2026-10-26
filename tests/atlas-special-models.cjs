const assert=require('node:assert/strict');
const {calculate,definitions}=require('../atlas-tools.js');
const defaults=id=>Object.fromEntries(definitions.find(x=>x.id===id).fields.map(f=>[f.key,f.value]));
const close=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),actual+' != '+expected);
// ISO interval boundaries are inclusive at the upper end, never interpolated.
for(const [size,gap] of [[3,2],[3.001,4],[20,7],[50,9],[50.001,10],[500,20]])assert.equal(calculate('g12-4',{nominal:size}).value,gap);
assert.throws(()=>calculate('g12-4',{nominal:500.01}));
assert.throws(()=>calculate('g12-4',{nominal:.001}));
const fit=calculate('g12-4',{nominal:20});assert.equal(fit.details[0][1],41);
// Known minimal binomial plan; independent Python math.comb check gave n=132, Ac=3.
const plan=calculate('g5-5',defaults('g5-5'));assert.equal(plan.value,132);assert.equal(plan.details[0][1],3);close(plan.details[2][1],4.42525058259672);close(plan.details[3][1],9.922830442578287);
const t=calculate('g32-7',{values:'-1;1',confidence:95});close(t.value,12.706204736432095,1e-7);
const roots=calculate('g32-1',{a:1,b:0,c:1});close(roots.value,0);assert.equal(roots.details[0][1],1);
const qr=calculate('g32-3',{x:'-2;-1;0;1;2',y:'9;4;1;0;1',degree:2,query:3});close(qr.value,4);
const solution=calculate('g32-12',{matrix:'0;1;0\n1;0;0\n0;0;1',rhs:'2;1;3'});close(solution.value,1);close(solution.details[0][1],2);close(solution.details[1][1],3);
close(calculate('g32-12',{matrix:'1;0;0\n0;1;0\n0;0;1',rhs:'1000000000000;1;1'}).value,1e12);
assert.throws(()=>calculate('g32-12',{matrix:'1;2;3\n2;4;6\n3;6;9',rhs:'1;2;3'}));
const mc=calculate('g12-3',defaults('g12-3'));assert.deepEqual(calculate('g12-3',defaults('g12-3')),mc);close(mc.value,Math.sqrt((.3**2+.4**2)/3),.03);
assert.equal(calculate('g12-3',{...defaults('g12-3'),tolerance:'0;0'}).value,0);
const ipv6=calculate('g33-15',defaults('g33-15'));assert.equal(ipv6.details[0][1],'65536');assert.equal(ipv6.details[2][1],'18446744073709551616');
assert.throws(()=>calculate('g33-15',{...defaults('g33-15'),address:'2001:::1'}));
assert.equal(calculate('g33-14',{address:'192.168.1.1',prefix:31}).value,2);
assert.equal(calculate('g33-14',{address:'192.168.1.1',prefix:32}).value,1);
assert.throws(()=>calculate('g33-14',{address:'999.1.1.1',prefix:24}));
for(const [id,expected] of [['g33-6',19255],['g33-7',3421780262]])assert.equal(calculate(id,defaults(id)).value,expected);
const p=calculate('g24-14',defaults('g24-14'));close(p.details[0][1],1);close(p.details[1][1],19);assert.equal(p.plot.y.length,3);
assert.throws(()=>calculate('g6-4',{...defaults('g6-4'),departure:'2026-02-30T00:00:00Z'}));
assert.throws(()=>calculate('g25-2',{...defaults('g25-2'),wind:200}));
console.log('PASS: ISO boundaries, binomial acceptance risks, Student t, QR/Gaussian pivots, seeded Monte Carlo, 128-bit IPv6, CRC vectors, control limits and impossible cases');

// Decimal ratios at integer boundaries must not add or lose a physical unit.
assert.equal(calculate('g28-11',{height:.07,layer:.01}).value,7);
assert.equal(calculate('g1-5',{height:.3,thickness:.1}).value,3);
assert.equal(calculate('g10-19',{stock:.3,part:.1,kerf:0}).value,3);
assert.equal(calculate('g27-1',{available:.3,standard:.1}).value,3);
assert.equal(calculate('g21-4',{required:.07,one:.01}).value,7);
assert.equal(calculate('g28-11',{height:.0700000001,layer:.01}).value,8);

const negativeZero=calculate('g33-3',{value:'-0'});assert.ok(Object.is(negativeZero.value,-0));assert.equal(negativeZero.details[0][1],'0x80000000');
assert.throws(()=>calculate('g28-11',{height:1e12,layer:1e-300}),/Количество выходит/);

close(calculate('g24-19',{first:'1;2;3',second:'2;4;6'}).value,4/11);
close(calculate('g24-19',{first:'1;2;3',second:'1;2;3'}).value,1);
assert.throws(()=>calculate('g24-19',{first:'1;1',second:'1;1'}));
close(calculate('g20-20',defaults('g20-20')).value,3.005037815259212);
assert.equal(calculate('g23-2',defaults('g23-2')).plot.x.length,6);
