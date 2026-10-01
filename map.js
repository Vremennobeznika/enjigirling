document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('russiaMap');
    const districtInfo = document.getElementById('districtInfo');
    const resetBtn = document.getElementById('mapReset');

    if (!svg || !districtInfo) return;

    let viewMode = 'uni';
    let activeDistrict = null;

    function getDistrictById(id) {
        return federalDistricts.find(d => d.id === id);
    }

    // Иконка для статуса бюджета
    function budgetMark(v) {
        return /да/i.test(v) ? '●' : '○';
    }

    // Карточка вуза
    function renderUniversityCard(u) {
        return `
            <div class="map-uni-card">
                <h4 class="map-uni-name">${u.name}</h4>
                <p class="map-uni-city">${u.city} · <span class="map-uni-kind">Вуз</span></p>
                <span class="map-uni-profile">${u.profile}</span>
                <p class="map-uni-focus">${u.focus}</p>
                <div class="map-detail-list">
                    <div class="map-detail">
                        <span class="map-detail-label">Срок обучения</span>
                        <span class="map-detail-value">${u.duration}</span>
                    </div>
                    <div class="map-detail">
                        <span class="map-detail-label">Бюджетные места</span>
                        <span class="map-detail-value ${/да/i.test(u.budget) ? 'ok' : ''}">${budgetMark(u.budget)} ${u.budget}</span>
                    </div>
                    <div class="map-detail">
                        <span class="map-detail-label">Платное обучение</span>
                        <span class="map-detail-value">${u.cost}</span>
                    </div>
                    <div class="map-detail">
                        <span class="map-detail-label">Поступление</span>
                        <span class="map-detail-value">${u.admission}</span>
                    </div>
                    ${u.site ? `
                    <div class="map-detail">
                        <span class="map-detail-label">Сайт</span>
                        <span class="map-detail-value"><a class="map-uni-site" href="${u.site}" target="_blank" rel="noopener noreferrer">${u.site}</a></span>
                    </div>` : ''}
                </div>
            </div>
        `;
    }

    // Карточка техникума
    function renderCollegeCard(c) {
        return `
            <div class="map-uni-card">
                <h4 class="map-uni-name">${c.name}</h4>
                <p class="map-uni-city">${c.city} · <span class="map-uni-kind">Техникум / СПО</span></p>
                <span class="map-uni-profile">${c.profile}</span>
                <p class="map-uni-focus">${c.focus}</p>
                <div class="map-detail-list">
                    <div class="map-detail">
                        <span class="map-detail-label">Срок обучения</span>
                        <span class="map-detail-value">${c.duration}</span>
                    </div>
                    <div class="map-detail">
                        <span class="map-detail-label">Бюджетные места</span>
                        <span class="map-detail-value ok">● Да, в основном бесплатно</span>
                    </div>
                    <div class="map-detail">
                        <span class="map-detail-label">Что после техникума</span>
                        <span class="map-detail-value">${c.afterCollege}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderList(district) {
        if (!district) return '';
        if (viewMode === 'uni') {
            const data = district.universities || [];
            return data.map(renderUniversityCard).join('');
        }
        const data = district.colleges || [];
        return data.map(renderCollegeCard).join('');
    }

    // Пояснительная справка «что это вообще такое»
    function renderExplain(mode) {
        if (mode === 'college') {
            return `
                <div class="map-explain">
                    <h4 class="map-explain-title">Что такое техникум и зачем он нужен?</h4>
                    <p>Техникум и колледж — это среднее профессиональное образование (СПО). Туда можно поступить <strong>после 9 или 11 классов</strong> — без ЕГЭ, по конкурсу аттестата.</p>
                    <p>Учиться обычно <strong>от 2 г. 10 мес. до 3 г. 10 мес.</strong>. Большинство мест — <strong>бюджетные</strong>.</p>
                    <p><strong>Зачем:</strong> быстро получить рабочую специальность (сварщик, электромонтажник, механик, оператор станков) и сразу начать работать. После выпуска можно поступить в вуз <strong>без ЕГЭ</strong> — по внутренним экзаменам, часто сразу на сокращённую (ускоренную) программу.</p>
                </div>
            `;
        }
        return `
            <div class="map-explain">
                <h4 class="map-explain-title">Что такое вуз и как туда попасть?</h4>
                <p>Вуз (институт, университет, академия) даёт <strong>высшее образование</strong> по направлению бакалавриата (4 года) или специалитета (5–5.5 лет).</p>
                <p>Поступление — по результатам <strong>ЕГЭ</strong> (русский язык + математика + профильный предмет). Часть мест — <strong>бюджетные</strong> (бесплатно, по конкурсу баллов), остальное — платно.</p>
                <p><strong>Зачем:</strong> даёт инженерную квалификацию и широкий карьерный рост. После техникума можно поступать в вуз <strong>без ЕГЭ</strong>.</p>
            </div>
        `;
    }

    function renderDistrictPanel() {
        if (!activeDistrict) {
            districtInfo.innerHTML = `
                <div class="map-toggle">
                    <button class="eng-filter-btn ${viewMode === 'uni' ? 'active' : ''}" data-mode="uni">Вузы</button>
                    <button class="eng-filter-btn ${viewMode === 'college' ? 'active' : ''}" data-mode="college">Техникумы / СПО</button>
                </div>
                ${renderExplain(viewMode)}
                <div class="map-placeholder">
                    <p class="map-placeholder-title">Выберите федеральный округ на карте</p>
                    <p class="map-placeholder-text">Кликните по контуру региона, чтобы увидеть вузы и техникумы с подробностями.</p>
                </div>
            `;
            bindToggle();
            return;
        }

        const total = viewMode === 'uni'
            ? (activeDistrict.universities || []).length
            : (activeDistrict.colleges || []).length;
        const label = viewMode === 'uni' ? 'вузов' : 'техникумов / СПО';

        districtInfo.innerHTML = `
            <div class="map-toggle">
                <button class="eng-filter-btn ${viewMode === 'uni' ? 'active' : ''}" data-mode="uni">Вузы</button>
                <button class="eng-filter-btn ${viewMode === 'college' ? 'active' : ''}" data-mode="college">Техникумы / СПО</button>
            </div>
            ${renderExplain(viewMode)}
            <div class="map-panel-head">
                <h3 class="eng-title">${activeDistrict.name}</h3>
                <span class="map-count">${total} ${label}</span>
            </div>
            <div class="map-uni-list">
                ${renderList(activeDistrict)}
            </div>
        `;
        bindToggle();
    }

    function bindToggle() {
        districtInfo.querySelectorAll('.map-toggle .eng-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                viewMode = btn.getAttribute('data-mode');
                renderDistrictPanel();
            });
        });
    }

    // Построение карты из данных
    svg.querySelectorAll('.eng-district').forEach(pathEl => {
        const id = pathEl.getAttribute('data-id');
        const district = getDistrictById(id);
        if (!district) return;

        pathEl.setAttribute('d', district.path);
        pathEl.classList.add('eng-district--ready');

        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        marker.setAttribute('class', 'eng-marker');
        marker.setAttribute('cx', district.marker[0]);
        marker.setAttribute('cy', district.marker[1]);
        marker.setAttribute('r', '6');
        marker.setAttribute('data-id', id);
        svg.appendChild(marker);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'eng-district-label');
        label.setAttribute('x', district.marker[0]);
        label.setAttribute('y', district.marker[1] - 12);
        label.textContent = district.short;
        svg.appendChild(label);

        const activate = () => {
            svg.querySelectorAll('.eng-district').forEach(p => p.classList.remove('active'));
            svg.querySelectorAll('.eng-marker').forEach(m => m.classList.remove('active'));
            pathEl.classList.add('active');
            marker.classList.add('active');
            activeDistrict = district;
            renderDistrictPanel();
        };
        pathEl.addEventListener('click', activate);
        marker.addEventListener('click', activate);
        pathEl.addEventListener('mouseenter', () => pathEl.classList.add('hover'));
        pathEl.addEventListener('mouseleave', () => pathEl.classList.remove('hover'));
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            svg.querySelectorAll('.eng-district').forEach(p => p.classList.remove('active'));
            svg.querySelectorAll('.eng-marker').forEach(m => m.classList.remove('active'));
            activeDistrict = null;
            renderDistrictPanel();
        });
    }

    renderDistrictPanel();
});