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
  "Связь и электроника": ["telecom-engineer", "embedded-engineer", "circuit-design-engineer", "pcb-layout-engineer"],
  "Безопасность и ГО": ["military-engineer", "civil-defense-engineer"],
  "Геодезия и картография": ["geodetic-engineer"],
  "Наука и техническая экспертиза": ["astronomer-engineer", "restoration-engineer", "standardization-engineer", "patent-engineer", "metrology-engineer"],
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

function renderCareer(steps = []) {
  if (!steps.length) return "";
  return '<p class="data-quality-note">Возможные направления роста; порядок не обязателен.</p>' +
    '<div class="career-list">' + steps.map(step =>
      '<div class="career-row"><div><strong>' + escapeHTML(step.title) + '</strong></div></div>'
    ).join('') + '</div>';
}

function renderProsCons({ easy, hard }) {
  const parts = [
    easy && '<div><h3>Особенности</h3><p>' + escapeHTML(easy) + '</p></div>',
    hard && '<div><h3>Сложности</h3><p>' + escapeHTML(hard) + '</p></div>'
  ].filter(Boolean).join('');
  return parts ? '<section class="profession-section pros-cons"><h2 class="pros-cons-title">Условия и особенности работы</h2>' + parts + '</section>' : '';
}

function renderVerifiedSalarySource(profession) {
  const entry = (window.salarySourceAudit || []).find(item => item.id === profession.id);
  if (!entry || entry.status !== 'source_snapshot' ||
      !['source_page_checked', 'employer_vacancy_checked'].includes(entry.validationStatus)) {
    return '<p>Сопоставимого подтверждённого диапазона нет. Непроверенные цифры скрыты.</p>';
  }
  const fmt = value => Number(value).toLocaleString('ru-RU');
  const amount = entry.rangeMinRub === entry.rangeMaxRub
    ? 'одно значение ' + fmt(entry.rangeMinRub)
    : 'Опубликованный диапазон ' + fmt(entry.rangeMinRub) + '–' + fmt(entry.rangeMaxRub);
  const quality = entry.evidenceLevel === 'single_observation'
    ? 'одно наблюдение, не характеристика рынка'
    : 'ограниченная выборка источника, не средняя зарплата по профессии';
  return '<p><strong>' + amount + ' ₽/мес.</strong></p>' +
    '<p>' + escapeHTML(entry.metric) + '</p>' +
    '<p class="data-quality-note">' + escapeHTML(entry.region) + ' · запись от ' + escapeHTML(entry.checkedAt) +
      '. Данные источника, не гарантированная зарплата.</p>' +
    '<details class="salary-evidence"><summary>Источник и методика</summary>' +
      '<p><strong>Тип данных:</strong> ' + quality + '.</p>' +
      '<p>Публикация: ' + escapeHTML(entry.sourceTitle) + '.</p>' +
      '<p><a href="' + escapeHTML(entry.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Открыть источник ↗</a></p>' +
    '</details>';
}

// The legacy "courses" field mixes software, methods and training topics.
// Conservative classification: ambiguous entries remain topics, never invented software.
function classifyLearningItems(items = []) {
  const software = /\b(?:AutoCAD|Revit|SketchUp|3ds Max|ЛИРА-САПР|SCAD|SolidWorks|CATIA|ANSYS|RastrWin|MATLAB|Simulink|Python|SQL|JavaScript|TypeScript|Java|Kotlin|Swift|Git|Docker|Kubernetes|Linux|Excel|ETAP|EPLAN|TIA Portal|WinCC|Codesys|Civil 3D|ArcGIS|QGIS|Blender|Figma|React|PostgreSQL|TensorFlow|PyTorch|NX|Creo|Inventor|Abaqus|LabVIEW|Altium|KiCad|LTspice|Petrel|ROXAR|HYSYS|ChemCAD|MCNP|KORSAR|ADAMS|Adobe InDesign|Angular|AWS|Blast-CAD|CREDO|DIALux|IndorCAD|MineFrame|NedGraphics|OpenCV|Photoshop|Postman|Relux|ROS|Selenium|Spark|Spring|Thermo-Calc|Vue|Yandex Cloud|Zulu|nanoCAD)\b/i;
  const cyrillicSoftware = /(?:Гранд-Смета|Компас-3D|КОМПАС|1С)/i;
  const tools = [], topics = [];
  for (const item of items) ((software.test(item) || cyrillicSoftware.test(item)) ? tools : topics).push(item);
  return { tools, topics };
}

// Reference directories are discovery aids, not proof that a standard applies to a given job.
// Per-profession primary documents: published text and a distinct scoped applicability assessment.
// A relevant official standard does not establish a binding requirement for every job with a similar name.
const PROFESSIONAL_REFERENCE_DIRECTORIES = [
  {label:"Официальный реестр профстандартов",url:"https://vcot.info/standards"},
  {label:"Минтруд: как применять профстандарты",url:"https://mintrud.gov.ru/ministry/programms/22/3"}
];
function renderNormativeReferences(profession) {
  const audit = (window.careerNormativeAudit || {}).records || [];
  const record = audit.find(x => x.id === profession.id);
  const docs = record?.documents || [];
  const header = '<p class="data-quality-note"><strong>Статус нормативной проверки:</strong> '+
    (docs.length
      ? 'Официальные документы соотнесены с конкретными функциями; обязательность определяется законом, должностью и условиями работодателя.'
      : 'По слишком широкой группе профессий нельзя корректно назначить единый стандарт без конкретной трудовой функции; это не свидетельство отсутствия стандарта.')+'</p>';
  const review = record
    ? '<p><strong>Разбор профессии:</strong> '+escapeHTML(record.assessment)+'</p>'
    : '<p>Индивидуальная проверка нормативной применимости отсутствует.</p>';
  const rows = docs.map(doc => {
    const when = doc.periodStatus === 'not_yet_effective'
      ? '<strong>Ещё не действует</strong> (начало '+escapeHTML(doc.effectiveFrom)+')'
      : doc.periodStatus === 'publication_found_effective_date_requires_confirmation'
        ? 'Приказ официально опубликован; дата начала действия требует отдельной проверки.'
        : 'Действующий на дату ревизии документ (начало '+escapeHTML(doc.effectiveFrom)+')';
    const limits = doc.relationship === 'related_or_narrower_function'
      ? 'Частичная/смежная функция, без автоматического переноса на всю профессию.'
      : 'Соответствие функций оценивается для конкретной должности.';
    return '<li><a href="'+escapeHTML(doc.url)+'" target="_blank" rel="noopener noreferrer">'+
      escapeHTML(doc.name)+'</a><p>'+escapeHTML(doc.order)+'. '+when+'. '+limits+'</p></li>';
  }).join('');
  const details = rows
    ? '<p>Профессиональные стандарты и документы для сопоставления трудовых функций:</p><ul>'+rows+'</ul>'
    : '<p>Нужны конкретные трудовые обязанности и отрасль работы, чтобы выбрать нормативный документ; назначения по одному названию нет.</p>';
  const construction = record?.legalObligationStatus === 'conditional_statutory_construction_roles'
    ? '<p class="data-quality-note"><strong>Строительство:</strong> для отдельных специалистов по организации строительства и проектирования предусмотрены дополнительные условия по <a href="https://www.consultant.ru/document/cons_doc_LAW_51040/6da623a7da211d885c1eaccefb2ef34b26fc141a/" target="_blank" rel="noopener noreferrer">ст. 55.5-1 ГрК РФ</a>. Проверять должность, функции и применимость требований СРО.</p>'
    : '';
  const registry=PROFESSIONAL_REFERENCE_DIRECTORIES.map(x=>'<li><a href="'+escapeHTML(x.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(x.label)+'</a></li>').join('');
  return header+review+details+construction+
    '<p><strong>Реестр и разъяснения:</strong></p><ul>'+registry+'</ul>'+
    '<p class="data-quality-note"><strong>Обязательность:</strong> по <a href="https://www.consultant.ru/document/cons_doc_LAW_34683/e76d6076ad800a12efcec206f99ad6c59b58517e/" target="_blank" rel="noopener noreferrer">ст. 195.3 ТК РФ</a> квалификационные требования профстандарта обязательны в предусмотренной законом части. Похожее название должности само по себе не устанавливает обязательность. Даты и применимость нужно проверять на дату конкретного решения.</p>';
}

function renderPracticalGuide(profession) {
  const requirements = profession.education?.requirements;
  const items = classifyLearningItems(profession.education?.courses || []);
  return [
    requirements && '<p>' + escapeHTML(requirements) + '</p>',
    items.tools.length && '<h4>Программные инструменты</h4><div class="tag-list">' +
      items.tools.map(x => '<span>' + escapeHTML(x) + '</span>').join('') + '</div>',
    items.topics.length && '<h4>Методы, дисциплины и темы обучения</h4><div class="tag-list">' +
      items.topics.map(x => '<span>' + escapeHTML(x) + '</span>').join('') + '</div>'
  ].filter(Boolean).join('');
}

function renderRelatedProfessions(profession, category) {
  const related = (window.professionsData || []).filter(item => item.id !== profession.id && categoryById[item.id] === category).slice(0, 5);
  if (!related.length) return "";
  return '<div class="related-professions">' + related.map(item =>
    '<button type="button" class="related-profession-link" data-related-id="' + escapeHTML(item.id) + '">' + escapeHTML(item.title) + '</button>'
  ).join("") + '</div>';
}

function renderRelatedTechnology(profession) {
  // Heavy related catalogs are loaded on first card opening, not during initial page load.
  const processes = (window.engineeringProcesses || []).filter(x => x.profession === profession.id);
  if (!processes.length) return Array.isArray(window.engineeringProcesses)
    ? "" : '<p class="data-quality-note">Загружаем связи с процессами и материалами…</p>';
  const materials = new Map((window.engineeringMaterials || []).map(x => [x.id, x]));
  const processLink = x => '<a href="processes.html#' + encodeURIComponent(x.id) + '">' + escapeHTML(x.name) + '</a>';
  const processLinks = processes.slice(0, 12).map(processLink).join("");
  const extraProcesses = processes.length > 12
    ? '<details class="related-more"><summary>Ещё ' + (processes.length - 12) + ' процессов</summary><div class="technology-links">' +
      processes.slice(12).map(processLink).join("") + '</div></details>'
    : '';
  const materialIds = [...new Set(processes.flatMap(x => x.materials || []))];
  const materialLinks = materialIds.filter(id => materials.has(id)).map(id =>
    '<a href="materials.html#' + encodeURIComponent(id) + '">' + escapeHTML(materials.get(id).name) + '</a>'
  ).join("");
  return '<p class="data-quality-note">Справочные связи: не инструкция по эксплуатации или безопасности.</p>' +
    '<p class="sub-label">Процессы (' + processes.length + ')</p><div class="technology-links">' + processLinks + '</div>' + extraProcesses +
    (materialLinks ? '<p class="sub-label">Материалы</p><div class="technology-links">' + materialLinks + '</div>' : "");
}

function renderProfession(profession, category) {
  const normative = renderNormativeReferences(profession);
  const related = renderRelatedTechnology(profession);
  return `
    <div class="modal-header">
      <div><div class="modal-category">${escapeHTML(category)}</div>
        <h2 id="modalTitle">${escapeHTML(profession.title)}</h2></div>
    </div>
    ${section("Чем занимается", '<p>' + valueOrDash(profession.shortDesc) + '</p>', " profession-intro")}
    ${section("Что нужно знать и какие инструменты используют", renderPracticalGuide(profession))}
    ${section("Зарплата", renderVerifiedSalarySource(profession))}
    ${section("Возможные карьерные роли", renderCareer(profession.careerGrowth))}
    ${renderProsCons(profession)}
    <details class="profession-section profession-extra"><summary>Профессиональные стандарты и нормативные документы</summary>${normative}</details>
    <details class="profession-section profession-extra"><summary>Связанные процессы и материалы</summary>${related}</details>
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
  let modalRequest = 0;
  let technologyLoading = null;
  function loadTechnology() {
    if (Array.isArray(window.engineeringMaterials) && Array.isArray(window.engineeringProcesses))
      return Promise.resolve();
    if (technologyLoading) return technologyLoading;
    function addScript(src,ready) {
      if (ready()) return Promise.resolve();
      return new Promise((resolve,reject) => {
        const tag=document.createElement('script');
        tag.src=src;tag.async=true;
        tag.onload=()=>ready()?resolve():reject(Error('Не загрузились данные: '+src));
        tag.onerror=()=>{tag.remove();reject(Error('Нет соединения: '+src));};
        document.head.appendChild(tag);
      });
    }
    technologyLoading=Promise.all([
      addScript('materials-data.js',()=>Array.isArray(window.engineeringMaterials)),
      addScript('processes-data.js',()=>Array.isArray(window.engineeringProcesses))
    ]).catch(error=>{technologyLoading=null;throw error;});
    return technologyLoading;
  }
  function renderModalWithTechnology(profession) {
    const token=++modalRequest;
    modalContent.innerHTML=renderProfession(profession,getCategory(profession));
    // Keep heavy process/material datasets unloaded until their collapsed section is opened.
    if(Array.isArray(window.engineeringMaterials) && Array.isArray(window.engineeringProcesses))return;
    const technologyDetails=modalContent.querySelectorAll('details.profession-extra')[1];
    if(!technologyDetails)return;
    technologyDetails.addEventListener('toggle',()=>{
      if(!technologyDetails.open)return;
      loadTechnology().then(()=>{
        if(token!==modalRequest||!modalOverlay.classList.contains('active'))return;
        const modal=modalContent.closest('.modal'),scroll=modal?modal.scrollTop:0;
        const expanded=[...modalContent.querySelectorAll('details.profession-extra')].map(x=>x.open);
        modalContent.innerHTML=renderProfession(profession,getCategory(profession));
        modalContent.querySelectorAll('details.profession-extra').forEach((x,i)=>{x.open=!!expanded[i];});
        if(modal)modal.scrollTop=scroll;
      }).catch(()=>{
        if(token!==modalRequest||!modalOverlay.classList.contains('active'))return;
        const loading=[...modalContent.querySelectorAll('.data-quality-note')]
          .find(x=>x.textContent.includes('Загружаем связи с процессами'));
        if(loading)loading.textContent='Не удалось загрузить связи. Проверьте сеть и откройте карточку повторно.';
      });
    });
  }

  let activeCategory = ALL;
  let activeProfessionId = ALL; // выбранная кнопка во второй строке (только для «АСУ ТП»)
  let searchQuery = "";
  let sortMode = "az";

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
    const card = document.createElement("div");
    card.className = "eng-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");


    const title = document.createElement("h3");
    title.className = "eng-title";
    title.id = `profession-card-title-${profession.id}`;
    // The role=button uses its only visible content as accessible name.
    title.textContent = profession.title;
    card.append(title);
    // Внешняя карточка содержит только название; всё описание открывается внутри.
    // Доступное имя кнопки совпадает с видимым текстом.
    card.setAttribute("aria-labelledby", title.id);

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
    for (const element of [document.querySelector("main"), document.querySelector("footer")]) {
      if (element) element.inert = isOpen;
    }
  }

  function openModal(profession) {
    modalTrigger = document.activeElement;
    setModalOpen(true);
    renderModalWithTechnology(profession);
    modalClose.focus();
  }

  const closeModal = () => {
    ++modalRequest;
    setModalOpen(false);
    // A closed dialog must not remain encoded as the active profession in the URL.
    if (/^#profession=[a-z0-9-]+$/.test(location.hash)) {
      history.replaceState(history.state, "", location.pathname + location.search);
    }
    if (modalTrigger instanceof HTMLElement && modalTrigger.isConnected) modalTrigger.focus();
    modalTrigger = null;
  };

  modalContent.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("[data-related-id]") : null;
    if (!button) return;
    const related = professionsData.find(item => item.id === button.dataset.relatedId);
    if (!related) return;
    renderModalWithTechnology(related);
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
    if (!modalOverlay.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
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

  // A stable URL lets other reference sections open a specific profession.
  function openProfessionFromHash() {
    const match = location.hash.match(/^#profession=([a-z0-9-]+)$/);
    if (!match) return;
    const profession = professionsData.find(item => item.id === match[1]);
    if (profession) openModal(profession);
  }
  openProfessionFromHash();
  window.addEventListener('hashchange', openProfessionFromHash);
});
