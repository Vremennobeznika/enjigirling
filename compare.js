/* Compare up to four occupations from the same 51-record career catalog. */
(function(){
'use strict';
const data=Array.isArray(window.professionsData)?window.professionsData:[];
const audit=Array.isArray(window.salarySourceAudit)?window.salarySourceAudit:[];
const byId=new Map(data.map(x=>[x.id,x])),salaryById=new Map(audit.map(x=>[x.id,x]));
const picker=document.getElementById('professionPicker');
const selected=document.getElementById('selectedProfessions');
const result=document.getElementById('comparisonResult');
const add=document.getElementById('addProfession');
if(!picker||!selected||!result||!add)return;
const chosen=[];
const escape=v=>String(v??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('ru-RU');
const url=v=>{try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}};
data.slice().sort((a,b)=>a.title.localeCompare(b.title,'ru')).forEach(p=>{
 const option=document.createElement('option');option.value=p.id;option.textContent=p.title;picker.append(option);
});
function evidence(p){
 const x=salaryById.get(p.id);
 if(!x||x.status!=='source_snapshot'||x.validationStatus==='adjacent_occupation_checked'||x.evidenceLevel==='adjacent_or_weak')return 'Только смежная профессия — нет сопоставимого диапазона; цифры не переносятся.';
 if(!Number.isFinite(x.rangeMinRub)||!Number.isFinite(x.rangeMaxRub))return 'Числовых данных нет';
 const range=x.rangeMinRub===x.rangeMaxRub?'Одно наблюдение '+fmt(x.rangeMinRub):fmt(x.rangeMinRub)+'–'+fmt(x.rangeMaxRub);
 return range+' ₽/мес. · '+x.region+' · '+x.checkedAt+' · '+(x.evidenceLevel==='single_observation'?'одна вакансия':'опубликованные данные')+'. Не общий рейтинг зарплат.';
}
function source(p){
 const x=salaryById.get(p.id);
 const link=x&&url(x.sourceUrl);
 return link?'<a href="'+escape(link)+'" target="_blank" rel="noopener noreferrer">Страница источника ↗</a>':'Источник не указан';
}
function status(p){
 const x=salaryById.get(p.id);
 if(!x)return 'Нет записи';
 if(x.validationStatus==='adjacent_occupation_checked')return 'Смежная должность, цифры исключены';
 if(x.validationStatus==='employer_vacancy_checked')return 'Отдельная вакансия, не рынок';
 if(x.validationStatus==='source_page_checked')return 'Отмечен просмотр страницы, независимая проверка выборки не проведена';
 return 'Нет независимой проверки';
}
function updateUrl(){
 const u=new URL(window.location.href);
 if(chosen.length)u.searchParams.set('ids',chosen.join(','));
 else u.searchParams.delete('ids');
 history.replaceState(history.state,'',u.pathname+u.search+u.hash);
}
const fields=[
 ['Чем занимается',p=>p.shortDesc],
 ['Образование',()=> 'Зависит от учебной программы и работодателя; формальные требования не установлены для всей профессии'],
 ['Базовые знания',p=>p.education?.requirements],
 ['Инструменты и темы обучения',p=>(p.education?.courses||[]).join(', ')],
 ['Возможные карьерные роли (без гарантированной последовательности и сроков)',p=>(p.careerGrowth||[]).map(x=>x.title).join('; ')],
 ['Возможные сложности (редакционная оценка)',p=>p.hard],
 ['Снимок зарплатного источника (данные несопоставимы напрямую)',evidence],
 ['Статус источника',status],
 ['Страница источника',source,true]
];
function render(){
 selected.replaceChildren();
 for(const id of chosen){
  const p=byId.get(id);if(!p)continue;
  const b=document.createElement('button');
  b.type='button';b.className='eng-filter-btn';b.textContent=p.title+' ×';
  b.setAttribute('aria-label','Убрать из сравнения: '+p.title);
  b.addEventListener('click',()=>{chosen.splice(chosen.indexOf(id),1);updateUrl();render();});
  selected.appendChild(b);
 }
 if(chosen.length<2){
   result.innerHTML='<p class="eng-empty">Добавьте минимум две профессии для сравнения.</p>';return;
 }
 const ps=chosen.map(id=>byId.get(id));
 result.innerHTML='<div class="comparison-scroll"><table class="comparison-table"><caption>Сравнение '+ps.length+' профессий (редакционные описания и снимки источников)</caption><thead><tr><th scope="col">Критерий</th>'+
 ps.map(p=>'<th scope="col">'+escape(p.title)+'</th>').join('')+
 '</tr></thead><tbody>'+
 fields.map(([heading,get,html])=>'<tr><th scope="row">'+escape(heading)+'</th>'+
 ps.map(p=>'<td>'+(html?get(p):escape(get(p)))+'</td>').join('')+'</tr>').join('')+
 '</tbody></table></div>';
}
add.addEventListener('click',()=>{
 const id=picker.value;
 if(!id||!byId.has(id)||chosen.includes(id))return;
 if(chosen.length>=4){
  result.insertAdjacentHTML('beforeend','<p class="data-quality-note" role="status">Максимум четыре профессии.</p>');return;
 }
 chosen.push(id);picker.value='';updateUrl();render();
});
const initial=new URLSearchParams(location.search).get('ids');
if(initial)for(const id of initial.split(',').slice(0,20)){
 if(!byId.has(id)||chosen.includes(id))continue;
 if(chosen.length===4)break;
 chosen.push(id);
}
render();
})();