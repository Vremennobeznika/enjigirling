/* ENJIGIRLING engineering lessons: deterministic, offline and dependency-free. */
(function(){
'use strict';
const key='enjigirling:engineering-lessons:v2';
const taskPrefix=key+':task:';
const expected={ohm:20,ohm2:12,signal:50,signal2:16,tolerance:25.15,tolerance2:0.03};
function readProgress(){
 const progress={};
 try{
  const saved=JSON.parse(localStorage.getItem(key)||'{}');
  if(saved&&typeof saved==='object'&&!Array.isArray(saved)){
   for(const id of Object.keys(expected))if(saved[id]===true)progress[id]=true;
  }
 }catch(_){/* Ignore damaged legacy progress. */}
 for(const id of Object.keys(expected)){
  try{if(localStorage.getItem(taskPrefix+id)==='1')progress[id]=true;}catch(_){}
 }
 return progress;
}
let done=readProgress();
const progressText=document.getElementById('progressText');
const progressBar=document.getElementById('progressBar');
function render(){
 const n=Object.keys(done).filter(id=>done[id]===true).length;
 progressText.textContent=n+' из '+Object.keys(expected).length;
 progressBar.value=n;
}
for(const form of document.querySelectorAll('form[data-task]')){
 const id=form.dataset.task,field=form.elements.namedItem('answer'),status=form.querySelector('[role="status"]');
 if(!Object.prototype.hasOwnProperty.call(expected,id))continue;
 form.addEventListener('submit',function(event){
  event.preventDefault();
  const raw=String(field.value).trim().replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)){
   status.textContent='Введите число, например 25,15.';
   status.className='result wrong';return;
  }
  const value=Number(raw);
  if(!Number.isFinite(value)){
   status.textContent='Введите конечное число.';
   status.className='result wrong';return;
  }
  const correct=Math.abs(value-expected[id])<=1e-8;
  status.className='result '+(correct?'correct':'wrong');
  if(!correct){
   status.textContent='Неверно. Проверьте формулу, единицы измерения и разбор решения.';
   return;
  }
  done[id]=true;
  let persisted=false;
  try{
   // Migrate prior shared-snapshot credit before removing it; separate keys avoid
   // independent tabs overwriting one another's successful submissions.
   for(const oldId of Object.keys(done))if(done[oldId]===true)localStorage.setItem(taskPrefix+oldId,'1');
   localStorage.removeItem(key);
   persisted=true;
  }catch(_){}
  status.textContent=persisted?'Верно. Задание зачтено.':'Верно. Задание зачтено в этой вкладке, но сохранить прогресс не удалось.';
  render();
 });
}
document.getElementById('resetProgress').addEventListener('click',function(){
 done={};
 try{
  localStorage.removeItem(key);
  for(const id of Object.keys(expected))localStorage.removeItem(taskPrefix+id);
 }catch(_){}
 for(const form of document.querySelectorAll('form[data-task]')){
  form.reset();
  const status=form.querySelector('[role="status"]');
  status.textContent='';
  status.className='result';
 }
 render();
});
if(typeof window!=='undefined'&&typeof window.addEventListener==='function'){
 window.addEventListener('storage',function(event){
  if(event.key!==null&&event.key!==key&&!event.key.startsWith(taskPrefix))return;
  done=readProgress();
  render();
 });
}
render();
})();