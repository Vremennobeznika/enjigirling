const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {definitions,calculate}=require('../atlas-tools.js');
const cases=[['gsm',{mass:5,width:10,length:10},500],['fabric-mass',{gsm:200,width:1.5,length:20},6],['tex',{mass:2,length:100},20],['roll-length',{mass:6,gsm:200,width:1.5},20],['transfer',{size:100,rate:100,efficiency:100},8.388608],['pcm',{rate:44100,bits:16,channels:2,duration:60},10584000],['timber',{length:6,width:100,height:150,quantity:10},.9],['glue',{area:10,rate:150,reserve:10},1.65]];
for(const [id,input,expected] of cases)assert.ok(Math.abs(calculate(id,input).value-expected)<1e-10,id);
assert.equal(calculate('pcm',{rate:100,bits:8,channels:1,duration:.07}).value,7);
assert.equal(calculate('pcm',{rate:100,bits:8,channels:1,duration:.07001}).value,8);
assert.equal(calculate('transfer',{size:0,rate:100,efficiency:100}).value,0);
assert.throws(()=>calculate('transfer',{size:1,rate:0,efficiency:100}));
assert.throws(()=>calculate('transfer',{size:1,rate:100,efficiency:101}));
assert.throws(()=>calculate('timber',{length:6,width:100,height:150,quantity:1.5}));
assert.throws(()=>calculate('pcm',{rate:44100,bits:12,channels:2,duration:1}));
for(const d of definitions){
 const input=Object.fromEntries(d.fields.map(f=>[f.key,f.value]));
 for(const invalid of ['',...(d.fields[0].signed?[]:[-1]),Infinity,'0x10',true,null])assert.throws(()=>calculate(d.id,{...input,[d.fields[0].key]:invalid}),d.id+' accepts '+invalid);
 for(const f of d.fields.filter(f=>f.positive))assert.throws(()=>calculate(d.id,{...input,[f.key]:0}));
 assert.throws(()=>calculate(d.id,{}));
}
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('calculator-atlas-data.js','utf8'),ctx);const topics=ctx.window.calculatorAtlasGroups.flatMap(g=>g.items);
assert.ok(definitions.length>=8);for(const d of definitions)assert.equal(topics.filter(x=>x===d.topic).length,1,d.topic+' must match a unique atlas topic');
const rows=fs.readFileSync('calculator-atlas.csv','utf8');for(const d of definitions)assert.ok(rows.split('\n').find(x=>x.includes(d.topic)).includes('Работает'),'CSV status missing for '+d.topic);
console.log('PASS eight live atlas calculators: reference answers, units, decimal sample rounding, invalid inputs and catalogue/CSV coverage');
