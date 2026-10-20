// Каталог профессий: разделы, поиск, сортировка и карточка с подробностями.
// Сами профессии лежат в data.js (window.professionsData).

// ─── Разделы ────────────────────────────────────────────────────────────────
// Название раздела → id его профессий.
// Чтобы переместить профессию в другой раздел, перенесите её id в другой список.
const CATEGORY_PROFESSIONS = {
  "Строительство и инфраструктура": ["civil-engineer", "pgs-designer", "architect-engineer", "road-engineer", "road-designer"],
  "Машиностроение и транспорт": ["mechanical-engineer", "automotive-engineer", "railway-engineer", "shipbuilding-engineer"],
  "Энергетика": ["power-engineer", "electrical-engineer", "electrical-designer", "nuclear-engineer"],
  "Авиация и космос": ["aerospace-engineer", "space-engineer"],
  "Химия и нефтегаз": ["chemical-engineer", "oil-gas-engineer"],
  "Металлургия и добыча": ["metallurgical-engineer", "mining-engineer"],
  "Материалы и технологии": ["materials-engineer"],
  "Экология и природные системы": ["environmental-engineer", "water-engineer", "forest-engineer"],
  "Биомедицина": ["biomedical-engineer"],
  "Автоматизация и робототехника": ["robotics-engineer"],
  "АСУ ТП": ["asu-tp-designer", "asu-tp-programmer", "asu-tp-commissioning", "kipia-engineer"],
  "Электротехника и светотехника": ["lighting-engineer"],
  "Промышленное производство": ["food-engineer", "textile-engineer", "polygraph-engineer"],
  "Связь и электроника": ["telecom-engineer", "embedded-engineer"],
  "Безопасность и ГО": ["military-engineer", "civil-defense-engineer"],
  "Геодезия и картография": ["geodetic-engineer"],
  "Наука и техническая экспертиза": ["astronomer-engineer", "restoration-engineer", "standardization-engineer", "patent-engineer"],
  "IT и данные": ["data-engineer", "devops-engineer", "ml-engineer", "security-engineer", "cloud-engineer", "frontend-engineer", "backend-engineer", "qa-engineer", "mobile-engineer"]
};

// У этого раздела под основными кнопками есть вторая строка: по кнопке на каждую профессию.
const SUBFILTER_CATEGORY = "АСУ ТП";
const ALL = "Все";

// id профессии → название раздела
const categoryById = Object.fromEntries(
  Object.entries(CATEGORY_PROFESSIONS).flatMap(([category, ids]) => ids.map((id) => [id, category]))
);

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

const DAY_LABELS = { morning: "Утро", midday: "День", afternoon: "Обед", evening: "Вторая половина дня" };

// ─── Вспомогательное ────────────────────────────────────────────────────────
const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

const valueOrDash = (value) => (value ? escapeHTML(value) : "—");

// Склонение по числу: plural(42, ["год", "года", "лет"]) → «года»
function plural(number, [one, few, many]) {
  const last = number % 10, lastTwo = number % 100;
  if (last === 1 && lastTwo !== 11) return one;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
}

// ─── Разметка карточки профессии ────────────────────────────────────────────
// Блок показывается, только если в нём есть что показать.
const section = (title, body, extraClass = "") =>
  body ? `<section class="profession-section${extraClass}"><h3>${title}</h3>${body}</section>` : "";

// «Подпись + значение»; className нужен только для сетки «Профиль профессии».
const labeled = (label, value, className = "") =>
  `<div${className ? ` class="${className}"` : ""}><span>${label}</span><strong>${value}</strong></div>`;

// Список строк «подпись — значение» (регионы, типичный день)
function renderRows(listClass, rowClass, labels, values) {
  const rows = Object.entries(labels)
    .filter(([key]) => values[key])
    .map(([key, label]) => `<div class="${rowClass}"><span>${label}</span><strong>${escapeHTML(values[key])}</strong></div>`)
    .join("");
  return rows ? `<div class="${listClass}">${rows}</div>` : "";
}

function renderProfile({ specialists, avgAge, genderRatio } = {}) {
  const items = [
    specialists && labeled("Специалистов", Number(specialists).toLocaleString("ru-RU"), "info-item"),
    avgAge && labeled("Средний возраст", `${escapeHTML(avgAge)} ${plural(Number(avgAge), ["год", "года", "лет"])}`, "info-item"),
    genderRatio && labeled("Соотношение", escapeHTML(genderRatio), "info-item")
  ].filter(Boolean).join("");
  return items && `<div class="info-grid">${items}</div>`;
}

function renderEducation({ duration, requirements, courses } = {}) {
  const tags = courses?.length ? courses.map((course) => `<span>${escapeHTML(course)}</span>`).join("") : "";
  return [
    duration && `<p><strong>Продолжительность программы (ориентир, не требование к должности):</strong> ${escapeHTML(duration)}</p>`,
    requirements && `<p><strong>Рекомендуемые знания (не юридическое требование):</strong> ${escapeHTML(requirements)}</p>`,
    tags && `<p class="sub-label">Инструменты и направления</p><div class="tag-list">${tags}</div>`
  ].filter(Boolean).join("");
}

function renderSalary({ start, median, peak, regions } = {}) {
  const grid = [["Старт", start], ["Медиана", median], ["Верхний уровень", peak]]
    .filter(([, value]) => value)
    .map(([label, value]) => labeled(label, escapeHTML(value)))
    .join("");
  const regionRows = regions ? renderRows("region-list", "region-row", REGION_NAMES, regions) : "";
  return `<div class="salary-grid">${grid}</div>` + (regionRows ? `<p class="sub-label">По регионам</p>${regionRows}` : "");
}

function renderCareer(steps = []) {
  const rows = steps.map((step, index) => `
    <div class="career-row">
      <span class="career-number">${index + 1}</span>
      <div><strong>${escapeHTML(step.title)}</strong><small>Последовательность условная; сроки зависят от работодателя и квалификации</small></div>
      <b class="career-unverified">Зарплата не подтверждена</b>
    </div>`).join("");
  return rows && `<div class="career-list">${rows}</div>`;
}

function renderProsCons({ easy, hard }) {
  const parts = [
    easy && `<div><h3>Что в работе нравится</h3><p>${escapeHTML(easy)}</p></div>`,
    hard && `<div><h3>Сложности</h3><p>${escapeHTML(hard)}</p></div>`
  ].filter(Boolean).join("");
  return parts && `<section class="profession-section pros-cons">${parts}</section>`;
}

function renderVerifiedSalarySource(profession) {
  const entry = (window.salarySourceAudit || []).find(item => item.id === profession.id && item.status === 'source_snapshot');
  if (!entry) return '<p class="data-quality-note">Подтверждённой зарплатной оценки для этой профессии пока нет. Непроверенные цифры скрыты.</p>';
  if (entry.validationStatus === 'adjacent_occupation_checked') return `<p class="data-quality-note">Для этой профессии точная зарплата не подтверждена. Найден источник по смежной должности «${escapeHTML(entry.sourceTitle)}», но его цифры не переносим на профессию каталога. <a href="${escapeHTML(entry.sourceUrl)}" target="_blank" rel="noopener noreferrer">Смежный источник</a>.</p>`;
  const fmt = value => Number(value).toLocaleString('ru-RU');
  return `<p class="data-quality-note"><strong>Опубликованный ориентир:</strong> ${entry.rangeMinRub === entry.rangeMaxRub ? `от ${fmt(entry.rangeMinRub)}` : `${fmt(entry.rangeMinRub)}–${fmt(entry.rangeMaxRub)}`} ₽/мес., ${escapeHTML(entry.region)}, ${escapeHTML(entry.checkedAt)}. ${escapeHTML(entry.metric)}. Статус сверки: ${entry.validationStatus === "source_linked_not_independently_verified" ? "ссылка добавлена, первоисточник ещё не перепроверен" : entry.validationStatus === "adjacent_occupation_checked" ? "источник проверен, профессия не совпадает" : "страница источника проверена"}. Тип данных: ${entry.evidenceLevel === "aggregate_or_range" ? "агрегированный диапазон / данные вакансий" : entry.evidenceLevel === "single_observation" ? "отдельная вакансия или оклад" : "смежная профессия либо слабая методика"}. Профессия в источнике: ${escapeHTML(entry.sourceTitle)}. <a href="${escapeHTML(entry.sourceUrl)}" target="_blank" rel="noopener noreferrer">Открыть источник зарплаты</a>. Другие зарплатные значения и региональные медианы не подтверждены и не отображаются.</p>`;
}

// Editorial guide derived from existing profession descriptions; not a claim about a specific employer.
function renderSourceMethodology(profession) {
  const item = (window.salarySourceAudit || []).find(x => x.id === profession.id);
  if (!item) return '<p>Проверяемый источник для этой профессии пока не указан.</p>';
  const evidence = {
    aggregate_or_range: 'Агрегированный диапазон или статистика с ограничениями выборки',
    single_observation: 'Одна опубликованная вакансия; не средняя зарплата рынка',
    adjacent_or_weak: 'Смежная должность или слабое соответствие; сумма не подтверждает зарплату данной профессии',
    needs_manual_review: 'Требуется дополнительная проверка'
  };
  const kind = evidence[item.evidenceLevel] || 'Тип данных не определён';
  const verified = item.validationStatus === 'source_page_checked' || item.validationStatus === 'employer_vacancy_checked';
  return '<p><strong>Тип свидетельства:</strong> ' + escapeHTML(kind) + '</p>' +
    '<p><strong>Проверка:</strong> ' + (verified ? 'Отмечена сверка страницы источника; репрезентативность и соответствие профессии оцениваются отдельно' : 'Полного подтверждения нет') + '</p>' +
    (item.checkedAt ? '<p><strong>Дата записи:</strong> ' + escapeHTML(item.checkedAt) + '</p>' : '') +
    (item.notes ? '<p>' + escapeHTML(item.notes) + '</p>' : '') +
    (item.sourceUrl ? '<p><a href="' + escapeHTML(item.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Открыть первоисточник ↗</a></p>' : '');
}

// The legacy "courses" field mixes software, methods and training topics.
// Conservative classification: ambiguous entries remain topics, never invented software.
function classifyLearningItems(items = []) {
  const software = /\\b(?:AutoCAD|Revit|SketchUp|3ds Max|ЛИРА-САПР|SCAD|КОМПАС|SolidWorks|CATIA|ANSYS|MATLAB|Simulink|Python|SQL|JavaScript|TypeScript|Java|Kotlin|Swift|C\\+\\+|Git|Docker|Kubernetes|Linux|Excel|1C|1С|ETAP|EPLAN|TIA Portal|WinCC|Codesys|AutoCAD Electrical|Civil 3D|ArcGIS|QGIS|Blender|Figma|React|Node\\.js|PostgreSQL|TensorFlow|PyTorch|NX|Creo|Inventor|Abaqus|LabVIEW|Altium|KiCad)\\b/i;
  const tools = [], topics = [];
  for (const item of items) (software.test(item) ? tools : topics).push(item);
  return { tools, topics };
}

// Reference directories are discovery aids, not proof that a standard applies to a given job.
const PROFESSIONAL_REFERENCE_DIRECTORIES = [
  { label: "Реестр профстандартов ВНИИ труда", url: "https://vcot.info/standards" },
  { label: "Разъяснения Минтруда о применении профстандартов", url: "https://mintrud.gov.ru/ministry/programms/22/3" },
  { label: "Профстандарты — ВНИИ труда", url: "https://nii-truda.ru/standards" }
];
const VERIFIED_PROFESSION_DOCUMENTS = {
  "standardization-engineer": [{
    label: "Профстандарт «Специалист по стандартизации» — приказ Минтруда № 346н от 27.04.2023",
    url: "https://mintrud.gov.ru/docs/mintrud/orders/2673",
    note: "Официальная публикация приказа. Соответствие конкретной должности и актуальность редакции требуют проверки."
  }]
};
function renderNormativeReferences(profession) {
  const docs = VERIFIED_PROFESSION_DOCUMENTS[profession.id] || [];
  const links = docs.map(x => '<li><a href="' + escapeHTML(x.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(x.label) + '</a><p>' + escapeHTML(x.note) + '</p></li>').join("");
  const directories = PROFESSIONAL_REFERENCE_DIRECTORIES.map(x => '<li><a href="' + escapeHTML(x.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(x.label) + '</a></li>').join("");
  return (docs.length ? '<p>Документы, найденные для этого направления:</p><ul>' + links + '</ul>' :
    '<p class="data-quality-note">Привязка конкретных нормативных документов к этой профессии ещё не проверена.</p>') +
    '<p>Реестры для поиска и проверки редакций:</p><ul>' + directories + '</ul>' +
    '<p class="data-quality-note">Наличие документа в реестре не означает, что он обязателен для каждой должности. Проверяйте статус, область применения и редакцию.</p>';
}

function renderPracticalGuide(profession) {
  const requirements = profession.education?.requirements;
  const tools = profession.education?.courses || [];
  const tasks = (profession.shortDesc || "").split(/[.;]/).map(x => x.trim()).filter(Boolean);
  const parts = [];
  if (tasks.length) parts.push('<h3>Основные задачи</h3><p>' + escapeHTML(tasks.join(". ")) + '</p>');
  if (requirements) parts.push('<h3>Что изучать</h3><p>' + escapeHTML(requirements) + '</p>');
  const classified = classifyLearningItems(tools);
  if (classified.tools.length) parts.push('<h3>Программные инструменты (ориентир)</h3><div class="tag-list">' + classified.tools.map(x => '<span>' + escapeHTML(x) + '</span>').join("") + '</div>');
  if (classified.topics.length) parts.push('<h3>Методы, дисциплины и темы обучения</h3><div class="tag-list">' + classified.topics.map(x => '<span>' + escapeHTML(x) + '</span>').join("") + '</div>');
  if (!parts.length) return "";
  return '<p class="data-quality-note">Редакционная памятка по материалам каталога. Перечень не является исчерпывающим стандартом квалификации или требованием конкретного работодателя.</p>' + parts.join("");
}

function renderRelatedProfessions(profession, category) {
  const related = (window.professionsData || []).filter(item => item.id !== profession.id && categoryById[item.id] === category).slice(0, 5);
  if (!related.length) return "";
  return '<div class="related-professions">' + related.map(item =>
    '<button type="button" class="related-profession-link" data-related-id="' + escapeHTML(item.id) + '">' + escapeHTML(item.title) + '</button>'
  ).join("") + '</div>';
}

function renderProfession(profession, category) {
  return `
    <div class="modal-header">
      <div>
        <div class="modal-category">${escapeHTML(category)}</div>
        <h2 id="modalTitle">${escapeHTML(profession.title)}</h2>
      </div>
    </div>
    ${section("Чем занимается", `<p>${valueOrDash(profession.shortDesc)}</p>`, " profession-intro")}
    <p class="data-quality-note">Численность специалистов, средний возраст и гендерное распределение не публикуются без проверяемых статистических источников.</p>
    ${section("Практика: задачи, знания и инструменты", renderPracticalGuide(profession))}
    ${section("Нормативные документы и профессиональные стандарты", renderNormativeReferences(profession))}
    ${section("Образование и подготовка (ориентир)", renderEducation(profession.education))}
    ${section("Зарплата", renderVerifiedSalarySource(profession))}
    ${section("Источники и ограничения данных", renderSourceMethodology(profession))}
    ${section("Возможные карьерные роли (без фиксированных сроков)", renderCareer(profession.careerGrowth))}
    ${section("Пример рабочего дня (иллюстрация, график зависит от работодателя)", profession.typicalDay ? renderRows("day-list", "day-row", DAY_LABELS, profession.typicalDay) : "")}
    ${renderProsCons(profession)}
    ${section("Другие профессии направления", renderRelatedProfessions(profession, category))}`;
}

// ─── Страница ───────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("professionsGrid");
  const categoriesEl = document.getElementById("categories");
  const subfiltersEl = document.getElementById("asuSubcategories");
  const searchInput = document.getElementById("professionSearch");
  const sortSelect = document.getElementById("professionSort");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");

  let modalTrigger = null;
  let activeCategory = ALL;
  let activeProfessionId = ALL; // выбранная кнопка во второй строке (только для «АСУ ТП»)
  let searchQuery = "";
  let sortMode = "default";

  const getCategory = (profession) => categoryById[profession.id] || "Прочее";

  function createFilterButton(label, isActive, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "eng-filter-btn" + (isActive ? " active" : "");
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  // Основные кнопки: «Все» и разделы по алфавиту
  function renderFilters() {
    const names = [...new Set(professionsData.map(getCategory))].sort((a, b) => a.localeCompare(b, "ru"));
    categoriesEl.replaceChildren(...[ALL, ...names].map((name) =>
      createFilterButton(name, name === activeCategory, () => {
        activeCategory = name;
        activeProfessionId = ALL;
        renderFilters();
        renderSubfilters();
        renderGrid();
      })
    ));
  }

  // Вторая строка кнопок: «Все» и каждая профессия раздела «АСУ ТП»
  function renderSubfilters() {
    const visible = activeCategory === SUBFILTER_CATEGORY;
    subfiltersEl.hidden = !visible;
    const options = visible
      ? [{ id: ALL, title: ALL }, ...professionsData.filter((profession) => getCategory(profession) === SUBFILTER_CATEGORY)]
      : [];
    subfiltersEl.replaceChildren(...options.map(({ id, title }) =>
      createFilterButton(title, id === activeProfessionId, () => {
        activeProfessionId = id;
        renderSubfilters();
        renderGrid();
      })
    ));
  }

  // Профессии с учётом раздела, подраздела, поиска и сортировки
  function getVisibleProfessions() {
    let items = professionsData.filter((profession) => activeCategory === ALL || getCategory(profession) === activeCategory);
    if (activeCategory === SUBFILTER_CATEGORY && activeProfessionId !== ALL) {
      items = items.filter((profession) => profession.id === activeProfessionId);
    }
    if (searchQuery) {
      const query = searchQuery.toLocaleLowerCase("ru-RU");
      items = items.filter((profession) =>
        [profession.title, profession.shortDesc, getCategory(profession)]
          .some((text) => String(text || "").toLocaleLowerCase("ru-RU").includes(query)));
    }
    if (sortMode === "az") items.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    if (sortMode === "za") items.sort((a, b) => b.title.localeCompare(a.title, "ru"));
    return items;
  }

  function buildCard(profession) {
    const card = document.createElement("article");
    card.className = "eng-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Открыть профессию: ${profession.title}`);

    const title = document.createElement("h3");
    title.className = "eng-title";
    title.textContent = profession.title;
    card.append(title);
    const desc = document.createElement("p");
    desc.className = "eng-card-summary";
    desc.textContent = profession.shortDesc || "";
    if (desc.textContent) card.append(desc);
    const meta = document.createElement("div");
    meta.className = "eng-card-meta";
    meta.textContent = getCategory(profession) + "  ↗";
    card.append(meta);

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

  function renderGrid() {
    const items = getVisibleProfessions();
    grid.replaceChildren(...items.map(buildCard));
    const count = document.getElementById("professionCount");
    if (count) count.textContent = `${items.length} из ${professionsData.length}`;
    if (!items.length) grid.innerHTML = '<p class="profession-empty">Ничего не найдено.</p>';
  }

  function setModalOpen(isOpen) {
    modalOverlay.classList.toggle("active", isOpen);
    modalOverlay.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);
  }

  function openModal(profession) {
    modalTrigger = document.activeElement;
    modalContent.innerHTML = renderProfession(profession, getCategory(profession));
    setModalOpen(true);
    modalClose.focus();
  }

  const closeModal = () => {
    setModalOpen(false);
    if (modalTrigger instanceof HTMLElement && modalTrigger.isConnected) modalTrigger.focus();
    modalTrigger = null;
  };

  modalContent.addEventListener("click", (event) => {
    const button = event.target.closest("[data-related-id]");
    if (!button) return;
    const related = professionsData.find(item => item.id === button.dataset.relatedId);
    if (!related) return;
    modalContent.innerHTML = renderProfession(related, getCategory(related));
    const modal = modalContent.closest(".modal");
    if (modal) modal.scrollTop = 0;
    modalClose.focus();
  });

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !modalOverlay.classList.contains("active")) return;
    const focusable = [...modalOverlay.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => el.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); modalClose.focus(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay.classList.contains("active")) closeModal();
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim();
    renderGrid();
  });
  sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;
    renderGrid();
  });

  renderFilters();
  renderSubfilters();
  renderGrid();
});
