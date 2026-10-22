(function(){
'use strict';
const entries=window.engineeringProcesses||[];
const root=document.getElementById('processGrid'),search=document.getElementById('processSearch'),category=document.getElementById('processCategory');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const materialNames=Object.fromEntries((window.engineeringMaterials||[]).map(item=>[item.id,item.name]));
const professionNames=Object.fromEntries((window.professionsData||[]).map(item=>[item.id,item.title]));
const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');search.insertAdjacentElement('afterend',status);
const reset=document.createElement('button');reset.type='button';reset.className='eng-filter-btn filter-reset';reset.textContent='Сбросить фильтры';status.insertAdjacentElement('afterend',reset);
reset.addEventListener('click',()=>{search.value='';category.value='all';render();search.focus();});
function render(){
const q=search.value.trim().toLocaleLowerCase('ru-RU').replace(/ё/g,'е'),group=category.value;
const materialMatches=x=>(x.materials||[]).map(id=>materialNames[id]||id).join(' ');
const profMatch=x=>professionNames[x.profession]||'';
const list=entries.filter(x=>(group==='all'||x.category===group)&&[x.name,x.description,x.steps,x.checks,materialMatches(x),profMatch(x)].join(' ').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').includes(q));
status.textContent='Найдено: '+list.length+' из '+entries.length;
reset.hidden=!search.value.trim()&&category.value==='all';
root.innerHTML=list.map(x=>'<article class="atlas-card" id="'+esc(x.id)+'"><h2>'+esc(x.name)+'</h2><p>'+esc(x.description)+'</p><h3>Типовая последовательность</h3><p>'+esc(x.steps)+'</p><h3>Контроль и ограничения</h3><p>'+esc(x.checks)+'</p><h3>Связанные материалы</h3><p>'+(x.materials.length?x.materials.map(id=>'<a href="materials.html#'+encodeURIComponent(id)+'">'+esc(materialNames[id]||id)+'</a>').join(' · '):'Для процесса не указана конкретная марка; подбор материала — по документации на изделие.')+'</p><h3>Связанная профессия</h3><p>'+(professionNames[x.profession]?'<a href="index.html#profession='+encodeURIComponent(x.profession)+'">'+esc(professionNames[x.profession])+'</a>':'<a href="index.html">Каталог профессий ↗</a>') +'</p>'+(x.evidence?'<h3>Проверенное утверждение</h3><p>'+esc(x.evidence.verifiedClaim)+'</p><p class="data-quality-note">Предел проверки: '+esc(x.evidence.reviewScope)+' (сверено: '+esc(x.evidence.checkedAt)+')</p>':'')+(x.sources&&x.sources.length?'<h3>Источники для проверки</h3><ul>'+x.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a></li>').join('')+'</ul>':'<p class="data-quality-note">Подтверждённый внешний источник пока не добавлен.</p>')+'<p class="data-quality-note">Обзор, не технологическая инструкция и не разрешение на выполнение работ.</p></article>').join('')||'<p class="eng-empty">Совпадений нет.</p>';
root.dataset.ready='true';
}
search.addEventListener('input',render);category.addEventListener('change',render);
const safeHash=()=>{try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}};
const hash=safeHash();if(hash&&entries.some(x=>x.id===hash)){category.value='all';search.value=entries.find(x=>x.id===hash).name;}
render();
if(location.hash){
 const id=safeHash();
 const target=document.getElementById(id);
 if(target){target.setAttribute('tabindex','-1');requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.focus({preventScroll:true});});}
}
window.addEventListener('hashchange',()=>{
 const id=safeHash();
 const entry=entries.find(x=>x.id===id);
 if(!entry)return;
 category.value='all';search.value=entry.name;render();
 const target=document.getElementById(id);
 if(target){target.setAttribute('tabindex','-1');target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}
});
})();