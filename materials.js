(function(){
'use strict';
const entries=window.engineeringMaterials||[];
const root=document.getElementById('materialGrid');
const search=document.getElementById('materialSearch');
const category=document.getElementById('materialCategory');
if(!root||!search||!category)return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
const processes=window.engineeringProcesses||[];
const professionNames=Object.fromEntries((window.professionsData||[]).map(p=>[p.id,p.title]));
const processById=Object.fromEntries(processes.map(p=>[p.id,p]));
const relatedByMaterial=Object.fromEntries(entries.map(m=>[
 m.id,[...new Set([...(m.process||[]),...processes.filter(p=>(p.materials||[]).includes(m.id)).map(p=>p.id)])]
]));
const status=document.createElement('p');
status.className='filter-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
search.insertAdjacentElement('afterend',status);
const reset=document.createElement('button');
reset.type='button';reset.className='eng-filter-btn filter-reset';reset.textContent='Сбросить фильтры';
status.insertAdjacentElement('afterend',reset);
reset.addEventListener('click',()=>{search.value='';category.value='all';render();search.focus();});
function processLink(id){
 const p=processById[id];
 return '<a href="processes.html#'+encodeURIComponent(id)+'">'+esc(p?.name||id)+'</a>';
}
function materialCard(x){
 const related=relatedByMaterial[x.id]||[];
 const selected=related.slice(0,10),rest=related.slice(10);
 const allLinks=selected.map(processLink).join(' · ')+(rest.length
  ?'<details class="material-related-more"><summary>Ещё '+rest.length+' связанных процессов</summary><div class="material-related-links">'+rest.map(processLink).join(' · ')+'</div></details>':'');
 const roles=[...new Set(related.map(id=>processById[id]?.profession).filter(id=>professionNames[id]))];
 const professionLinks=roles.map(id=>'<a href="index.html#profession='+encodeURIComponent(id)+'">'+esc(professionNames[id])+'</a>').join(' · ');
 return '<article class="atlas-card" id="'+esc(x.id)+'"><h2>'+esc(x.name)+'</h2>'+
  '<p class="data-quality-note">'+esc(x.family)+'</p><p>'+esc(x.detail)+'</p>'+
  '<h3>Применение</h3><p>'+esc(x.uses)+'</p>'+
  '<h3>Что нужно уточнять</h3><p>'+esc(x.note)+'</p>'+
  '<h3>Связанные процессы ('+related.length+')</h3><div class="material-process-links">'+(allLinks||'Не указаны')+'</div>'+
  '<h3>Связанные профессии</h3><p>'+(professionLinks||'Не указаны')+'</p>'+
  '<p class="data-quality-note">Связи редакционные: они не подтверждают технологическую применимость к конкретному изделию или режиму.</p>'+
  '<p class="data-quality-note">Числовые характеристики и нормативный источник для данной марки необходимо сверять с применимой документацией.</p></article>';
}
function render(){
 const q=norm(search.value.trim()),g=category.value;
 const list=entries.filter(x=>(g==='all'||x.group===g)&&norm([x.name,x.family,x.detail,x.uses].join(' ')).includes(q));
 status.textContent='Найдено: '+list.length+' из '+entries.length;
 reset.hidden=!search.value.trim()&&g==='all';
 root.innerHTML=list.map(materialCard).join('')||'<p class="eng-empty">Совпадений нет.</p>';
 root.dataset.ready='true';
}
function safeHash(){try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}}
function openHash(){
 const id=safeHash(),item=entries.find(x=>x.id===id);if(!item)return;
 if(!document.getElementById(id)){category.value='all';search.value=item.name;render();}
 const target=document.getElementById(id);
 if(target){target.setAttribute('tabindex','-1');requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.focus({preventScroll:true});});}
}
search.addEventListener('input',render);
category.addEventListener('change',render);
render();openHash();
window.addEventListener('hashchange',openHash);
})();
