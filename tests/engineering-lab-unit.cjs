const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const scope={};
vm.runInNewContext(fs.readFileSync('engineering-lab-core.js','utf8'),scope,{timeout:5000});
const m=scope.EngineeringMath;
assert.ok(m,'math engine not exported');
for(const [format,decimal,hex] of [
 ['fp32','0.1','0x3DCCCCCD'],
 ['fp64','0.1','0x3FB999999999999A'],
 ['fp16','1','0x3C00'],
 ['fp16','-0','0x8000'],
 ['bf16','1','0x3F80'],
 ['bf16','0.1','0x3DCD'],
 ['tf32','1','0x1FC00'],
 ['fp16','0.000000059604644775390625','0x0001'],
 ['fp16','1.00048828125','0x3C00'],
 ['fp16','65504','0x7BFF'],
 ['fp16','65536','0x7C00']
])assert.equal(m.encode(format,decimal).hex,hex,format+' '+decimal);
assert.equal(m.encode('fp32','NaN').kind,'NaN');
assert.equal(m.encode('fp16','Infinity').kind,'Бесконечность');
assert.ok(Object.is(m.decode('fp32','80000000','hex').stored,-0));
assert.equal(m.decode('fp32','00111111100000000000000000000000','binary').stored,1);
assert.equal(m.decode('fp64','3FF0000000000000','hex').stored,1);
assert.equal(m.decode('tf32','1FC00','hex').stored,1);
assert.throws(()=>m.decode('tf32','FFFFF','hex'));
assert.equal(m.encode('fp16','0.1').hex,'0x2E66');
assert.equal(m.exactError('fp32',m.encode('fp32','0.1').hex,'0.1').includes('10^-9'),true);
assert.equal(m.exactError('fp64',m.encode('fp64','0.1').hex,'0.1').includes('10^-18'),true);
assert.throws(()=>m.decode('fp32','XX','hex'));
assert.throws(()=>m.decode('fp16','010','binary'));
assert.equal(m.modbus('3F80','0000','ABCD').value,1);
assert.equal(m.modbus('0000','3F80','CDAB').value,1);
assert.equal(m.modbus('803F','0000','BADC').value,1);
assert.equal(m.modbus('0000','803F','DCBA').value,1);
assert.equal(m.ohm('ur',12,6).p,24);
assert.equal(m.ohm('ui',12,2).r,6);
assert.equal(m.ohm('ir',2,6).u,12);
assert.equal(m.divider(12,1000,1000).v,6);
assert.ok(Math.abs(m.rc(1000,1).frequency-159.154943)<1e-5);
assert.equal(m.tolerance('10;0.1\n-2;0.2').nominal,8);
assert.ok(Math.abs(m.tolerance('10;0.1\n-2;0.2').rss-Math.sqrt(.05))<1e-12);
assert.throws(()=>m.tolerance('1;bad'));
assert.throws(()=>m.divider(5,0,100));

function close(actual,expected,tolerance=1e-9){assert.ok(Math.abs(actual-expected)<=tolerance,actual+' !== '+expected);}
const takt=m.takt(420,840);
close(takt.seconds,30);close(takt.perHour,120);
const oee=m.oee(480,450,1000,960,24);
close(oee.availability,.9375);close(oee.performance,8/9);close(oee.quality,.96);close(oee.oee,.8);
close(m.billetMass(7850,1000,100,10).kilograms,7.85);
close(m.thermalLength(1000,12,50).deltaMM,.6);
close(m.thermalLength(1000,-4,50).deltaMM,-.2);
close(m.cutSpeed('rpm',20,1000).mPerMin,Math.PI*20);
close(m.cutSpeed('speed',20,Math.PI*20).rpm,1000);
close(m.pipeFlow(100,2).m3Hour,Math.PI*.1*.1/4*2*3600);
assert.throws(()=>m.takt(420,0));
assert.throws(()=>m.oee(480,500,1000,960,24));
assert.throws(()=>m.oee(480,450,1000,1001,24));
assert.throws(()=>m.oee(480,450,1000,960,30));
assert.throws(()=>m.billetMass(-1,100,100,100));
assert.throws(()=>m.cutSpeed('rpm',0,100));
assert.throws(()=>m.pipeFlow(0,1));
assert.throws(()=>m.thermalLength(1000,12,Infinity));

const marker=m.markerEfficiency(62000,5,150);
close(marker.percent,62/75*100);close(marker.wasteM2,1.3);
assert.throws(()=>m.markerEfficiency(76000,5,150));
const book=m.fabricBooking(6.2,4,3,100);
close(book.perPiece,1.5965);close(book.totalM,159.65);
assert.throws(()=>m.fabricBooking(6.2,0,3,100));
const thread=m.threadBooking(1,5.5,15,100);
close(thread.perPieceM,6.325);close(thread.totalM,632.5);
assert.throws(()=>m.threadBooking(1,5.5,-1,100));
const line=m.sewingEfficiency(1000,12,40,480);
close(line.percent,62.5);close(line.availableMin,19200);
close(m.sewingEfficiency(0,12,40,480).percent,0);
assert.throws(()=>m.sewingEfficiency(.5,12,40,480));
const voyage=m.marinePassage(50,12);
close(voyage.hours,50/12);close(voyage.distanceKm,92.6);close(voyage.speedKmh,22.224);
assert.throws(()=>m.marinePassage(50,0));
const fuel=m.marineFuel(50,12,24,20);
close(fuel.usedL,100);close(fuel.totalL,120);
assert.throws(()=>m.marineFuel(50,12,24,-20));
close(m.hullSpeed(10).knots,1.34*Math.sqrt(10/.3048));
assert.throws(()=>m.hullSpeed(0));
const draft=m.draftByTPC(246,2000,1.025);
close(draft.tpc,20.5);close(draft.deltaCm,12);
close(m.draftByTPC(-246,2000,1.025).deltaCm,-12);
assert.throws(()=>m.draftByTPC(246,2000,0));

close(m.shrinkage(100,97).percent,3);
close(m.layLength(4,10,5,.1).consumption,51);
assert.equal(m.lineBalance('20\n30\n15',25).theoretical,3);
close(m.displacement(100,20,5,.7,1.025).tonnes,7175);
close(m.currentVector(10,0,2,90).sog,Math.sqrt(104));
close(m.vernier(23.45,.05).read,23.45);
assert.throws(()=>m.vernier(55,.05));
assert.throws(()=>m.displacement(100,20,5,1.1,1.025));
console.log('Engineering math: sewing, maritime, production and vernier PASS');

