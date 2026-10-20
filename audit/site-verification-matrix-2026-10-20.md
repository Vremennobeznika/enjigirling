# Матрица проверки ENJIGIRLING — 20.10.2026

**Обозначения:** PASS — машинная проверка структуры; CANDIDATE — документ для предметного сопоставления, не подтверждение применимости; NOT VERIFIED — независимая проверка не проведена. Ни одна отметка PASS не означает юридической или фактической экспертизы содержания.

## Контроль сайта

| Блок | Метод | Результат | Доказательство |
|---|---|---|---|
| Каталог | Уникальные ID и поля каждой из 51 карточки | PASS (51/51) | data.js; tests/site-check.cjs |
| Зарплатные источники | ID, ссылка, диапазон либо явный статус неподтверждения | PASS (51/51); 50 числовых записей и 1 без суммы | salary-sources.js; исходная ссылка АВТОВАЗа возвращала HTTP 404 |
| Соответствие зарплаты опубликованному источнику | Независимая сверка цифр и дат по каждой странице | NOT VERIFIED | Требуется внешний фактчекинг |
| Зарплатные страницы — содержимое | GET + проверка наличия записанных чисел в HTML, все 51 записи | **42** страницы с обоими числовыми фрагментами, **1** с одним, **4** без совпадения, **3** не прочитаны, **1** без опубликованной суммы; **0** подтверждённых 404 | GitHub Actions Salary evidence content audit #39411903678; совпадение цифр само по себе **не доказывает достоверность или соответствие должности** |
| Профстандарты | Наличие кандидатов по ID | 7/51 CANDIDATE | script.js; нет проверки действующей редакции и трудовых функций |
| Профстандарты | Проверка действующей редакции и применимости | NOT VERIFIED | Реестр ВНИИ труда / Минтруд |
| Образование | Отсутствие неподтверждённых универсальных сроков | PASS (51/51) | data.js; tests/site-check.cjs |
| Карьера | Отсутствие неподтверждённых сроков и зарплат ступеней | PASS (51/51) | data.js; tests/site-check.cjs |
| Демография | Отсутствие неподтверждённых показателей | PASS (51/51) | data.js; tests/site-check.cjs |
| UI | Браузерные и функциональные тесты, 51 модальная карточка | **PASS 35/35**: 9 страниц × 3 ширины, все 51 карточка, поиск, фильтры, сравнение, конвертер, зарплатный блок и календарь; переполнение 390 px исправлено | GitHub Actions Browser smoke checks #39411453293, success |
| Автотесты | Site checks | **PASS**, 51 карточка + нормативные и зарплатные ограничения + матрица | GitHub Actions Site checks #39411453167, success |
| Публикация | GitHub Pages | **PASS** для коммита 70d1fca; новый отчёт требует следующей публикации | GitHub Actions run #39411452362, success |
| Внешние ссылки | Проверка 144 внешних URL, включая зарплатные и профстандарты | PASS по подтверждённым ошибкам: **118 OK, 0 HTTP 404/410, 26 UNVERIFIED** (недоступные / антибот / прочие коды), 20.10.2026 | GitHub Actions External link audit #39411259576, success; 404 источника АВТОВАЗа исключён из опубликованных зарплат |
| Доступность | Полный аудит WCAG клавиатуры, экранных читалок и контраста | NOT VERIFIED | Smoke-тест не заменяет WCAG-аудит |
| Производительность | Lighthouse / Core Web Vitals | NOT VERIFIED | Не измерялись |

## Поимённая матрица (все 51)

| № | ID | Профессия | Основные поля | Источник зарплаты (структура) | Класс зарплатного свидетельства | Профстандарт | Независимая сверка зарплаты | Проверка редакции и применимости стандарта |
|---:|---|---|---|---|---|---|---|---|
| 1 | civil-engineer | Инженер-строитель (ПГС) | PASS | PASS | source_page_checked | CANDIDATE | NOT VERIFIED | NOT VERIFIED |
| 2 | pgs-designer | Инженер-проектировщик (ПГС) | PASS | PASS | source_page_checked | CANDIDATE | NOT VERIFIED | NOT VERIFIED |
| 3 | architect-engineer | Инженер-архитектор | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 4 | road-engineer | Инженер-дорожник | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 5 | road-designer | Инженер-проектировщик автомобильных дорог | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 6 | mechanical-engineer | Инженер-механик | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 7 | automotive-engineer | Инженер-автомобилестроитель | PASS | UNVERIFIED (сумма скрыта) | source_linked_not_independently_verified | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 8 | power-engineer | Инженер-энергетик | PASS | PASS | source_page_checked | CANDIDATE | NOT VERIFIED | NOT VERIFIED |
| 9 | electrical-engineer | Инженер-электрик | PASS | PASS | source_page_checked | CANDIDATE | NOT VERIFIED | NOT VERIFIED |
| 10 | electrical-designer | Инженер-проектировщик электроснабжения | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 11 | nuclear-engineer | Инженер-атомщик | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 12 | aerospace-engineer | Инженер-авиастроитель | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 13 | space-engineer | Космический инженер (ракетостроитель) | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 14 | chemical-engineer | Инженер-химик-технолог | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 15 | oil-gas-engineer | Инженер-нефтяник | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 16 | metallurgical-engineer | Инженер-металлург | PASS | PASS | source_page_checked | CANDIDATE | NOT VERIFIED | NOT VERIFIED |
| 17 | mining-engineer | Горный инженер | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 18 | environmental-engineer | Инженер-эколог | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 19 | biomedical-engineer | Инженер-биомедик | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 20 | robotics-engineer | Инженер-робототехник | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 21 | railway-engineer | Инженер-железнодорожник | PASS | PASS | source_page_checked | CANDIDATE | NOT VERIFIED | NOT VERIFIED |
| 22 | shipbuilding-engineer | Инженер-кораблестроитель | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 23 | asu-tp-designer | Проектировщик АСУ ТП | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 24 | asu-tp-programmer | Программист АСУ ТП | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 25 | asu-tp-commissioning | Пуско-наладчик АСУ ТП | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 26 | kipia-engineer | Инженер КИПиА | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 27 | food-engineer | Инженер-технолог пищевой промышленности | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 28 | textile-engineer | Инженер-текстильщик | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 29 | forest-engineer | Инженер лесного хозяйства | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 30 | telecom-engineer | Инженер связи | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 31 | water-engineer | Инженер водоснабжения и водоотведения | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 32 | lighting-engineer | Инженер-светотехник | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 33 | military-engineer | Военный инженер | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 34 | polygraph-engineer | Инженер полиграфии | PASS | PASS | employer_vacancy_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 35 | materials-engineer | Инженер-материаловед | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 36 | civil-defense-engineer | Инженер ГО и ЧС | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 37 | geodetic-engineer | Инженер-геодезист | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 38 | astronomer-engineer | Инженер-астроном | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 39 | restoration-engineer | Инженер-реставратор | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 40 | standardization-engineer | Инженер по стандартизации | PASS | PASS | source_page_checked | CANDIDATE | NOT VERIFIED | NOT VERIFIED |
| 41 | patent-engineer | Инженер-патентовед | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 42 | data-engineer | Инженер данных (Data Engineer) | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 43 | devops-engineer | DevOps-инженер | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 44 | ml-engineer | Инженер машинного обучения (ML Engineer) | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 45 | security-engineer | Инженер по информационной безопасности | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 46 | cloud-engineer | Cloud-инженер | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 47 | embedded-engineer | Инженер встраиваемых систем (Embedded) | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 48 | frontend-engineer | Frontend-разработчик | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 49 | backend-engineer | Backend-разработчик | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 50 | qa-engineer | QA-инженер | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
| 51 | mobile-engineer | Mobile-разработчик | PASS | PASS | adjacent_occupation_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |

## Адресные исключения после сверки содержимого зарплатных страниц

**Это очередь предметной проверки, а не перечень доказанных ошибок.** Числовые фрагменты могут отсутствовать в HTML из-за округления, изменения выборки, скриптов или блокировок.

| Профессия (ID) | Фактический результат | Решение / ограничение |
|---|---|---|
| civil-engineer | HTTP 200, обе старые цифры не найдены; доступная копия страницы показывает иной, датированный сентябрём срез | Нельзя считать диапазон актуальной медианой без новой сверки методики и даты |
| power-engineer | HTTP 200, автоматически распознано одно число; в доступном тексте Dream Job указаны 80–115 тыс. ₽ и выборка из 19 отзывов | Ручное чтение подтверждает опубликованный ориентир; небольшая выборка остаётся ограничением |
| biomedical-engineer | HTTP 200, цифры не распознаны; источник по смежной должности | В карточке не переносить зарплату смежной профессии |
| cloud-engineer | HTTP 200, точные числовые строки не найдены, потому что HireHi публикует границы округлённо: 327–473 тыс. ₽ | Сверено как округлённый диапазон, но не доказана репрезентативность 10 вакансий |
| embedded-engineer | HTTP 200, цифры среза не найдены; доступная копия HireHi показывает другие границы и дату | Проверить динамику выборки и зафиксировать новый достоверный срез, не заменять старый слепо |
| asu-tp-commissioning | HTTP 403 в автоматической проверке; индексированная страница Finder показывает вакансию от 130 тыс. ₽ | Разделять проверку вакансии в поисковом индексе и прямой доступ к сайту |
| standardization-engineer | HTTP 403, точная страница Finder не прочитана автоматически | Не повышать уровень доверия без независимой сверки |
| patent-engineer | HTTP 403 в автоматической проверке; доступная индексированная страница Finder содержит вакансию от 70 тыс. ₽ | Только отдельная вакансия, не медиана рынка |

Сопоставление: автоматический отчёт GitHub Actions **Salary evidence content audit**, прогон [#39412212686](https://github.com/Vremennobeznika/enjigirling/actions/runs/39412212686). Неопределённый ответ HTTP 403 не равен HTTP 404 и не доказывает, что ссылка удалена.

## Проверка фактической работоспособности

Добавлены Playwright-тесты `tests/site-functionality.spec.cjs`: открытие и закрытие всех 51 карточки; поиск, сортировка и категории; сравнение профессий и удаление из сравнения; поиск и сброс в ресурсах, словаре, материалах и процессах; работа источников зарплат; преобразование единиц и защита от температуры ниже абсолютного нуля; календарь. В `tests/site-visual.spec.cjs` сохраняется проверка 9 страниц на 390, 768 и 1440 px и цветов ссылок. Автоматические проверки ссылок расширены с раздела ресурсов на зарплатные источники и профстандарты. Открытые ограничения — предметная верификация содержания, WCAG и производительность.

## Критерий завершения

Закрывать NOT VERIFIED разрешено только после записи проверенного источника, даты обращения, области применимости и конкретного результата. Нельзя превращать наличие ссылки или успешно пройденный тест в отметку о содержательной достоверности.
