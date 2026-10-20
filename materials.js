(function(){
'use strict';
const entries=window.engineeringMaterials||[];
const root=document.getElementById('materialGrid'),search=document.getElementById('materialSearch'),category=document.getElementById('materialCategory');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const processNames={casting:'Литьё',welding:'Дуговая сварка',cutting:'Обработка резанием',heat:'Термическая обработка',additive:'Аддитивное производство',inspection:'Неразрушающий контроль','mig-mag':'MIG/MAG-сварка',tig:'TIG-сварка',ultrasonic:'Ультразвуковой контроль',radiographic:'Радиографический контроль',dye:'Капиллярный контроль',hardness:'Измерение твёрдости'};
function render(){
const q=search.value.trim().toLocaleLowerCase('ru'),group=category.value;
const list=entries.filter(x=>(group==='all'||x.group===group)&&[x.name,x.family,x.detail,x.uses].join(' ').toLocaleLowerCase('ru').includes(q));
root.innerHTML=list.map(x=>'<article class="atlas-card" id="'+esc(x.id)+'"><h2>'+esc(x.name)+'</h2><p class="data-quality-note">'+esc(x.family)+'</p><p>'+esc(x.detail)+'</p><h3>Применение</h3><p>'+esc(x.uses)+'</p><h3>Что нужно уточнять</h3><p>'+esc(x.note)+'</p><h3>Связанные процессы</h3><p>'+x.process.map(id=>'<a href="processes.html#'+encodeURIComponent(id)+'">'+esc(processNames[id]||id)+'</a>').join(' · ')+'</p><p class="data-quality-note">Редакционное описание. Числовые характеристики и нормативный источник для данной марки пока не верифицированы.</p></article>').join('')||'<p class="eng-empty">Совпадений нет.</p>';
}
search.addEventListener('input',render);category.addEventListener('change',render);
const hash=decodeURIComponent(location.hash.slice(1));if(hash&&entries.some(x=>x.id===hash)){const x=entries.find(x=>x.id===hash);category.value='all';search.value=x.name;}
render();
})();