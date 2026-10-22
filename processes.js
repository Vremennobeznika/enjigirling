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
 chemicals:'Химическое производство',general:'Межотраслевые процессы',
 composites:'Композиты',construction:'Строительство и дороги',energy:'Энергетика и теплообмен',
 water:'Водоподготовка и очистка',ceramics:'Керамика, цемент и стекло',
 pharma:'Фармацевтическое производство',printing:'Полиграфия',mining:'Горное производство'
};
const processNames=Object.fromEntries(entries.map(x=>[x.id,x.name]));
const materialNames=Object.fromEntries((window.engineeringMaterials||[]).map(x=>[x.id,x.name]));
const professionNames=Object.fromEntries((window.professionsData||[]).map(x=>[x.id,x.title]));
const searchIndex=new Map(entries.map(x=>[x.id,norm([
 x.name,x.description,x.steps,x.checks,industries[x.industry]||'',
 ...(x.materials||[]).map(id=>materialNames[id]||id),
 professionNames[x.profession]||'',x.parentId&&processNames[x.parentId]||''
].join(' '))]));
const status=document.createElement('p');
status.className='filter-status';
status.setAttribute('role','status');status.setAttribute('aria-live','polite');
root.insertAdjacentElement('beforebegin',status);
const reset=document.createElement('button');
reset.type='button';reset.className='eng-filter-btn filter-reset';reset.textContent='Сбросить фильтры';
status.insertAdjacentElement('afterend',reset);
const more=document.createElement('button');
more.type='button';more.id='processShowMore';more.className='eng-filter-btn process-show-more';
more.textContent='Показать ещё';
root.insertAdjacentElement('afterend',more);
const PAGE=24;
let visibleLimit=PAGE;
function resetControls(){search.value='';category.value='all';industry.value='all';sort.value='default';visibleLimit=PAGE;}
function cardMarkup(x){
 const steps=String(x.steps||'').split(/\s*→\s*/).filter(Boolean);
 const related=(x.materials||[]).length
  ?x.materials.map(id=>'<a href="materials.html#'+encodeURIComponent(id)+'">'+esc(materialNames[id]||id)+'</a>').join(' · ')
  :'Материал подбирается по требованиям конкретного изделия; универсальная марка не указана.';
 const profession=professionNames[x.profession]
  ?'<a href="index.html#profession='+encodeURIComponent(x.profession)+'">'+esc(professionNames[x.profession])+'</a>'
  :'<a href="index.html">Каталог профессий</a>';
 const isLocated=x.reviewStatus==='source_located'||x.evidence?.verificationStatus==='source_located';
 const evidence=x.evidence
  ?'<h3>'+(isLocated?'Статус: источник найден':'Тезис и границы проверки')+'</h3><p>'+
   esc(x.evidence.verifiedClaim||'Результат не прошёл независимую проверку.')+'</p>'+
   '<p class="data-quality-note">'+(isLocated?'Ограничение: ':'Предел проверки: ')+esc(x.evidence.reviewScope||'')+
   ' (дата просмотра источника: '+esc(x.evidence.checkedAt||'не указана')+').</p>'
  :'';
 const sources=(x.sources||[]).filter(s=>/^https:\/\//i.test(s.url||'')&&s.title);
 const sourceHtml=sources.length
  ?'<details class="process-references"><summary>Источники и публикации ('+sources.length+')</summary><ul class="process-sources">'+sources.map(s=>
   '<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a></li>').join('')+'</ul></details>'
  :'<p class="data-quality-note">Источники не добавлены.</p>';
 const parent=x.parentId&&processNames[x.parentId]
  ?'<p class="process-parent">Семейство: <a href="#'+encodeURIComponent(x.parentId)+'">'+esc(processNames[x.parentId])+'</a></p>':'';
 return '<article class="atlas-card" id="'+esc(x.id)+'">'+
  '<div class="process-card-meta"><span>'+esc(industries[x.industry]||'Отрасль не указана')+'</span>'+
  '<a href="#'+encodeURIComponent(x.id)+'" aria-label="Постоянная ссылка на процесс '+esc(x.name)+'"># Ссылка</a></div>'+
  '<h2>'+esc(x.name)+'</h2>'+parent+'<p>'+esc(x.description)+'</p>'+
  '<h3>Типовая последовательность</h3><ol class="process-step-list">'+
   steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>'+
  '<h3>Контроль и ограничения</h3><p>'+esc(x.checks)+'</p>'+
  '<h3>Связанные материалы</h3><p class="process-related">'+related+'</p>'+
  '<h3>Связанная профессия</h3><p class="process-related">'+profession+'</p>'+
  evidence+sourceHtml+
  '<p class="data-quality-note">Обзор; не инструкция и не подтверждение применимости к конкретному изделию.</p></article>';
}
function getFiltered(){
 const terms=norm(search.value).split(' ').filter(Boolean);
 const c=category.value,i=industry.value;
 const list=entries.filter(x=>(c==='all'||x.category===c)&&(i==='all'||x.industry===i)&&
  terms.every(t=>(searchIndex.get(x.id)||'').includes(t)));
 if(sort.value==='az'||sort.value==='za')
  list.sort((a,b)=>a.name.localeCompare(b.name,'ru')*(sort.value==='az'?1:-1));
 return list;
}
function render(){
 const list=getFiltered();
 const shown=list.slice(0,visibleLimit);
 status.textContent='Найдено: '+list.length+' из '+entries.length+'. Показано: '+shown.length+'.';
 reset.hidden=!search.value.trim()&&category.value==='all'&&industry.value==='all'&&sort.value==='default';
 more.hidden=shown.length>=list.length;
 if(!more.hidden)more.textContent='Показать ещё '+Math.min(PAGE,list.length-shown.length);
 root.innerHTML=shown.map(cardMarkup).join('')||'<p class="eng-empty">Совпадений нет. Измените запрос или сбросьте фильтры.</p>';
 root.dataset.ready='true';
}

// Экспорт полных данных одной отрасли. Фильтры и постраничный показ карточек
// не обрезают передаваемые ИИ записи.
const exportIndustry=document.getElementById('processExportIndustry');
const exportCount=document.getElementById('processExportCount');
const exportStatus=document.getElementById('processExportStatus');
const exportMd=document.getElementById('processExportMd');
const exportJson=document.getElementById('processExportJson');
const exportCopy=document.getElementById('processExportCopy');
if(exportIndustry&&exportCount&&exportStatus&&exportMd&&exportJson&&exportCopy){
 for(const opt of Array.from(industry.options)){
  if(opt.value==='all'||!Object.prototype.hasOwnProperty.call(industries,opt.value))continue;
  exportIndustry.add(new Option(opt.textContent,opt.value));
 }
 const canonical=document.querySelector('link[rel="canonical"]')?.href||location.href.split('#')[0];
 const exportEntries=key=>entries.filter(x=>x.industry===key).slice().sort((a,b)=>a.name.localeCompare(b.name,'ru'));
 const selectedKey=()=>Object.prototype.hasOwnProperty.call(industries,exportIndustry.value)?exportIndustry.value:'';
 function updateExportUI(){
  const key=industry.value==='all'?'':industry.value;
  if(exportIndustry.value!==key)exportIndustry.value=key;
  const n=key?exportEntries(key).length:0;
  exportCount.textContent=key?'Записей в отрасли: '+n+'. Выгружаются все записи отрасли.':'Выберите конкретную отрасль для выгрузки.';
  exportMd.disabled=exportJson.disabled=exportCopy.disabled=!n;
  exportStatus.textContent='';
 }
 function makePayload(){
  const key=selectedKey();
  if(!key)throw Error('Сначала выберите отрасль.');
  const records=exportEntries(key);
  if(!records.length)throw Error('В этой отрасли нет записей.');
  return {
   schemaVersion:'1.0',
   dataset:'engineeringProcesses',
   title:'Атлас производственных процессов — '+industries[key],
   language:'ru',
   sourceUrl:canonical,
   industry:{id:key,name:industries[key]},
   recordsCount:records.length,
   quality:'editorial_not_independently_verified',
   notice:'Обзорные сведения, не технологические инструкции. Наличие источника и отдельного проверенного тезиса не подтверждает всю карточку; требования к изделию устанавливаются нормативной и технологической документацией.',
   records:records.map(x=>({
    ...x,
    industryName:industries[x.industry],
    materialNames:(x.materials||[]).map(id=>({id,name:materialNames[id]||id})),
    professionName:professionNames[x.profession]||x.profession||'',
    parentName:x.parentId?processNames[x.parentId]||x.parentId:null
   }))
  };
 }
 function makeMarkdown(p){
  const lines=[
   '# '+p.title,'',
   '- Отрасль: '+p.industry.name,
   '- Записей: '+p.recordsCount,
   '- Источник: '+p.sourceUrl,
   '- Статус данных: редакционный справочник, целиком независимо не проверен.','',
   '> '+p.notice,''
  ];
  for(const x of p.records){
   lines.push('## '+x.name+' ('+x.id+')','',
    '- Тип операции: '+(x.category||'не указан'),
    '- Профессия: '+x.professionName,
    '- Материалы: '+(x.materialNames.length?x.materialNames.map(v=>v.name+' ('+v.id+')').join(', '):'не указаны'),
    ...(x.parentName?['- Семейство: '+x.parentName]:[]),
    '',x.description||'', '',
    '### Этапы','',x.steps||'Не указаны.','',
    '### Контроль и ограничения','',x.checks||'Не указаны.','');
   if(x.evidence){
    lines.push('### Тезис и пределы проверки','',
     '- Статус: '+(x.reviewStatus==='source_located'||x.evidence.verificationStatus==='source_located'?'источник найден (не равнозначно проверке всей карточки)':'указан ограниченный проверяемый тезис'),
     '- Тезис: '+(x.evidence.verifiedClaim||'не указан'),
     '- Ограничения: '+(x.evidence.reviewScope||'не указаны'),
     '- Дата просмотра: '+(x.evidence.checkedAt||'не указана'),'');
   }
   lines.push('### Источники','');
   if((x.sources||[]).length)for(const src of x.sources){
    lines.push('- '+src.title+' — '+src.url);
   }else lines.push('Источники не указаны.');
   lines.push('');
  }
  return lines.join('\n').trim()+'\n';
 }
 function saveExport(text,filename,type){
  const url=URL.createObjectURL(new Blob([text],{type}));
  const link=document.createElement('a');
  link.href=url;link.download=filename;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
 }
 const filename=ext=>'processes-'+selectedKey()+'.'+ext;
 exportIndustry.addEventListener('change',()=>{
  industry.value=selectedKey()||'all';
  changeFilter();
  updateExportUI();
 });
 industry.addEventListener('change',updateExportUI);
 reset.addEventListener('click',updateExportUI);
 exportMd.addEventListener('click',()=>{
  try{const p=makePayload();saveExport(makeMarkdown(p),filename('md'),'text/markdown;charset=utf-8');exportStatus.textContent='Сформирован Markdown: '+p.recordsCount+' записей.';}
  catch(err){exportStatus.textContent=err.message;}
 });
 exportJson.addEventListener('click',()=>{
  try{const p=makePayload();saveExport(JSON.stringify(p,null,2)+'\n',filename('json'),'application/json;charset=utf-8');exportStatus.textContent='Сформирован JSON: '+p.recordsCount+' записей.';}
  catch(err){exportStatus.textContent=err.message;}
 });
 exportCopy.addEventListener('click',async()=>{
  try{
   const p=makePayload(),s=makeMarkdown(p);
   if(!navigator.clipboard?.writeText)throw Error('Копирование не поддерживается браузером. Скачайте Markdown.');
   await navigator.clipboard.writeText(s);
   exportStatus.textContent='Скопировано: '+p.recordsCount+' записей отрасли «'+p.industry.name+'».';
  }catch(err){exportStatus.textContent='Не удалось скопировать. Скачайте Markdown. '+(err.message||'');}
 });
 updateExportUI();
}

function safeHash(){try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}}
function openAnchor(){
 const id=safeHash();
 if(!id||!processNames[id])return;
 if(!document.getElementById(id)){resetControls();visibleLimit=entries.length;render();}
 const target=document.getElementById(id);
 if(target){
  target.setAttribute('tabindex','-1');
  requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.focus({preventScroll:true});});
 }
}
function changeFilter(){visibleLimit=PAGE;render();}
search.addEventListener('input',changeFilter);
search.addEventListener('keydown',event=>{if(event.key==='Escape'&&search.value){search.value='';changeFilter();}});
category.addEventListener('change',changeFilter);
industry.addEventListener('change',changeFilter);
sort.addEventListener('change',changeFilter);
reset.addEventListener('click',()=>{resetControls();render();search.focus();});
more.addEventListener('click',()=>{visibleLimit+=PAGE;render();});
render();openAnchor();
window.addEventListener('hashchange',openAnchor);
})();
