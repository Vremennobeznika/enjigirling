'use strict';
// No production dependency: every vector runs in Node against the same engine used by the site.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const scope={};vm.runInNewContext(fs.readFileSync('engineering-lab-core.js','utf8'),scope,{timeout:5000});
const M=scope.EngineeringMath;assert.ok(M);
let checks=0;
function near(actual,expected,label,eps=1e-10){
 assert.ok(Number.isFinite(actual),label+': nonfinite '+actual);
 assert.ok(Math.abs(actual-expected)<=eps*Math.max(1,Math.abs(expected)),label+': '+actual+' vs '+expected);
 checks++;
}
function bad(fn,label){assert.throws(fn,undefined,label);checks++;}
const nm=1.852;
const p=M.marinePassage(1,1);
near(p.hours,1,'one nautical mile at one knot');near(p.minutes,60,'minutes');near(p.distanceKm,nm,'nautical mile in km');near(p.speedKmh,nm,'knot in km/h');
const f=M.marineFuel(100,20,8,25);
near(f.hours,5,'voyage fuel hours');near(f.usedL,40,'voyage fuel used');near(f.extraL,10,'fuel allowance');near(f.totalL,50,'fuel total');
near(M.marineFuel(10,10,2,0).totalL,2,'zero user allowance');
const hull=M.hullSpeed(.3048);
near(hull.knots,1.34,'hull speed LWL in feet');near(hull.kilometresHour,1.34*nm,'hull speed km/h');
near(M.hullSpeed(4).knots/M.hullSpeed(1).knots,2,'hull square-root scaling');
const tpc=M.draftByTPC(2.46,240,1.025);
near(tpc.tpc,2.46,'Transport Canada TPC example');near(tpc.deltaCm,1,'TC positive immersion');
near(M.draftByTPC(-2.46,240,1.025).deltaCm,-1,'TC unloading');
const disp=M.displacement(200,22,8,.75,1.025);
near(disp.volume,26400,'TC block coefficient volume');near(disp.tonnes,27060,'TC displaced mass at 1.025t/m3');
near(M.displacement(100,20,5,.7,1).tonnes,7000,'freshwater displacement');
const direction=M.currentVector(10,0,2,90);
near(direction.sog,Math.sqrt(104),'cross current SOG');near(direction.cog,Math.atan2(2,10)*180/Math.PI,'cross current COG');
near(M.currentVector(10,0,2,180).sog,8,'opposing current');
near(M.currentVector(0,0,2,90).sog,2,'drift with no engine motion');
near(M.currentVector(0,0,2,90).cog,90,'drift east');
near(M.currentVector(10,0,2,0).sog,12,'following current');
assert.equal(M.currentVector(0,0,0,0).cog,null,'no movement must not invent heading');checks++;
assert.equal(M.currentVector(10,90,10,270).cog,null,'opposing speeds cancel');checks++;
near(M.currentVector(10,0,0,360).sog,10,'360-degree direction');
for(const [name,fn] of [
 ['zero speed',()=>M.marinePassage(20,0)],
 ['negative distance',()=>M.marinePassage(-1,20)],
 ['infinite hours',()=>M.marinePassage(1e308,1)],
 ['infinite speed conversion',()=>M.marinePassage(1,1e308)],
 ['fuel negative',()=>M.marineFuel(10,10,-1,0)],
 ['fuel zero',()=>M.marineFuel(10,10,0,0)],
 ['fuel reserve negative',()=>M.marineFuel(10,10,1,-1)],
 ['fuel reserve excessive',()=>M.marineFuel(10,10,1,1001)],
 ['hull 0m',()=>M.hullSpeed(0)],
 ['draft waterplane 0',()=>M.draftByTPC(10,0,1.025)],
 ['draft zero density',()=>M.draftByTPC(10,2000,0)],
 ['block > 1',()=>M.displacement(1,1,1,1.01,1.025)],
 ['block negative',()=>M.displacement(1,1,1,-.1,1.025)],
 ['displacement underflow',()=>M.displacement(1e-200,1e-200,1e-200,.7,1)],
 ['course negative',()=>M.currentVector(10,-1,2,90)],
 ['course >360',()=>M.currentVector(10,361,2,90)],
 ['current angle >360',()=>M.currentVector(10,0,2,361)],
 ['current speed negative',()=>M.currentVector(10,0,-2,90)],
 ['current direction Infinity',()=>M.currentVector(10,0,2,Infinity)]
])bad(fn,name);
// Seeded, deterministic metamorphic checks for six maritime calculators.
let seed=123456789;function rand(){seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/0x100000000;}
for(let i=0;i<256;i++){
 const d=.01+rand()*1500,v=.05+rand()*40,r=.01+rand()*200,reserve=rand()*100;
 const voyage=M.marinePassage(d,v),fuel=M.marineFuel(d,v,r,reserve);
 near(voyage.hours*v,d,'passage dimensional identity '+i,1e-9);
 near(fuel.usedL,voyage.hours*r,'fuel dimensional identity '+i,1e-9);
 near(fuel.totalL,fuel.usedL*(1+reserve/100),'reserve identity '+i,1e-9);
 const a=rand()*360,b=rand()*360,c=rand()*20;
 const track=M.currentVector(v,a,c,b);
 assert.ok(track.sog>=0&&track.sog<=v+c+1e-10,'vector triangle upper bound');checks++;
 assert.ok(track.sog>=Math.abs(v-c)-1e-10,'vector triangle lower bound');checks++;
 assert.ok(track.cog===null||(track.cog>=0&&track.cog<360),'COG bounds');checks++;
}
// Separate production/electrical/textile/number-format boundary gates.
near(M.takt(420,840).seconds,30,'takt');near(M.oee(480,450,1000,960,24).oee,.8,'OEE');
near(M.billetMass(7850,1000,100,10).kilograms,7.85,'billet mass');
near(M.pipeFlow(100,2).m3Hour,Math.PI*.1**2/4*7200,'pipe flow');
near(M.thermalLength(1000,12,50).deltaMM,.6,'thermal expansion');
near(M.cutSpeed('rpm',20,1000).mPerMin,Math.PI*20,'cut speed');
near(M.markerEfficiency(62000,5,150).percent,62000/75000*100,'marker efficiency');
near(M.fabricBooking(6.2,4,3,100).totalM,159.65,'fabric booking');
near(M.threadBooking(1,5.5,15,100).totalM,632.5,'thread booking');
near(M.sewingEfficiency(1000,12,40,480).percent,62.5,'sewing efficiency');
near(M.shrinkage(100,97).percent,3,'shrinkage');near(M.layLength(4,10,5,.1).consumption,51,'lay calculation');
near(M.lineBalance('20\\n30\\n15',25).theoretical,3,'line balance');
near(M.vernier(23.45,.05).read,23.45,'vernier');
near(M.ohm('ur',12,6).p,24,'ohm');near(M.divider(12,1000,1000).v,6,'divider');
near(M.rc(1000,1).frequency,159.15494309189535,'RC cutoff');
assert.ok(Number.isNaN(M.number('1e309')),'overflow numeric parser should reject Infinity');checks++;
for(const [label,fn] of [
 ['ohm div0',()=>M.ohm('ur',12,0)],
 ['divider overflow',()=>M.divider(1e308,1e308,1e308)],
 ['RC underflow',()=>M.rc(1e-200,1e-200)],
 ['takt overflow',()=>M.takt(1e308,1e-100)],
 ['takt underflow',()=>M.takt(1e-307,1e308)],
 ['pipe overflow',()=>M.pipeFlow(1e308,1e308)],
 ['tolerance overflow',()=>M.tolerance('1;1e308')],
 ['shrinkage overflow',()=>M.shrinkage(1e-308,1e308)],
 ['billet density invalid',()=>M.billetMass(-1,100,100,100)],
 ['negative thread loss',()=>M.threadBooking(1,1,-1,1)],
 ['OEE > 100%',()=>M.oee(480,450,1000,900,30)]
])bad(fn,label);
const html=fs.readFileSync('calculator.html','utf8');
const load=fs.readFileSync('calculator-loader.js','utf8');
assert.ok(html.includes('data-lab="marine"')&&html.includes('data-lab="moreMarine"'));checks++;
assert.ok(!html.includes('<script src="engineering-lab-core.js"'), 'heavy engine must remain lazy');checks++;
assert.ok(load.includes("function loadEngine(){return script('engineering-lab-core.js')"));checks++;
const coreBytes=fs.statSync('engineering-lab-core.js').size;
const uiBytes=fs.statSync('engineering-lab-ui.js').size;
assert.ok(coreBytes<=22000&&uiBytes<=16000,'Do not bloat lazy engineering module');checks++;
console.log('PASS high-assurance engineering arithmetic matrix: '+checks+' assertions; marine/production/electrical/textile/IEEE adjacent; engine '+coreBytes+' B UI '+uiBytes+' B');
