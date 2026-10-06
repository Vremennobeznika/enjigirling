// Раздел «Ресурсы сообщества»: фильтр по типу и поиск.
// Данные лежат в resources-data.js (const resources).
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('resourcesGrid');
    const filter = document.getElementById('resourcesFilter');

    const ALL = 'Все';
    // Короткие подписи для кнопок фильтра; остальные типы показываются как есть
    const FILTER_LABELS = {
        'Дружественные каналы': 'Каналы',
        'Чаты в Telegram': 'Чаты',
        'Платформы для разработок': 'Платформы'
    };
    const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

    const types = [ALL, ...new Set(resources.map((item) => item.type).filter(Boolean))];
    let activeType = ALL;
    let query = '';

    filter.innerHTML = `
      <div class="resource-filter-row">
        <div class="resource-buttons" id="resourceTypeButtons"></div>
        <input class="resource-search" id="resourceSearch" type="search" placeholder="Поиск по ресурсам" autocomplete="off">
      </div>`;
    const buttons = document.getElementById('resourceTypeButtons');
    const search = document.getElementById('resourceSearch');

    function render() {
        const items = resources.filter((item) => {
            const text = [item.name, item.desc, item.type].join(' ').toLocaleLowerCase('ru-RU');
            return (activeType === ALL || item.type === activeType) && text.includes(query);
        });
        grid.innerHTML = items.length
            ? items.map((item) => `
          <a class="eng-card eng-card--link resource-card" href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer">
            <div class="resource-type">${escapeHTML(item.type || 'Ресурс')}</div>
            <h3 class="eng-title">${escapeHTML(item.name)}</h3>
            <p class="eng-desc">${escapeHTML(item.desc)}</p>
            <span class="eng-resource-link">Перейти →</span>
          </a>`).join('')
            : '<p class="eng-empty">Ничего не найдено.</p>';
    }

    types.forEach((type) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'eng-filter-btn' + (type === activeType ? ' active' : '');
        button.textContent = FILTER_LABELS[type] || type;
        button.addEventListener('click', () => {
            activeType = type;
            buttons.querySelectorAll('button').forEach((other) => other.classList.toggle('active', other === button));
            render();
        });
        buttons.appendChild(button);
    });

    search.addEventListener('input', () => {
        query = search.value.trim().toLocaleLowerCase('ru-RU');
        render();
    });

    render();
});
