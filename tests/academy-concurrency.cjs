'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

// Browser-independent integration harness: two tabs, one origin/localStorage,
// plus legacy migration and denied storage. This checks client behavior only.
for(const [file,key] of [
 ['academy-draft.js','enjigirling:academy-draft:v1'],
 ['academy-draft-part2.js','enjigirling:academy-draft:part2'],
 ['academy-draft-part3.js','enjigirling:academy-draft:part3']
]){
 const source=fs.readFileSync(file,'utf8');
 const m=source.match(/const answers=(\{[^;]+\});/);
 assert.ok(m,'answer map missing in '+file);
 const answers=JSON.parse(m[1]);
 const [id1,id2]=Object.keys(answers);
 assert.ok(id1&&id2);
 const values=new Map();
 let blocked=false;
 const tabs=[];
 const sharedStorage={
  getItem:k=>{if(blocked)throw Error('storage denied');return values.get(k)??null;},
  setItem:(k,v)=>{
   if(blocked)throw Error('storage denied');
   values.set(k,String(v));
   for(const tab of tabs)if(tab.onStorage)tab.onStorage({key:k});
  }
 };
 function openTab(){
  const forms=new Map();
  const count={textContent:''};
  const tab={onStorage:null};
  for(const id of Object.keys(answers)){
   const field={value:''},result={textContent:'',className:''};
   const model={
    dataset:{id},
    elements:{namedItem:name=>{assert.equal(name,'answer');return field;}},
    querySelector:s=>{assert.equal(s,'.result');return result;},
    addEventListener:(name,handler)=>{assert.equal(name,'submit');model.submit=handler;}
   };
   forms.set(id,{field,result,model});
  }
  const document={
   getElementById:name=>{assert.equal(name,'count');return count;},
   querySelectorAll:s=>{assert.equal(s,'form[data-id]');return [...forms.values()].map(v=>v.model);}
  };
  const window={addEventListener:(name,callback)=>{assert.equal(name,'storage');tab.onStorage=callback;}};
  tabs.push(tab);
  vm.runInNewContext(source,{document,localStorage:sharedStorage,window},{timeout:1000,filename:file});
  return {
   count,
   submit(id,value){
    const {field,result,model}=forms.get(id);
    field.value=String(value);
    model.submit({preventDefault(){}});
    return result.textContent;
   }
  };
 }
 const tab1=openTab(),tab2=openTab();
 assert.equal(tab1.count.textContent,'0 из '+Object.keys(answers).length);
 assert.equal(tab2.count.textContent,'0 из '+Object.keys(answers).length);
 assert.match(tab1.submit(id1,answers[id1]),/Верно/);
 assert.match(tab2.submit(id2,answers[id2]),/Верно/);
 assert.equal(values.get(key+':task:'+id1),'1','tab A credit overwritten');
 assert.equal(values.get(key+':task:'+id2),'1','tab B credit overwritten');
 assert.equal(tab1.count.textContent,'2 из '+Object.keys(answers).length,'tab A did not update from tab B');
 assert.equal(tab2.count.textContent,'2 из '+Object.keys(answers).length,'tab B did not update from tab A');
 const tab3=openTab();
 assert.equal(tab3.count.textContent,'2 из '+Object.keys(answers).length,'reload did not restore both credits');
 // Corrupt legacy JSON must not hide valid individual records.
 values.set(key,'{corrupted');
 const tab4=openTab();
 assert.equal(tab4.count.textContent,'2 из '+Object.keys(answers).length,'bad legacy hid valid task records');
 // Denied storage cannot silently claim persistence.
 blocked=true;
 const denied=openTab();
 assert.equal(denied.count.textContent,'0 из '+Object.keys(answers).length);
 assert.match(denied.submit(id1,answers[id1]),/сохранить прогресс не удалось/);
 assert.equal(denied.count.textContent,'1 из '+Object.keys(answers).length);
 blocked=false;
 // Existing monolithic progress remains readable without destructive migration.
 values.clear();
 values.set(key,JSON.stringify({[id1]:true,[id2]:'true'}));
 const legacy=openTab();
 assert.equal(legacy.count.textContent,'1 из '+Object.keys(answers).length,'only boolean true may be restored');
 assert.match(legacy.submit(id2,answers[id2]),/Верно/);
 const migrated=openTab();
 assert.equal(migrated.count.textContent,'2 из '+Object.keys(answers).length);
 console.log('PASS concurrency/legacy/storage',file,Object.keys(answers).length,'tasks');
}
