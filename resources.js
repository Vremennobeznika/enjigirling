// Каталог инженерных ресурсов: поиск, категории, сортировка и компактный список.
// Источник данных — resources-data.js. Дружественные сообщества редактируются отдельно.
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const items = Array.isArray(resources) ? resources : [];
  const filter = document.getElementById('resourcesFilter');
  const grid = document.getElementById('resourcesGrid');
  const search = document.getElementById('resourceSearch');
  const sort = document.getElementById('resourceSort');
  const status = document.getElementById('resourcesStatus');
  const reset = document.getElementById('resourceReset');
  const viewGrid = document.getElementById('resourceGridView');
  const viewList = document.getElementById('resourceListView');
  if (!filter || !grid || !search || !sort || !status || !reset) return;
  const ALL = 'Все';
  const order = ['Журналы', 'Форумы', 'Платформы для разработок', 'Инструменты и симуляторы', 'Научные базы и справочники', 'Стандарты и метрология', 'Обучение и курсы', 'Дружественные каналы', 'Чаты в Telegram'];
  const labels = {'Платформы для разработок':'Разработка', 'Инструменты и симуляторы':'Инструменты', 'Научные базы и справочники':'Библиотеки', 'Стандарты и метрология':'Стандарты', 'Обучение и курсы':'Курсы', 'Дружественные каналы':'Каналы', 'Чаты в Telegram':'Чаты'};
  const htmlEsc = value => String(value ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const normalize = value => String(value ?? '').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/\s+/g,' ').trim();
  const collator = new Intl.Collator('ru-RU', {numeric:true, sensitivity:'base'});
  const count = new Map(), index = items.map(item=>({item,search:normalize([item.name,item.desc,item.type,item.tags||''].join(' '))}));
  items.forEach(item=>count.set(item.type,(count.get(item.type)||0)+1));
  const types = [ALL,...order.filter(type=>count.has(type)), ...[...count.keys()].filter(type=>!order.includes(type)).sort(collator.compare)];
  const buttons = new Map();
  let activeType=ALL, view='grid';
  const hostname = url => { try {return new URL(url).hostname.replace(/^www\./,'');} catch {return '';} };
  const makeCard = item => {
    const href=String(item.link||'');
    if (!/^https?:\/\//i.test(href)) return '';
    return `<a class="eng-card eng-card--link resource-card" href="${htmlEsc(href)}" target="_blank" rel="noopener noreferrer">
      <div class="resource-type">${htmlEsc(item.type || 'Ресурс')}</div>
      <h3 class="eng-title">${htmlEsc(item.name)}</h3>
      <p class="eng-desc">${htmlEsc(item.desc)}</p>
      <div class="resource-card-bottom"><span class="resource-host">${htmlEsc(hostname(href))}</span><span class="eng-resource-link">Открыть ↗</span></div>
    </a>`;
  };
  for(const type of types){
    const button=document.createElement('button');
    button.type='button';button.className='eng-filter-btn resource-chip';
    const quantity=type===ALL?items.length:count.get(type)||0;
    button.innerHTML=`<span>${htmlEsc(labels[type]||type)}</span><span class="resource-chip-count" aria-hidden="true">${quantity}</span>`;
    button.title=type;
    button.setAttribute('aria-pressed',type===activeType?'true':'false');
    button.classList.toggle('active',type===activeType);
    button.addEventListener('click',()=>{activeType=type;update();});
    filter.appendChild(button);buttons.set(type,button);
  }
  function update(){
    const query=normalize(search.value);
    const visible=index.filter(({item,search:terms})=>(activeType===ALL||item.type===activeType)&&terms.includes(query)).map(({item})=>item);
    visible.sort((a,b)=>collator.compare(a.name,b.name)*(sort.value==='za'?-1:1));
    const groups=activeType===ALL?types.slice(1):[activeType];
    const markup=[];
    for(const type of groups){
      const matches=visible.filter(item=>item.type===type);
      if(!matches.length)continue;
      markup.push(`<section class="resource-group" aria-label="${htmlEsc(type)}">
       <div class="resource-group-header"><h2>${htmlEsc(type)}</h2><span>${matches.length}</span></div>
       <div class="resource-items">${matches.map(makeCard).join('')}</div></section>`);
    }
    grid.innerHTML=markup.join('')||'<p class="eng-empty">Ничего не найдено. Измените запрос или сбросьте фильтры.</p>';
    grid.classList.toggle('resource-list-view',view==='list');
    grid.dataset.ready='true';
    status.textContent=`Найдено: ${visible.length} из ${items.length}`+(activeType===ALL?'':` · ${activeType}`);
    reset.hidden=(activeType===ALL&&!query&&sort.value==='az'&&view==='grid');
    for(const [type,button] of buttons){
      const selected=type===activeType;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-pressed',String(selected));
    }
    viewGrid.setAttribute('aria-pressed',String(view==='grid'));
    viewList.setAttribute('aria-pressed',String(view==='list'));
  }
  search.addEventListener('input',update);
  search.addEventListener('keydown',e=>{if(e.key==='Escape'&&search.value){search.value='';update();}});
  sort.addEventListener('change',update);
  viewGrid.addEventListener('click',()=>{view='grid';update();});
  viewList.addEventListener('click',()=>{view='list';update();});
  reset.addEventListener('click',()=>{activeType=ALL;search.value='';sort.value='az';view='grid';update();});
  update();
});
