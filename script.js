// Каталог профессий: разделы, поиск, сортировка и карточка с подробностями.
// Сами профессии лежат в data.js (window.professionsData).

// ─── Разделы ────────────────────────────────────────────────────────────────
// Название раздела → id его профессий.
// Чтобы переместить профессию в другой раздел, перенесите её id в другой список.
const CATEGORY_PROFESSIONS = {
  "Строительство и инфраструктура": ["civil-engineer", "architect-engineer", "road-engineer"],
  "Машиностроение и транспорт": ["mechanical-engineer", "automotive-engineer", "railway-engineer", "shipbuilding-engineer"],
  "Энергетика": ["power-engineer", "electrical-engineer", "nuclear-engineer"],
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
    avgAge && labeled("Средний возраст", `${escapeHTML(avgAge)} лет`, "info-item"),
    genderRatio && labeled("Соотношение", escapeHTML(genderRatio), "info-item")
  ].filter(Boolean).join("");
  return items && `<div class="info-grid">${items}</div>`;
}

function renderEducation({ duration, requirements, courses } = {}) {
  const tags = courses?.length ? courses.map((course) => `<span>${escapeHTML(course)}</span>`).join("") : "";
  return [
    duration && `<p><strong>Срок обучения:</strong> ${escapeHTML(duration)}</p>`,
    requirements && `<p><strong>База:</strong> ${escapeHTML(requirements)}</p>`,
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
      <div><strong>${escapeHTML(step.title)}</strong><small>${escapeHTML(step.period)}</small></div>
      <b>${escapeHTML(step.salary)}</b>
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

function renderProfession(profession, category) {
  return `
    <div class="modal-header">
      <div>
        <div class="modal-category">${escapeHTML(category)}</div>
        <h2 id="modalTitle">${escapeHTML(profession.title)}</h2>
      </div>
    </div>
    ${section("Чем занимается", `<p>${valueOrDash(profession.shortDesc)}</p>`, " profession-intro")}
    ${section("Профиль профессии", renderProfile(profession.stats))}
    ${section("Образование и подготовка", renderEducation(profession.education))}
    ${section("Зарплата", renderSalary(profession.salary))}
    ${section("Карьерный путь", renderCareer(profession.careerGrowth))}
    ${section("Типичный рабочий день", profession.typicalDay ? renderRows("day-list", "day-row", DAY_LABELS, profession.typicalDay) : "")}
    ${renderProsCons(profession)}`;
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
    if (!items.length) grid.innerHTML = '<p class="profession-empty">Ничего не найдено.</p>';
  }

  function setModalOpen(isOpen) {
    modalOverlay.classList.toggle("active", isOpen);
    modalOverlay.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);
  }

  function openModal(profession) {
    modalContent.innerHTML = renderProfession(profession, getCategory(profession));
    setModalOpen(true);
    modalClose.focus();
  }

  const closeModal = () => setModalOpen(false);

  modalClose.addEventListener("click", closeModal);
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
