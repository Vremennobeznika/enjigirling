'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const cases=[
 ['academy-draft.js','academy-draft.html'],
 ['academy-draft-part2.js','academy-draft-part2.html'],
 ['academy-draft-part3.js','academy-draft-part3.html']
];
let assertions=0;
for(const [jsFile,htmlFile] of cases){
 const code=fs.readFileSync(jsFile,'utf8');
 const html=fs.readFileSync(htmlFile,'utf8');
 const match=code.match(/const answers=(\{[^;]+\});/);
 assert.ok(match);
 const answers=JSON.parse(match[1]);
 const handlers=new Map();
 const elements=new Map();
 const count={textContent:''};
 for(const id of Object.keys(answers)){
  const status={textContent:'',className:''};
  const input={value:''};
  const form={
   dataset:{id},
   elements:{namedItem:()=>input},
   querySelector:()=>status,
   addEventListener:(type,fn)=>{assert.equal(type,'submit');handlers.set(id,fn);}
  };
  elements.set(id,{form,input,status});
 }
 let saved={};
 let throwStorage=false;
 const storage={
  getItem:key=>{if(throwStorage)throw Error('blocked');return saved[key]||null;},
  setItem:(key,value)=>{if(throwStorage)throw Error('blocked');saved[key]=value;}
 };
 const document={
  getElementById:id=>{assert.equal(id,'count');return count;},
  querySelectorAll:selector=>{assert.equal(selector,'form[data-id]');return [...elements.values()].map(x=>x.form);}
 };
 const run=()=>vm.runInNewContext(code,{document,localStorage:storage},{timeout:1000,filename:jsFile});
 run();
 assert.equal(handlers.size,Object.keys(answers).length);
 assert.equal(count.textContent,'0 из '+handlers.size);
 const submit=(id,value)=>{
  const entry=elements.get(id);
  entry.input.value=value;
  handlers.get(id)({preventDefault(){}});
  return entry.status;
 };
 for(const [id,answer] of Object.entries(answers)){
  let result=submit(id,String(answer).replace('.',','));
  assert.match(result.textContent,/Верно/);
  assert.ok(result.className.includes('ok'));
  assertions+=2;
 }
 // Unicode mathematical minus (U+2212) must work for negative reference answers.
 const negativeEntry=Object.entries(answers).find(([,value])=>value<0);
 assert.ok(negativeEntry,jsFile+' needs a negative-answer regression fixture');
 const unicodeMinus=submit(negativeEntry[0],String(negativeEntry[1]).replace('-', '\u2212'));
 assert.match(unicodeMinus.textContent,/Верно/,jsFile+' rejected U+2212 mathematical minus');
 assert.ok(unicodeMinus.className.includes('ok'),jsFile+' failed to credit U+2212 answer');
 assertions+=2;
 assert.equal(count.textContent,handlers.size+' из '+handlers.size);
 // Regression: no wrong or near-but-wrong answer may be credited for any of 98 tasks.
 for(const [id,answer] of Object.entries(answers)){
  const wrong=answer+Math.max(0.01,Math.abs(answer)*0.01);
  const res=submit(id,String(wrong));
  assert.ok(!res.textContent.includes('Верно'),jsFile+' credited incorrect answer '+id);
  assert.ok(!res.className.includes('ok'),jsFile+' marked incorrect answer as correct '+id);
  assertions+=2;
 }
 const first=Object.keys(answers)[0];
 submit(first,String(answers[first]));
 assert.equal(count.textContent,handlers.size+' из '+handlers.size,'double counting');
 const invalid=['','   ','abc','NaN','Infinity','1e999','1;2','1,2,3'];
 for(const raw of invalid){
  const res=submit(first,raw);
  assert.ok(!res.textContent.includes('Верно'),jsFile+' accepted '+JSON.stringify(raw));
  assertions++;
 }
 handlers.clear();
 run();
 assert.equal(count.textContent,handlers.size+' из '+handlers.size,'progress not restored');
 saved=Object.fromEntries(Object.keys(saved).map(key=>[key,'{corrupted']));
 handlers.clear();
 run();
 assert.equal(count.textContent,'0 из '+handlers.size,'corrupt progress not handled');
 throwStorage=true;
 handlers.clear();
 run();
 const res=submit(first,String(answers[first]));
 assert.match(res.textContent,/Верно/,'blocked storage should not prevent solving');
 assert.equal(count.textContent,'1 из '+handlers.size);
 assert.ok(html.includes('<form'));
 console.log('PASS runtime',jsFile,handlers.size,'forms');
}
console.log('PASS runtime scenarios, assertions on individual answers:',assertions);
