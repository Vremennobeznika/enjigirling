/* Academy draft: per-exercise persistence prevents lost credit when multiple tabs submit. */
(()=>{
'use strict';
const answers={"E10-1":0.2,"E10-2":4.8,"A07-1":1,"A07-2":2,"A08-1":3,"A08-2":5,"A09-1":15,"A09-2":10,"A10-1":85,"A10-2":9,"A11-1":10,"A11-2":11,"A12-1":50,"A12-2":10,"C04-1":0.1,"C04-2":-0.1,"C07-1":2,"C07-2":1,"C08-1":3,"C08-2":10,"C09-1":16,"C09-2":25,"C10-1":40.3,"C10-2":39.7,"M04-1":100,"M04-2":20,"M05-1":0.2,"M05-2":0.3,"M06-1":65,"M06-2":20,"M07-1":2,"M07-2":3,"M08-1":2000,"M08-2":10000,"M10-1":120,"M10-2":120,"Q03-1":5,"Q03-2":10,"Q06-1":14,"Q06-2":10,"Q07-1":5,"Q07-2":75,"Q08-1":8,"Q08-2":40,"Q09-1":5,"Q09-2":5,"Q10-1":5,"Q10-2":114};
const storageKey='enjigirling:academy-draft:part3';
const taskPrefix=storageKey+':task:';
function readProgress(){
 const result={};
 try{
  const legacy=JSON.parse(localStorage.getItem(storageKey)||'{}');
  if(legacy&&typeof legacy==='object'&&!Array.isArray(legacy)){
   for(const id of Object.keys(answers))if(legacy[id]===true)result[id]=true;
  }
 }catch(_){/* An invalid legacy record must not hide valid per-task records. */}
 for(const id of Object.keys(answers)){
  try{if(localStorage.getItem(taskPrefix+id)==='1')result[id]=true;}catch(_){}
 }
 return result;
}
let done=readProgress();
const count=document.getElementById('count');
function render(){count.textContent=Object.keys(done).length+' из '+Object.keys(answers).length;}
for(const form of document.querySelectorAll('form[data-id]')){
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const id=form.dataset.id;
  if(!Object.prototype.hasOwnProperty.call(answers,id))return;
  const raw=String(form.elements.namedItem('answer').value).trim().replace(',','.');
  const result=form.querySelector('.result');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)||!Number.isFinite(Number(raw))){
   result.textContent='Введите конечное число.';
   result.className='result bad';
   return;
  }
  const ok=Math.abs(Number(raw)-answers[id])<=Math.max(1e-8,Math.abs(answers[id])*1e-9);
  result.className='result '+(ok?'ok':'bad');
  if(!ok){result.textContent='Неверно. Проверьте единицы и решение.';return;}
  // Write only this exercise key: two independent tabs never overwrite a shared JSON snapshot.
  done[id]=true;
  let persisted=false;
  try{localStorage.setItem(taskPrefix+id,'1');persisted=true;}catch(_){}
  result.textContent=persisted?'Верно. Задание зачтено.':'Верно. Задание зачтено в этой вкладке, но сохранить прогресс не удалось. После перезагрузки результат может исчезнуть.';
  render();
 });
}
if(typeof window!=='undefined'&&typeof window.addEventListener==='function'){
 window.addEventListener('storage',event=>{
  if(event.key!==null&&event.key!==storageKey&&!event.key.startsWith(taskPrefix))return;
  done=readProgress();
  render();
 });
}
render();
})();
