(function(){
'use strict';
const entries=window.engineeringProcesses||[];
const root=document.getElementById('processGrid');
const search=document.getElementById('processSearch');
const category=document.getElementById('processCategory');
const industry=document.getElementById('processIndustry');
const sort=document.getElementById('processSort');
if(!root||!search||!category||!industry||!sort)return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/\s+/g,' ').trim();
const industries={
 metals:'Металлы и машиностроение',polymers:'Полимеры',food:'Пищевая промышленность',
 textiles:'Текстиль и швейное производство',wood:'Деревообработка',electronics:'Электроника',
 chemicals:'Химическое производство',general:'Межотраслевые процессы'
};
const materialNames=Object.fromEntries((window.engineeringMaterials||[]).map(x=>[x.id,x.name]));
const professionNames=Object.fromEntries((window.professionsData||[]).map(x=>[x.id,x.title]));
const searchIndex=new Map(entries.map(x=>[x.id,norm([
 x.name,x.description,x.steps,x.checks,industries[x.industry]||'',
 ...(x.materials||[]).map(id=>materialNames[id]||id),
 professionNames[x.profession]||''
].join(' '))]));
const status=document.createElement('p');
status.className='filter-status';
status.setAttribute('role','status');
status.setAttribute('aria-live','polite');
root.insertAdjacentElement('beforebegin',status);
const reset=document.createElement('button');
reset.type='button';
reset.className='eng-filter-btn filter-reset';
reset.textContent='Сбросить фильтры';
status.insertAdjacentElement('afterend',reset);
function resetControls(){
 search.value='';category.value='all';industry.value='all';sort.value='default';
}
function cardMarkup(x){
 const steps=String(x.steps||'').split(/\s*→\s*/).filter(Boolean);
 const related=(x.materials||[]).length
  ?x.materials.map(id=>'<a href="materials.html#'+encodeURIComponent(id)+'">'+esc(materialNames[id]||id)+'</a>').join(' · ')
  :'Материал зависит от изделия и технологической документации; универсальная марка не указана.';
 const profession=professionNames[x.profession]
  ?'<a href="index.html#profession='+encodeURIComponent(x.profession)+'">'+esc(professionNames[x.profession])+'</a>'
  :'<a href="index.html">Каталог профессий</a>';
 const evidence=x.evidence
  ?'<h3>Тезис и пределы проверки</h3><p>'+esc(x.evidence.verifiedClaim)+'</p>'+
   '<p class="data-quality-note">Проверено только: '+esc(x.evidence.reviewScope)+
   ' (дата в реестре: '+esc(x.evidence.checkedAt)+').</p>'
  :'';
 const sources=(x.sources||[]).filter(s=>/^https:\/\//i.test(s.url||''));
 const sourceHtml=sources.length
  ?'<h3>Источники для самостоятельной проверки</h3><ul class="process-sources">'+sources.map(s=>
   '<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a></li>').join('')+'</ul>'
  :'<p class="data-quality-note">Внешние источники ещё не добавлены.</p>';
 return '<article class="atlas-card" id="'+esc(x.id)+'">'+
  '<div class="process-card-meta"><span>'+esc(industries[x.industry]||'Отрасль не указана')+'</span>'+
  '<a href="#'+encodeURIComponent(x.id)+'" aria-label="Ссылка на процесс '+esc(x.name)+'"># Ссылка</a></div>'+
  '<h2>'+esc(x.name)+'</h2><p>'+esc(x.description)+'</p>'+
  '<h3>Типовая последовательность</h3><ol class="process-step-list">'+
   steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>'+
  '<h3>Контроль и ограничения</h3><p>'+esc(x.checks)+'</p>'+
  '<h3>Связанные материалы</h3><p class="process-related">'+related+'</p>'+
  '<h3>Связанная профессия</h3><p class="process-related">'+profession+'</p>'+
  evidence+sourceHtml+
  '<p class="data-quality-note">Обзор, не технологическая инструкция и не разрешение на выполнение работ.</p></article>';
}
function render(){
 const terms=norm(search.value).split(' ').filter(Boolean);
 const selectedCategory=category.value,selectedIndustry=industry.value;
 const list=entries.filter(x=>
  (selectedCategory==='all'||x.category===selectedCategory)&&
  (selectedIndustry==='all'||x.industry===selectedIndustry)&&
  terms.every(term=>(searchIndex.get(x.id)||'').includes(term))
 );
 if(sort.value!=='default'){
  const mult=sort.value==='az'?1:-1;
  list.sort((a,b)=>mult*a.name.localeCompare(b.name,'ru'));
 }
 status.textContent='Найдено: '+list.length+' из '+entries.length;
 reset.hidden=!search.value.trim()&&selectedCategory==='all'&&selectedIndustry==='all'&&sort.value==='default';
 root.innerHTML=list.map(cardMarkup).join('')||'<p class="eng-empty">Совпадений нет. Измените запрос или сбросьте фильтры.</p>';
 root.dataset.ready='true';
}
function safeHash(){
 try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}
}
function openAnchor(){
 const id=safeHash();
 if(!id||!entries.some(x=>x.id===id))return;
 if(!document.getElementById(id)){resetControls();render();}
 const target=document.getElementById(id);
 if(target){
  target.setAttribute('tabindex','-1');
  requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.focus({preventScroll:true});});
 }
}
search.addEventListener('input',render);
search.addEventListener('keydown',event=>{if(event.key==='Escape'&&search.value){search.value='';render();}});
category.addEventListener('change',render);
industry.addEventListener('change',render);
sort.addEventListener('change',render);
reset.addEventListener('click',()=>{resetControls();render();search.focus();});
render();openAnchor();
window.addEventListener('hashchange',openAnchor);
})();
