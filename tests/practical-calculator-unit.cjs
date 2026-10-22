const assert=require('node:assert/strict');const M=require('../calculator-practical-core.js');
function near(a,b,eps=1e-9){assert.ok(Math.abs(a-b)<eps,a+' != '+b)}
const p=M.threePhase(400,10,.8);near(p.apparentKVA,Math.sqrt(3)*4);near(p.activeKW,Math.sqrt(3)*3.2);near(p.reactiveKVAR,Math.sqrt(3)*2.4);
near(M.threePhase(400,0,0).activeKW,0);
const d=M.cableDrop('dc',24,10,5,2.5,.0175,1);near(d.dropV,.7);near(d.percent,100*.7/24);
near(M.cableDrop('three',400,20,50,4,.0175,.9).dropV,Math.sqrt(3)*20*.0175*50/4*.9);
near(M.cableDrop('single',230,10,30,2.5,.0175,1).dropV,4.2);
near(M.cylinderMass(7850,50,0,1000).massKg,7850*Math.PI*.05*.05/4);
near(M.cylinderMass(7850,50,20,1000).massKg,7850*Math.PI*(.05*.05-.02*.02)/4);
for(const fn of [()=>M.threePhase(400,10,1.1),()=>M.threePhase(Infinity,1,.8),()=>M.cableDrop('three',400,1,1,0,.0175,.9),()=>M.cableDrop('unknown',400,1,1,1,.0175,.9),()=>M.cableDrop('dc',24,1000,100,1,.0175,1),()=>M.cylinderMass(7850,50,50,1000),()=>M.cylinderMass(0,50,0,1000),()=>M.cylinderMass(7850,50,-1,1000)])assert.throws(fn);
console.log('Practical calculator math PASS');
