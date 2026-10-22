/* One small boot script. Heavy calculation engines load only when a panel is opened. */
(function(){
'use strict';
const details=document.querySelectorAll('details[data-lab],details.calc-legacy,details.practical-lab');
if(!details.length)return;
const modules=new Map(),initialized=new WeakSet(),waiting=new WeakSet();
function script(src){
 if(!modules.has(src)){
  const promise=new Promise((resolve,reject)=>{
   const tag=document.createElement('script');
   tag.src=src;tag.async=true;
   tag.addEventListener('load',resolve,{once:true});
   tag.addEventListener('error',()=>{tag.remove();reject(Error('Не удалось загрузить '+src));},{once:true});
   document.body.appendChild(tag);
  }).catch(error=>{modules.delete(src);throw error});
  modules.set(src,promise);
 }
 return modules.get(src);
}
function loadEngine(){return script('engineering-lab-core.js').then(()=>script('engineering-lab-ui.js'))}
function loadPractical(){return script('calculator-practical-core.js').then(()=>script('calculator-practical.js'))}
function loadLegacy(){return script('engineer-calculators.js')}
function activate(panel){
 if(!panel.open||initialized.has(panel)||waiting.has(panel))return;
 waiting.add(panel);
 let status=panel.querySelector('.lab-load-status');
 if(!status){
  const body=panel.querySelector('.calc-lab-body');
  if(body){status=document.createElement('p');status.className='lab-load-status calc-lab-status';status.setAttribute('role','status');body.prepend(status)}
 }
 if(status)status.textContent='Загрузка калькулятора…';
 const isLab=panel.hasAttribute('data-lab');
 const promise=isLab?loadEngine():panel.classList.contains('practical-lab')?loadPractical():loadLegacy();
 promise.then(()=>{
  if(isLab)window.initEngineeringLab(panel.dataset.lab);
  initialized.add(panel);
  if(status)status.textContent='';
 }).catch(()=>{
  if(status)status.textContent='Не удалось загрузить расчёт. Проверьте соединение и откройте этот блок ещё раз.';
 }).finally(()=>waiting.delete(panel));
}
for(const panel of details)panel.addEventListener('toggle',()=>activate(panel));
function openHash(){
 let id;
 try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
 const panel=document.getElementById(id);
 if(panel&&panel.matches('details.calc-lab')&&!panel.open)panel.open=true;
}
window.addEventListener('hashchange',openHash);
openHash();
})();