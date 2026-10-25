(function(){
'use strict';
const entries=window.engineeringMaterials||[];
const processes=window.engineeringProcesses||[];
const root=document.getElementById('materialGrid');
const search=document.getElementById('materialSearch');
const category=document.getElementById('materialCategory');
const industry=document.getElementById('materialIndustry');
const sort=document.getElementById('materialSort');
if(!root||!search||!category||!industry||!sort)return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/\s+/g,' ').trim();
const industries={metals:"Металлы и машиностроение",polymers:"Полимеры",food:"Пищевая промышленность",textiles:"Текстиль и швейное производство",wood:"Деревообработка",electronics:"Электроника",chemicals:"Химическое производство",general:"Межотраслевые процессы",composites:"Композиты",construction:"Строительство и дороги",energy:"Энергетика и теплообмен",water:"Водоподготовка и очистка",ceramics:"Керамика, цемент и стекло",pharma:"Фармацевтическое производство",printing:"Полиграфия",mining:"Горное производство"};
const groupNames={metal:'Металлы и сплавы',organic:'Органические и полимерные',inorganic:'Неорганические',composite:'Композиты',functional:'Функциональные смеси и вещества'};
const professionNames=Object.fromEntries((window.professionsData||[]).map(p=>[p.id,p.title]));
const processById=Object.fromEntries(processes.map(p=>[p.id,p]));
const materialNames=Object.fromEntries(entries.map(m=>[m.id,m.name]));
const relatedByMaterial=Object.fromEntries(entries.map(m=>[
m.id,[...new Set([...(m.process||[]),...processes.filter(p=>(p.materials||[]).includes(m.id)).map(p=>p.id)])].filter(id=>processById[id])
]));
const searchIndex=new Map(entries.map(m=>[m.id,norm([m.name,m.family,m.detail,m.uses,m.note,
...(m.industries||[]).map(id=>industries[id]||id),
...(relatedByMaterial[m.id]||[]).map(id=>processById[id].name)].join(' '))]));
const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
root.insertAdjacentElement('beforebegin',status);
const reset=document.createElement('button');reset.className='eng-filter-btn filter-reset';reset.type='button';reset.textContent='Сбросить фильтры';
status.insertAdjacentElement('afterend',reset);
const more=document.createElement('button');more.type='button';more.className='eng-filter-btn process-show-more';more.textContent='Показать ещё';
root.insertAdjacentElement('afterend',more);
const PAGE=18;let visibleLimit=PAGE;
function processLink(id){const p=processById[id];return p?'<a href="processes.html#'+encodeURIComponent(id)+'">'+esc(p.name)+'</a>':'';}
function card(x){
const rel=relatedByMaterial[x.id]||[],short=rel.slice(0,8),rest=rel.slice(8);
const names=short.map(processLink).join(' · ')+(rest.length?'<details class="material-related-more"><summary>Ещё '+rest.length+' процессов</summary><p>'+rest.map(processLink).join(' · ')+'</p></details>':'');
const professions=[...new Set(rel.map(id=>processById[id]?.profession).filter(id=>professionNames[id]))];
const roles=professions.slice(0,8).map(id=>'<a href="index.html#profession='+encodeURIComponent(id)+'">'+esc(professionNames[id])+'</a>').join(' · ');
const evidence=x.evidence||{},isPartial=evidence.verificationStatus==='partial_claim';
const sources=(x.sources||[]).filter(s=>/^https:\/\/[^\s]+$/i.test(s.url||'')&&s.title);
const sourceHtml=sources.length?'<details class="material-references"><summary>Источники ('+sources.length+')</summary><ul>'+sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a></li>').join('')+'</ul></details>':'<p>Источников пока нет.</p>';
return '<article class="atlas-card" id="'+esc(x.id)+'">'+
'<div class="material-card-meta"><span>'+esc(groupNames[x.group]||x.group)+'</span><a href="#'+encodeURIComponent(x.id)+'" aria-label="Ссылка на материал '+esc(x.name)+'"># Ссылка</a></div>'+
'<h2>'+esc(x.name)+'</h2><p class="data-quality-note">'+esc(x.family)+'</p><p>'+esc(x.detail)+'</p>'+
'<h3>Отрасли</h3><p>'+esc((x.industries||[]).map(k=>industries[k]||k).join(' · ')||'Не определены')+'</p>'+
'<h3>Применение</h3><p>'+esc(x.uses)+'</p>'+
'<h3>Что уточнять перед применением</h3><p>'+esc(x.note)+'</p>'+
'<h3>Связанные процессы ('+rel.length+')</h3><div class="material-process-links">'+(names||'Не установлены')+'</div>'+
'<h3>Связанные профессии</h3><p>'+(roles||'Не указаны')+'</p>'+
'<h3>Достоверность и границы проверки</h3><p><strong>'+(isPartial?'Частичный тезис':'Контекстный источник')+'</strong>: '+esc(evidence.verifiedClaim||'Тезис отдельно не проверен.')+'</p>'+
'<p class="data-quality-note">'+esc(evidence.reviewScope||'Не проверено.')+' Дата просмотра: '+esc(evidence.checkedAt||'не указана')+'.</p>'+
sourceHtml+
'<p class="data-quality-note">Редакционная связь с процессами не подтверждает применимость конкретной марки или партии.</p></article>';
}
function filtered(){
const terms=norm(search.value).split(' ').filter(Boolean),c=category.value,i=industry.value;
const list=entries.filter(m=>(c==='all'||m.group===c)&&(i==='all'||(m.industries||[]).includes(i))&&terms.every(t=>(searchIndex.get(m.id)||'').includes(t)));
if(sort.value==='az'||sort.value==='za')list.sort((a,b)=>a.name.localeCompare(b.name,'ru')*(sort.value==='az'?1:-1));
return list;
}
function render(appendFrom=0){
const list=filtered(),shown=list.slice(0,visibleLimit);
status.textContent='Найдено: '+list.length+' из '+entries.length+'. Показано: '+shown.length+'.';
reset.hidden=!search.value.trim()&&category.value==='all'&&industry.value==='all'&&sort.value==='az';
more.hidden=shown.length>=list.length;
if(!more.hidden)more.textContent='Показать ещё '+Math.min(PAGE,list.length-shown.length);
if(appendFrom)root.insertAdjacentHTML('beforeend',shown.slice(appendFrom).map(card).join(''));
else root.innerHTML=shown.map(card).join('')||'<p class="eng-empty">Совпадений нет. Измените параметры поиска.</p>';
root.dataset.ready='true';
}
function resetFilters(){search.value='';category.value='all';industry.value='all';sort.value='az';visibleLimit=PAGE;}
function changeFilter(){visibleLimit=PAGE;render();}
function safeHash(){try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}}
function openHash(){
const id=safeHash(),item=entries.find(x=>x.id===id);if(!item)return;
if(!document.getElementById(id)){
search.value=item.name;industry.value='all';category.value='all';visibleLimit=entries.length;render();
}
const target=document.getElementById(id);
if(target){target.setAttribute('tabindex','-1');requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.focus({preventScroll:true});});}
}
search.addEventListener('input',changeFilter);
search.addEventListener('keydown',e=>{if(e.key==='Escape'&&search.value){search.value='';changeFilter();}});
category.addEventListener('change',changeFilter);
industry.addEventListener('change',changeFilter);
sort.addEventListener('change',changeFilter);
reset.addEventListener('click',()=>{resetFilters();render();search.focus();});
more.addEventListener('click',()=>{const from=visibleLimit;visibleLimit+=PAGE;render(from);});


render();openHash();
window.addEventListener('hashchange',openHash);
})();
