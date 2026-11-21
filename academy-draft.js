/* Academy draft: per-exercise persistence prevents lost credit when multiple tabs submit. */
(()=>{
'use strict';
const answers={"E01-1":2500,"E01-2":4.7,"E03-1":450,"E03-2":100,"E04-1":0.2,"E04-2":1,"E06-1":1,"E06-2":1,"E07-1":50,"E07-2":50,"A01-1":6,"A01-2":-12,"A02-1":0,"A02-2":1,"C01-1":60,"C01-2":40,"C05-1":65,"C05-2":50.3,"M02-1":10,"M02-2":40,"M09-1":95,"M09-2":92.5,"Q01-1":1,"Q01-2":0,"Q04-1":7,"Q04-2":2};
const storageKey='enjigirling:academy-draft:v1';
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
  if(!/^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)$/.test(raw)||!Number.isFinite(Number(raw))){
   result.textContent='Введите конечное число.';
   result.className='result error';
   return;
  }
  const ok=Math.abs(Number(raw)-answers[id])<=Math.max(1e-8,Math.abs(answers[id])*1e-9);
  result.className='result '+(ok?'ok':'error');
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
