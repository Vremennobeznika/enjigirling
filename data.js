window.professionsData = [
    // ===== СТРОИТЕЛЬСТВО =====
    {
        id: "civil-engineer",
        title: "Инженер-строитель (ПГС)",
        shortDesc: "Проектирование и строительство зданий и сооружений",
        stats: { specialists: 320000, avgAge: 42, genderRatio: "70% мужчин / 30% женщин" },
        education: { duration: "4–5.5 лет (бакалавриат/специалитет)", requirements: "Глубокое знание строительной механики и сопротивления материалов.", courses: ["AutoCAD/Revit", "Главгосэкспертиза", "Сметное дело"] },
        salary: { start: "60 000 ₽", peak: "250 000+ ₽", median: "110 000 ₽", regions: { central: "80 000–250 000 ₽", northwest: "70 000–200 000 ₽", south: "55 000–150 000 ₽", northcaucasus: "45 000–120 000 ₽", volga: "55 000–150 000 ₽", ural: "65 000–180 000 ₽", siberia: "55 000–160 000 ₽", fareast: "70 000–200 000 ₽" } },
        careerGrowth: [
            { title: "Инженер ПТО", period: "0–2 года", salary: "60 000–80 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "90 000–140 000 ₽" },
            { title: "Главный инженер проекта", period: "4–7 лет", salary: "150 000–200 000 ₽" },
            { title: "Руководитель стройки / ГИП", period: "7+ лет", salary: "200 000–300 000+ ₽" }
        ],
        typicalDay: { morning: "07:30 — Планёрка", midday: "09:00–13:00 — Контроль", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Документация" },
        easy: "Работа на свежем воздухе, видимый результат.",
        hard: "Работа в любую погоду. Высокая ответственность."
    },
    {
        id: "architect-engineer",
        title: "Инженер-архитектор",
        shortDesc: "Архитектурное проектирование и планировка пространств",
        stats: { specialists: 85000, avgAge: 39, genderRatio: "45% мужчин / 55% женщин" },
        education: { duration: "5–6 лет", requirements: "Знание архитектурной композиции.", courses: ["Revit", "SketchUp", "3ds Max"] },
        salary: { start: "50 000 ₽", peak: "300 000+ ₽", median: "100 000 ₽", regions: { central: "70 000–300 000 ₽", northwest: "60 000–250 000 ₽", south: "50 000–180 000 ₽", northcaucasus: "40 000–130 000 ₽", volga: "50 000–170 000 ₽", ural: "55 000–200 000 ₽", siberia: "50 000–180 000 ₽", fareast: "60 000–220 000 ₽" } },
        careerGrowth: [
            { title: "Архитектор-стажёр", period: "0–1 год", salary: "50 000–70 000 ₽" },
            { title: "Архитектор", period: "1–3 года", salary: "70 000–120 000 ₽" },
            { title: "Ведущий архитектор", period: "3–6 лет", salary: "130 000–200 000 ₽" },
            { title: "Главный архитектор проекта", period: "6+ лет", salary: "200 000–350 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Обсуждение", midday: "10:30–14:00 — Моделирование", afternoon: "14:00–15:00 — Обед", evening: "15:00–19:00 — Визуализация" },
        easy: "Творческая работа. Можно увидеть свои проекты в городе.",
        hard: "Бессонные ночи перед дедлайнами. Сложные согласования."
    },
    {
        id: "road-engineer",
        title: "Инженер-дорожник",
        shortDesc: "Проектирование и строительство дорог и мостов",
        stats: { specialists: 95000, avgAge: 44, genderRatio: "75% мужчин / 25% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание проектирования дорог.", courses: ["AutoCAD Civil 3D", "IndorCAD"] },
        salary: { start: "55 000 ₽", peak: "220 000+ ₽", median: "100 000 ₽", regions: { central: "70 000–220 000 ₽", northwest: "60 000–180 000 ₽", south: "50 000–150 000 ₽", northcaucasus: "40 000–120 000 ₽", volga: "50 000–150 000 ₽", ural: "60 000–170 000 ₽", siberia: "55 000–160 000 ₽", fareast: "65 000–190 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-дорожник", period: "0–2 года", salary: "55 000–80 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "85 000–130 000 ₽" },
            { title: "Главный инженер участка", period: "4–7 лет", salary: "140 000–180 000 ₽" },
            { title: "Начальник участка", period: "7+ лет", salary: "180 000–250 000+ ₽" }
        ],
        typicalDay: { morning: "07:00 — Выезд", midday: "08:30–13:00 — Контроль", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Документы" },
        easy: "Работа на свежем воздухе. Видишь результат.",
        hard: "Вахтовый метод. Работа в любую погоду."
    },

    // ===== МАШИНОСТРОЕНИЕ =====
    {
        id: "mechanical-engineer",
        title: "Инженер-механик",
        shortDesc: "Проектирование машин, механизмов и оборудования",
        stats: { specialists: 280000, avgAge: 45, genderRatio: "80% мужчин / 20% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание теоретической механики.", courses: ["Компас-3D / SolidWorks", "ANSYS"] },
        salary: { start: "55 000 ₽", peak: "200 000+ ₽", median: "95 000 ₽", regions: { central: "70 000–200 000 ₽", northwest: "60 000–170 000 ₽", south: "50 000–140 000 ₽", northcaucasus: "40 000–110 000 ₽", volga: "50 000–140 000 ₽", ural: "60 000–170 000 ₽", siberia: "55 000–150 000 ₽", fareast: "65 000–180 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-конструктор", period: "0–2 года", salary: "55 000–80 000 ₽" },
            { title: "Ведущий инженер-механик", period: "2–5 лет", salary: "85 000–130 000 ₽" },
            { title: "Главный механик", period: "5–8 лет", salary: "140 000–180 000 ₽" },
            { title: "Главный конструктор", period: "8+ лет", salary: "180 000–300 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Планёрка", midday: "09:00–13:00 — Чертежи", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:30 — Контроль" },
        easy: "Классическая инженерия. Работа с чертежами и 3D-моделями.",
        hard: "Советское наследие оборудования. Износ станков."
    },
    {
        id: "automotive-engineer",
        title: "Инженер-автомобилестроитель",
        shortDesc: "Проектирование и производство автомобилей",
        stats: { specialists: 65000, avgAge: 40, genderRatio: "78% мужчин / 22% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание автомобилей.", courses: ["CATIA", "ADAMS"] },
        salary: { start: "60 000 ₽", peak: "250 000+ ₽", median: "110 000 ₽", regions: { central: "80 000–250 000 ₽", northwest: "70 000–200 000 ₽", south: "55 000–160 000 ₽", northcaucasus: "45 000–120 000 ₽", volga: "60 000–170 000 ₽", ural: "65 000–190 000 ₽", siberia: "55 000–170 000 ₽", fareast: "65 000–200 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-конструктор", period: "0–2 года", salary: "60 000–90 000 ₽" },
            { title: "Ведущий конструктор", period: "2–4 года", salary: "95 000–150 000 ₽" },
            { title: "Руководитель группы", period: "4–7 лет", salary: "160 000–220 000 ₽" },
            { title: "Главный конструктор", period: "7+ лет", salary: "220 000–350 000+ ₽" }
        ],
        typicalDay: { morning: "08:30 — Испытания", midday: "09:30–13:00 — Моделирование", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Прототипы" },
        easy: "Передовые CAD-системы. Интересные технологии.",
        hard: "Жёсткие дедлайны. Высокая конкуренция."
    },

    // ===== ЭНЕРГЕТИКА =====
    {
        id: "power-engineer",
        title: "Инженер-энергетик",
        shortDesc: "Проектирование и эксплуатация энергосистем",
        stats: { specialists: 180000, avgAge: 44, genderRatio: "72% мужчин / 28% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание электротехники.", courses: ["RastrWin", "ANSYS"] },
        salary: { start: "55 000 ₽", peak: "220 000+ ₽", median: "100 000 ₽", regions: { central: "70 000–220 000 ₽", northwest: "65 000–180 000 ₽", south: "50 000–150 000 ₽", northcaucasus: "40 000–120 000 ₽", volga: "55 000–150 000 ₽", ural: "65 000–180 000 ₽", siberia: "60 000–170 000 ₽", fareast: "70 000–200 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-энергетик", period: "0–2 года", salary: "55 000–80 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "85 000–130 000 ₽" },
            { title: "Главный энергетик", period: "4–7 лет", salary: "140 000–180 000 ₽" },
            { title: "Директор по энергетике", period: "7+ лет", salary: "180 000–300 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Оперативка", midday: "09:00–13:00 — Расчёты", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Обход" },
        easy: "Стабильная работа. Чёткие регламенты.",
        hard: "Аварийные ситуации. Высокая ответственность."
    },
    {
        id: "electrical-engineer",
        title: "Инженер-электрик",
        shortDesc: "Проектирование и обслуживание электрических сетей",
        stats: { specialists: 150000, avgAge: 43, genderRatio: "75% мужчин / 25% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание электротехники.", courses: ["AutoCAD"] },
        salary: { start: "60 000 ₽", peak: "220 000+ ₽", median: "105 000 ₽", regions: { central: "75 000–220 000 ₽", northwest: "65 000–180 000 ₽", south: "50 000–150 000 ₽", northcaucasus: "40 000–120 000 ₽", volga: "55 000–155 000 ₽", ural: "65 000–180 000 ₽", siberia: "60 000–170 000 ₽", fareast: "70 000–200 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-электрик", period: "0–2 года", salary: "60 000–85 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "90 000–135 000 ₽" },
            { title: "Главный электрик", period: "4–7 лет", salary: "140 000–185 000 ₽" },
            { title: "Директор по электрике", period: "7+ лет", salary: "185 000–300 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Щитовая", midday: "09:00–13:00 — Проектирование", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Монтаж" },
        easy: "Стабильный спрос. Чёткие стандарты.",
        hard: "Аварийные вызовы. Работа с высоким напряжением."
    },
    {
        id: "nuclear-engineer",
        title: "Инженер-атомщик",
        shortDesc: "Проектирование и эксплуатация АЭС",
        stats: { specialists: 35000, avgAge: 43, genderRatio: "76% мужчин / 24% женщин" },
        education: { duration: "5–6 лет", requirements: "Знание ядерной физики.", courses: ["KORSAR", "MCNP"] },
        salary: { start: "70 000 ₽", peak: "300 000+ ₽", median: "130 000 ₽", regions: { central: "90 000–300 000 ₽", northwest: "80 000–250 000 ₽", south: "65 000–200 000 ₽", northcaucasus: "55 000–160 000 ₽", volga: "70 000–220 000 ₽", ural: "80 000–250 000 ₽", siberia: "75 000–230 000 ₽", fareast: "85 000–280 000 ₽" } },
        careerGrowth: [
            { title: "Инженер АЭС", period: "0–2 года", salary: "70 000–100 000 ₽" },
            { title: "Ведущий инженер", period: "2–5 лет", salary: "110 000–170 000 ₽" },
            { title: "Начальник смены", period: "5–8 лет", salary: "180 000–250 000 ₽" },
            { title: "Главный инженер АЭС", period: "8+ лет", salary: "250 000–400 000+ ₽" }
        ],
        typicalDay: { morning: "07:30 — Смена", midday: "08:30–13:00 — Реактор", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Документация" },
        easy: "Высокая зарплата. Престиж. Современное оборудование.",
        hard: "Строжайшая дисциплина. Закрытые города."
    },

    // ===== АВИАЦИЯ И КОСМОС =====
    {
        id: "aerospace-engineer",
        title: "Инженер-авиастроитель",
        shortDesc: "Проектирование и производство летательных аппаратов",
        stats: { specialists: 55000, avgAge: 44, genderRatio: "80% мужчин / 20% женщин" },
        education: { duration: "5–6 лет", requirements: "Знание аэродинамики.", courses: ["ANSYS Fluent", "CATIA"] },
        salary: { start: "65 000 ₽", peak: "300 000+ ₽", median: "120 000 ₽", regions: { central: "85 000–300 000 ₽", northwest: "75 000–250 000 ₽", south: "60 000–190 000 ₽", northcaucasus: "50 000–140 000 ₽", volga: "65 000–200 000 ₽", ural: "70 000–220 000 ₽", siberia: "65 000–210 000 ₽", fareast: "75 000–250 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-конструктор", period: "0–2 года", salary: "65 000–95 000 ₽" },
            { title: "Ведущий инженер", period: "2–5 лет", salary: "100 000–160 000 ₽" },
            { title: "Начальник КБ", period: "5–8 лет", salary: "170 000–250 000 ₽" },
            { title: "Главный конструктор", period: "8+ лет", salary: "250 000–400 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Планёрка", midday: "09:00–13:00 — Расчёты", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Макет" },
        easy: "Работа на пределе технологий. Гордость за результат.",
        hard: "Огромная ответственность. Долгий цикл разработки."
    },
    {
        id: "space-engineer",
        title: "Космический инженер (ракетостроитель)",
        shortDesc: "Проектирование и создание ракетно-космической техники",
        stats: { specialists: 30000, avgAge: 42, genderRatio: "78% мужчин / 22% женщин" },
        education: { duration: "5–6 лет", requirements: "Знание баллистики.", courses: ["Баллистика", "Ракетные двигатели"] },
        salary: { start: "70 000 ₽", peak: "300 000+ ₽", median: "130 000 ₽", regions: { central: "90 000–300 000 ₽", northwest: "80 000–250 000 ₽", south: "60 000–200 000 ₽", northcaucasus: "50 000–150 000 ₽", volga: "70 000–220 000 ₽", ural: "75 000–240 000 ₽", siberia: "70 000–230 000 ₽", fareast: "80 000–260 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-конструктор", period: "0–3 года", salary: "70 000–100 000 ₽" },
            { title: "Ведущий конструктор", period: "3–6 лет", salary: "100 000–150 000 ₽" },
            { title: "Начальник отдела", period: "6–10 лет", salary: "150 000–220 000 ₽" },
            { title: "Главный конструктор", period: "10+ лет", salary: "220 000–300 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Планёрка", midday: "09:00–13:00 — Расчёты", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Испытания" },
        easy: "Работа на переднем крае технологий. Причастность к космосу.",
        hard: "Огромная ответственность. Секретность."
    },

    // ===== ХИМИЯ И НЕФТЕХИМИЯ =====
    {
        id: "chemical-engineer",
        title: "Инженер-химик-технолог",
        shortDesc: "Разработка и управление химическими производствами",
        stats: { specialists: 75000, avgAge: 41, genderRatio: "55% мужчин / 45% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание химии.", courses: ["HYSYS", "ChemCAD"] },
        salary: { start: "55 000 ₽", peak: "220 000+ ₽", median: "100 000 ₽", regions: { central: "75 000–220 000 ₽", northwest: "65 000–180 000 ₽", south: "55 000–150 000 ₽", northcaucasus: "45 000–120 000 ₽", volga: "60 000–170 000 ₽", ural: "65 000–190 000 ₽", siberia: "60 000–180 000 ₽", fareast: "70 000–210 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-технолог", period: "0–2 года", salary: "55 000–80 000 ₽" },
            { title: "Ведущий технолог", period: "2–4 года", salary: "85 000–130 000 ₽" },
            { title: "Начальник производства", period: "4–7 лет", salary: "140 000–200 000 ₽" },
            { title: "Главный технолог", period: "7+ лет", salary: "200 000–300 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Обход", midday: "09:30–13:00 — Оптимизация", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Карты" },
        easy: "Работа в лаборатории. Можно изобретать новые материалы.",
        hard: "Вредное производство. Риск аварий."
    },
    {
        id: "oil-gas-engineer",
        title: "Инженер-нефтяник",
        shortDesc: "Разведка, бурение и добыча нефти и газа",
        stats: { specialists: 120000, avgAge: 40, genderRatio: "78% мужчин / 22% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание геологии.", courses: ["Petrel", "ROXAR"] },
        salary: { start: "80 000 ₽", peak: "400 000+ ₽", median: "150 000 ₽", regions: { central: "100 000–400 000 ₽", northwest: "90 000–350 000 ₽", south: "75 000–280 000 ₽", northcaucasus: "60 000–220 000 ₽", volga: "85 000–320 000 ₽", ural: "100 000–380 000 ₽", siberia: "90 000–350 000 ₽", fareast: "95 000–370 000 ₽" } },
        careerGrowth: [
            { title: "Оператор", period: "0–2 года", salary: "80 000–120 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "130 000–200 000 ₽" },
            { title: "Начальник участка", period: "4–7 лет", salary: "210 000–300 000 ₽" },
            { title: "Главный инженер", period: "7+ лет", salary: "300 000–500 000+ ₽" }
        ],
        typicalDay: { morning: "06:00 — Буровая", midday: "07:30–13:00 — Бурение", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Анализ" },
        easy: "Высокая зарплата. Современные технологии.",
        hard: "Вахтовый метод. Суровые климатические условия."
    },

    // ===== МЕТАЛЛУРГИЯ =====
    {
        id: "metallurgical-engineer",
        title: "Инженер-металлург",
        shortDesc: "Производство и обработка металлов и сплавов",
        stats: { specialists: 60000, avgAge: 46, genderRatio: "82% мужчин / 18% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание металлургии.", courses: ["Thermo-Calc", "SolidWorks"] },
        salary: { start: "55 000 ₽", peak: "200 000+ ₽", median: "95 000 ₽", regions: { central: "70 000–200 000 ₽", northwest: "60 000–170 000 ₽", south: "50 000–140 000 ₽", northcaucasus: "40 000–110 000 ₽", volga: "55 000–150 000 ₽", ural: "65 000–180 000 ₽", siberia: "60 000–170 000 ₽", fareast: "65 000–190 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-металлург", period: "0–2 года", salary: "55 000–80 000 ₽" },
            { title: "Мастер участка", period: "2–4 года", salary: "85 000–120 000 ₽" },
            { title: "Начальник цеха", period: "4–7 лет", salary: "130 000–180 000 ₽" },
            { title: "Главный металлург", period: "7+ лет", salary: "180 000–280 000+ ₽" }
        ],
        typicalDay: { morning: "07:00 — Планёрка", midday: "08:00–13:00 — Плавка", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Пробы" },
        easy: "Работа с огнём и металлом. Стабильная занятость.",
        hard: "Горячее производство. Вредные условия."
    },

    // ===== ГОРНОЕ ДЕЛО =====
    {
        id: "mining-engineer",
        title: "Горный инженер",
        shortDesc: "Разработка месторождений полезных ископаемых",
        stats: { specialists: 45000, avgAge: 43, genderRatio: "85% мужчин / 15% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание геологии.", courses: ["MineFrame", "Blast-CAD"] },
        salary: { start: "70 000 ₽", peak: "300 000+ ₽", median: "130 000 ₽", regions: { central: "90 000–300 000 ₽", northwest: "80 000–250 000 ₽", south: "65 000–200 000 ₽", northcaucasus: "55 000–160 000 ₽", volga: "70 000–220 000 ₽", ural: "85 000–280 000 ₽", siberia: "80 000–260 000 ₽", fareast: "90 000–300 000 ₽" } },
        careerGrowth: [
            { title: "Горный мастер", period: "0–2 года", salary: "70 000–100 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "110 000–170 000 ₽" },
            { title: "Начальник участка", period: "4–7 лет", salary: "180 000–250 000 ₽" },
            { title: "Главный инженер рудника", period: "7+ лет", salary: "250 000–400 000+ ₽" }
        ],
        typicalDay: { morning: "06:00 — Шахта", midday: "07:00–13:00 — Проходка", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Отчёты" },
        easy: "Высокая зарплата. Романтика горного дела.",
        hard: "Опасные условия. Вахты."
    },

    // ===== ЭКОЛОГИЯ =====
    {
        id: "environmental-engineer",
        title: "Инженер-эколог",
        shortDesc: "Охрана окружающей среды и экологическая безопасность",
        stats: { specialists: 35000, avgAge: 37, genderRatio: "40% мужчин / 60% женщин" },
        education: { duration: "4 года + магистратура", requirements: "Знание экологии.", courses: ["ОВОС", "Экологический аудит"] },
        salary: { start: "50 000 ₽", peak: "180 000+ ₽", median: "85 000 ₽", regions: { central: "65 000–180 000 ₽", northwest: "55 000–150 000 ₽", south: "45 000–130 000 ₽", northcaucasus: "35 000–100 000 ₽", volga: "45 000–130 000 ₽", ural: "55 000–150 000 ₽", siberia: "50 000–140 000 ₽", fareast: "60 000–170 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-эколог", period: "0–2 года", salary: "50 000–70 000 ₽" },
            { title: "Ведущий эколог", period: "2–4 года", salary: "75 000–110 000 ₽" },
            { title: "Начальник отдела", period: "4–7 лет", salary: "120 000–160 000 ₽" },
            { title: "Директор по экологии", period: "7+ лет", salary: "160 000–250 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Мониторинг", midday: "10:30–13:00 — Расчёты", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:30 — Отчёты" },
        easy: "Работа на природе. Социально значимая профессия.",
        hard: "Бумажная работа. Конфликты с производством."
    },

    // ===== БИОМЕДИЦИНА =====
    {
        id: "biomedical-engineer",
        title: "Инженер-биомедик",
        shortDesc: "Разработка медицинского оборудования и биопротезов",
        stats: { specialists: 12000, avgAge: 35, genderRatio: "50% мужчин / 50% женщин" },
        education: { duration: "4–6 лет", requirements: "Знание анатомии.", courses: ["SolidWorks", "MATLAB"] },
        salary: { start: "60 000 ₽", peak: "250 000+ ₽", median: "110 000 ₽", regions: { central: "80 000–250 000 ₽", northwest: "70 000–200 000 ₽", south: "55 000–160 000 ₽", northcaucasus: "45 000–120 000 ₽", volga: "55 000–160 000 ₽", ural: "65 000–190 000 ₽", siberia: "60 000–180 000 ₽", fareast: "70 000–210 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-биомедик", period: "0–2 года", salary: "60 000–90 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "95 000–150 000 ₽" },
            { title: "Руководитель разработки", period: "4–7 лет", salary: "160 000–220 000 ₽" },
            { title: "Технический директор", period: "7+ лет", salary: "220 000–350 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Прототип", midday: "10:30–13:00 — МК", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Документация" },
        easy: "Спасаешь жизни. Работа на стыке технологий и медицины.",
        hard: "Долгая сертификация. Высокая ответственность."
    },

    // ===== РОБОТОТЕХНИКА =====
    {
        id: "robotics-engineer",
        title: "Инженер-робототехник",
        shortDesc: "Проектирование и программирование роботов",
        stats: { specialists: 15000, avgAge: 32, genderRatio: "75% мужчин / 25% женщин" },
        education: { duration: "4–6 лет", requirements: "Знание автоматики.", courses: ["ROS", "OpenCV"] },
        salary: { start: "80 000 ₽", peak: "350 000+ ₽", median: "150 000 ₽", regions: { central: "100 000–350 000 ₽", northwest: "90 000–300 000 ₽", south: "70 000–220 000 ₽", northcaucasus: "55 000–160 000 ₽", volga: "75 000–240 000 ₽", ural: "85 000–280 000 ₽", siberia: "80 000–260 000 ₽", fareast: "85 000–300 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-робототехник", period: "0–2 года", salary: "80 000–120 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "130 000–200 000 ₽" },
            { title: "Руководитель направления", period: "4–7 лет", salary: "210 000–300 000 ₽" },
            { title: "Технический директор", period: "7+ лет", salary: "300 000–500 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Сенсоры", midday: "10:30–13:00 — Алгоритмы", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Тестирование" },
        easy: "Современные технологии. Можно создавать реальных роботов.",
        hard: "Дорогое оборудование. Быстрое устаревание."
    },

    // ===== ЖЕЛЕЗНАЯ ДОРОГА =====
    {
        id: "railway-engineer",
        title: "Инженер-железнодорожник",
        shortDesc: "Проектирование и эксплуатация железных дорог",
        stats: { specialists: 85000, avgAge: 45, genderRatio: "78% мужчин / 22% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание ж/д.", courses: ["AutoCAD", "ЖАТ"] },
        salary: { start: "55 000 ₽", peak: "200 000+ ₽", median: "95 000 ₽", regions: { central: "70 000–200 000 ₽", northwest: "60 000–170 000 ₽", south: "50 000–140 000 ₽", northcaucasus: "40 000–110 000 ₽", volga: "55 000–150 000 ₽", ural: "60 000–170 000 ₽", siberia: "55 000–160 000 ₽", fareast: "65 000–190 000 ₽" } },
        careerGrowth: [
            { title: "Инженер пути", period: "0–2 года", salary: "55 000–80 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "85 000–120 000 ₽" },
            { title: "Начальник дистанции", period: "4–7 лет", salary: "130 000–170 000 ₽" },
            { title: "Главный инженер дороги", period: "7+ лет", salary: "170 000–280 000+ ₽" }
        ],
        typicalDay: { morning: "06:00 — Платёжка", midday: "07:30–13:00 — Осмотр", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Документы" },
        easy: "Стабильная работа в РЖД. Хороший соцпакет.",
        hard: "Работа в любую погоду. Ночные смены."
    },

    // ===== КОРАБЛЕСТРОЕНИЕ =====
    {
        id: "shipbuilding-engineer",
        title: "Инженер-кораблестроитель",
        shortDesc: "Проектирование и строительство судов",
        stats: { specialists: 30000, avgAge: 46, genderRatio: "82% мужчин / 18% женщин" },
        education: { duration: "5–5.5 лет", requirements: "Знание корабля.", courses: ["SolidWorks", "ANSYS"] },
        salary: { start: "60 000 ₽", peak: "250 000+ ₽", median: "110 000 ₽", regions: { central: "80 000–250 000 ₽", northwest: "70 000–220 000 ₽", south: "55 000–170 000 ₽", northcaucasus: "45 000–130 000 ₽", volga: "55 000–170 000 ₽", ural: "60 000–190 000 ₽", siberia: "55 000–180 000 ₽", fareast: "75 000–240 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-конструктор", period: "0–2 года", salary: "60 000–90 000 ₽" },
            { title: "Ведущий конструктор", period: "2–5 лет", salary: "95 000–150 000 ₽" },
            { title: "Начальник КБ", period: "5–8 лет", salary: "160 000–220 000 ₽" },
            { title: "Главный конструктор проекта", period: "8+ лет", salary: "220 000–350 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Планёрка", midday: "09:00–13:00 — Чертежи", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:30 — Испытания" },
        easy: "Масштабные проекты. Гордость — спуск корабля на воду.",
        hard: "Долгий цикл строительства. Бюрократия."
    },

    // ===== ПРИБОРОСТРОЕНИЕ =====
    {
        id: "instrumentation-engineer",
        title: "Инженер АСУ ТП",
        shortDesc: "Контрольно-измерительные приборы и автоматика",
        stats: { specialists: 95000, avgAge: 43, genderRatio: "70% мужчин / 30% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание автоматики.", courses: ["SCADA", "Siemens"] },
        salary: { start: "55 000 ₽", peak: "200 000+ ₽", median: "95 000 ₽", regions: { central: "70 000–200 000 ₽", northwest: "60 000–170 000 ₽", south: "50 000–140 000 ₽", northcaucasus: "40 000–110 000 ₽", volga: "55 000–150 000 ₽", ural: "65 000–180 000 ₽", siberia: "55 000–160 000 ₽", fareast: "65 000–190 000 ₽" } },
        careerGrowth: [
            { title: "Инженер АСУ ТП", period: "0–2 года", salary: "55 000–80 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "85 000–130 000 ₽" },
            { title: "Начальник службы КИП", period: "4–7 лет", salary: "140 000–180 000 ₽" },
            { title: "Главный метролог", period: "7+ лет", salary: "180 000–250 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — АСУ ТП", midday: "09:30–13:00 — Калибровка", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — ПЛК" },
        easy: "Работа и с железом, и с софтом. Востребовано везде.",
        hard: "Аварийные вызовы. Устаревший парк приборов."
    },

    // ===== ПИЩЕВАЯ ПРОМЫШЛЕННОСТЬ =====
    {
        id: "food-engineer",
        title: "Инженер-технолог пищевой промышленности",
        shortDesc: "Разработка и производство продуктов питания",
        stats: { specialists: 55000, avgAge: 40, genderRatio: "35% мужчин / 65% женщин" },
        education: { duration: "4 года", requirements: "Знание биохимии.", courses: ["HACCP", "1С"] },
        salary: { start: "45 000 ₽", peak: "170 000+ ₽", median: "80 000 ₽", regions: { central: "60 000–170 000 ₽", northwest: "50 000–140 000 ₽", south: "40 000–120 000 ₽", northcaucasus: "30 000–90 000 ₽", volga: "40 000–120 000 ₽", ural: "45 000–130 000 ₽", siberia: "40 000–120 000 ₽", fareast: "50 000–150 000 ₽" } },
        careerGrowth: [
            { title: "Технолог", period: "0–2 года", salary: "45 000–65 000 ₽" },
            { title: "Ведущий технолог", period: "2–4 года", salary: "70 000–100 000 ₽" },
            { title: "Начальник производства", period: "4–7 лет", salary: "110 000–150 000 ₽" },
            { title: "Главный технолог", period: "7+ лет", salary: "150 000–220 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Сырьё", midday: "09:00–13:00 — Линии", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Дегустация" },
        easy: "Работа с едой. Продукт видят миллионы.",
        hard: "Ранние смены. Строгий контроль."
    },

    // ===== ТЕКСТИЛЬНАЯ ПРОМЫШЛЕННОСТЬ =====
    {
        id: "textile-engineer",
        title: "Инженер-текстильщик",
        shortDesc: "Производство тканей и текстильных материалов",
        stats: { specialists: 20000, avgAge: 44, genderRatio: "30% мужчин / 70% женщин" },
        education: { duration: "4 года", requirements: "Знание ткачества.", courses: ["NedGraphics"] },
        salary: { start: "40 000 ₽", peak: "150 000+ ₽", median: "70 000 ₽", regions: { central: "55 000–150 000 ₽", northwest: "45 000–120 000 ₽", south: "35 000–100 000 ₽", northcaucasus: "25 000–80 000 ₽", volga: "35 000–100 000 ₽", ural: "40 000–110 000 ₽", siberia: "35 000–100 000 ₽", fareast: "45 000–130 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-технолог", period: "0–2 года", salary: "40 000–60 000 ₽" },
            { title: "Ведущий технолог", period: "2–4 года", salary: "65 000–90 000 ₽" },
            { title: "Начальник производства", period: "4–7 лет", salary: "95 000–130 000 ₽" },
            { title: "Главный технолог", period: "7+ лет", salary: "130 000–200 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Станки", midday: "09:00–13:00 — Контроль", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Рисунки" },
        easy: "Творческая работа с цветом и фактурой.",
        hard: "Шум в цехах. Устаревшее оборудование."
    },

    // ===== ЛЕСНАЯ ПРОМЫШЛЕННОСТЬ =====
    {
        id: "forest-engineer",
        title: "Инженер лесного хозяйства",
        shortDesc: "Лесовосстановление, лесозаготовка и деревообработка",
        stats: { specialists: 25000, avgAge: 42, genderRatio: "72% мужчин / 28% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание лесоведения.", courses: ["ГИС", "Таксация"] },
        salary: { start: "45 000 ₽", peak: "170 000+ ₽", median: "80 000 ₽", regions: { central: "60 000–170 000 ₽", northwest: "50 000–140 000 ₽", south: "40 000–120 000 ₽", northcaucasus: "30 000–90 000 ₽", volga: "40 000–120 000 ₽", ural: "50 000–140 000 ₽", siberia: "50 000–150 000 ₽", fareast: "55 000–160 000 ₽" } },
        careerGrowth: [
            { title: "Инженер лесного хозяйства", period: "0–2 года", salary: "45 000–65 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "70 000–100 000 ₽" },
            { title: "Начальник лесничества", period: "4–7 лет", salary: "110 000–150 000 ₽" },
            { title: "Директор лесхоза", period: "7+ лет", salary: "150 000–220 000+ ₽" }
        ],
        typicalDay: { morning: "07:00 — Делянки", midday: "09:00–13:00 — Таксация", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Отчёты" },
        easy: "Работа на природе. Сохранение лесов.",
        hard: "Удалённые районы. Пожароопасный сезон."
    },

    // ===== СВЯЗЬ И ТЕЛЕКОММУНИКАЦИИ =====
    {
        id: "telecom-engineer",
        title: "Инженер связи",
        shortDesc: "Проектирование и обслуживание сетей связи",
        stats: { specialists: 65000, avgAge: 38, genderRatio: "68% мужчин / 32% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание сигналов.", courses: ["Cisco", "MikroTik"] },
        salary: { start: "50 000 ₽", peak: "200 000+ ₽", median: "90 000 ₽", regions: { central: "65 000–200 000 ₽", northwest: "55 000–170 000 ₽", south: "45 000–140 000 ₽", northcaucasus: "35 000–110 000 ₽", volga: "45 000–140 000 ₽", ural: "55 000–160 000 ₽", siberia: "50 000–150 000 ₽", fareast: "60 000–180 000 ₽" } },
        careerGrowth: [
            { title: "Инженер связи", period: "0–2 года", salary: "50 000–75 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "80 000–120 000 ₽" },
            { title: "Начальник узла связи", period: "4–7 лет", salary: "130 000–170 000 ₽" },
            { title: "Технический директор", period: "7+ лет", salary: "170 000–280 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Мониторинг", midday: "10:00–13:00 — Настройка", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Выезды" },
        easy: "Передовые технологии. Можно удалённо.",
        hard: "Аварии в любое время. Работа на высоте."
    },

    // ===== ВОДОСНАБЖЕНИЕ =====
    {
        id: "water-engineer",
        title: "Инженер-гидротехник",
        shortDesc: "Водоснабжение, водоотведение и гидротехнические сооружения",
        stats: { specialists: 40000, avgAge: 44, genderRatio: "65% мужчин / 35% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание гидравлики.", courses: ["Zulu", "AutoCAD Civil"] },
        salary: { start: "50 000 ₽", peak: "190 000+ ₽", median: "90 000 ₽", regions: { central: "65 000–190 000 ₽", northwest: "55 000–160 000 ₽", south: "45 000–130 000 ₽", northcaucasus: "35 000–100 000 ₽", volga: "45 000–130 000 ₽", ural: "55 000–150 000 ₽", siberia: "50 000–140 000 ₽", fareast: "60 000–170 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-гидротехник", period: "0–2 года", salary: "50 000–75 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "80 000–120 000 ₽" },
            { title: "Начальник службы", period: "4–7 лет", salary: "130 000–170 000 ₽" },
            { title: "Главный инженер водоканала", period: "7+ лет", salary: "170 000–250 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Насосные", midday: "09:30–13:00 — Расчёты", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Строительство" },
        easy: "Социально значимая работа. Стабильность.",
        hard: "Аварии на сетях. Износ сетей 70%."
    },

    // ===== СВЕТОТЕХНИКА =====
    {
        id: "lighting-engineer",
        title: "Инженер-светотехник",
        shortDesc: "Проектирование освещения зданий, улиц и объектов",
        stats: { specialists: 12000, avgAge: 38, genderRatio: "55% мужчин / 45% женщин" },
        education: { duration: "4 года", requirements: "Знание фотометрии.", courses: ["DIALux", "Relux"] },
        salary: { start: "50 000 ₽", peak: "200 000+ ₽", median: "90 000 ₽", regions: { central: "65 000–200 000 ₽", northwest: "55 000–170 000 ₽", south: "45 000–140 000 ₽", northcaucasus: "35 000–110 000 ₽", volga: "45 000–140 000 ₽", ural: "55 000–160 000 ₽", siberia: "50 000–150 000 ₽", fareast: "60 000–180 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-светотехник", period: "0–2 года", salary: "50 000–75 000 ₽" },
            { title: "Ведущий инженер", period: "2–4 года", salary: "80 000–120 000 ₽" },
            { title: "Руководитель проектов", period: "4–7 лет", salary: "130 000–170 000 ₽" },
            { title: "Главный светотехник", period: "7+ лет", salary: "170 000–250 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Расчёты", midday: "10:30–13:00 — Подбор", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Замеры" },
        easy: "Творческая работа. Красивые проекты.",
        hard: "Ночные замеры. Работа на высоте."
    },

    // ===== ВОЕННОЕ ДЕЛО =====
    {
        id: "military-engineer",
        title: "Военный инженер",
        shortDesc: "Инженерное обеспечение войск и военной инфраструктуры",
        stats: { specialists: 50000, avgAge: 38, genderRatio: "95% мужчин / 5% женщин" },
        education: { duration: "5–5.5 лет", requirements: "Военная подготовка.", courses: ["Фортификация", "Инженерные заграждения"] },
        salary: { start: "55 000 ₽", peak: "180 000+ ₽", median: "95 000 ₽", regions: { central: "70 000–180 000 ₽", northwest: "60 000–150 000 ₽", south: "50 000–130 000 ₽", northcaucasus: "45 000–110 000 ₽", volga: "55 000–130 000 ₽", ural: "60 000–140 000 ₽", siberia: "55 000–140 000 ₽", fareast: "65 000–160 000 ₽" } },
        careerGrowth: [
            { title: "Лейтенант", period: "0–3 года", salary: "55 000–80 000 ₽" },
            { title: "Старший инженер", period: "3–6 лет", salary: "80 000–110 000 ₽" },
            { title: "Начальник инженерной службы", period: "6–10 лет", salary: "110 000–150 000 ₽" },
            { title: "Командир инженерной части", period: "10+ лет", salary: "150 000–180 000+ ₽" }
        ],
        typicalDay: { morning: "06:00 — Подъём", midday: "08:00–14:00 — Полевые", afternoon: "14:00–15:00 — Обед", evening: "15:00–18:00 — Техника" },
        easy: "Государственное обеспечение. Гарантированная занятость.",
        hard: "Строгая дисциплина. Физические нагрузки."
    },

    // ===== ПОЛИГРАФИЯ =====
    {
        id: "polygraph-engineer",
        title: "Инженер полиграфии",
        shortDesc: "Печатные технологии и производство печатной продукции",
        stats: { specialists: 15000, avgAge: 42, genderRatio: "60% мужчин / 40% женщин" },
        education: { duration: "4 года", requirements: "Знание печати.", courses: ["Adobe InDesign", "Photoshop"] },
        salary: { start: "45 000 ₽", peak: "160 000+ ₽", median: "80 000 ₽", regions: { central: "60 000–160 000 ₽", northwest: "50 000–130 000 ₽", south: "40 000–100 000 ₽", northcaucasus: "30 000–80 000 ₽", volga: "40 000–100 000 ₽", ural: "45 000–110 000 ₽", siberia: "40 000–110 000 ₽", fareast: "50 000–130 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-технолог печати", period: "0–2 года", salary: "45 000–65 000 ₽" },
            { title: "Ведущий технолог", period: "2–4 года", salary: "65 000–95 000 ₽" },
            { title: "Начальник производства", period: "4–7 лет", salary: "95 000–130 000 ₽" },
            { title: "Директор типографии", period: "7+ лет", salary: "130 000–160 000+ ₽" }
        ],
        typicalDay: { morning: "08:00 — Машины", midday: "09:00–13:00 — Цветопроба", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Подготовка" },
        easy: "Работа с цветом и печатью. Виден конечный продукт.",
        hard: "Строгие требования к цвету. Срочные тиражи."
    },

    // ===== МАТЕРИАЛОВЕДЕНИЕ =====
    {
        id: "materials-engineer",
        title: "Инженер-материаловед",
        shortDesc: "Разработка и исследование материалов и покрытий",
        stats: { specialists: 18000, avgAge: 41, genderRatio: "65% мужчин / 35% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание физики материалов.", courses: ["Материаловедение", "Металлография"] },
        salary: { start: "50 000 ₽", peak: "190 000+ ₽", median: "90 000 ₽", regions: { central: "65 000–190 000 ₽", northwest: "55 000–150 000 ₽", south: "45 000–120 000 ₽", northcaucasus: "35 000–95 000 ₽", volga: "45 000–120 000 ₽", ural: "55 000–140 000 ₽", siberia: "50 000–130 000 ₽", fareast: "60 000–160 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-материаловед", period: "0–2 года", salary: "50 000–70 000 ₽" },
            { title: "Ведущий материаловед", period: "2–5 лет", salary: "75 000–110 000 ₽" },
            { title: "Начальник лаборатории", period: "5–8 лет", salary: "110 000–150 000 ₽" },
            { title: "Главный технолог по материалам", period: "8+ лет", salary: "150 000–190 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Образцы", midday: "10:00–13:00 — Анализ", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:30 — Отчёты" },
        easy: "Современное лабораторное оборудование. Создание новых материалов.",
        hard: "Монотонные испытания. Вредные реактивы."
    },

    // ===== ГО И ЧС =====
    {
        id: "civil-defense-engineer",
        title: "Инженер ГО и ЧС",
        shortDesc: "Обеспечение гражданской обороны и защиты от чрезвычайных ситуаций",
        stats: { specialists: 20000, avgAge: 40, genderRatio: "70% мужчин / 30% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание защиты населения.", courses: ["БЖД", "Защита в ЧС"] },
        salary: { start: "45 000 ₽", peak: "160 000+ ₽", median: "80 000 ₽", regions: { central: "60 000–160 000 ₽", northwest: "50 000–130 000 ₽", south: "40 000–100 000 ₽", northcaucasus: "30 000–80 000 ₽", volga: "40 000–100 000 ₽", ural: "45 000–110 000 ₽", siberia: "40 000–110 000 ₽", fareast: "50 000–130 000 ₽" } },
        careerGrowth: [
            { title: "Инженер ГО", period: "0–3 года", salary: "45 000–65 000 ₽" },
            { title: "Ведущий специалист", period: "3–5 лет", salary: "65 000–95 000 ₽" },
            { title: "Начальник управления ГО", period: "5–8 лет", salary: "95 000–130 000 ₽" },
            { title: "Руководитель отдела ГО", period: "8+ лет", salary: "130 000–160 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Оповещение", midday: "10:00–13:00 — Планирование", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Учения" },
        easy: "Социально значимая работа. Стабильность.",
        hard: "Ответственность за жизни людей. Стрессовые ситуации."
    },

    // ===== ГЕОДЕЗИЯ =====
    {
        id: "geodetic-engineer",
        title: "Инженер-геодезист",
        shortDesc: "Геодезические изыскания и топографическая съёмка",
        stats: { specialists: 30000, avgAge: 40, genderRatio: "75% мужчин / 25% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание геодезии.", courses: ["Геодезия", "ГНСС", "ГИС"] },
        salary: { start: "50 000 ₽", peak: "180 000+ ₽", median: "90 000 ₽", regions: { central: "65 000–180 000 ₽", northwest: "55 000–150 000 ₽", south: "45 000–120 000 ₽", northcaucasus: "35 000–90 000 ₽", volga: "45 000–120 000 ₽", ural: "55 000–140 000 ₽", siberia: "50 000–130 000 ₽", fareast: "60 000–160 000 ₽" } },
        careerGrowth: [
            { title: "Геодезист", period: "0–2 года", salary: "50 000–70 000 ₽" },
            { title: "Ведущий геодезист", period: "2–5 лет", salary: "75 000–110 000 ₽" },
            { title: "Начальник геодезической службы", period: "5–8 лет", salary: "110 000–150 000 ₽" },
            { title: "Главный геодезист проекта", period: "8+ лет", salary: "150 000–180 000+ ₽" }
        ],
        typicalDay: { morning: "07:00 — Выезд", midday: "08:30–13:00 — Съёмка", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Обработка" },
        easy: "Работа на свежем воздухе. Современное GPS-оборудование.",
        hard: "Работа в любую погоду. Высокая точность."
    },

    // ===== АСТРОНОМИЯ =====
    {
        id: "astronomer-engineer",
        title: "Инженер-астроном",
        shortDesc: "Разработка и эксплуатация астрономического оборудования",
        stats: { specialists: 5000, avgAge: 39, genderRatio: "70% мужчин / 30% женщин" },
        education: { duration: "5–6 лет", requirements: "Знание астрофизики.", courses: ["Астрофизика", "Оптика"] },
        salary: { start: "55 000 ₽", peak: "200 000+ ₽", median: "100 000 ₽", regions: { central: "70 000–200 000 ₽", northwest: "60 000–170 000 ₽", south: "50 000–140 000 ₽", northcaucasus: "40 000–110 000 ₽", volga: "50 000–140 000 ₽", ural: "55 000–150 000 ₽", siberia: "50 000–140 000 ₽", fareast: "60 000–170 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-исследователь", period: "0–3 года", salary: "55 000–80 000 ₽" },
            { title: "Ведущий инженер", period: "3–6 лет", salary: "80 000–120 000 ₽" },
            { title: "Руководитель группы", period: "6–10 лет", salary: "120 000–160 000 ₽" },
            { title: "Заведующий лабораторией", period: "10+ лет", salary: "160 000–200 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Анализ", midday: "10:30–14:00 — Настройка", afternoon: "14:00–15:00 — Обед", evening: "15:00–19:00 — Наблюдения" },
        easy: "Работа на границе знаний. Романтика космоса.",
        hard: "Ночные наблюдения. Удалённые обсерватории."
    },

    // ===== РЕСТАВРАЦИЯ =====
    {
        id: "restoration-engineer",
        title: "Инженер-реставратор",
        shortDesc: "Реставрация и сохранение памятников архитектуры",
        stats: { specialists: 8000, avgAge: 45, genderRatio: "60% мужчин / 40% женщин" },
        education: { duration: "5–6 лет", requirements: "Знание истории архитектуры.", courses: ["История архитектуры", "Реставрационные технологии"] },
        salary: { start: "50 000 ₽", peak: "180 000+ ₽", median: "90 000 ₽", regions: { central: "65 000–180 000 ₽", northwest: "55 000–150 000 ₽", south: "45 000–120 000 ₽", northcaucasus: "35 000–90 000 ₽", volga: "45 000–120 000 ₽", ural: "50 000–130 000 ₽", siberia: "45 000–120 000 ₽", fareast: "55 000–140 000 ₽" } },
        careerGrowth: [
            { title: "Инженер-реставратор", period: "0–3 года", salary: "50 000–70 000 ₽" },
            { title: "Ведущий реставратор", period: "3–6 лет", salary: "75 000–110 000 ₽" },
            { title: "Руководитель работ", period: "6–10 лет", salary: "110 000–150 000 ₽" },
            { title: "Главный реставратор", period: "10+ лет", salary: "150 000–180 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Осмотр", midday: "10:00–13:00 — Реставрация", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Документация" },
        easy: "Сохранение культурного наследия. Уникальные технологии.",
        hard: "Огромная ответственность. Кропотливая работа."
    },

    // ===== СТАНДАРТИЗАЦИЯ =====
    {
        id: "standardization-engineer",
        title: "Инженер по стандартизации",
        shortDesc: "Разработка и контроль соблюдения стандартов и норм",
        stats: { specialists: 15000, avgAge: 43, genderRatio: "55% мужчин / 45% женщин" },
        education: { duration: "4 года", requirements: "Знание стандартизации.", courses: ["Стандартизация", "Метрология"] },
        salary: { start: "45 000 ₽", peak: "160 000+ ₽", median: "80 000 ₽", regions: { central: "60 000–160 000 ₽", northwest: "50 000–130 000 ₽", south: "40 000–100 000 ₽", northcaucasus: "30 000–80 000 ₽", volga: "40 000–100 000 ₽", ural: "45 000–110 000 ₽", siberia: "40 000–110 000 ₽", fareast: "50 000–130 000 ₽" } },
        careerGrowth: [
            { title: "Инженер по стандартизации", period: "0–3 года", salary: "45 000–65 000 ₽" },
            { title: "Ведущий специалист", period: "3–6 лет", salary: "65 000–95 000 ₽" },
            { title: "Начальник отдела", period: "6–10 лет", salary: "95 000–130 000 ₽" },
            { title: "Главный специалист по качеству", period: "10+ лет", salary: "130 000–160 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Контроль", midday: "10:00–13:00 — Разработка", afternoon: "13:00–14:00 — Обед", evening: "14:00–17:00 — Внедрение" },
        easy: "Стабильная работа. Востребовано на производстве.",
        hard: "Много документации. Строгие сроки."
    },

    // ===== ПАТЕНТОВЕДЕНИЕ =====
    {
        id: "patent-engineer",
        title: "Инженер-патентовед",
        shortDesc: "Защита интеллектуальной собственности и патентование",
        stats: { specialists: 6000, avgAge: 44, genderRatio: "50% мужчин / 50% женщин" },
        education: { duration: "4–5 лет + юриспруденция", requirements: "Знание патентного права.", courses: ["Патентное право", "Патентные исследования"] },
        salary: { start: "50 000 ₽", peak: "180 000+ ₽", median: "95 000 ₽", regions: { central: "65 000–180 000 ₽", northwest: "55 000–150 000 ₽", south: "45 000–120 000 ₽", northcaucasus: "35 000–90 000 ₽", volga: "45 000–120 000 ₽", ural: "50 000–130 000 ₽", siberia: "45 000–120 000 ₽", fareast: "55 000–140 000 ₽" } },
        careerGrowth: [
            { title: "Патентовед", period: "0–3 года", salary: "50 000–70 000 ₽" },
            { title: "Ведущий патентовед", period: "3–6 лет", salary: "70 000–110 000 ₽" },
            { title: "Руководитель отдела", period: "6–10 лет", salary: "110 000–150 000 ₽" },
            { title: "Главный патентовед", period: "10+ лет", salary: "150 000–180 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Поиски", midday: "10:30–14:00 — Заявки", afternoon: "14:00–15:00 — Обед", evening: "15:00–18:00 — Экспертиза" },
        easy: "Интеллектуальная работа. Сочетание техники и права.",
        hard: "Сложные формулировки. Долгие сроки экспертизы."
    },

    // ===== IT =====
    {
        id: "data-engineer",
        title: "Инженер данных (Data Engineer)",
        shortDesc: "Построение и поддержка инфраструктуры данных",
        stats: { specialists: 45000, avgAge: 30, genderRatio: "70% мужчин / 30% женщин" },
        education: { duration: "4 года + курсы", requirements: "Знание SQL.", courses: ["Spark", "Python"] },
        salary: { start: "120 000 ₽", peak: "500 000+ ₽", median: "250 000 ₽", regions: { central: "150 000–500 000 ₽", northwest: "130 000–400 000 ₽", south: "100 000–300 000 ₽", northcaucasus: "80 000–220 000 ₽", volga: "110 000–320 000 ₽", ural: "120 000–350 000 ₽", siberia: "110 000–330 000 ₽", fareast: "120 000–380 000 ₽" } },
        careerGrowth: [
            { title: "Junior Data Engineer", period: "0–1 год", salary: "120 000–150 000 ₽" },
            { title: "Data Engineer", period: "1–3 года", salary: "160 000–250 000 ₽" },
            { title: "Senior Data Engineer", period: "3–5 лет", salary: "260 000–400 000 ₽" },
            { title: "Lead Data Engineer", period: "5+ лет", salary: "400 000–600 000+ ₽" }
        ],
        typicalDay: { morning: "09:30 — Daily", midday: "10:00–13:00 — Пайплайны", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Код-ревью" },
        easy: "Высокий спрос. Работа с большими данными.",
        hard: "Легаси-код. Данные низкого качества."
    },
    {
        id: "devops-engineer",
        title: "DevOps-инженер",
        shortDesc: "Автоматизация разработки и эксплуатации IT-систем",
        stats: { specialists: 60000, avgAge: 31, genderRatio: "78% мужчин / 22% женщин" },
        education: { duration: "4 года + курсы", requirements: "Знание Linux.", courses: ["Docker", "Kubernetes"] },
        salary: { start: "130 000 ₽", peak: "550 000+ ₽", median: "270 000 ₽", regions: { central: "160 000–550 000 ₽", northwest: "140 000–450 000 ₽", south: "110 000–350 000 ₽", northcaucasus: "90 000–250 000 ₽", volga: "120 000–370 000 ₽", ural: "130 000–400 000 ₽", siberia: "120 000–380 000 ₽", fareast: "130 000–420 000 ₽" } },
        careerGrowth: [
            { title: "Junior DevOps", period: "0–1 год", salary: "130 000–170 000 ₽" },
            { title: "DevOps-инженер", period: "1–3 года", salary: "180 000–280 000 ₽" },
            { title: "Senior DevOps", period: "3–5 лет", salary: "300 000–450 000 ₽" },
            { title: "Lead DevOps", period: "5+ лет", salary: "450 000–650 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Алерты", midday: "10:00–13:00 — Terraform", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Инциденты" },
        easy: "Автоматизация. Высокая зарплата.",
        hard: "Ночные дежурства. Легаси-инфраструктура."
    },
    {
        id: "ml-engineer",
        title: "Инженер машинного обучения (ML Engineer)",
        shortDesc: "Разработка и внедрение моделей машинного обучения",
        stats: { specialists: 25000, avgAge: 29, genderRatio: "65% мужчин / 35% женщин" },
        education: { duration: "4–6 лет", requirements: "Знание математики.", courses: ["PyTorch", "TensorFlow"] },
        salary: { start: "150 000 ₽", peak: "600 000+ ₽", median: "300 000 ₽", regions: { central: "180 000–600 000 ₽", northwest: "160 000–500 000 ₽", south: "130 000–400 000 ₽", northcaucasus: "100 000–300 000 ₽", volga: "140 000–420 000 ₽", ural: "150 000–450 000 ₽", siberia: "140 000–430 000 ₽", fareast: "150 000–480 000 ₽" } },
        careerGrowth: [
            { title: "Junior ML Engineer", period: "0–1 год", salary: "150 000–200 000 ₽" },
            { title: "ML Engineer", period: "1–3 года", salary: "210 000–350 000 ₽" },
            { title: "Senior ML Engineer", period: "3–5 лет", salary: "360 000–500 000 ₽" },
            { title: "Lead ML", period: "5+ лет", salary: "500 000–800 000+ ₽" }
        ],
        typicalDay: { morning: "10:00 — Метрики", midday: "10:30–14:00 — Feature engineering", afternoon: "14:00–15:00 — Обед", evening: "15:00–19:00 — Деплой" },
        easy: "Передний край технологий. Огромные зарплаты.",
        hard: "Данные низкого качества. Бесконечные эксперименты."
    },
    {
        id: "security-engineer",
        title: "Инженер по информационной безопасности",
        shortDesc: "Защита IT-инфраструктуры от кибератак",
        stats: { specialists: 35000, avgAge: 33, genderRatio: "75% мужчин / 25% женщин" },
        education: { duration: "4–5 лет", requirements: "Знание сетей.", courses: ["OSCP", "CEH"] },
        salary: { start: "110 000 ₽", peak: "500 000+ ₽", median: "230 000 ₽", regions: { central: "140 000–500 000 ₽", northwest: "120 000–400 000 ₽", south: "90 000–300 000 ₽", northcaucasus: "70 000–220 000 ₽", volga: "100 000–320 000 ₽", ural: "110 000–350 000 ₽", siberia: "100 000–330 000 ₽", fareast: "110 000–380 000 ₽" } },
        careerGrowth: [
            { title: "Аналитик ИБ", period: "0–1 год", salary: "110 000–140 000 ₽" },
            { title: "Инженер ИБ", period: "1–3 года", salary: "150 000–250 000 ₽" },
            { title: "Senior Security Engineer", period: "3–5 лет", salary: "260 000–400 000 ₽" },
            { title: "Head of Security", period: "5+ лет", salary: "400 000–700 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Инциденты", midday: "10:30–13:00 — Пентест", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Аудит" },
        easy: "Высокая зарплата. Остросюжетная работа.",
        hard: "Ночные инциденты. Постоянное обучение."
    },
    {
        id: "cloud-engineer",
        title: "Cloud-инженер",
        shortDesc: "Проектирование и управление облачной инфраструктурой",
        stats: { specialists: 30000, avgAge: 30, genderRatio: "72% мужчин / 28% женщин" },
        education: { duration: "4 года + курсы", requirements: "Знание облаков.", courses: ["Yandex Cloud", "AWS"] },
        salary: { start: "130 000 ₽", peak: "500 000+ ₽", median: "260 000 ₽", regions: { central: "160 000–500 000 ₽", northwest: "140 000–420 000 ₽", south: "110 000–330 000 ₽", northcaucasus: "90 000–240 000 ₽", volga: "120 000–350 000 ₽", ural: "130 000–380 000 ₽", siberia: "120 000–360 000 ₽", fareast: "130 000–400 000 ₽" } },
        careerGrowth: [
            { title: "Junior Cloud Engineer", period: "0–1 год", salary: "130 000–170 000 ₽" },
            { title: "Cloud Engineer", period: "1–3 года", salary: "180 000–280 000 ₽" },
            { title: "Senior Cloud Engineer", period: "3–5 лет", salary: "300 000–450 000 ₽" },
            { title: "Cloud Architect", period: "5+ лет", salary: "450 000–650 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Биллинг", midday: "10:00–13:00 — Архитектура", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Оптимизация" },
        easy: "Передовые технологии. Высокая зарплата.",
        hard: "Биллинг может вырасти. Сложность архитектур."
    },
    {
        id: "embedded-engineer",
        title: "Инженер встраиваемых систем (Embedded)",
        shortDesc: "Разработка ПО для микроконтроллеров и встраиваемых устройств",
        stats: { specialists: 20000, avgAge: 35, genderRatio: "80% мужчин / 20% женщин" },
        education: { duration: "4–5.5 лет", requirements: "Знание C/C++.", courses: ["ARM", "RTOS"] },
        salary: { start: "90 000 ₽", peak: "350 000+ ₽", median: "180 000 ₽", regions: { central: "110 000–350 000 ₽", northwest: "100 000–300 000 ₽", south: "75 000–220 000 ₽", northcaucasus: "60 000–170 000 ₽", volga: "80 000–240 000 ₽", ural: "90 000–280 000 ₽", siberia: "85 000–260 000 ₽", fareast: "95 000–300 000 ₽" } },
        careerGrowth: [
            { title: "Junior Embedded", period: "0–1 год", salary: "90 000–120 000 ₽" },
            { title: "Embedded Engineer", period: "1–3 года", salary: "130 000–200 000 ₽" },
            { title: "Senior Embedded", period: "3–5 лет", salary: "210 000–300 000 ₽" },
            { title: "Lead Embedded", period: "5+ лет", salary: "300 000–450 000+ ₽" }
        ],
        typicalDay: { morning: "09:00 — Баги", midday: "10:00–13:00 — Прошивка", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Осциллограф" },
        easy: "Работа с железом. Видишь результат.",
        hard: "Отладка без отладчика. Жёсткие ограничения памяти."
    },
    {
        id: "frontend-engineer",
        title: "Frontend-разработчик",
        shortDesc: "Разработка пользовательских интерфейсов веб-приложений",
        stats: { specialists: 120000, avgAge: 28, genderRatio: "60% мужчин / 40% женщин" },
        education: { duration: "4 года + курсы", requirements: "Знание JavaScript.", courses: ["React", "Vue", "Angular"] },
        salary: { start: "100 000 ₽", peak: "450 000+ ₽", median: "220 000 ₽", regions: { central: "130 000–450 000 ₽", northwest: "110 000–380 000 ₽", south: "80 000–280 000 ₽", northcaucasus: "65 000–200 000 ₽", volga: "90 000–300 000 ₽", ural: "100 000–330 000 ₽", siberia: "95 000–310 000 ₽", fareast: "105 000–350 000 ₽" } },
        careerGrowth: [
            { title: "Junior Frontend", period: "0–1 год", salary: "100 000–130 000 ₽" },
            { title: "Frontend-разработчик", period: "1–3 года", salary: "140 000–230 000 ₽" },
            { title: "Senior Frontend", period: "3–5 лет", salary: "240 000–350 000 ₽" },
            { title: "Lead Frontend", period: "5+ лет", salary: "350 000–500 000+ ₽" }
        ],
        typicalDay: { morning: "10:00 — Daily", midday: "10:30–14:00 — Компоненты", afternoon: "14:00–15:00 — Обед", evening: "15:00–19:00 — Код-ревью" },
        easy: "Видимый результат сразу. Много вакансий.",
        hard: "Правки дизайна. Кросс-браузерность."
    },
    {
        id: "backend-engineer",
        title: "Backend-разработчик",
        shortDesc: "Разработка серверной логики и API веб-приложений",
        stats: { specialists: 150000, avgAge: 30, genderRatio: "75% мужчин / 25% женщин" },
        education: { duration: "4 года + курсы", requirements: "Знание Java/Go/Python.", courses: ["Spring", "PostgreSQL"] },
        salary: { start: "110 000 ₽", peak: "500 000+ ₽", median: "240 000 ₽", regions: { central: "140 000–500 000 ₽", northwest: "120 000–420 000 ₽", south: "90 000–320 000 ₽", northcaucasus: "75 000–230 000 ₽", volga: "100 000–340 000 ₽", ural: "110 000–370 000 ₽", siberia: "105 000–350 000 ₽", fareast: "115 000–390 000 ₽" } },
        careerGrowth: [
            { title: "Junior Backend", period: "0–1 год", salary: "110 000–150 000 ₽" },
            { title: "Backend-разработчик", period: "1–3 года", salary: "160 000–260 000 ₽" },
            { title: "Senior Backend", period: "3–5 лет", salary: "270 000–400 000 ₽" },
            { title: "Team Lead", period: "5+ лет", salary: "400 000–600 000+ ₽" }
        ],
        typicalDay: { morning: "10:00 — Daily", midday: "10:30–14:00 — API", afternoon: "13:00–14:00 — Обед", evening: "15:00–19:00 — Оптимизация" },
        easy: "Высокий спрос. Чёткие задачи.",
        hard: "Легаси-код. Ночные дедлайны."
    },
    {
        id: "qa-engineer",
        title: "QA-инженер",
        shortDesc: "Обеспечение качества и тестирование программного обеспечения",
        stats: { specialists: 80000, avgAge: 29, genderRatio: "55% мужчин / 45% женщин" },
        education: { duration: "4 года + курсы", requirements: "Знание тестирования.", courses: ["Selenium", "Postman"] },
        salary: { start: "80 000 ₽", peak: "350 000+ ₽", median: "170 000 ₽", regions: { central: "100 000–350 000 ₽", northwest: "90 000–300 000 ₽", south: "65 000–220 000 ₽", northcaucasus: "55 000–160 000 ₽", volga: "75 000–240 000 ₽", ural: "85 000–270 000 ₽", siberia: "80 000–250 000 ₽", fareast: "90 000–290 000 ₽" } },
        careerGrowth: [
            { title: "Junior QA", period: "0–1 год", salary: "80 000–110 000 ₽" },
            { title: "QA Engineer", period: "1–3 года", salary: "120 000–190 000 ₽" },
            { title: "Senior QA", period: "3–5 лет", salary: "200 000–300 000 ₽" },
            { title: "QA Lead", period: "5+ лет", salary: "300 000–450 000+ ₽" }
        ],
        typicalDay: { morning: "09:30 — Баги", midday: "10:00–13:00 — Автотесты", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Ручное тестирование" },
        easy: "Можно найти баги. Автоматизация — творческая работа.",
        hard: "Ручное тестирование утомляет. Баги не воспроизводятся."
    },
    {
        id: "mobile-engineer",
        title: "Mobile-разработчик",
        shortDesc: "Разработка мобильных приложений для iOS и Android",
        stats: { specialists: 55000, avgAge: 29, genderRatio: "70% мужчин / 30% женщин" },
        education: { duration: "4 года + курсы", requirements: "Знание Kotlin/Swift.", courses: ["Kotlin", "Swift"] },
        salary: { start: "110 000 ₽", peak: "450 000+ ₽", median: "230 000 ₽", regions: { central: "140 000–450 000 ₽", northwest: "120 000–380 000 ₽", south: "90 000–280 000 ₽", northcaucasus: "75 000–210 000 ₽", volga: "100 000–310 000 ₽", ural: "110 000–340 000 ₽", siberia: "105 000–320 000 ₽", fareast: "115 000–360 000 ₽" } },
        careerGrowth: [
            { title: "Junior Mobile", period: "0–1 год", salary: "110 000–140 000 ₽" },
            { title: "Mobile-разработчик", period: "1–3 года", salary: "150 000–250 000 ₽" },
            { title: "Senior Mobile", period: "3–5 лет", salary: "260 000–380 000 ₽" },
            { title: "Lead Mobile", period: "5+ лет", salary: "380 000–550 000+ ₽" }
        ],
        typicalDay: { morning: "10:00 — Daily", midday: "10:30–14:00 — Экраны", afternoon: "13:00–14:00 — Обед", evening: "15:00–19:00 — Тестирование" },
        easy: "Продукт в кармане. Быстрая обратная связь.",
        hard: "Фрагментация устройств. Модерация App Store."
    }
];

// ===== АСУ ТП: специализации =====
window.professionsData.push(
    {
        id: "asu-tp-designer",
        title: "Проектировщик АСУ ТП",
        shortDesc: "Проектирование систем автоматизации технологических процессов: структура системы, шкафы, сети, I/O и рабочая документация.",
        stats: { specialists: 95000, avgAge: 43, genderRatio: "70% мужчин / 30% женщин" },
        education: { duration: "4–5 лет + практика", requirements: "Автоматика, электротехника, КИП, промышленные сети.", courses: ["EPLAN", "SCADA", "ПЛК", "Промышленные сети"] },
        salary: { start: "55 000 ₽", peak: "200 000+ ₽", median: "95 000 ₽", regions: { central: "70 000–200 000 ₽", northwest: "60 000–170 000 ₽", south: "50 000–140 000 ₽", northcaucasus: "40 000–110 000 ₽", volga: "55 000–150 000 ₽", ural: "65 000–180 000 ₽", siberia: "55 000–160 000 ₽", fareast: "65 000–190 000 ₽" } },
        careerGrowth: [{ title: "Проектировщик АСУ ТП", period: "0–2 года", salary: "55 000–80 000 ₽" }, { title: "Ведущий проектировщик", period: "2–5 лет", salary: "85 000–140 000 ₽" }, { title: "Руководитель группы", period: "5–8 лет", salary: "140 000–200 000 ₽" }],
        typicalDay: { morning: "08:30 — ТЗ и исходные данные", midday: "09:30–13:00 — Схемы и спецификации", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Проверка документации" },
        easy: "Много проектной работы и понятный результат в документации.",
        hard: "Ошибки в исходных данных дорого исправлять на монтаже."
    },
    {
        id: "asu-tp-programmer",
        title: "Программист АСУ ТП",
        shortDesc: "Разработка программ для ПЛК, HMI и SCADA, настройка обмена данными и логики управления.",
        stats: { specialists: 95000, avgAge: 38, genderRatio: "75% мужчин / 25% женщин" },
        education: { duration: "4–5 лет + практика", requirements: "Программирование, автоматика, алгоритмы управления.", courses: ["IEC 61131-3", "ПЛК", "HMI", "SCADA"] },
        salary: { start: "60 000 ₽", peak: "230 000+ ₽", median: "110 000 ₽", regions: { central: "75 000–230 000 ₽", northwest: "65 000–200 000 ₽", south: "55 000–160 000 ₽", northcaucasus: "45 000–125 000 ₽", volga: "60 000–170 000 ₽", ural: "70 000–190 000 ₽", siberia: "60 000–180 000 ₽", fareast: "70 000–210 000 ₽" } },
        careerGrowth: [{ title: "Программист АСУ ТП", period: "0–2 года", salary: "60 000–90 000 ₽" }, { title: "Ведущий программист", period: "2–5 лет", salary: "100 000–160 000 ₽" }, { title: "Ведущий специалист / архитектор", period: "5+ лет", salary: "160 000–250 000+ ₽" }],
        typicalDay: { morning: "08:00 — Задачи и диагностика", midday: "09:00–13:00 — Логика ПЛК и HMI", afternoon: "13:00–14:00 — Обед", evening: "14:00–18:00 — Тестирование и отладка" },
        easy: "На стыке программирования и реального оборудования.",
        hard: "Ошибки логики могут влиять на технологический процесс."
    },
    {
        id: "asu-tp-commissioning",
        title: "Пуско-наладчик АСУ ТП",
        shortDesc: "Пуск, наладка и проверка систем автоматизации на объекте: от сигналов и шкафов до ПЛК, сетей и алгоритмов.",
        stats: { specialists: 95000, avgAge: 41, genderRatio: "80% мужчин / 20% женщин" },
        education: { duration: "4–5 лет + практика", requirements: "КИП, электротехника, автоматика, диагностика.", courses: ["ПЛК", "SCADA", "Modbus", "Profibus / Profinet"] },
        salary: { start: "65 000 ₽", peak: "250 000+ ₽", median: "120 000 ₽", regions: { central: "80 000–250 000 ₽", northwest: "70 000–210 000 ₽", south: "60 000–180 000 ₽", northcaucasus: "50 000–140 000 ₽", volga: "65 000–190 000 ₽", ural: "75 000–210 000 ₽", siberia: "65 000–200 000 ₽", fareast: "80 000–230 000 ₽" } },
        careerGrowth: [{ title: "Пуско-наладчик АСУ ТП", period: "0–2 года", salary: "65 000–95 000 ₽" }, { title: "Ведущий специалист", period: "2–5 лет", salary: "100 000–170 000 ₽" }, { title: "Руководитель пуско-наладки", period: "5+ лет", salary: "170 000–260 000+ ₽" }],
        typicalDay: { morning: "08:00 — Подготовка и проверки", midday: "09:00–13:00 — Сигналы и оборудование", afternoon: "13:00–14:00 — Обед", evening: "14:00–19:00 — Испытания и наладка" },
        easy: "Много практики и непосредственная работа с объектом.",
        hard: "Выезды, сменный режим и работа в сжатые сроки."
    }
);
