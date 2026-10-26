const assert=require('node:assert/strict');
const {estimate,stockMass,processes}=require('../manufacturing-cost.js');
const base={quantity:10,mass:2,priceTonne:60000,minutes:30,machineRate:1200,laborMinutes:10,laborRate:600,setup:1000,tooling:2000,reject:20,overhead:10,markup:20};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const r=estimate(base);assert.equal(r.blanks,13);close(r.material,1560);close(r.machine,7800);close(r.labor,1300);close(r.cost,15026);close(r.quote,18031.2);close(r.unitQuote,1803.12);
// One-time tooling and setup are spread over good parts, never charged per blank.
const one=estimate({...base,quantity:1,reject:0,mass:0,minutes:0,laborMinutes:0,overhead:0,markup:0});assert.equal(one.unitCost,3000);
close(estimate({...base,mass:'2,5'}).material,1950);
for(const patch of [{quantity:0},{quantity:1.5},{quantity:1000001},{reject:100},{reject:99.9999999},{mass:-1},{priceTonne:''},{priceTonne:0},{minutes:Infinity},{machineRate:true},{markup:'bad'}])assert.throws(()=>estimate({...base,...patch}));
assert.throws(()=>estimate({}));
assert.equal(Object.keys(processes).length,12);
close(stockMass('sheet',{density:7850,length:1000,width:100,height:10}),7.85);
close(stockMass('round',{density:7850,length:1000,diameter:50}),Math.PI*.05*.05/4*7850);
close(stockMass('tube',{density:7850,length:1000,diameter:50,wall:3}),Math.PI*(.05*.05-.044*.044)/4*7850);
close(stockMass('rectTube',{density:7850,length:1000,width:100,height:50,wall:3}),6.7824);
for(const [shape,x] of [['tube',{diameter:50,wall:25}],['rectTube',{width:50,height:20,wall:10}],['sheet',{width:0,height:20}],['round',{diameter:0}]])assert.throws(()=>stockMass(shape,{density:7850,length:1000,...x}));
assert.throws(()=>stockMass('sheet',{density:7850,length:0,width:100,height:10}));
console.log('PASS manufacturing cost: batch allocation, rubles/tonne, rejects, markup, 4 stock sections and invalid inputs');

// Exact decimal boundaries: no extra blank at an exact yield threshold,
// but a genuinely positive remainder still requires one more blank.
for(const [quantity,reject,expected] of [[9,90,90],[10,80,50],[3,40,5],[7,30,10],[1,0,1],[9,90.000001,91],[9,89.999999,90],[1,1e-7,2],[1,1e-16,2],[1000000,90,10000000]]){
 const result=estimate({...base,quantity,reject});
 assert.equal(result.blanks,expected,`${quantity} good / ${reject}% rejects`);
}
