/* Отдельный набор из 25 внешних учебных ресурсов, без загрузки всего каталога сообщества. */
const codingResources = [
    {"id":"ai-library-01","type":"Библиотека программирования для ИИ","topic":"Python","name":"Руководство по Python","desc":"Синтаксис, функции, структуры данных, классы и модули. Язык: RU.","link":"https://docs.python.org/ru/3/tutorial/","tags":"RU"},
    {"id":"ai-library-02","type":"Библиотека программирования для ИИ","topic":"Python","name":"Стандартная библиотека Python","desc":"API модулей Python, работа с файлами, JSON и асинхронностью. Язык: RU/EN.","link":"https://docs.python.org/ru/3/library/index.html","tags":"RU/EN"},
    {"id":"ai-library-03","type":"Библиотека программирования для ИИ","topic":"Python","name":"PEP 8 — стиль Python","desc":"Правила оформления читаемого Python-кода. Язык: EN.","link":"https://peps.python.org/pep-0008/","tags":"EN"},
    {"id":"ai-library-04","type":"Библиотека программирования для ИИ","topic":"Python","name":"pytest — документация","desc":"Тесты, фикстуры, параметризация, диагностика ошибок. Язык: EN.","link":"https://docs.pytest.org/en/stable/","tags":"EN"},
    {"id":"ai-library-05","type":"Библиотека программирования для ИИ","topic":"Веб-разработка","name":"MDN — HTML","desc":"Семантическая разметка, формы и HTML-элементы. Язык: RU/EN.","link":"https://developer.mozilla.org/ru/docs/Web/HTML","tags":"RU/EN"},
    {"id":"ai-library-06","type":"Библиотека программирования для ИИ","topic":"Веб-разработка","name":"MDN — CSS","desc":"Адаптивная вёрстка, Flexbox, Grid и стили. Язык: RU/EN.","link":"https://developer.mozilla.org/ru/docs/Web/CSS","tags":"RU/EN"},
    {"id":"ai-library-07","type":"Библиотека программирования для ИИ","topic":"Веб-разработка","name":"MDN — JavaScript","desc":"JavaScript, DOM, браузерные API, асинхронность. Язык: RU/EN.","link":"https://developer.mozilla.org/ru/docs/Web/JavaScript","tags":"RU/EN"},
    {"id":"ai-library-08","type":"Библиотека программирования для ИИ","topic":"Веб-разработка","name":"Современный учебник JavaScript","desc":"Пошаговый учебник JavaScript и браузерной разработки. Язык: RU.","link":"https://learn.javascript.ru/","tags":"RU"},
    {"id":"ai-library-09","type":"Библиотека программирования для ИИ","topic":"Веб-разработка","name":"React — учебник","desc":"Компоненты, состояние, хуки и рендеринг React. Язык: RU.","link":"https://ru.react.dev/learn","tags":"RU"},
    {"id":"ai-library-10","type":"Библиотека программирования для ИИ","topic":"Веб-разработка","name":"TypeScript Handbook","desc":"Типы, интерфейсы и типизированная разработка. Язык: EN.","link":"https://www.typescriptlang.org/docs/handbook/","tags":"EN"},
    {"id":"ai-library-11","type":"Библиотека программирования для ИИ","topic":"Веб-разработка","name":"Node.js — обучение","desc":"Серверный JavaScript, npm, запуск и отладка. Язык: EN.","link":"https://nodejs.org/learn","tags":"EN"},
    {"id":"ai-library-12","type":"Библиотека программирования для ИИ","topic":"Качество веба","name":"web.dev — производительность","desc":"Ускорение сайта, оптимизация загрузки и работы браузера. Язык: EN.","link":"https://web.dev/learn/performance","tags":"EN"},
    {"id":"ai-library-13","type":"Библиотека программирования для ИИ","topic":"Качество веба","name":"MDN — доступность","desc":"Доступные интерфейсы, клавиатура, семантика и формы. Язык: RU/EN.","link":"https://developer.mozilla.org/ru/docs/Learn_web_development/Core/Accessibility","tags":"RU/EN"},
    {"id":"ai-library-14","type":"Библиотека программирования для ИИ","topic":"Git и публикация","name":"Pro Git — открытая книга","desc":"Коммиты, ветки, слияния, конфликты и совместная работа. Язык: RU.","link":"https://git-scm.com/book/ru/v2","tags":"RU"},
    {"id":"ai-library-15","type":"Библиотека программирования для ИИ","topic":"Git и публикация","name":"GitHub Docs","desc":"Репозитории, pull requests, управление проектом. Язык: RU.","link":"https://docs.github.com/ru","tags":"RU"},
    {"id":"ai-library-16","type":"Библиотека программирования для ИИ","topic":"Git и публикация","name":"GitHub Actions","desc":"Непрерывная интеграция, тестирование и автоматическая сборка. Язык: RU.","link":"https://docs.github.com/ru/actions","tags":"RU"},
    {"id":"ai-library-17","type":"Библиотека программирования для ИИ","topic":"Git и публикация","name":"GitHub Pages","desc":"Размещение статических сайтов, домены и HTTPS. Язык: RU.","link":"https://docs.github.com/ru/pages","tags":"RU"},
    {"id":"ai-library-18","type":"Библиотека программирования для ИИ","topic":"Тестирование и инфраструктура","name":"Playwright — документация","desc":"Автоматизация браузера, E2E-тесты, скриншоты. Язык: EN.","link":"https://playwright.dev/docs/intro","tags":"EN"},
    {"id":"ai-library-19","type":"Библиотека программирования для ИИ","topic":"Тестирование и инфраструктура","name":"Docker — введение","desc":"Контейнеры, Dockerfile, воспроизводимые окружения. Язык: EN.","link":"https://docs.docker.com/get-started/","tags":"EN"},
    {"id":"ai-library-20","type":"Библиотека программирования для ИИ","topic":"Базы данных","name":"PostgreSQL — документация","desc":"SQL, транзакции, запросы, индексы и схемы. Язык: RU.","link":"https://postgrespro.ru/docs/postgresql/current","tags":"RU"},
    {"id":"ai-library-21","type":"Библиотека программирования для ИИ","topic":"Базы данных","name":"SQLite — документация","desc":"Встроенная СУБД, SQL и работа с локальными данными. Язык: EN.","link":"https://www.sqlite.org/docs.html","tags":"EN"},
    {"id":"ai-library-22","type":"Библиотека программирования для ИИ","topic":"Android","name":"Android Developers","desc":"Android API, разработка, сборки и публикация приложений. Язык: RU/EN.","link":"https://developer.android.com/develop?hl=ru","tags":"RU/EN"},
    {"id":"ai-library-23","type":"Библиотека программирования для ИИ","topic":"Android","name":"Kotlin — документация","desc":"Синтаксис и средства языка Kotlin. Язык: EN.","link":"https://kotlinlang.org/docs/","tags":"EN"},
    {"id":"ai-library-24","type":"Библиотека программирования для ИИ","topic":"Android","name":"Android — производительность","desc":"Память, производительность, запуск и оптимизация приложений. Язык: RU/EN.","link":"https://developer.android.com/topic/performance/overview?hl=ru","tags":"RU/EN"},
    {"id":"ai-library-25","type":"Библиотека программирования для ИИ","topic":"Безопасность","name":"OWASP Cheat Sheet Series","desc":"Практические рекомендации по безопасности приложений. Язык: EN.","link":"https://cheatsheetseries.owasp.org/","tags":"EN"},
];

/* Git platforms and collaborative code hosting are kept separately from engineering communities. */
const codingPlatforms = [
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
        desc: "Мос.Хаб — платформа совместной разработки и размещения кода ДИТ Москвы; возможна проверка доступа.",
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
];
