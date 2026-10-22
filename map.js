/* Education directory: accessible search and map controls, using existing editorial data. */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const districts=Array.isArray(typeof federalDistricts!=='undefined' ? federalDistricts : null) ? federalDistricts : [];
  const search=document.getElementById('educationSearch');
  const districtSelect=document.getElementById('educationDistrict');
  const typeSelect=document.getElementById('educationType');
  const sortSelect=document.getElementById('educationSort');
  const results=document.getElementById('educationResults');
  const status=document.getElementById('educationStatus');
  const clear=document.getElementById('educationClear');
  const more=document.getElementById('educationMore');
  const total=document.getElementById('educationTotal');
  const svg=document.getElementById('russiaMap');
  const mapReset=document.getElementById('mapReset');
  const mapInfo=document.getElementById('districtInfo');
  if(!search||!districtSelect||!typeSelect||!sortSelect||!results||!status||!clear||!more||!svg||!mapInfo)return;
  const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=v=>String(v??'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/\s+/g,' ').trim();
  const compare=new Intl.Collator('ru-RU',{numeric:true,sensitivity:'base'});
  const count=(d,key)=>Array.isArray(d[key])?d[key].length:0;
  const entries=[];
  for(const district of districts){
    for(const [key,type] of [['universities','uni'],['colleges','college']]){
      for(const item of district[key]||[]){
        entries.push({item,district,type,search:normalize([item.name,item.city,item.focus,item.profile,...(item.verifiedPrograms||[]).flatMap(p=>[p.code,p.name,p.year]),district.name,district.short].join(' '))});
      }
    }
    const option=document.createElement('option');
    option.value=district.id;option.textContent=district.name;
    districtSelect.appendChild(option);
  }
  total.textContent=entries.length+' записей';
  const pageSize=12;
  let shown=pageSize,filtered=[];
  const validLink=url=>{try{const parsed=new URL(String(url));return (parsed.protocol==='https:'||(parsed.protocol==='http:'&&parsed.hostname==='gaskk-mck.ru'))?parsed.href:'';}catch{return '';}};
  function renderCard(record){
    const {item,district,type}=record;
    const source=validLink(item.sourceUrl),site=validLink(item.site);
    const hasSource=item.sourceStatus==='official_source_located'&&source;
    const programs=Array.isArray(item.verifiedPrograms)?item.verifiedPrograms:[];
    const programDetails=programs.map(p=>({
      label:'Программа по источнику '+p.code,
      value:[p.name,p.year,p.basis,p.duration,
        Number.isFinite(p.budgetPlaces)?'Бюджетных мест: '+p.budgetPlaces:null,
        Number.isFinite(p.paidPlaces)?'Платных мест: '+p.paidPlaces:null,
        Number.isFinite(p.tuitionAnnualRub)?'Стоимость платного обучения: '+new Intl.NumberFormat('ru-RU').format(p.tuitionAnnualRub)+' ₽ в год':null,
        Number.isFinite(p.tuitionSemesterRub)?'Стоимость: '+new Intl.NumberFormat('ru-RU').format(p.tuitionSemesterRub)+' ₽ за семестр':null,
        p.admission?'Вступительные испытания: '+p.admission:null,
        p.note].filter(Boolean).join(' · '),
      source:validLink(p.sourceUrl)
    }));

    const facts=[
      ['Описание направлений',programs.length?'Ниже приведены сведения о программах с указанными источниками. Независимая сверка каждого утверждения не гарантирована; остальные направления — редакционный ориентир.':'Направление — редакционный ориентир; наличие конкретной программы приёма не подтверждено.'],
      ['Сроки, стоимость, бюджет и экзамены','Зависят от программы и года приёма. Без проверенного документа не приводятся.'],
      ['Статус',hasSource?item.verifiedScope:'Правила набора по этой организации индивидуально не проверены.'],
      ...(item.sourceFetchStatus?[['Доступность страницы источника',item.sourceFetchStatus==='fetched'?'22.10.2026: документ или сайт открылся. Содержательная точность остальных сведений не следует из этого факта.':'22.10.2026: проверить ссылку не удалось (тайм-аут или ошибка доступа). Это не доказательство закрытия организации.']]:[]),
      ...(item.siteFetchStatus?[['Доступность сайта из исходного каталога',item.siteFetchStatus==='fetched'?'22.10.2026: сайт открылся. Это не подтверждает программы и набор.':'22.10.2026: отдельная попытка открыть сайт не удалась. Адрес мог быть недоступен только для проверяющего клиента.']]:[]),

      ...programDetails.map(p=>[p.label,p.value])
    ].map(([label,value])=>'<div class="education-fact"><dt>'+escapeHtml(label)+'</dt><dd>'+escapeHtml(value)+'</dd></div>').join('');
    return '<article class="education-card">'+
      '<div class="education-card-meta"><span class="education-kind">'+(type==='uni'?'Вуз':'Колледж / техникум')+'</span><span class="education-location">'+escapeHtml(item.city)+' · '+escapeHtml(district.short)+'</span></div>'+
      '<h3>'+escapeHtml(item.name)+'</h3>'+
      '<p class="education-focus"><strong>Направления (ориентир):</strong> '+escapeHtml(item.focus||item.profile||'Не указаны')+'</p>'+
      '<p class="education-card-status">'+(programs.length?(item.reviewStatus==='program_source_recorded'?'Программа указана в источнике; условия набора не подтверждены':item.reviewStatus==='program_verified_with_access_limit'?'Документ программы требует повторной проверки доступности':item.reviewStatus==='program_verified'?'В каталоге указана частичная сверка; проверяйте сам источник':'Источник программы указан; проверка не завершена'):(item.sourceFetchStatus==='fetch_failed'?'Ссылка не открылась при проверке':(hasSource?(item.sourceType==='institution_home'?'Название сверено, не набор':'Источник найден; условия не сверены'):'Условия приёма не проверены')))+'</p>'+
      '<details class="education-card-details"><summary>Источники, программы и ограничения</summary><dl>'+facts+'</dl>'+
      programDetails.filter(p=>p.source).map(p=>'<a class="education-site" href="'+escapeHtml(p.source)+'" rel="noopener noreferrer" target="_blank">Программа '+escapeHtml(p.label.replace('Программа по источнику ',''))+' — источник'+(p.source.startsWith('http:')?' (HTTP, без шифрования)':'')+' ↗</a>').join('')+
      (hasSource?'<a class="education-site" href="'+escapeHtml(source)+'" rel="noopener noreferrer" target="_blank">'+(item.sourceType==='institution_home'?'Официальный сайт (название)':'Первоисточник')+(source.startsWith('http:')?' (HTTP, без шифрования)':'')+' ↗</a>':'')+
      (site&&site!==source?'<a class="education-site" href="'+escapeHtml(site)+'" rel="noopener noreferrer" target="_blank">Сайт из каталога ↗</a>':(!site&&!source?'<p class="education-no-link">Адрес сайта не подтверждён</p>':''))+
      '</details></article>';
  }
  function sortedMatches(){
    const terms=normalize(search.value).split(' ').filter(Boolean);
    const districtId=districtSelect.value,kind=typeSelect.value;
    const matched=entries.filter(row=>
      (!districtId||row.district.id===districtId)&&
      (kind==='all'||kind===row.type)&&
      terms.every(t=>row.search.includes(t))
    );
    const order=sortSelect.value;
    matched.sort((a,b)=>{
      if(order==='city')return compare.compare(a.item.city,b.item.city)||compare.compare(a.item.name,b.item.name);
      if(order==='district')return compare.compare(a.district.name,b.district.name)||compare.compare(a.item.city,b.item.city)||compare.compare(a.item.name,b.item.name);
      return compare.compare(a.item.name,b.item.name)||compare.compare(a.item.city,b.item.city);
    });
    return matched;
  }
  function synchronizeMap(){
    const selected=districtSelect.value;
    svg.querySelectorAll('.eng-district').forEach(el=>{
      const active=el.dataset.id===selected;
      el.classList.toggle('active',active);
      el.setAttribute('aria-pressed',String(active));
    });
    svg.querySelectorAll('.eng-marker').forEach(el=>el.classList.toggle('active',el.dataset.id===selected));
    const d=districts.find(row=>row.id===selected);
    if(d){
      mapInfo.innerHTML='<h3>'+escapeHtml(d.name)+'</h3>'+
        '<p>В редакционной базе: <strong>'+count(d,'universities')+'</strong> вузов и <strong>'+count(d,'colleges')+'</strong> колледжей / техникумов.</p>'+
        '<p>Выбранный округ уже применён к каталогу выше.</p>'+
        '<a class="education-map-return" href="#education-directory">Посмотреть результаты ↑</a>';
    }else{
      mapInfo.innerHTML='<h3>Все федеральные округа</h3><p>Выберите округ на схеме, клавиатурой или через список фильтров в каталоге. Карта — дополнительный способ выбора, не обязательный.</p>';
    }
  }
  function render(){
    const opened=new Set([...results.querySelectorAll('.education-card')].filter(card=>card.querySelector('details[open]')).map(card=>card.querySelector('h3')?.textContent));
    filtered=sortedMatches();
    const visible=filtered.slice(0,shown);
    results.innerHTML=visible.length?visible.map(renderCard).join(''):'<p class="education-empty">Ничего не найдено. Попробуйте другой город, специальность или сбросьте фильтры.</p>';
    results.querySelectorAll('.education-card').forEach(card=>{
      if(opened.has(card.querySelector('h3')?.textContent))card.querySelector('details').open=true;
    });
    status.textContent='Найдено '+filtered.length+' из '+entries.length+' · показано '+visible.length;
    more.hidden=visible.length>=filtered.length;
    more.textContent='Показать ещё '+Math.min(pageSize,filtered.length-visible.length);
    clear.hidden=!(search.value||districtSelect.value||typeSelect.value!=='all'||sortSelect.value!=='name');
    synchronizeMap();
  }
  function changed(){shown=pageSize;render();}
  search.addEventListener('input',changed);
  search.addEventListener('keydown',e=>{if(e.key==='Escape'&&search.value){search.value='';changed();}});
  [districtSelect,typeSelect,sortSelect].forEach(el=>el.addEventListener('change',changed));
  clear.addEventListener('click',()=>{search.value='';districtSelect.value='';typeSelect.value='all';sortSelect.value='name';changed();search.focus();});
  more.addEventListener('click',()=>{
    shown+=pageSize;render();
  });
  document.querySelectorAll('.learning-shortcuts a[href^="#education-"]').forEach(link=>{
    link.addEventListener('click',()=>{
      const target=document.querySelector(link.getAttribute('href'));
      if(target&&target.tagName==='DETAILS')target.open=true;
    });
  });
  const namespace='http://www.w3.org/2000/svg';
  function chooseDistrict(id,scroll){
    districtSelect.value=id;
    changed();
    if(scroll){
      document.getElementById('education-directory').scrollIntoView({behavior:'auto',block:'start'});
      districtSelect.focus({preventScroll:true});
    }
  }
  svg.querySelectorAll('.eng-district').forEach(path=>{
    const district=districts.find(d=>d.id===path.dataset.id);
    if(!district)return;
    path.setAttribute('d',district.path);
    path.classList.add('eng-district--ready');
    path.setAttribute('role','button');
    path.setAttribute('tabindex','0');
    path.setAttribute('aria-label',district.name+', выбрать федеральный округ');
    const title=document.createElementNS(namespace,'title');title.textContent=district.name;path.appendChild(title);
    path.addEventListener('click',()=>chooseDistrict(district.id,true));
    path.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseDistrict(district.id,true);}
    });
    const marker=document.createElementNS(namespace,'circle');
    marker.setAttribute('class','eng-marker');
    marker.setAttribute('cx',district.marker[0]);marker.setAttribute('cy',district.marker[1]);marker.setAttribute('r',6);
    marker.dataset.id=district.id;
    marker.setAttribute('aria-hidden','true');
    marker.addEventListener('click',()=>chooseDistrict(district.id,true));
    svg.appendChild(marker);
    const label=document.createElementNS(namespace,'text');
    label.setAttribute('class','eng-district-label');
    label.setAttribute('x',district.marker[0]);label.setAttribute('y',district.marker[1]-12);
    label.textContent=district.short;
    label.setAttribute('aria-hidden','true');
    label.style.pointerEvents='auto';
    label.style.cursor='pointer';
    label.addEventListener('click',()=>chooseDistrict(district.id,true));
    svg.appendChild(label);
  });
  if(mapReset)mapReset.addEventListener('click',()=>chooseDistrict('',false));
  render();
});
