'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync('engineering-lessons.js','utf8');
const answers={ohm:20,ohm2:12,signal:50,signal2:16,tolerance:25.15,tolerance2:0.03};
const key='enjigirling:engineering-lessons:v2',prefix=key+':task:';
function setup(saved={},blocked=false){
 const handlers=new Map(),fields=new Map(),statuses=new Map(),events=new Map();
 const progressText={textContent:''},progressBar={value:0};
 for(const id of Object.keys(answers)){
  const field={value:''},status={textContent:'',className:''};
  fields.set(id,field);statuses.set(id,status);
  const form={dataset:{task:id},elements:{namedItem:()=>field},querySelector:()=>status,
   addEventListener:(name,fn)=>{assert.equal(name,'submit');handlers.set(id,fn);},
   reset:()=>{field.value='';}};
  events.set(id,form);
 }
 const reset={addEventListener:(name,fn)=>{assert.equal(name,'click');events.set('reset',fn);}};
 const document={
  getElementById:id=>id==='progressText'?progressText:id==='progressBar'?progressBar:reset,
  querySelectorAll:()=>[...Object.keys(answers)].map(id=>events.get(id))
 };
 const localStorage={
  getItem:k=>{if(blocked)throw Error('blocked');return Object.prototype.hasOwnProperty.call(saved,k)?saved[k]:null;},
  setItem:(k,v)=>{if(blocked)throw Error('blocked');saved[k]=v;},
  removeItem:k=>{if(blocked)throw Error('blocked');delete saved[k];}
 };
 const window={addEventListener:(name,fn)=>{if(name==='storage')events.set('storage',fn);}};
 vm.runInNewContext(code,{document,localStorage,window},{timeout:1000});
 const submit=(id,value)=>{fields.get(id).value=value;handlers.get(id)({preventDefault(){}});return statuses.get(id);};
 return {submit,progressText,progressBar,events,saved};
}
let checks=0;
{
 const store={},a=setup(store),b=setup(store);
 assert.equal(a.progressText.textContent,'0 из 6');
 assert.match(a.submit('ohm','20').textContent,/Верно/);
 assert.match(b.submit('signal','50').textContent,/Верно/);
 assert.equal(store[prefix+'ohm'],'1');
 assert.equal(store[prefix+'signal'],'1');
 const c=setup(store);assert.equal(c.progressText.textContent,'2 из 6');checks+=5;
 c.events.get('reset')();assert.equal(c.progressText.textContent,'0 из 6');
 assert.equal(Object.keys(store).length,0);checks+=2;
}
{
 const store={[key]:JSON.stringify({ohm:true,signal2:true})};
 const a=setup(store);assert.equal(a.progressText.textContent,'2 из 6');
 a.submit('tolerance','25,15');
 assert.equal(store[prefix+'ohm'],'1');
 assert.equal(store[prefix+'signal2'],'1');
 assert.equal(store[prefix+'tolerance'],'1');
 assert.ok(!Object.prototype.hasOwnProperty.call(store,key));
 assert.equal(setup(store).progressText.textContent,'3 из 6');checks+=6;
}
{
 const a=setup({},true);
 assert.match(a.submit('ohm','20').textContent,/не удалось/);
 assert.equal(a.progressText.textContent,'1 из 6');checks+=2;
}
{
 const a=setup({});
 for(const raw of ['NaN','Infinity','1e999','1,2,3','abc']){
  assert.doesNotMatch(a.submit('ohm',raw).textContent,/Верно/);checks++;
 }
 for(const [id,answer] of Object.entries(answers)){
  assert.match(a.submit(id,String(answer)).textContent,/Верно/);checks++;
 }
 assert.equal(a.progressText.textContent,'6 из 6');checks++;
}
console.log('PASS: original academy six-task progress migration, independent tabs, reset, storage failure, invalid and correct answers; checks='+checks);
