/* Download calculator code only after an advanced calculator is expanded. */
(function(){
'use strict';
const details=[...document.querySelectorAll('details[data-lab]')];
if(!details.length)return;
let pending;
function script(src){
 return new Promise((resolve,reject)=>{
  const tag=document.createElement('script');tag.src=src;tag.onload=resolve;tag.onerror=()=>reject(Error('Не удалось загрузить '+src));
  document.body.appendChild(tag);
 });
}
function load(){
 if(!pending)pending=script('engineering-lab-core.js').then(()=>script('engineering-lab-ui.js')).catch(error=>{pending=null;throw error;});
 return pending;
}
function activate(panel){
 if(!panel.open)return;
 const status=panel.querySelector('.lab-load-status');
 if(status)status.textContent='Загрузка калькулятора…';
 load().then(()=>{
  window.initEngineeringLab(panel.dataset.lab);
  if(status)status.textContent='';
 }).catch(()=>{
  if(status)status.textContent='Модуль не загрузился. Проверьте локальные файлы и обновите страницу.';
 });
}
for(const panel of details)panel.addEventListener('toggle',()=>activate(panel));
function openHash(){
 const id=decodeURIComponent(location.hash.slice(1));
 const panel=details.find(x=>x.id===id);
 if(panel&&!panel.open)panel.open=true;
}
window.addEventListener('hashchange',openHash);
openHash();
})();