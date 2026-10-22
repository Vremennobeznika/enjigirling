// Лёгкий каталог инженерных ресурсов: поиск по всем записям, порционная отрисовка.
// Данные дружественных каналов находятся в resources-data.js и здесь не изменяются.
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const items = typeof resources !== 'undefined' && Array.isArray(resources) ? resources : [];
  const filter = document.getElementById('resourcesFilter');
  const grid = document.getElementById('resourcesGrid');
  const search = document.getElementById('resourceSearch');
  const sort = document.getElementById('resourceSort');
  const status = document.getElementById('resourcesStatus');
  const reset = document.getElementById('resourceReset');
  const more = document.getElementById('resourceShowMore');
  const viewGrid = document.getElementById('resourceGridView');
  const viewList = document.getElementById('resourceListView');
  if (!filter || !grid || !search || !sort || !status || !reset || !more || !viewGrid || !viewList) return;
  const ALL = 'Все';
  const order = ['Журналы', 'САПР и конструирование', 'Разработка ПО', 'Инструменты и симуляторы', 'Онлайн-измерения', 'Форумы', 'Научные базы и справочники', 'Стандарты и метрология', 'Обучение и курсы', 'Дружественные каналы', 'Чаты в Telegram'];
  const labels = {'Разработка ПО':'Код и Git', 'САПР и конструирование':'САПР и КБ', 'Инструменты и симуляторы':'Симуляторы', 'Онлайн-измерения':'Измерения онлайн', 'Научные базы и справочники':'Библиотеки', 'Стандарты и метрология':'Стандарты', 'Обучение и курсы':'Курсы', 'Дружественные каналы':'Каналы', 'Чаты в Telegram':'Чаты'};
  const journalTopics = ['Машиностроение и САПР','Автоматизация и электроника','Материалы, контроль и измерения','Энергетика, строительство и транспорт','Пищевая и лёгкая промышленность','Наука и образование'];
  const htmlEsc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const normalize = value => String(value ?? '').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/\s+/g,' ').trim();
  const collator = typeof Intl !== 'undefined' && Intl.Collator ? new Intl.Collator('ru-RU', {numeric:true, sensitivity:'base'}) : {compare:(a,b) => String(a).localeCompare(String(b))};
  const index = items.map(item => ({item, terms:normalize([item.name,item.desc,item.type,item.topic || '',item.tags || ''].join(' '))}));
  const counts = new Map();
  items.forEach(item => counts.set(item.type, (counts.get(item.type) || 0) + 1));
  const types = [ALL,...order.filter(type => counts.has(type)),...[...counts.keys()].filter(type => !order.includes(type)).sort(collator.compare)];
  const buttons = new Map();
  let activeType = ALL, view = 'grid', limit = 4, searchTimer = null;
  const batchSize = () => activeType === ALL ? 4 : 24;
  const hostname = href => { try { return new URL(href).hostname.replace(/^www\./,''); } catch { return ''; } };
  const makeCard = item => {
    const href = String(item.link || '');
    if (!/^https?:\/\//i.test(href)) return '';
    return `<a class="eng-card eng-card--link resource-card" href="${htmlEsc(href)}" target="_blank" rel="noopener noreferrer">
      <div class="resource-type">${htmlEsc(item.topic || item.type || 'Ресурс')}</div>
      <h3 class="eng-title">${htmlEsc(item.name)}</h3>
      <p class="eng-desc">${htmlEsc(item.desc)}</p>
      <div class="resource-card-bottom"><span class="resource-host">${htmlEsc(hostname(href))}</span><span class="eng-resource-link">Открыть ↗</span></div>
    </a>`;
  };
  for (const type of types) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'eng-filter-btn resource-chip';
    button.innerHTML = `<span>${htmlEsc(labels[type] || type)}</span><span class="resource-chip-count" aria-hidden="true">${type === ALL ? items.length : counts.get(type) || 0}</span>`;
    button.title = type;
    button.setAttribute('aria-pressed', String(type === activeType));
    button.classList.toggle('active', type === activeType);
    button.addEventListener('click', () => { activeType = type; limit = batchSize(); update(); });
    filter.appendChild(button);
    buttons.set(type, button);
  }
  function update() {
    if (searchTimer !== null) { clearTimeout(searchTimer); searchTimer = null; }
    const query = normalize(search.value);
    const visible = index.filter(row => (activeType === ALL || row.item.type === activeType) && row.terms.includes(query)).map(row => row.item);
    visible.sort((a,b) => collator.compare(a.name,b.name) * (sort.value === 'za' ? -1 : 1));
    const groups = activeType === ALL ? types.slice(1) : [activeType];
    const byType = new Map();
    for (const item of visible) {
      if (!byType.has(item.type)) byType.set(item.type, []);
      byType.get(item.type).push(item);
    }
    const html = [];
    let rendered = 0, nextRendered = 0;
    for (const type of groups) {
      const candidates = byType.get(type) || [];
      if (!candidates.length) continue;
      // Дружественные каналы всегда выводятся полностью, без ограничения числа карточек.
      const shown = type === 'Дружественные каналы' ? candidates : candidates.slice(0, limit);
      rendered += shown.length;
      nextRendered += type === 'Дружественные каналы' ? candidates.length : Math.min(candidates.length, limit + batchSize());
      let cards = `<div class="resource-items">${shown.map(makeCard).join('')}</div>`;
      if (type === 'Журналы') {
        const topics = [...journalTopics, ...new Set(shown.map(x => x.topic || 'Без направления').filter(x => !journalTopics.includes(x)))];
        cards = topics.map(topic => {
          const subset = shown.filter(x => (x.topic || 'Без направления') === topic);
          return subset.length ? `<section class="resource-topic"><div class="resource-topic-header"><h3>${htmlEsc(topic)}</h3><span>${subset.length}</span></div><div class="resource-items">${subset.map(makeCard).join('')}</div></section>` : '';
        }).join('');
      }
      html.push(`<section class="resource-group" aria-label="${htmlEsc(type)}"><div class="resource-group-header"><h2>${htmlEsc(type)}</h2><span>${candidates.length}</span></div>${cards}</section>`);
    }
    grid.innerHTML = html.join('') || '<p class="eng-empty">Ничего не найдено. Измените запрос или сбросьте фильтры.</p>';
    grid.classList.toggle('resource-list-view', view === 'list');
    grid.dataset.ready = 'true';
    grid.dataset.rendered = String(rendered);
    grid.dataset.matches = String(visible.length);
    status.textContent = `Найдено: ${visible.length} из ${items.length} · Показано: ${rendered}` + (activeType === ALL ? '' : ` · ${activeType}`);
    more.hidden = rendered >= visible.length;
    if (!more.hidden) more.textContent = `Показать ещё ${nextRendered - rendered}`;
    reset.hidden = activeType === ALL && !query && sort.value === 'az' && view === 'grid' && limit === 4;
    for (const [type,button] of buttons) {
      const selected = type === activeType;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    viewGrid.setAttribute('aria-pressed', String(view === 'grid'));
    viewList.setAttribute('aria-pressed', String(view === 'list'));
  }
  search.addEventListener('input', () => {
    if (searchTimer !== null) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { searchTimer = null; limit = batchSize(); update(); }, 120);
  });
  search.addEventListener('keydown', e => { if (e.key === 'Escape' && search.value) { search.value = ''; limit = batchSize(); update(); } });
  sort.addEventListener('change', () => { limit = batchSize(); update(); });
  viewGrid.addEventListener('click', () => { view = 'grid'; update(); });
  viewList.addEventListener('click', () => { view = 'list'; update(); });
  more.addEventListener('click', () => { limit += batchSize(); update(); });
  reset.addEventListener('click', () => { activeType = ALL; search.value = ''; sort.value = 'az'; view = 'grid'; limit = 4; update(); });
  update();
});
