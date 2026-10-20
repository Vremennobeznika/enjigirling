(function(){
'use strict';
const entries=window.engineeringMaterials||[];
const root=document.getElementById('materialGrid'),search=document.getElementById('materialSearch'),category=document.getElementById('materialCategory');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const processes=window.engineeringProcesses||[];
const professionNames=Object.fromEntries((window.professionsData||[]).map(p=>[p.id,p.title]));
const processNames={casting:'Литьё',welding:'Дуговая сварка',cutting:'Обработка резанием',heat:'Термическая обработка',additive:'Аддитивное производство',inspection:'Неразрушающий контроль','mig-mag':'MIG/MAG-сварка',tig:'TIG-сварка',ultrasonic:'Ультразвуковой контроль',radiographic:'Радиографический контроль',dye:'Капиллярный контроль',hardness:'Измерение твёрдости'};
const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');search.insertAdjacentElement('afterend',status);
const reset=document.createElement('button');reset.type='button';reset.className='eng-filter-btn filter-reset';reset.textContent='Сбросить фильтры';status.insertAdjacentElement('afterend',reset);
reset.addEventListener('click',()=>{search.value='';category.value='all';render();search.focus();});
function render(){
const q=search.value.trim().toLocaleLowerCase('ru'),group=category.value;
const list=entries.filter(x=>(group==='all'||x.group===group)&&[x.name,x.family,x.detail,x.uses].join(' ').toLocaleLowerCase('ru').includes(q));
status.textContent='Найдено: '+list.length+' из '+entries.length;
reset.hidden=!search.value.trim()&&category.value==='all';
root.innerHTML=list.map(x=>'<article class="atlas-card" id="'+esc(x.id)+'"><h2>'+esc(x.name)+'</h2><p class="data-quality-note">'+esc(x.family)+'</p><p>'+esc(x.detail)+'</p><h3>Применение</h3><p>'+esc(x.uses)+'</p><h3>Что нужно уточнять</h3><p>'+esc(x.note)+'</p><h3>Связанные процессы</h3><p>'+x.process.map(id=>'<a href="processes.html#'+encodeURIComponent(id)+'">'+esc(processNames[id]||id)+'</a>').join(' · ')+'</p><h3>Связанные профессии</h3><p>'+[...new Set(processes.filter(process=>x.process.includes(process.id)).map(process=>process.profession))].filter(id=>professionNames[id]).map(id=>'<a href="index.html#profession='+encodeURIComponent(id)+'">'+esc(professionNames[id])+'</a>').join(' · ')+'</p><p class="data-quality-note">Редакционное описание. Числовые характеристики и нормативный источник для данной марки пока не верифицированы.</p></article>').join('')||'<p class="eng-empty">Совпадений нет.</p>';
}
search.addEventListener('input',render);category.addEventListener('change',render);
const hash=decodeURIComponent(location.hash.slice(1));if(hash&&entries.some(x=>x.id===hash)){const x=entries.find(x=>x.id===hash);category.value='all';search.value=x.name;}
render();
if(location.hash){
 const id=decodeURIComponent(location.hash.slice(1));
 const target=document.getElementById(id);
 if(target){target.setAttribute('tabindex','-1');requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.focus({preventScroll:true});});}
}
window.addEventListener('hashchange',()=>{
 const id=decodeURIComponent(location.hash.slice(1));
 const entry=entries.find(x=>x.id===id);
 if(!entry)return;
 category.value='all';search.value=entry.name;render();
 const target=document.getElementById(id);
 if(target){target.setAttribute('tabindex','-1');target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}
});
})();