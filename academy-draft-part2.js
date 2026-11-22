/* Academy draft: per-exercise persistence prevents lost credit when multiple tabs submit. */
(()=>{
'use strict';
const answers={"E05-1":1250,"E05-2":0.75,"E08-1":12,"E08-2":4,"E09-1":19.9,"E09-2":20.2,"A04-1":100,"A04-2":0,"A05-1":100,"A05-2":100,"A06-1":2,"A06-2":0,"C02-1":5,"C02-2":9,"C06-1":0.3,"C06-2":0.2,"M01-1":27,"M01-2":39,"M03-1":90,"M03-2":120,"Q02-1":-2,"Q02-2":0.5,"Q05-1":3,"Q05-2":28};
const storageKey='enjigirling:academy-draft:part2';
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
