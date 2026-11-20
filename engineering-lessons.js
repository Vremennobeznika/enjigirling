/* ENJIGIRLING engineering lessons: deterministic, offline and dependency-free. */
(function(){
'use strict';
const key='enjigirling:engineering-lessons:v1';
const expected={ohm:20,signal:50,tolerance:25.15};
let done={};
try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved)){for(const id of Object.keys(expected))if(saved[id]===true)done[id]=true;}}catch(_){}
const progressText=document.getElementById('progressText');
const progressBar=document.getElementById('progressBar');
function render(){const n=Object.keys(done).filter(id=>done[id]===true).length;progressText.textContent=n+' из 3';progressBar.value=n;}
for(const form of document.querySelectorAll('form[data-task]')){
 const id=form.dataset.task,field=form.elements.namedItem('answer'),status=form.querySelector('[role="status"]');
 if(!Object.prototype.hasOwnProperty.call(expected,id))continue;
 form.addEventListener('submit',function(event){
  event.preventDefault();
  const raw=String(field.value).trim().replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)){status.textContent='Введите число, например 25,15.';status.className='result wrong';return;}
  const value=Number(raw);
  if(!Number.isFinite(value)){status.textContent='Введите конечное число.';status.className='result wrong';return;}
  const correct=Math.abs(value-expected[id])<=1e-8;
  status.textContent=correct?'Верно. Задание зачтено.':'Неверно. Проверьте формулу, единицы измерения и разбор решения.';
  status.className='result '+(correct?'correct':'wrong');
  if(correct){done[id]=true;try{localStorage.setItem(key,JSON.stringify(done));}catch(_){}render();}
 });
}
document.getElementById('resetProgress').addEventListener('click',function(){done={};try{localStorage.removeItem(key);}catch(_){}for(const form of document.querySelectorAll('form[data-task]')){form.reset();const status=form.querySelector('[role="status"]');status.textContent='';status.className='result';}render();});
render();
})();