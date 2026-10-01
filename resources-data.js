const resources = [
    // ===== Журналы: инженерия, САПР, производство, автоматизация =====
    {
        id: "mag-cadmaster",
        type: "Журналы",
        name: "CADmaster",
        desc: "Специализированный электронный журнал и портал о САПР, ТИМ/BIM, инженерном программном обеспечении и цифровых технологиях.",
        link: "https://www.cadmaster.ru/"
    },
    {
        id: "mag-vestnik-mashinostroeniya",
        type: "Журналы",
        name: "Вестник машиностроения",
        desc: "Научно-технический журнал по конструированию, расчёту, испытаниям, надёжности машин, технологии машиностроения, материалам, роботизации и САПР.",
        link: "https://www.mashin.ru/eshop/journals/vestnik_mashinostroeniya/"
    },
    {
        id: "mag-avtomatizaciya-sovremennye-tehnologii",
        type: "Журналы",
        name: "Автоматизация. Современные технологии",
        desc: "Научно-технический журнал об автоматизации и механизации производственных процессов, проектировании, информационных технологиях, системах управления и инновационном машиностроении.",
        link: "https://ast.izdatelstvo24.ru/"
    },
    {
        id: "mag-spravochnik-engineer",
        type: "Журналы",
        name: "Справочник. Инженерный журнал",
        desc: "Инженерное издание о механике, динамике, технологии машиностроения, конструировании, расчётах, автоматизации инженерного труда, материалах и внедрении ИИ.",
        link: "https://www.handbook-j.ru/"
    },
    {
        id: "mag-avtomatizaciya-v-promyshlennosti",
        type: "Журналы",
        name: "Автоматизация в промышленности",
        desc: "Ежемесячный научно-технический и производственный журнал для специалистов по промышленной автоматизации, АСУ ТП, КИПиА, инжинирингу и производственным системам.",
        link: "https://avtprom.ru/"
    },
    {
        id: "mag-avtomatizaciya-modelirovanie",
        type: "Журналы",
        name: "Автоматизация и моделирование в проектировании и управлении",
        desc: "Открытый научный журнал по автоматизации и управлению технологическими процессами и производствами, системам автоматизации проектирования и моделированию.",
        link: "https://journals.rcsi.science/2658-3488/index/index/ru_RU"
    },
    {
        id: "mag-vestnik-stankin",
        type: "Журналы",
        name: "Вестник МГТУ «Станкин»",
        desc: "Научный журнал по машиностроению, автоматизации, технологическим процессам и инженерным разработкам. Открытый доступ, входит в ВАК и РИНЦ.",
        link: "https://journals.rcsi.science/2072-3172/index/index/ru_RU"
    },
    {
        id: "mag-zagotovitelnoe-proizvodstvo",
        type: "Журналы",
        name: "Заготовительные производства в машиностроении",
        desc: "Издание о литейном, сварочном, кузнечно-штамповочном и прокатном производстве, материалах, оснастке, САПР технологических процессов и автоматизации.",
        link: "https://www.mashin.ru/eshop/journals/zagotovitel_nye_proizvodstva_v_mashinostroenii/"
    },
    // ===== Журналы =====
    {
        id: "mag-science-life",
        type: "Журналы",
        name: "Наука и жизнь",
        desc: "Классический научно-популярный журнал с материалами по физике, химии, биологии и технике. Один из старейших изданий для инженеров.",
        link: "https://nkj.ru"
    },
    {
        id: "mag-kvant-digital",
        type: "Журналы",
        name: "Квант (цифровой)",
        desc: "Научно-популярный физико-математический журнал для школьников и студентов. Статьи по физике и математике на высоком уровне.",
        link: "https://www.kvant.digital/"
    },
    {
        id: "mag-biblio-mccme",
        type: "Журналы",
        name: "Библиотека МЦНМО",
        desc: "Книги и материалы Московского центра непрерывного математического образования: математика, физика, инженерные науки.",
        link: "https://mccme.ru/ru/magazins/"
    },
    {
        id: "mag-kvantik",
        type: "Журналы",
        name: "Квантик",
        desc: "Детский научно-популярный журнал о математике, физике и лингвистике. Увлекательные задачи и эксперименты для юных инженеров.",
        link: "https://kvantik.com/"
    },
    {
        id: "mag-krugozor-kolobok",
        type: "Журналы",
        name: "Кругозор / Колобок",
        desc: "Архив советских детских журналов с пластинками: увлекательно о технике, науке и путешествиях.",
        link: "http://www.krugozor-kolobok.ru/"
    },
    {
        id: "mag-trv-science",
        type: "Журналы",
        name: "Троицкий вариант — Наука",
        desc: "Независимая научно-популярная газета о науке, академической жизни и технологиях. Актуальные статьи для инженеров и учёных.",
        link: "https://www.trv-science.ru/"
    },
    {
        id: "mag-moluch",
        type: "Журналы",
        name: "Молодой учёный",
        desc: "Научный журнал для молодых исследователей и студентов. Публикация статей по техническим и естественным наукам.",
        link: "https://moluch.ru/"
    },

    // ===== Форумы =====
    {
        id: "forum-habr",
        type: "Форумы",
        name: "Хабр",
        desc: "Крупнейшая русскоязычная платформа о технологиях, IT и инженерии. Статьи, вопросы и обсуждения по всем направлениям.",
        link: "https://habr.com"
    },
    {
        id: "forum-ixbt",
        type: "Форумы",
        name: "iXBT.com",
        desc: "Площадка о компьютерном железе, электронике, радиотехнике и новых технологиях. Активное сообщество технических энтузиастов.",
        link: "https://forum.ixbt.com"
    },

    // ===== Платформы для разработок =====
    {
        id: "dev-github",
        type: "Платформы для разработок",
        name: "GitHub",
        desc: "Крупнейшая в мире платформа для хостинга кода, совместной разработки и управления проектами.",
        link: "https://github.com/"
    },
    {
        id: "dev-gitflic",
        type: "Платформы для разработок",
        name: "GitFlic",
        desc: "Российская платформа для хранения и совместной разработки кода. Аналог GitHub для работы над инженерными и программными проектами.",
        link: "https://gitflic.ru/"
    },
    {
        id: "dev-hub-mos",
        type: "Платформы для разработок",
        name: "Hub.Mos",
        desc: "Московская платформа для обсуждения проектов и идей развития города. Площадка для инженеров и инициативных жителей.",
        link: "https://hub.mos.ru/"
    },
    {
        id: "dev-gitee",
        type: "Платформы для разработок",
        name: "Gitee",
        desc: "Крупнейшая китайская платформа для хостинга кода и совместной разработки. Популярная альтернатива GitHub.",
        link: "https://gitee.com/"
    },
    {
        id: "dev-gitcode",
        type: "Платформы для разработок",
        name: "GitCode",
        desc: "Китайская платформа для хранения и совместной разработки кода, ориентированная на программные и инженерные проекты.",
        link: "https://gitcode.com/"
    },

    // ===== Форумы =====
    {
        id: "forum-eng-tips",
        type: "Форумы",
        name: "Eng-Tips",
        desc: "Большой международный инженерный форум: механика, машиностроение, электротехника, строительство, производство, CAD и смежные области.",
        link: "https://www.eng-tips.com/"
    },
    {
        id: "forum-dwg-ru",
        type: "Форумы",
        name: "DWG.ru",
        desc: "Русскоязычное инженерное сообщество с форумами по AutoCAD, САПР, строительству, проектированию, машиностроению и технической документации.",
        link: "https://forum.dwg.ru/"
    },
    {
        id: "forum-autodesk",
        type: "Форумы",
        name: "Autodesk Community",
        desc: "Официальное сообщество Autodesk с форумами по AutoCAD, Inventor, Fusion, Revit, Civil 3D, Mechanical, CFD, CAM и другим инженерным продуктам.",
        link: "https://forums.autodesk.com/"
    },
    {
        id: "forum-grabcad",
        type: "Форумы",
        name: "GrabCAD Community",
        desc: "Сообщество инженеров и конструкторов: вопросы по CAD, инженерии и 3D-печати, проекты, группы, модели и обучающие материалы.",
        link: "https://grabcad.com/community"
    },
    {
        id: "forum-solidworks",
        type: "Форумы",
        name: "SOLIDWORKS Community",
        desc: "Сообщество пользователей SOLIDWORKS и инженерного ПО: моделирование, чертежи, сборки, Simulation, PDM и автоматизация.",
        link: "https://forum.solidworks.com/"
    },
    {
        id: "forum-cadcam",
        type: "Форумы",
        name: "CAD/CAM форум",
        desc: "Обсуждения CAD/CAM, ЧПУ, станков, технологий обработки, программирования и производственных задач.",
        link: "https://www.cadcam.ru/"
    },
    {
        id: "forum-reddit-engineering",
        type: "Форумы",
        name: "Reddit — Engineering",
        desc: "Международное сообщество для обсуждения инженерных задач, профессий, проектов, образования и практического опыта.",
        link: "https://www.reddit.com/r/engineering/"
    },

    // ===== Платформы для разработок =====
    {
        id: "dev-gitlab",
        type: "Платформы для разработок",
        name: "GitLab",
        desc: "Платформа для хранения кода, контроля версий, совместной разработки, CI/CD, issue tracking и DevOps.",
        link: "https://gitlab.com/"
    },
    {
        id: "dev-codeberg",
        type: "Платформы для разработок",
        name: "Codeberg",
        desc: "Некоммерческая европейская платформа для размещения Git-репозиториев и совместной разработки проектов с открытым исходным кодом.",
        link: "https://codeberg.org/"
    },
    {
        id: "dev-sourcecraft",
        type: "Платформы для разработок",
        name: "SourceCraft",
        desc: "Российская платформа для хранения исходного кода, совместной разработки и работы с Git-репозиториями.",
        link: "https://sourcecraft.dev/"
    },
    {
        id: "dev-grabcad",
        type: "Платформы для разработок",
        name: "GrabCAD",
        desc: "Инженерная платформа с библиотекой CAD-моделей, проектами, группами и материалами для конструкторов и разработчиков.",
        link: "https://grabcad.com/"
    },
    {
        id: "dev-onshape",
        type: "Платформы для разработок",
        name: "Onshape",
        desc: "Облачная CAD-платформа для 3D-моделирования, сборок, совместной работы и управления инженерными данными.",
        link: "https://www.onshape.com/"
    },
    {
        id: "dev-autodesk-platform-services",
        type: "Платформы для разработок",
        name: "Autodesk Platform Services",
        desc: "Набор облачных API и сервисов Autodesk для интеграции CAD/BIM-данных, автоматизации и создания собственных инженерных приложений.",
        link: "https://aps.autodesk.com/"
    },
    {
        id: "dev-freecad",
        type: "Платформы для разработок",
        name: "FreeCAD",
        desc: "Открытая параметрическая CAD-платформа для 3D-моделирования и разработки инженерных решений.",
        link: "https://www.freecad.org/"
    },
    {
        id: "dev-partcommunity",
        type: "Платформы для разработок",
        name: "PARTcommunity",
        desc: "Каталог инженерных компонентов с готовыми CAD-моделями производителей для использования в конструкторских системах.",
        link: "https://www.partcommunity.com/"
    },
    {
        id: "dev-traceparts",
        type: "Платформы для разработок",
        name: "TraceParts",
        desc: "Онлайн-платформа инженерных компонентов и CAD-моделей производителей с загрузкой моделей для различных CAD-систем.",
        link: "https://www.traceparts.com/"
    },

    // ===== Дополнительно проверено: журналы / форумы / платформы =====
    {
        id: "mag-sapr-grafika",
        type: "Журналы",
        name: "САПР и графика",
        desc: "Ежемесячный журнал об автоматизации проектирования, компьютерном анализе, технологической подготовке производства и техническом документообороте.",
        link: "https://www.sapr.ru/"
    },
    {
        id: "mag-problemy-mashinostroeniya-avtomatizacii",
        type: "Журналы",
        name: "Проблемы машиностроения и автоматизации",
        desc: "Научно-технический журнал по машиностроению и автоматизации, с публикациями по инженерным расчётам, производственным и цифровым технологиям.",
        link: "https://www.pressa-rf.ru/rucont/edition/260830/"
    },
    {
        id: "forum-caduser",
        type: "Форумы",
        name: "CADUser Forum",
        desc: "Русскоязычный форум по САПР с разделами по nanoCAD, машиностроению, строительству и другим прикладным инженерным задачам.",
        link: "https://www.caduser.ru/forum/"
    },
    {
        id: "forum-ascon",
        type: "Форумы",
        name: "Форум пользователей ПО АСКОН",
        desc: "Практическое сообщество по КОМПАС-3D, КОМПАС-График, прикладным САПР, параметризации, 2D/3D-моделированию и выпуску документации.",
        link: "https://forum.ascon.ru/"
    },
    {
        id: "platform-cyberleninka",
        type: "Платформы для разработок",
        name: "КиберЛенинка",
        desc: "Научная электронная библиотека с открытым доступом к публикациям по техническим и естественным наукам.",
        link: "https://cyberleninka.ru/"
    },
    {
        id: "platform-elibrary",
        type: "Платформы для разработок",
        name: "eLIBRARY.RU",
        desc: "Российская научная электронная библиотека и информационно-аналитическая система по научным публикациям и цитированию.",
        link: "https://elibrary.ru/"
    },
    {
        id: "platform-zhurnalivak",
        type: "Платформы для разработок",
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
        name: "You_engineer_asu",
        desc: "Канал о жизни инженера АСУ ТП без приукрашиваний. Там же большой чат для обмена опытом.",
        link: "https://t.me/you_engineer_asu"
    },
    {
        id: "fr-forodirch-news",
        type: "Дружественные каналы",
        name: "ForodirchNEWS",
        desc: "Канал доктора физико-математических наук: много непопулярной политики, занимательных вещей и путешествий.",
        link: "https://t.me/forodirchNEWS"
    },
    {
        id: "fr-mathrocknroll",
        type: "Дружественные каналы",
        name: "Mathrocknroll",
        desc: "Красота математики, пригодной для быта.",
        link: "https://t.me/mathrocknroll"
    },
    {
        id: "fr-nachertillicome",
        type: "Дружественные каналы",
        name: "Nachertilicome",
        desc: "Корабел шутит и объясняет сложное на пальцах под музыку.",
        link: "https://t.me/Nachertilicome"
    },
    {
        id: "fr-catin-asutp",
        type: "Дружественные каналы",
        name: "CatinAsuTp",
        desc: "Канал инженера АСУ ТП и его аккуратных проектов с юмором.",
        link: "https://t.me/catinAsuTp"
    },
    {
        id: "fr-pro-asutp",
        type: "Дружественные каналы",
        name: "Pro_asutp",
        desc: "Роботы на зарплате. Оптимизация по высшему разряду.",
        link: "https://t.me/pro_asutp"
    },
    {
        id: "fr-dragon-logic",
        type: "Дружественные каналы",
        name: "Dragon_logic",
        desc: "Новые инструментальные средства для программирования ПЛК (ООП).",
        link: "https://t.me/dragon_logic"
    },
    {
        id: "fr-whyisitso",
        type: "Дружественные каналы",
        name: "Whyisitso",
        desc: "Проблемы людей, железок, людей с железками и железок с людьми.",
        link: "https://t.me/whyisitso"
    },
    {
        id: "fr-cerreradark-official",
        type: "Дружественные каналы",
        name: "Cerreradarkofficial",
        desc: "Канал, где делают самый лучший фонк.",
        link: "https://t.me/cerreradarkofficial/763"
    },
    {
        id: "fr-aiunusov",
        type: "Дружественные каналы",
        name: "Aiunusov",
        desc: "Канал философа-практика, режиссёра и эзотерика.",
        link: "https://t.me/aiunusov"
    },
    {
        id: "fr-popyachsa",
        type: "Дружественные каналы",
        name: "Popyachsa",
        desc: "Агрегатор хорошего настроения от иностранного агента. Разработка, мемы, много непопулярной политики и науки.",
        link: "https://t.me/popyachsa"
    },
    {
        id: "fr-prlshrlinlove",
        type: "Дружественные каналы",
        name: "Prlshrlinlove",
        desc: "Психологический канал о людях с расстройствами личности.",
        link: "https://t.me/prlshrlinlove"
    }
];