const resources = [
    // ===== Журналы: инженерия, САПР, производство, автоматизация =====
    {
        id: "mag-cadmaster",
        type: "Журналы",
        topic: "Машиностроение и САПР",
        name: "CADmaster",
        desc: "Специализированный электронный журнал и портал о САПР, ТИМ/BIM, инженерном программном обеспечении и цифровых технологиях.",
        link: "https://www.cadmaster.ru/"
    },
    {
        id: "mag-vestnik-mashinostroeniya",
        type: "Журналы",
        topic: "Машиностроение и САПР",
        name: "Вестник машиностроения",
        desc: "Научно-технический журнал по конструированию, расчёту, испытаниям, надёжности машин, технологии машиностроения, материалам, роботизации и САПР.",
        link: "https://www.mashin.ru/eshop/journals/vestnik_mashinostroeniya/"
    },
    {
        id: "mag-avtomatizaciya-sovremennye-tehnologii",
        type: "Журналы",
        topic: "Автоматизация и электроника",
        name: "Автоматизация. Современные технологии",
        desc: "Научно-технический журнал об автоматизации и механизации производственных процессов, проектировании, информационных технологиях, системах управления и инновационном машиностроении.",
        link: "https://ast.izdatelstvo24.ru/"
    },
    {
        id: "mag-spravochnik-engineer",
        type: "Журналы",
        topic: "Машиностроение и САПР",
        name: "Справочник. Инженерный журнал",
        desc: "Инженерное издание о механике, динамике, технологии машиностроения, конструировании, расчётах, автоматизации инженерного труда, материалах и внедрении ИИ.",
        link: "https://www.handbook-j.ru/"
    },
    {
        id: "mag-avtomatizaciya-v-promyshlennosti",
        type: "Журналы",
        topic: "Автоматизация и электроника",
        name: "Автоматизация в промышленности",
        desc: "Ежемесячный научно-технический и производственный журнал для специалистов по промышленной автоматизации, АСУ ТП, КИПиА, инжинирингу и производственным системам.",
        link: "https://avtprom.ru/"
    },
    {
        id: "mag-avtomatizaciya-modelirovanie",
        type: "Журналы",
        topic: "Автоматизация и электроника",
        name: "Автоматизация и моделирование в проектировании и управлении",
        desc: "Открытый научный журнал по автоматизации и управлению технологическими процессами и производствами, системам автоматизации проектирования и моделированию.",
        link: "https://journals.rcsi.science/2658-3488/index/index/ru_RU"
    },
    {
        id: "mag-vestnik-stankin",
        type: "Журналы",
        topic: "Машиностроение и САПР",
        name: "Вестник МГТУ «Станкин»",
        desc: "Научный журнал по машиностроению, автоматизации, технологическим процессам и инженерным разработкам. Открытый доступ, входит в ВАК и РИНЦ.",
        link: "https://journals.rcsi.science/2072-3172/index/index/ru_RU"
    },
    {
        id: "mag-zagotovitelnoe-proizvodstvo",
        type: "Журналы",
        topic: "Машиностроение и САПР",
        name: "Заготовительные производства в машиностроении",
        desc: "Издание о литейном, сварочном, кузнечно-штамповочном и прокатном производстве, материалах, оснастке, САПР технологических процессов и автоматизации.",
        link: "https://www.mashin.ru/eshop/journals/zagotovitel_nye_proizvodstva_v_mashinostroenii/"
    },
    // ===== Журналы =====
    {
        id: "mag-science-life",
        type: "Журналы",
        topic: "Наука и образование",
        name: "Наука и жизнь",
        desc: "Классический научно-популярный журнал с материалами по физике, химии, биологии и технике. Один из старейших изданий для инженеров.",
        link: "https://nkj.ru"
    },
    {
        id: "mag-kvant-digital",
        type: "Журналы",
        topic: "Наука и образование",
        name: "Квант (цифровой)",
        desc: "Научно-популярный физико-математический журнал для школьников и студентов. Статьи по физике и математике на высоком уровне.",
        link: "https://www.kvant.digital/"
    },
    {
        id: "mag-biblio-mccme",
        type: "Научные базы и справочники",
        name: "Библиотека МЦНМО",
        desc: "Книги и материалы Московского центра непрерывного математического образования: математика, физика, инженерные науки.",
        link: "https://mccme.ru/ru/magazins/"
    },
    {
        id: "mag-kvantik",
        type: "Журналы",
        topic: "Наука и образование",
        name: "Квантик",
        desc: "Детский научно-популярный журнал о математике, физике и лингвистике. Увлекательные задачи и эксперименты для юных инженеров.",
        link: "https://kvantik.com/"
    },
    {
        id: "mag-krugozor-kolobok",
        type: "Журналы",
        topic: "Наука и образование",
        name: "Кругозор / Колобок",
        desc: "Архив советских детских журналов с пластинками: увлекательно о технике, науке и путешествиях.",
        link: "http://www.krugozor-kolobok.ru/"
    },
    {
        id: "mag-trv-science",
        type: "Журналы",
        topic: "Наука и образование",
        name: "Троицкий вариант — Наука",
        desc: "Независимая научно-популярная газета о науке, академической жизни и технологиях. Актуальные статьи для инженеров и учёных.",
        link: "https://www.trv-science.ru/home-2/"
    },
    {
        id: "mag-moluch",
        type: "Журналы",
        topic: "Наука и образование",
        name: "Молодой учёный",
        desc: "Научный журнал для молодых исследователей и студентов. Публикация статей по техническим и естественным наукам.",
        link: "https://moluch.ru/"
    },

    // ===== Форумы =====
    {
        id: "forum-habr",
        type: "Форумы",
        topic: "ИТ и технологии",
        name: "Хабр",
        desc: "Крупнейшая русскоязычная платформа о технологиях, IT и инженерии. Статьи, вопросы и обсуждения по всем направлениям.",
        link: "https://habr.com"
    },
    {
        id: "forum-ixbt",
        type: "Форумы",
        topic: "ИТ и технологии",
        name: "iXBT.com",
        desc: "Площадка о компьютерном железе, электронике, радиотехнике и новых технологиях. Активное сообщество технических энтузиастов.",
        link: "https://forum.ixbt.com"
    },

    // ===== Платформы для разработок =====
    {
        id: "dev-github",
        type: "Разработка ПО",
        name: "GitHub",
        desc: "Крупнейшая в мире платформа для хостинга кода, совместной разработки и управления проектами.",
        link: "https://github.com/"
    },
    {
        id: "dev-gitflic",
        type: "Разработка ПО",
        name: "GitFlic",
        desc: "Российская платформа для хранения и совместной разработки кода. Аналог GitHub для работы над инженерными и программными проектами.",
        link: "https://gitflic.ru/"
    },
    {
        id: "dev-hub-mos",
        type: "Разработка ПО",
        name: "Hub.Mos",
        desc: "Московская платформа для обсуждения проектов и идей развития города. Площадка для инженеров и инициативных жителей.",
        link: "https://hub.mos.ru/"
    },
    {
        id: "dev-gitee",
        type: "Разработка ПО",
        name: "Gitee",
        desc: "Крупнейшая китайская платформа для хостинга кода и совместной разработки. Популярная альтернатива GitHub.",
        link: "https://gitee.com/"
    },
    {
        id: "dev-gitcode",
        type: "Разработка ПО",
        name: "GitCode",
        desc: "Китайская платформа для хранения и совместной разработки кода, ориентированная на программные и инженерные проекты.",
        link: "https://gitcode.com/"
    },

    // ===== Форумы =====
    {
        id: "forum-eng-tips",
        type: "Форумы",
        topic: "Общая инженерия",
        name: "Eng-Tips",
        desc: "Большой международный инженерный форум: механика, машиностроение, электротехника, строительство, производство, CAD и смежные области.",
        link: "https://www.eng-tips.com/"
    },
    {
        id: "forum-dwg-ru",
        type: "Форумы",
        topic: "САПР и конструирование",
        name: "DWG.ru",
        desc: "Русскоязычное инженерное сообщество с форумами по AutoCAD, САПР, строительству, проектированию, машиностроению и технической документации.",
        link: "https://forum.dwg.ru/"
    },
    {
        id: "forum-autodesk",
        type: "Форумы",
        topic: "САПР и конструирование",
        name: "Autodesk Community",
        desc: "Официальное сообщество Autodesk с форумами по AutoCAD, Inventor, Fusion, Revit, Civil 3D, Mechanical, CFD, CAM и другим инженерным продуктам.",
        link: "https://forums.autodesk.com/"
    },
    {
        id: "forum-grabcad",
        type: "Форумы",
        topic: "САПР и конструирование",
        name: "GrabCAD Community",
        desc: "Сообщество инженеров и конструкторов: вопросы по CAD, инженерии и 3D-печати, проекты, группы, модели и обучающие материалы.",
        link: "https://grabcad.com/community"
    },
    {
        id: "forum-solidworks",
        type: "Форумы",
        topic: "САПР и конструирование",
        name: "SOLIDWORKS Community",
        desc: "Сообщество пользователей SOLIDWORKS и инженерного ПО: моделирование, чертежи, сборки, Simulation, PDM и автоматизация.",
        link: "https://forum.solidworks.com/"
    },
    {
        id: "forum-cadcam",
        type: "Форумы",
        topic: "ЧПУ и металлообработка",
        name: "CNC-Club — ЧПУ и CAD/CAM",
        desc: "Русскоязычный форум о ЧПУ, станках, CAD/CAM-системах, постпроцессорах, G-коде и технологиях обработки.",
        link: "https://cnc-club.ru/forum/"
    },
    {
        id: "forum-reddit-engineering",
        type: "Форумы",
        topic: "Общая инженерия",
        name: "Reddit — Engineering",
        desc: "Международное сообщество для обсуждения инженерных задач, профессий, проектов, образования и практического опыта.",
        link: "https://www.reddit.com/r/engineering/"
    },

    // ===== Платформы для разработок =====
    {
        id: "dev-gitlab",
        type: "Разработка ПО",
        name: "GitLab",
        desc: "Платформа для хранения кода, контроля версий, совместной разработки, CI/CD, issue tracking и DevOps.",
        link: "https://gitlab.com/"
    },
    {
        id: "dev-codeberg",
        type: "Разработка ПО",
        name: "Codeberg",
        desc: "Некоммерческая европейская платформа для размещения Git-репозиториев и совместной разработки проектов с открытым исходным кодом.",
        link: "https://codeberg.org/"
    },
    {
        id: "dev-sourcecraft",
        type: "Разработка ПО",
        name: "SourceCraft",
        desc: "Российская платформа для хранения исходного кода, совместной разработки и работы с Git-репозиториями.",
        link: "https://sourcecraft.dev/"
    },
    {
        id: "dev-grabcad",
        type: "САПР и конструирование",
        name: "GrabCAD",
        desc: "Инженерная платформа с библиотекой CAD-моделей, проектами, группами и материалами для конструкторов и разработчиков.",
        link: "https://grabcad.com/"
    },
    {
        id: "dev-onshape",
        type: "САПР и конструирование",
        name: "Onshape",
        desc: "Облачная CAD-платформа для 3D-моделирования, сборок, совместной работы и управления инженерными данными.",
        link: "https://www.onshape.com/"
    },
    {
        id: "dev-autodesk-platform-services",
        type: "САПР и конструирование",
        name: "Autodesk Platform Services",
        desc: "Набор облачных API и сервисов Autodesk для интеграции CAD/BIM-данных, автоматизации и создания собственных инженерных приложений.",
        link: "https://aps.autodesk.com/"
    },
    {
        id: "dev-freecad",
        type: "САПР и конструирование",
        name: "FreeCAD",
        desc: "Открытая параметрическая CAD-платформа для 3D-моделирования и разработки инженерных решений.",
        link: "https://www.freecad.org/"
    },
    {
        id: "dev-partcommunity",
        type: "САПР и конструирование",
        name: "PARTcommunity",
        desc: "Каталог инженерных компонентов с готовыми CAD-моделями производителей для использования в конструкторских системах.",
        link: "https://www.partcommunity.com/"
    },
    {
        id: "dev-traceparts",
        type: "САПР и конструирование",
        name: "TraceParts",
        desc: "Онлайн-платформа инженерных компонентов и CAD-моделей производителей с загрузкой моделей для различных CAD-систем.",
        link: "https://www.traceparts.com/"
    },

    // ===== Дополнительно проверено: журналы / форумы / платформы =====
    {
        id: "mag-sapr-grafika",
        type: "Журналы",
        topic: "Машиностроение и САПР",
        name: "САПР и графика",
        desc: "Ежемесячный журнал об автоматизации проектирования, компьютерном анализе, технологической подготовке производства и техническом документообороте.",
        link: "https://www.sapr.ru/"
    },
    {
        id: "mag-problemy-mashinostroeniya-avtomatizacii",
        type: "Журналы",
        topic: "Машиностроение и САПР",
        name: "Проблемы машиностроения и автоматизации",
        desc: "Научно-технический журнал по машиностроению и автоматизации, с публикациями по инженерным расчётам, производственным и цифровым технологиям.",
        link: "https://www.pressa-rf.ru/rucont/edition/260830/"
    },
    {
        id: "forum-caduser",
        type: "Форумы",
        topic: "САПР и конструирование",
        name: "CADUser Forum",
        desc: "Русскоязычный форум по САПР с разделами по nanoCAD, машиностроению, строительству и другим прикладным инженерным задачам.",
        link: "https://www.caduser.ru/forum/"
    },
    {
        id: "forum-ascon",
        type: "Форумы",
        topic: "САПР и конструирование",
        name: "Форум пользователей ПО АСКОН",
        desc: "Практическое сообщество по КОМПАС-3D, КОМПАС-График, прикладным САПР, параметризации, 2D/3D-моделированию и выпуску документации.",
        link: "https://forum.ascon.ru/"
    },
    {
        id: "platform-cyberleninka",
        type: "Научные базы и справочники",
        name: "КиберЛенинка",
        desc: "Научная электронная библиотека с открытым доступом к публикациям по техническим и естественным наукам.",
        link: "https://cyberleninka.ru/"
    },
    {
        id: "platform-elibrary",
        type: "Научные базы и справочники",
        name: "eLIBRARY.RU",
        desc: "Российская научная электронная библиотека и информационно-аналитическая система по научным публикациям и цитированию.",
        link: "https://elibrary.ru/"
    },
    {
        id: "platform-zhurnalivak",
        type: "Научные базы и справочники",
        name: "Открытый каталог журналов ВАК",
        desc: "Каталог научных журналов по техническим наукам с поиском по направлениям, включая машиностроение, строительство, ИТ и энергетику.",
        link: "https://www.zhurnalivak.ru/"
    },

    // ===== Чаты в Telegram =====
    {
        id: "tg-electronix",
        type: "Чаты в Telegram",
        name: "Electronix",
        desc: "Telegram-чат для общения об электронике, схемотехнике и разработке электронных устройств.",
        link: "https://t.me/electronix"
    },
    {
        id: "tg-it-chats",
        type: "Чаты в Telegram",
        name: "IT-чаты",
        desc: "Сборник Telegram-чатов для IT-специалистов: обмен опытом, вакансии и обсуждение технологий.",
        link: "https://t.me/it_chats"
    },
    {
        id: "tg-speech-recognition-ru",
        type: "Чаты в Telegram",
        name: "Распознавание речи RU",
        desc: "Русскоязычный Telegram-чат о распознавании речи, обработке аудио и речевых технологиях.",
        link: "https://t.me/speech_recognition_ru"
    },
    {
        id: "tg-russianphoneclub",
        type: "Чаты в Telegram",
        name: "Russian Phone Club",
        desc: "Telegram-чат о телефонах, мобильных устройствах и связанных с ними технологиях.",
        link: "https://t.me/russianphoneclub"
    },
    {
        id: "tg-solidsovet",
        type: "Чаты в Telegram",
        name: "SolidSovet",
        desc: "Сообщество пользователей САПР SolidWorks: обсуждение моделирования, чертежей и проектирования.",
        link: "https://t.me/solidsovet"
    },
    {
        id: "tg-decadentia-chat",
        type: "Чаты в Telegram",
        name: "DeCADentia Chat",
        desc: "Telegram-чат о САПР AutoCAD и проектировании: обмен опытом, лайфхаки и решение задач.",
        link: "https://t.me/DeCADentia_Chat"
    },
    {
        id: "tg-brainfuckpc-chat",
        type: "Чаты в Telegram",
        name: "BrainfuckPC Chat",
        desc: "Telegram-чат о компьютерах, железе и сборке ПК: советы, обсуждения и помощь.",
        link: "https://t.me/brainfuckpc_chat"
    },
    {
        id: "tg-ru2chmobi",
        type: "Чаты в Telegram",
        name: "Ru2ch mobil",
        desc: "Telegram-чат о мобильных устройствах и гаджетах: новости, обсуждения и рекомендации.",
        link: "https://t.me/ru2chmobi"
    },
    {
        id: "tg-cadmeetup",
        type: "Чаты в Telegram",
        name: "CAD Meetup",
        desc: "Telegram-чат о САПР и инженерном проектировании: встречи, обсуждения и обмен опытом.",
        link: "https://t.me/cadmeetup"
    },
    {
        id: "tg-ru-iot",
        type: "Чаты в Telegram",
        name: "RU IoT",
        desc: "Русскоязычный Telegram-чат об интернете вещей (IoT): устройства, протоколы и умный дом.",
        link: "https://t.me/ru_iot"
    },
    {
        id: "tg-ru-electronics",
        type: "Чаты в Telegram",
        name: "RU Electronics",
        desc: "Русскоязычный Telegram-чат об электронике: схемы, компоненты и разработка устройств.",
        link: "https://t.me/ru_electronics"
    },
    {
        id: "tg-ru-arduino",
        type: "Чаты в Telegram",
        name: "RU Arduino",
        desc: "Русскоязычный Telegram-чат об Arduino и микроконтроллерах: проекты, код и помощь.",
        link: "https://t.me/ru_arduino"
    },

    // ===== Дружественные каналы =====
    {
        id: "fr-you-engineer-asu",
        type: "Дружественные каналы",
        name: "Ты же инженер АСУ ТП",
        desc: "Канал о жизни инженера АСУ ТП без приукрашиваний. Там же большой чат для обмена опытом.",
        link: "https://t.me/you_engineer_asu"
    },
    {
        id: "fr-forodirch-news",
        type: "Дружественные каналы",
        name: "Кофейный теоретик",
        desc: "Канал доктора физико-математических наук: много непопулярной политики, занимательных вещей и путешествий.",
        link: "https://t.me/forodirchNEWS"
    },
    {
        id: "fr-mathrocknroll",
        type: "Дружественные каналы",
        name: "Математический рок-н-ролл",
        desc: "Красота математики, пригодной для быта.",
        link: "https://t.me/mathrocknroll"
    },
    {
        id: "fr-catin-asutp",
        type: "Дружественные каналы",
        name: "КОТЭ в АСУ ТП",
        desc: "Канал инженера АСУ ТП и его аккуратных проектов с юмором.",
        link: "https://t.me/catinAsuTp"
    },
    {
        id: "fr-pro-asutp",
        type: "Дружественные каналы",
        name: "Роботы на зарплате",
        desc: "Оптимизация по высшему разряду.",
        link: "https://t.me/pro_asutp"
    },
    {
        id: "fr-dragon-logic",
        type: "Дружественные каналы",
        name: "ЯП ДРАКОН++",
        desc: "Новые инструментальные средства для программирования ПЛК (ООП).",
        link: "https://t.me/dragon_logic"
    },
    {
        id: "fr-whyisitso",
        type: "Дружественные каналы",
        name: "Почему оно такое?",
        desc: "Проблемы людей, железок, людей с железками и железок с людьми.",
        link: "https://t.me/whyisitso"
    },
    {
        id: "fr-cerreradark-official",
        type: "Дружественные каналы",
        name: "Cerrera D'Ark",
        desc: "Канал, где делают самый лучший фонк.",
        link: "https://t.me/cerreradarkofficial/763"
    },
    {
        id: "fr-aiunusov",
        type: "Дружественные каналы",
        name: "Artur's Channel",
        desc: "Канал философа-практика, режиссёра и эзотерика.",
        link: "https://t.me/aiunusov"
    },
    {
        id: "fr-popyachsa",
        type: "Дружественные каналы",
        name: "Попячечная",
        desc: "Агрегатор хорошего настроения от иностранного агента. Разработка, мемы, много непопулярной политики и науки.",
        link: "https://t.me/popyachsa"
    },
    {
        id: "fr-prlshrlinlove",
        type: "Дружественные каналы",
        name: "Погранично-шизоидные отношения",
        desc: "Психологический канал о людях с расстройствами личности.",
        link: "https://t.me/prlshrlinlove"
    },

    // ===== Дополнения 21.10.2026: проверенные страницы, вне чатов и дружественных каналов =====
    {
        "id": "mag-ufn",
        "type": "Журналы",
        topic: "Наука и образование",
        "name": "Успехи физических наук",
        "desc": "Рецензируемые обзоры физики, экспериментальных методов и приборостроения.",
        "link": "https://ufn.ru/"
    },
    {
        "id": "mag-kipis",
        "type": "Журналы",
        topic: "Материалы, контроль и измерения",
        "name": "КИПиС",
        "desc": "Профильный журнал и статьи о контрольно-измерительных приборах, измерениях и метрологии.",
        "link": "https://www.kipis.ru/"
    },
    {
        "id": "mag-welding-naks",
        "type": "Журналы",
        topic: "Материалы, контроль и измерения",
        "name": "Сварка и диагностика",
        "desc": "Научно-технический журнал о сварке, неразрушающем контроле и диагностике; материалы выпусков могут быть платными.",
        "link": "https://svarka.naks.ru/"
    },
    {
        "id": "mag-izvuz-mash",
        "type": "Журналы",
        topic: "Машиностроение и САПР",
        "name": "Известия вузов. Машиностроение",
        "desc": "Научный журнал МГТУ имени Баумана по конструированию, машиностроению и технологиям.",
        "link": "https://izvuzmash.bmstu.ru/"
    },
    {
        "id": "forum-metrologu",
        "type": "Форумы",
        topic: "АСУ ТП",
        "name": "Главный форум метрологов",
        "desc": "Поверка, калибровка, стандарты, измерения и метрологическая документация.",
        "link": "https://metrologu.ru/"
    },
    {
        "id": "forum-electronix",
        "type": "Форумы",
        topic: "АСУ ТП",
        "name": "Форум ELECTRONIX",
        "desc": "Русскоязычные обсуждения микроконтроллеров, схемотехники, компонентной базы и встраиваемых систем.",
        "link": "https://electronix.ru/forum/"
    },
    {
        "id": "forum-radiokot",
        "type": "Форумы",
        topic: "Электроника и микроконтроллеры",
        "name": "РадиоКот",
        "desc": "Схемотехника, ремонт, радиодетали и проекты любительской электроники.",
        "link": "https://www.radiokot.ru/forum/"
    },
    {
        "id": "forum-kicad",
        "type": "Форумы",
        topic: "Электроника и микроконтроллеры",
        "name": "KiCad.info",
        "desc": "Сообщество пользователей KiCad: разводка плат, библиотеки, производственные файлы.",
        "link": "https://forum.kicad.info/"
    },
    {
        "id": "forum-electronics-se",
        "type": "Форумы",
        topic: "Электроника и микроконтроллеры",
        "name": "Electrical Engineering Stack Exchange",
        "desc": "Вопросы и технические ответы об электронике, цепях, микроконтроллерах и измерениях.",
        "link": "https://electronics.stackexchange.com/"
    },
    {
        "id": "forum-robotics-se",
        "type": "Форумы",
        topic: "АСУ ТП",
        "name": "Robotics Stack Exchange",
        "desc": "Практические вопросы по робототехнике, приводам, датчикам и алгоритмам управления.",
        "link": "https://robotics.stackexchange.com/"
    },
    {
        "id": "forum-asutpforum",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "Форум АСУТП",
        "desc": "Обсуждения промышленной автоматики, ПЛК, КИПиА и эксплуатации систем управления; доступность форума не подтверждена при текущей проверке.",
        "link": "https://asutpforum.ru/"
    },
    {
        "id": "forum-proasutp",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "Форум Про АСУ ТП",
        "desc": "Профессиональная площадка по АСУ ТП, программированию и наладке; содержимое форума при текущей проверке не открылось.",
        "link": "https://forum.proasutp.com/"
    },
    {
        "id": "forum-asu-tp-community",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "АСУ ТП — сообщество инженеров",
        "desc": "Форум инженеров по ПЛК и автоматизации, статьи из практики, библиотека, вакансии и обсуждения.",
        "link": "https://asu-tp.su/forum/"
    },
    {
        "id": "forum-cyberforum",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "КиберФорум",
        "desc": "Русскоязычный форум по программированию, системному администрированию, электронике и техническим задачам.",
        "link": "https://www.cyberforum.ru/"
    },
    {
        "id": "forum-delta-electronics",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "Delta Electronics — форум",
        "desc": "Вопросы по контроллерам, приводам и оборудованию Delta Electronics; ссылка ведёт прямо в действующий раздел форума, а не на главную страницу поставщика.",
        "link": "https://www.delta-forum.ru/viewforum.php?f=2"
    },
    {
        "id": "forum-owen",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "ОВЕН — форум АСУ ТП",
        "desc": "ПЛК ОВЕН, CODESYS, OWEN Logic, SCADA, КИПиА, датчики, Modbus и наладка оборудования.",
        "link": "https://owen.ru/forum/index.php"
    },
    {
        "id": "forum-plctalk",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "PLCTalk",
        "desc": "Вопросы по PLC, HMI, SCADA, промышленным сетям и поиску неисправностей; автоматические запросы иногда блокируются.",
        "link": "https://www.plctalk.net/forums/"
    },
    {
        "id": "forum-mrplc",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "MrPLC",
        "desc": "Сообщество по контроллерам Siemens, Allen-Bradley, Omron, Mitsubishi, HMI и робототехнике.",
        "link": "https://mrplc.com/forums/"
    },
    {
        "id": "forum-control-com",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "Control.com — форумы",
        "desc": "Промышленная автоматизация, измерения, электроприводы, датчики, управление и инженерная практика; защита может ограничивать автоматический доступ.",
        "link": "https://control.com/forums/"
    },
    {
        "id": "forum-codesys",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "CODESYS Forge Talk",
        "desc": "Официальные обсуждения IEC 61131-3, среды CODESYS, визуализации, runtime и промышленного управления.",
        "link": "https://forge.codesys.com/forge/talk/?f=1"
    },
    {
        "id": "forum-rockwell",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "Rockwell Automation Engage",
        "desc": "Сообщество пользователей Studio 5000, FactoryTalk, ControlLogix, приводов и сетей промышленной автоматизации.",
        "link": "https://engage.rockwellautomation.com/home"
    },
    {
        "id": "forum-plcforums",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "PLC Forums",
        "desc": "Обсуждения оборудования Siemens, Rockwell, Omron, Mitsubishi и других систем автоматизации.",
        "link": "https://plcforums.com/"
    },
    {
        "id": "forum-krug2000",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "КРУГ-2000 — форум АСУ ТП",
        "desc": "Форум программно-технических комплексов и SCADA КРУГ-2000, OPC-серверов и промышленного управления; архив обновляется нерегулярно.",
        "link": "https://www.forum.krug2000.ru/"
    },
    {
        "id": "forum-cccp3d",
        "type": "Форумы",
        "topic": "САПР и конструирование",
        "name": "CCCP3D — CAD/CAM/CAE",
        "desc": "Русскоязычное сообщество по NX, CATIA, CAM, стойкам ЧПУ, постпроцессорам и проектированию; сайт может ограничивать автоматический доступ.",
        "link": "https://cccp3d.ru/"
    },
    {
        "id": "forum-onshape",
        "type": "Форумы",
        "topic": "САПР и конструирование",
        "name": "Onshape Forums",
        "desc": "Сообщество облачной параметрической САПР: детали, сборки, чертежи, FeatureScript, совместная работа.",
        "link": "https://forum.onshape.com/discussions"
    },
    {
        "id": "forum-freecad-official",
        "type": "Форумы",
        "topic": "САПР и конструирование",
        "name": "FreeCAD Forum",
        "desc": "Официальный форум свободной САПР FreeCAD: рабочие среды, моделирование, FEM, Python; при открытии возможна антибот-проверка.",
        "link": "https://forum.freecad.org/"
    },
    {
        "id": "forum-cxem",
        "type": "Форумы",
        "topic": "Электроника и микроконтроллеры",
        "name": "Паяльник — форум схемотехники",
        "desc": "Русскоязычный форум радиоэлектроники: STM32, AVR, платы, приборы, промышленные контроллеры.",
        "link": "https://forum.cxem.net/"
    },
    {
        "id": "forum-promelec",
        "type": "Форумы",
        "topic": "Электроника и микроконтроллеры",
        "name": "Промэлектроника — форум",
        "desc": "Электронные компоненты, микроконтроллеры, программирование, отладка и консультации по оборудованию.",
        "link": "https://forum.promelec.ru/"
    },
    {
        "id": "forum-rlocman",
        "type": "Форумы",
        "topic": "Электроника и микроконтроллеры",
        "name": "РадиоЛоцман — форум",
        "desc": "Разработка, диагностика и ремонт электроники, схемотехника, компоненты и измерения.",
        "link": "https://www.rlocman.ru/forum/"
    },
    {
        "id": "forum-eham",
        "type": "Форумы",
        "topic": "Электроника и микроконтроллеры",
        "name": "eHam — технический форум",
        "desc": "Вопросы разработчиков по микроконтроллерам, источникам питания, радиотехнике и электронным компонентам.",
        "link": "https://www.eham.ru/forum"
    },
    {
        "id": "forum-allaboutcircuits",
        "type": "Форумы",
        "topic": "Электроника и микроконтроллеры",
        "name": "All About Circuits Forum",
        "desc": "Англоязычное сообщество электронщиков: аналоговые схемы, PCB, микроконтроллеры и измерения; автоматический доступ ограничен.",
        "link": "https://forum.allaboutcircuits.com/"
    },
    {
        "id": "forum-tehnari-electronics",
        "type": "Форумы",
        "topic": "Электроника и микроконтроллеры",
        "name": "Технари — электроника",
        "desc": "Русскоязычные обсуждения самодельной электроники, схем, источников питания и микроконтроллеров.",
        "link": "https://tehnari.ru/forums/forum-po-elektronike.39/"
    },
    {
        "id": "forum-chipmaker",
        "type": "Форумы",
        "topic": "ЧПУ и металлообработка",
        "name": "Chipmaker — металлообработка",
        "desc": "Профессиональные обсуждения токарных и фрезерных станков, сварки, термообработки и ЧПУ; прямая автоматическая проверка сайта ограничена.",
        "link": "https://chipmaker.ru/"
    },
    {
        "id": "forum-cnc-userforum",
        "type": "Форумы",
        "topic": "ЧПУ и металлообработка",
        "name": "Форум клана ЧПУшников",
        "desc": "Станки и комплектующие ЧПУ, инструмент, шпиндели, ArtCAM, ремонт и наладка.",
        "link": "https://cnc.userforum.ru/"
    },
    {
        "id": "forum-lightburn",
        "type": "Форумы",
        "topic": "ЧПУ и металлообработка",
        "name": "LightBurn Software Forum",
        "desc": "Лазерная резка и гравировка: программа LightBurn, совместимость станков, контроллеры и настройка.",
        "link": "https://forum.lightburnsoftware.com/"
    },
    {
        "id": "forum-meztool",
        "type": "Форумы",
        "topic": "ЧПУ и металлообработка",
        "name": "Meztool — металлообработка",
        "desc": "Фрезерование, точение, режущий инструмент, режимы обработки, CAM и технологии производства.",
        "link": "https://meztool.ru/forums/"
    },
    {
        "id": "forum-alfa-industry",
        "type": "Форумы",
        "topic": "ЧПУ и металлообработка",
        "name": "Альфа-Индастри — сварка и металлообработка",
        "desc": "TIG, MIG/MAG, MMA, плазменная резка, материалы, оборудование и технологические вопросы.",
        "link": "https://www.alfa-industry.ru/forum/"
    },
    {
        "id": "forum-metalorezzka",
        "type": "Форумы",
        "topic": "ЧПУ и металлообработка",
        "name": "MetaloRezzka — цеховой форум",
        "desc": "Практика лазерной и плазменной резки, гибки, DXF, выбора станков и контроля качества.",
        "link": "https://metalorezzka.ru/"
    },
    {
        "id": "forum-abok",
        "type": "Форумы",
        "topic": "Общая инженерия",
        "name": "АВОК — диалог специалистов",
        "desc": "Инженерные системы зданий: отопление, вентиляция, автоматизация, электроснабжение, проектирование и нормативы.",
        "link": "https://forum.abok.ru/"
    },
    {
        "id": "forum-opennet",
        "type": "Форумы",
        topic: "АСУ ТП",
        "name": "OpenNET",
        "desc": "Обсуждения Linux, промышленных систем, сетей и открытого программного обеспечения.",
        "link": "https://www.opennet.ru/"
    },
    {
        "id": "dev-gitverse",
        "type": "Разработка ПО",
        "name": "GitVerse",
        "desc": "Российский сервис Git-репозиториев и совместной разработки; условия сервиса могут изменяться.",
        "link": "https://gitverse.ru/"
    },
    {
        "id": "dev-forgejo",
        "type": "Разработка ПО",
        "name": "Forgejo",
        "desc": "Свободная платформа для размещения собственных Git-сервисов и управления разработкой.",
        "link": "https://forgejo.org/"
    },
    {
        "id": "dev-gitea",
        "type": "Разработка ПО",
        "name": "Gitea",
        "desc": "Самостоятельно разворачиваемый Git-сервис с задачами, ревью и CI/CD.",
        "link": "https://about.gitea.com/"
    },
    {
        "id": "dev-platformio",
        "type": "Разработка ПО",
        "name": "PlatformIO",
        "desc": "Инструменты для проектов с микроконтроллерами, библиотеками и отладкой встроенного ПО.",
        "link": "https://platformio.org/"
    },
    {
        "id": "dev-jupyter",
        "type": "Разработка ПО",
        "name": "Project Jupyter",
        "desc": "Интерактивные блокноты для Python, аналитики, расчётов и исследований.",
        "link": "https://jupyter.org/"
    },
    {
        "id": "dev-kicad",
        "type": "САПР и конструирование",
        "name": "KiCad",
        "desc": "Свободный EDA-пакет для принципиальных схем, печатных плат и просмотра 3D.",
        "link": "https://www.kicad.org/"
    },
    {
        "id": "dev-openscad",
        "type": "САПР и конструирование",
        "name": "OpenSCAD",
        "desc": "Параметрическое 3D-моделирование геометрии с помощью кода.",
        "link": "https://openscad.org/"
    },
    {
        "id": "dev-openmodelica",
        "type": "Инструменты и симуляторы",
        "name": "OpenModelica",
        "desc": "Моделирование динамических физических систем на языке Modelica.",
        "link": "https://openmodelica.org/"
    },
    {
        "id": "dev-wokwi",
        "type": "Инструменты и симуляторы",
        "name": "Wokwi",
        "desc": "Браузерная симуляция проектов с ESP32, Arduino и другими микроконтроллерами.",
        "link": "https://wokwi.com/"
    },
    {
        "id": "dev-simscale",
        "type": "Инструменты и симуляторы",
        "name": "SimScale",
        "desc": "Облачное инженерное моделирование, включая CFD и расчёты конструкций; доступ зависит от тарифов.",
        "link": "https://www.simscale.com/"
    },
    {
        "id": "ref-siemens-sieportal",
        "type": "Форумы",
        "topic": "АСУ ТП",
        "name": "Siemens SiePortal — поддержка",
        "desc": "Официальная поддержка промышленной продукции Siemens: техническая документация, материалы и обращения по оборудованию; для работы портала требуется JavaScript.",
        "link": "https://sieportal.siemens.com/en-ww/support"
    },
    {
        "id": "ref-engineering-toolbox",
        "type": "Научные базы и справочники",
        "name": "Engineering ToolBox",
        "desc": "Инженерные справочные формулы, таблицы свойств и калькуляторы; критичные значения сверяйте с первоисточниками.",
        "link": "https://www.engineeringtoolbox.com/"
    },
    {
        "id": "ref-efunda",
        "type": "Научные базы и справочники",
        "name": "eFunda",
        "desc": "Справочные данные и учебные материалы по механике, машиностроению и материалам.",
        "link": "https://www.efunda.com/"
    },
    {
        "id": "ref-arxiv",
        "type": "Научные базы и справочники",
        "name": "arXiv",
        "desc": "Открытый архив научных препринтов; размещение работы не означает рецензирования.",
        "link": "https://arxiv.org/"
    },
    {
        "id": "ref-crossref",
        "type": "Научные базы и справочники",
        "name": "Crossref",
        "desc": "Метаданные научных публикаций, DOI и сведения об источниках.",
        "link": "https://www.crossref.org/"
    },
    {
        "id": "std-rosstandart",
        "type": "Стандарты и метрология",
        "name": "Портал Росстандарта",
        "desc": "Официальное опубликование документов по стандартизации, классификаторов и технических регламентов.",
        "link": "https://protect.gost.ru/"
    },
    {
        "id": "std-iso",
        "type": "Стандарты и метрология",
        "name": "ISO",
        "desc": "Международная организация по стандартизации; тексты многих стандартов приобретаются отдельно.",
        "link": "https://www.iso.org/"
    },
    {
        "id": "std-iec",
        "type": "Стандарты и метрология",
        "name": "IEC Webstore",
        "desc": "Официальный каталог международных стандартов по электротехнике и электронике; документы обычно платные.",
        "link": "https://webstore.iec.ch/"
    },
    {
        "id": "std-nist",
        "type": "Стандарты и метрология",
        "name": "NIST",
        "desc": "Американский институт метрологии и стандартов: исследования, справочные данные и измерительные методики.",
        "link": "https://www.nist.gov/"
    },
    {
        "id": "learn-mit-ocw",
        "type": "Обучение и курсы",
        "name": "MIT OpenCourseWare",
        "desc": "Открытые материалы курсов Массачусетского технологического института, преимущественно на английском.",
        "link": "https://ocw.mit.edu/"
    },
    {
        "id": "learn-nptel",
        "type": "Обучение и курсы",
        "name": "NPTEL",
        "desc": "Университетские инженерные лекции и курсы индийских технических вузов; язык преимущественно английский.",
        "link": "https://nptel.ac.in/"
    },
    {
        "id": "learn-teachengineering",
        "type": "Обучение и курсы",
        "name": "TeachEngineering",
        "desc": "Учебные инженерные проекты, практические задания и методические материалы для школьного обучения.",
        "link": "https://www.teachengineering.org/"
    },

    // ===== Каталог профильной прессы и конструкторских систем; октябрь 2026 =====
    {
        "id": "mag-metallurg",
        "type": "Журналы",
        "topic": "Материалы, контроль и измерения",
        "name": "Металлург",
        "desc": "Производство и обработка чёрных и цветных металлов; научные и отраслевые статьи.",
        "link": "https://metallurgizdat.com/jurnalmetallurg"
    },
    {
        "id": "mag-black-metallurgy",
        "type": "Журналы",
        "topic": "Материалы, контроль и измерения",
        "name": "Проблемы чёрной металлургии и материаловедения",
        "desc": "Материалы, технологии обработки металлов и металлургические процессы.",
        "link": "https://metallurgizdat.com/probchermet"
    },
    {
        "id": "mag-vestnik-mei",
        "type": "Журналы",
        "topic": "Энергетика, строительство и транспорт",
        "name": "Вестник МЭИ",
        "desc": "Энергетика, электромеханика, радиоэлектроника и техническая автоматика.",
        "link": "https://vestnik.mpei.ru/index.php/vestnik/index"
    },
    {
        "id": "mag-industrial-engineering",
        "type": "Журналы",
        "topic": "Машиностроение и САПР",
        "name": "Машиностроение: сетевой научный журнал",
        "desc": "Исследования в машиностроении, механике, промышленных технологиях и инженерии.",
        "link": "https://indust-engineering.ru/"
    },
    {
        "id": "mag-food-industry",
        "type": "Журналы",
        "topic": "Пищевая и лёгкая промышленность",
        "name": "Пищевая промышленность",
        "desc": "Технологии пищевых производств, оборудование и управление качеством.",
        "link": "https://www.foodprom.ru/journals/pischevaya-promyshlennost"
    },
    {
        "id": "mag-beverages",
        "type": "Журналы",
        "topic": "Пищевая и лёгкая промышленность",
        "name": "Пиво и напитки",
        "desc": "Технологии производства напитков, сырьё, линии и контроль качества.",
        "link": "https://foodprom.ru/journals/pivo-i-napitki"
    },
    {
        "id": "mag-control-diagnostics",
        "type": "Журналы",
        "topic": "Материалы, контроль и измерения",
        "name": "Контроль. Диагностика",
        "desc": "Неразрушающий контроль, техническая диагностика, мониторинг оборудования.",
        "link": "https://www.td-j.ru/"
    },
    {
        "id": "mag-sta",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Современные технологии автоматизации (СТА)",
        "desc": "АСУ ТП, промышленная автоматизация, встраиваемые системы и практика интеграторов.",
        "link": "https://www.cta.ru/magazines/cta/"
    },
    {
        "id": "mag-modern-electronics",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Современная электроника",
        "desc": "Схемотехника, электронные компоненты, проектирование устройств.",
        "link": "https://www.cta.ru/magazines/soel/"
    },
    {
        "id": "mag-stankoinstrument",
        "type": "Журналы",
        "topic": "Машиностроение и САПР",
        "name": "Станкоинструмент",
        "desc": "Станкостроение, ЧПУ, обработка металлов, инструмент и технологии изготовления.",
        "link": "https://www.stankoinst.ru/"
    },
    {
        "id": "mag-aviation-tech",
        "type": "Журналы",
        "topic": "Энергетика, строительство и транспорт",
        "name": "Известия вузов. Авиационная техника",
        "desc": "Проектирование воздушных судов, аэродинамика и технологии авиапрома.",
        "link": "https://aviatech.kai.ru/index"
    },
    {
        "id": "mag-power-electronics",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Силовая электроника",
        "desc": "Преобразователи, источники питания, силовые полупроводники.",
        "link": "https://power-e.ru/journal/"
    },
    {
        "id": "mag-electrical-market",
        "type": "Журналы",
        "topic": "Энергетика, строительство и транспорт",
        "name": "Электротехнический рынок",
        "desc": "Отраслевое рекламно-аналитическое издание об электротехнической продукции.",
        "link": "https://er.elec.ru/"
    },
    {
        "id": "mag-analitika",
        "type": "Журналы",
        "topic": "Материалы, контроль и измерения",
        "name": "Аналитика",
        "desc": "Приборы и методы аналитической химии, лабораторное измерительное оборудование.",
        "link": "https://www.j-analytics.ru/"
    },
    {
        "id": "mag-nanoindustry",
        "type": "Журналы",
        "topic": "Материалы, контроль и измерения",
        "name": "Наноиндустрия",
        "desc": "Наноматериалы, исследования, нанотехнологические процессы и оборудование.",
        "link": "https://www.nanoindustry.su/"
    },
    {
        "id": "mag-komponenty",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Компоненты и технологии",
        "desc": "Электронные компоненты, проектирование электроники и технологии монтажа.",
        "link": "https://kit-e.ru/about/"
    },
    {
        "id": "mag-sudostroenie",
        "type": "Журналы",
        "topic": "Энергетика, строительство и транспорт",
        "name": "Судостроение",
        "desc": "Кораблестроение, корпусные конструкции, морские технологии и судоремонт.",
        "link": "https://www.sstc.spb.ru/publications/sudostroy/"
    },
    {
        "id": "mag-photonics",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Фотоника",
        "desc": "Оптика, лазерная техника, фотонные приборы и технологические применения.",
        "link": "https://www.photonics.su/"
    },
    {
        "id": "mag-electronics",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Электроника: Наука, технология, бизнес",
        "desc": "Микроэлектроника, разработки, компоненты и производство электронных изделий.",
        "link": "https://www.electronics.ru/"
    },
    {
        "id": "mag-first-mile",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Первая миля",
        "desc": "Телекоммуникации, инфраструктура связи и сетевое оборудование.",
        "link": "https://www.lastmile.su/page/mile_about"
    },
    {
        "id": "mag-pribory",
        "type": "Журналы",
        "topic": "Материалы, контроль и измерения",
        "name": "Приборы и техника эксперимента",
        "desc": "Экспериментальное оборудование, методы измерений, научное приборостроение.",
        "link": "https://iet.ras.ru/about.shtml"
    },
    {
        "id": "mag-light-industry",
        "type": "Журналы",
        "topic": "Пищевая и лёгкая промышленность",
        "name": "Известия вузов. Технология лёгкой промышленности",
        "desc": "Текстиль, трикотаж, производство одежды, материалы и оборудование.",
        "link": "https://journal.prouniver.ru/"
    },
    {
        "id": "mag-foodtech-vuz",
        "type": "Журналы",
        "topic": "Пищевая и лёгкая промышленность",
        "name": "Известия вузов. Пищевая технология",
        "desc": "Научные исследования пищевых технологий и перерабатывающей промышленности.",
        "link": "https://ivpt.ru/news/"
    },
    {
        "id": "mag-world-measurements",
        "type": "Журналы",
        "topic": "Материалы, контроль и измерения",
        "name": "Мир измерений",
        "desc": "Прикладная метрология, управление качеством, измерительные технологии.",
        "link": "https://www.asms.ru/struktura/magazine/ria-stk/mir-izmereniy/"
    },
    {
        "id": "mag-mechatronics",
        "type": "Журналы",
        "topic": "Автоматизация и электроника",
        "name": "Мехатроника, автоматизация, управление",
        "desc": "Промышленные системы управления, мехатроника и робототехника.",
        "link": "https://iptmuran.ru/journals/mehatronika-avtomatizacija-upravlenie/"
    },
    {
        "id": "mag-electric-industry-market",
        "type": "Журналы",
        "topic": "Энергетика, строительство и транспорт",
        "name": "Рынок электротехники",
        "desc": "Отраслевые обзоры электротехнического оборудования, производителей и проектов.",
        "link": "https://marketelectro.ru/magazine"
    },
    {
        "id": "mag-radio-archive",
        "type": "Журналы",
        "topic": "Наука и образование",
        "name": "Радио — архив номеров",
        "desc": "Исторический архив радиотехнического журнала со схемами и публикациями.",
        "link": "https://archive.radio.ru/web/"
    },
    {
        "id": "mag-design-material-tech",
        "type": "Журналы",
        "topic": "Пищевая и лёгкая промышленность",
        "name": "Дизайн. Материалы. Технология",
        "desc": "Проектирование, промышленные материалы, технологическая подготовка и дизайн.",
        "link": "https://journal.prouniver.ru/dmt/"
    },
    {
        "id": "mag-spgutd-vestnik",
        "type": "Журналы",
        "topic": "Пищевая и лёгкая промышленность",
        "name": "Вестник СПГУТД",
        "desc": "Исследования промышленных технологий, материалов и систем автоматизации.",
        "link": "https://journal.prouniver.ru/vestnik/"
    },
    {
        "id": "cad-kompas",
        "type": "САПР и конструирование",
        "name": "КОМПАС-3D",
        "desc": "Российская САПР для 3D-моделирования изделий, сборок и конструкторской документации.",
        "link": "https://kompas.ru/"
    },
    {
        "id": "cad-nanocad",
        "type": "САПР и конструирование",
        "name": "nanoCAD",
        "desc": "Российская САПР 2D/3D, чертежи и проектная документация DWG.",
        "link": "https://www.nanocad.ru/products/"
    },
    {
        "id": "cad-tflex",
        "type": "САПР и конструирование",
        "name": "T-FLEX CAD / PLM",
        "desc": "Параметрическое проектирование, работа с изделием, CAD/CAM/PDM.",
        "link": "https://www.tflex.ru/"
    },
    {
        "id": "cad-ascon",
        "type": "САПР и конструирование",
        "name": "АСКОН — инженерные продукты",
        "desc": "Каталог КОМПАС, ВЕРТИКАЛЬ, ЛОЦМАН, Renga и других инженерных систем.",
        "link": "https://ascon.ru/products/"
    },

    // ===== Онлайн измерительные приборы: тренажёры и виртуальные лаборатории =====
    {
        "id": "measurement-mic-tools",
        "type": "Онлайн-измерения",
        "topic": "Микрометр",
        "name": "ToolsPix — микрометр",
        "desc": "Интерактивный барабан и гильза; разные цены деления, погрешность нуля, упражнения.",
        "link": "https://toolspix.uk/image-tools/micrometer/"
    },
    {
        "id": "measurement-mic-numerilo",
        "type": "Онлайн-измерения",
        "topic": "Микрометр",
        "name": "Numerilo — микрометр",
        "desc": "Микрометр 0–25 мм и 0,01 мм; вращение барабана, объяснение отсчёта и упражнения.",
        "link": "https://numerilo.com/micrometer-screw-gauge-simulator/"
    },
    {
        "id": "measurement-mic-trade",
        "type": "Онлайн-измерения",
        "topic": "Микрометр и штангенциркуль",
        "name": "Trade Schools — метрологический практикум",
        "desc": "Общая лаборатория микрометров и штангенциркулей с проверкой результата и допусков.",
        "link": "https://www.trade-schools.net/tools/micrometer-caliper-practice"
    },
    {
        "id": "measurement-mic-mech",
        "type": "Онлайн-измерения",
        "topic": "Микрометр",
        "name": "MechSimulator — винтовой микрометр",
        "desc": "Виртуальный винтовой микрометр и проверка чтения шкалы.",
        "link": "https://mechsimulator.com/tools/screw-gauge/"
    },
    {
        "id": "measurement-dial-mech",
        "type": "Онлайн-измерения",
        "topic": "Индикатор",
        "name": "MechSimulator — индикатор часового типа",
        "desc": "Циферблат 0,01 мм, установка нуля, тренировка и учебная проверка биения.",
        "link": "https://mechsimulator.com/tools/dial-gauge/"
    },
    {
        "id": "measurement-dial-stefanelli",
        "type": "Онлайн-измерения",
        "topic": "Индикатор",
        "name": "Stefanelli — индикатор часового типа",
        "desc": "Учебный индикатор с перемещением штока и установкой нуля; интерфейс на английском.",
        "link": "https://www.stefanelli.eng.br/en/virtual-dial-indicator-simulator-hundredths-millimeter/"
    },
    {
        "id": "measurement-angle-stefanelli",
        "type": "Онлайн-измерения",
        "topic": "Угломер",
        "name": "Stefanelli — угломер с нониусом",
        "desc": "Виртуальный угломер с нониусом и отсчётом до 5 угловых минут.",
        "link": "https://www.stefanelli.eng.br/en/virtual-goniometer-five-minutes-degree/"
    },
    {
        "id": "measurement-ruler-screen",
        "type": "Онлайн-измерения",
        "topic": "Экранная линейка",
        "name": "Online Ruler — линейка на экране",
        "desc": "Экранная линейка в миллиметрах и дюймах. Для физического размера сначала калибруйте масштаб дисплея.",
        "link": "https://online-ruler.net/"
    },
    {
        "id": "measurement-multimeter-mokxi",
        "type": "Онлайн-измерения",
        "topic": "Электроизмерения",
        "name": "Mokxi — мультиметр",
        "desc": "Виртуальный мультиметр на модели электрической схемы: напряжение, сопротивление, ток, ёмкость и диод.",
        "link": "https://mokxi.com/multimeter-simulator"
    },
    {
        "id": "measurement-oscilloscope-falstad",
        "type": "Онлайн-измерения",
        "topic": "Электроизмерения",
        "name": "Falstad CircuitJS — осциллограммы",
        "desc": "Симулятор электронных цепей с графиками напряжения и тока, работающими как осциллограф.",
        "link": "https://falstad.com/circuit/circuitjs.html"
    },
    {
        "id": "measurement-dial-caliper-mech",
        "type": "Онлайн-измерения",
        "topic": "Штангенциркуль",
        "name": "MechSimulator — штангенциркуль с индикатором",
        "desc": "Симуляция штангенциркуля с круговой шкалой, ошибки нуля и тренировочные задания.",
        "link": "https://mechsimulator.com/tools/dial-caliper/"
    },
    {
        "id": "measurement-vernier-numerilo",
        "type": "Онлайн-измерения",
        "topic": "Штангенциркуль",
        "name": "Numerilo — нониусный штангенциркуль",
        "desc": "Интерактивная шкала и тренировочные задания для чтения нониуса.",
        "link": "https://numerilo.com/vernier-caliper-simulator/"
    },

    // ===== Кураторское пополнение 22.10.2026: проверка целевых страниц и условий бесплатного обучения =====
    {
        "id": "mag-communications-engineering",
        "type": "Журналы",
        "topic": "Энергетика, строительство и транспорт",
        "name": "Communications Engineering",
        "desc": "Рецензируемый журнал открытого доступа о механике, материалах, робототехнике и инженерных системах.",
        "link": "https://www.nature.com/commseng/"
    },
    {
        "id": "mag-frontiers-mechanical",
        "type": "Журналы",
        "topic": "Машиностроение и САПР",
        "name": "Frontiers in Mechanical Engineering",
        "desc": "Журнал открытого доступа о механических системах, теплообмене, мехатронике и цифровом производстве.",
        "link": "https://www.frontiersin.org/journals/mechanical-engineering"
    },
    {
        "id": "forum-arduino",
        "type": "Форумы",
        topic: "Электроника и микроконтроллеры",
        "name": "Arduino Forum",
        "desc": "Официальный форум по микроконтроллерам, прошивкам, аппаратуре и отладке Arduino.",
        "link": "https://forum.arduino.cc/"
    },
    {
        "id": "forum-engineering-stackexchange",
        "type": "Форумы",
        topic: "Общая инженерия",
        "name": "Engineering Stack Exchange",
        "desc": "Профессиональные вопросы и ответы по механике, электротехнике, расчётам и проектированию.",
        "link": "https://engineering.stackexchange.com/"
    },
    {
        "id": "forum-librecad",
        "type": "Форумы",
        topic: "САПР и конструирование",
        "name": "LibreCAD Forum",
        "desc": "Вопросы пользователей свободной 2D-САПР LibreCAD, чертежи, DXF, настройка и ошибки.",
        "link": "https://discourse.librecad.org/"
    },
    {
        "id": "dev-sourceforge",
        "type": "Разработка ПО",
        "name": "SourceForge",
        "desc": "Хостинг, совместная разработка, распространение и каталог программ с открытым исходным кодом.",
        "link": "https://sourceforge.net/"
    },
    {
        "id": "dev-launchpad",
        "type": "Разработка ПО",
        "name": "Launchpad",
        "desc": "Платформа разработки с Git-репозиториями, задачами, ревью и пакетами для Ubuntu.",
        "link": "https://launchpad.net/"
    },
    {
        "id": "cad-librecad",
        "type": "САПР и конструирование",
        "name": "LibreCAD",
        "desc": "Свободная 2D-САПР для технических чертежей, DXF и работы без подписки.",
        "link": "https://librecad.org/"
    },
    {
        "id": "cad-solvespace",
        "type": "САПР и конструирование",
        "name": "SolveSpace",
        "desc": "Свободная параметрическая 2D/3D-САПР для деталей, сборочных ограничений и экспорта STEP.",
        "link": "https://solvespace.com/index.pl"
    },
    {
        "id": "tool-phet",
        "type": "Инструменты и симуляторы",
        "name": "PhET",
        "desc": "Бесплатные интерактивные модели по физике, электричеству, химии и математике.",
        "link": "https://phet.colorado.edu/"
    },
    {
        "id": "tool-falstad-circuit",
        "type": "Инструменты и симуляторы",
        "name": "Falstad Circuit Simulator",
        "desc": "Моделирование электрических цепей в браузере: токи, напряжения и осциллограммы.",
        "link": "https://falstad.com/circuit/"
    },
    {
        "id": "tool-octave-online",
        "type": "Инструменты и симуляторы",
        "name": "Octave Online",
        "desc": "Онлайн-редактор для численных расчётов и выполнения кода GNU Octave; сложные задачи нагружают браузер.",
        "link": "https://octave-online.net/"
    },
    {
        "id": "tool-scilab",
        "type": "Инструменты и симуляторы",
        "name": "Scilab / Xcos",
        "desc": "Свободные численные вычисления и моделирование динамических систем; требуется установка.",
        "link": "https://www.scilab.org/"
    },
    {
        "id": "ref-nist-webbook",
        "type": "Научные базы и справочники",
        "name": "NIST Chemistry WebBook",
        "desc": "Справочные термохимические и спектральные данные с описанием источников и ограничений.",
        "link": "https://webbook.nist.gov/chemistry/"
    },
    {
        "id": "ref-nasa-ntrs",
        "type": "Научные базы и справочники",
        "name": "NASA Technical Reports Server",
        "desc": "Открытые инженерные отчёты NASA: аэрокосмическая техника, испытания и исследования.",
        "link": "https://ntrs.nasa.gov/"
    },
    {
        "id": "ref-pubchem",
        "type": "Научные базы и справочники",
        "name": "PubChem",
        "desc": "Публичная база химических соединений, структуры и физико-химических свойств; требует JavaScript.",
        "link": "https://pubchem.ncbi.nlm.nih.gov/"
    },
    {
        "id": "ref-allaboutcircuits",
        "type": "Научные базы и справочники",
        "name": "All About Circuits — учебник",
        "desc": "Открытый учебник по цепям постоянного и переменного тока, схемотехнике и электронике.",
        "link": "https://www.allaboutcircuits.com/textbook/product/ac-circuits/"
    },
    {
        "id": "std-bipm-si",
        "type": "Стандарты и метрология",
        "name": "BIPM — Брошюра SI",
        "desc": "Официальное описание Международной системы единиц SI и правил записи величин.",
        "link": "https://www.bipm.org/en/publications/si-brochure"
    },
    {
        "id": "std-nist-constants",
        "type": "Стандарты и метрология",
        "name": "NIST — физические константы",
        "desc": "Рекомендованные значения фундаментальных физических констант, неопределённости и ссылки на CODATA.",
        "link": "https://physics.nist.gov/cuu/Constants/"
    },
    {
        "id": "std-euramet",
        "type": "Стандарты и метрология",
        "name": "EURAMET",
        "desc": "Европейская сеть национальных метрологических институтов: руководства, проекты и результаты работ.",
        "link": "https://www.euramet.org/"
    },
    {
        "id": "learn-freecodecamp",
        "type": "Обучение и курсы",
        "name": "freeCodeCamp",
        "desc": "Полностью бесплатные курсы и практические задания по программированию, Python и веб-разработке.",
        "link": "https://www.freecodecamp.org/"
    },
    {
        "id": "learn-odin",
        "type": "Обучение и курсы",
        "name": "The Odin Project",
        "desc": "Бесплатная структурированная программа по веб-разработке и Git с практическими проектами.",
        "link": "https://www.theodinproject.com/"
    },
    {
        "id": "learn-openlearn",
        "type": "Обучение и курсы",
        "name": "OpenLearn — бесплатные курсы",
        "desc": "Подборка бесплатных коротких университетских курсов Open University; есть STEM и цифровые навыки.",
        "link": "https://www.open.edu/openlearn/free-courses"
    },
    {
        "id": "learn-mit-open-library",
        "type": "Обучение и курсы",
        "name": "MIT Open Learning Library",
        "desc": "Бесплатные интерактивные университетские материалы и задания без регистрации; без сертификата.",
        "link": "https://openlearninglibrary.mit.edu/"
    },
    {
        "id": "learn-arduino",
        "type": "Обучение и курсы",
        "name": "Arduino — учебные материалы",
        "desc": "Бесплатные официальные уроки по схемам, микроконтроллерам, интерфейсам и программированию.",
        "link": "https://docs.arduino.cc/learn"
    },
    {
        "id": "learn-allaboutcircuits",
        "type": "Обучение и курсы",
        "name": "All About Circuits — DC Circuits",
        "desc": "Бесплатный последовательный учебник по электрическим цепям постоянного тока.",
        "link": "https://www.allaboutcircuits.com/TEXTBOOK/product/dc-circuits/"
    },
    {
        "id": "measurement-kelibron",
        "type": "Онлайн-измерения",
        "topic": "Штангенциркуль и микрометр",
        "name": "KELIBRON — 3D метрологическая лаборатория",
        "desc": "Бесплатный браузерный тренажёр штангенциркулей и микрометров с проверкой приёмки детали; требует WebGL.",
        "link": "https://kelibron.com/?play=scene-micrometer-reading"
    },
    {
        "id": "tg-sprutai-3dcreator",
        "type": "Чаты в Telegram",
        "name": "Sprut — 3D-печать и моделирование",
        "desc": "Публичный технический чат по 3D-печати и моделированию; отдельная группа экосистемы Sprut.AI.",
        "link": "https://t.me/SprutAI_3Dcreator"
    },
    {
        "id": "tg-chat3diy",
        "type": "Чаты в Telegram",
        "name": "3DIY — 3D-печать",
        "desc": "Публичный чат о 3D-принтерах, материалах и печати, связанный с каналом 3DIY.",
        "link": "https://t.me/chat3diy"
    },
    {
        "id": "tg-python-generation",
        "type": "Чаты в Telegram",
        "name": "Поколение Python — чат",
        "desc": "Обсуждение программирования и учебного сообщества «Поколение Python»; правила и модерация указаны в группе.",
        "link": "https://t.me/pygen_ru_comments"
    },
];