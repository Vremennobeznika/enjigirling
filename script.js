const PROFESSION_CATEGORIES = {
  "civil-engineer": "Строительство и инфраструктура",
  "architect-engineer": "Строительство и инфраструктура",
  "road-engineer": "Строительство и инфраструктура",
  "mechanical-engineer": "Машиностроение и транспорт",
  "automotive-engineer": "Машиностроение и транспорт",
  "railway-engineer": "Машиностроение и транспорт",
  "shipbuilding-engineer": "Машиностроение и транспорт",
  "power-engineer": "Энергетика",
  "electrical-engineer": "Энергетика",
  "nuclear-engineer": "Энергетика",
  "aerospace-engineer": "Авиация и космос",
  "space-engineer": "Авиация и космос",
  "chemical-engineer": "Химия и нефтегаз",
  "oil-gas-engineer": "Химия и нефтегаз",
  "metallurgical-engineer": "Металлургия и добыча",
  "mining-engineer": "Металлургия и добыча",
  "materials-engineer": "Материалы и технологии",
  "environmental-engineer": "Экология и природные системы",
  "water-engineer": "Экология и природные системы",
  "forest-engineer": "Экология и природные системы",
  "biomedical-engineer": "Биомедицина",
  "robotics-engineer": "Автоматизация и робототехника",
  "asu-tp-designer": "АСУ ТП",
  "asu-tp-programmer": "АСУ ТП",
  "asu-tp-commissioning": "АСУ ТП",
  "lighting-engineer": "Электротехника и светотехника",
  "food-engineer": "Промышленное производство",
  "textile-engineer": "Промышленное производство",
  "polygraph-engineer": "Промышленное производство",
  "telecom-engineer": "Связь и электроника",
  "embedded-engineer": "Связь и электроника",
  "military-engineer": "Безопасность и ГО",
  "civil-defense-engineer": "Безопасность и ГО",
  "geodetic-engineer": "Геодезия и картография",
  "astronomer-engineer": "Наука и техническая экспертиза",
  "restoration-engineer": "Наука и техническая экспертиза",
  "standardization-engineer": "Наука и техническая экспертиза",
  "patent-engineer": "Наука и техническая экспертиза",
  "data-engineer": "IT и данные",
  "devops-engineer": "IT и данные",
  "ml-engineer": "IT и данные",
  "security-engineer": "IT и данные",
  "cloud-engineer": "IT и данные",
  "frontend-engineer": "IT и данные",
  "backend-engineer": "IT и данные",
  "qa-engineer": "IT и данные",
  "mobile-engineer": "IT и данные"
};

const REGION_NAMES = {
  central: "ЦФО",
  northwest: "СЗФО",
  south: "ЮФО",
  northcaucasus: "СКФО",
  volga: "ПФО",
  ural: "УФО",
  siberia: "СФО",
  fareast: "ДФО"
};

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function valueOrDash(value) {
  return value ? escapeHTML(value) : "—";
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("professionsGrid");
  const categoriesEl = document.getElementById("categories");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  const searchInput = document.getElementById("professionSearch");
  const sortSelect = document.getElementById("professionSort");
  const asuSubcategories = document.getElementById("asuSubcategories");

  if (!grid || !categoriesEl || !modalOverlay || !modalContent) return;

  let activeCategory = "Все";
  let activeAsu = "Все";
  let searchQuery = "";
  let sortMode = "default";

  const getCategory = (profession) => PROFESSION_CATEGORIES[profession.id] || "Прочее";

  function getCategories() {
    return [...new Set(professionsData.map(getCategory))].sort((a, b) => a.localeCompare(b, "ru"));
  }

  function renderFilters() {
    categoriesEl.innerHTML = "";
    ["Все", ...getCategories()].forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `eng-filter-btn${category === activeCategory ? " active" : ""}`;
      button.textContent = category;
      button.addEventListener("click", () => {
        activeCategory = category;
        activeAsu = "Все";
        renderFilters();
        renderAsuSubfilters();
        renderGrid();
      });
      categoriesEl.appendChild(button);
    });
  }

  function buildCard(profession) {
    const card = document.createElement("article");
    card.className = "eng-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Открыть профессию: ${profession.title}`);

    card.innerHTML = `
      <h3 class="eng-title">${escapeHTML(profession.title)}</h3>
    `;

    const open = () => openModal(profession);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });

    return card;
  }

  function renderAsuSubfilters() {
    if (!asuSubcategories) return;
    const visible = activeCategory === "АСУ ТП";
    asuSubcategories.hidden = !visible;
    asuSubcategories.innerHTML = "";
    if (!visible) return;
    const options = [
      ["Все", "Все"],
      ["asu-tp-designer", "Проектировщик АСУ ТП"],
      ["asu-tp-programmer", "Программист АСУ ТП"],
      ["asu-tp-commissioning", "Пуско-наладчик АСУ ТП"]
    ];
    options.forEach(([id, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `eng-filter-btn${activeAsu === id ? " active" : ""}`;
      button.textContent = label;
      button.addEventListener("click", () => { activeAsu = id; renderAsuSubfilters(); renderGrid(); });
      asuSubcategories.appendChild(button);
    });
  }

  function renderGrid() {
    let items = activeCategory === "Все" ? professionsData.slice() : professionsData.filter((profession) => getCategory(profession) === activeCategory);
    if (activeCategory === "АСУ ТП" && activeAsu !== "Все") items = items.filter((profession) => profession.id === activeAsu);
    if (searchQuery) {
      const q = searchQuery.toLocaleLowerCase("ru-RU");
      items = items.filter((profession) => [profession.title, profession.shortDesc, getCategory(profession)].some(v => String(v || "").toLocaleLowerCase("ru-RU").includes(q)));
    }
    if (sortMode === "az") items.sort((a,b) => a.title.localeCompare(b.title, "ru"));
    if (sortMode === "za") items.sort((a,b) => b.title.localeCompare(a.title, "ru"));
    grid.innerHTML = "";
    if (!items.length) { grid.innerHTML = '<p class="profession-empty">Ничего не найдено.</p>'; return; }
    items.forEach((profession) => grid.appendChild(buildCard(profession)));
  }

  function renderRegions(regions) {
    if (!regions) return "";
    const rows = Object.entries(REGION_NAMES)
      .filter(([key]) => regions[key])
      .map(([key, name]) => `<div class="region-row"><span>${name}</span><strong>${escapeHTML(regions[key])}</strong></div>`)
      .join("");
    return rows ? `<div class="region-list">${rows}</div>` : "";
  }

  function renderTypicalDay(day) {
    if (!day) return "";
    const labels = { morning: "Утро", midday: "День", afternoon: "Обед", evening: "Вторая половина дня" };
    const rows = Object.entries(labels)
      .filter(([key]) => day[key])
      .map(([key, label]) => `<div class="day-row"><span>${label}</span><strong>${escapeHTML(day[key])}</strong></div>`)
      .join("");
    return rows ? `<div class="day-list">${rows}</div>` : "";
  }

  function openModal(profession) {
    const stats = profession.stats || {};
    const education = profession.education || {};
    const salary = profession.salary || {};
    const growth = profession.careerGrowth || [];

    modalContent.innerHTML = `
      <div class="modal-header">
        <div>
          <div class="modal-category">${escapeHTML(getCategory(profession))}</div>
          <h2>${escapeHTML(profession.title)}</h2>
        </div>
      </div>

      <section class="profession-section profession-intro">
        <h3>Чем занимается</h3>
        <p>${valueOrDash(profession.shortDesc)}</p>
      </section>

      <section class="profession-section">
        <h3>Профиль профессии</h3>
        <div class="info-grid">
          ${stats.specialists ? `<div class="info-item"><span>Специалистов</span><strong>${Number(stats.specialists).toLocaleString("ru-RU")}</strong></div>` : ""}
          ${stats.avgAge ? `<div class="info-item"><span>Средний возраст</span><strong>${escapeHTML(stats.avgAge)} лет</strong></div>` : ""}
          ${stats.genderRatio ? `<div class="info-item"><span>Соотношение</span><strong>${escapeHTML(stats.genderRatio)}</strong></div>` : ""}
        </div>
      </section>

      <section class="profession-section">
        <h3>Образование и подготовка</h3>
        ${education.duration ? `<p><strong>Срок обучения:</strong> ${escapeHTML(education.duration)}</p>` : ""}
        ${education.requirements ? `<p><strong>База:</strong> ${escapeHTML(education.requirements)}</p>` : ""}
        ${education.courses?.length ? `<p class="sub-label">Инструменты и направления</p><div class="tag-list">${education.courses.map((course) => `<span>${escapeHTML(course)}</span>`).join("")}</div>` : ""}
      </section>

      <section class="profession-section">
        <h3>Зарплата</h3>
        <div class="salary-grid">
          ${salary.start ? `<div><span>Старт</span><strong>${escapeHTML(salary.start)}</strong></div>` : ""}
          ${salary.median ? `<div><span>Медиана</span><strong>${escapeHTML(salary.median)}</strong></div>` : ""}
          ${salary.peak ? `<div><span>Верхний уровень</span><strong>${escapeHTML(salary.peak)}</strong></div>` : ""}
        </div>
        ${salary.regions ? `<p class="sub-label">По регионам</p>${renderRegions(salary.regions)}` : ""}
      </section>

      ${growth.length ? `
        <section class="profession-section">
          <h3>Карьерный путь</h3>
          <div class="career-list">
            ${growth.map((step, index) => `
              <div class="career-row">
                <span class="career-number">${index + 1}</span>
                <div><strong>${escapeHTML(step.title)}</strong><small>${escapeHTML(step.period)}</small></div>
                <b>${escapeHTML(step.salary)}</b>
              </div>
            `).join("")}
          </div>
        </section>` : ""}

      ${profession.typicalDay ? `
        <section class="profession-section">
          <h3>Типичный рабочий день</h3>
          ${renderTypicalDay(profession.typicalDay)}
        </section>` : ""}

      ${(profession.easy || profession.hard) ? `
        <section class="profession-section pros-cons">
          ${profession.easy ? `<div><h3>Что в работе нравится</h3><p>${escapeHTML(profession.easy)}</p></div>` : ""}
          ${profession.hard ? `<div><h3>Сложности</h3><p>${escapeHTML(profession.hard)}</p></div>` : ""}
        </section>` : ""}
    `;

    modalOverlay.classList.add("active");
    document.body.classList.add("modal-open");
    modalClose?.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  modalClose?.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay.classList.contains("active")) closeModal();
  });

  if (searchInput) searchInput.addEventListener("input", () => { searchQuery = searchInput.value.trim(); renderGrid(); });
  if (sortSelect) sortSelect.addEventListener("change", () => { sortMode = sortSelect.value; renderGrid(); });

  renderFilters();
  renderAsuSubfilters();
  renderGrid();
});
