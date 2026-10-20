(function(){
'use strict';
const entries=window.engineeringProcesses||[];
const root=document.getElementById('processGrid'),search=document.getElementById('processSearch'),category=document.getElementById('processCategory');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');search.insertAdjacentElement('afterend',status);
const reset=document.createElement('button');reset.type='button';reset.className='eng-filter-btn filter-reset';reset.textContent='Сбросить фильтры';status.insertAdjacentElement('afterend',reset);
reset.addEventListener('click',()=>{search.value='';category.value='all';render();search.focus();});
function render(){
const q=search.value.trim().toLocaleLowerCase('ru'),group=category.value;
const list=entries.filter(x=>(group==='all'||x.category===group)&&[x.name,x.description,x.steps,x.checks].join(' ').toLocaleLowerCase('ru').includes(q));
status.textContent='Найдено: '+list.length+' из '+entries.length;
reset.hidden=!search.value.trim()&&category.value==='all';
root.innerHTML=list.map(x=>'<article class="atlas-card" id="'+esc(x.id)+'"><h2>'+esc(x.name)+'</h2><p>'+esc(x.description)+'</p><h3>Типовая последовательность</h3><p>'+esc(x.steps)+'</p><h3>Контроль и ограничения</h3><p>'+esc(x.checks)+'</p><h3>Связанные материалы</h3><p>'+x.materials.map(id=>'<a href="materials.html#'+encodeURIComponent(id)+'">'+esc(id.toUpperCase())+'</a>').join(' · ')+'</p><a href="index.html">Каталог профессий ↗</a><p class="data-quality-note">Обзор, не технологическая инструкция и не разрешение на выполнение работ.</p></article>').join('')||'<p class="eng-empty">Совпадений нет.</p>';
}
search.addEventListener('input',render);category.addEventListener('change',render);
const hash=decodeURIComponent(location.hash.slice(1));if(hash&&entries.some(x=>x.id===hash)){category.value='all';search.value=entries.find(x=>x.id===hash).name;}
render();
})();