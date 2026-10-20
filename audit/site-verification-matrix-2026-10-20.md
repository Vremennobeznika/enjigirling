# Матрица проверки ENJIGIRLING — 20.10.2026

**Обозначения:** PASS — машинная проверка структуры; CANDIDATE — документ для предметного сопоставления, не подтверждение применимости; NOT VERIFIED — независимая проверка не проведена. Ни одна отметка PASS не означает юридической или фактической экспертизы содержания.

## Контроль сайта

| Блок | Метод | Результат | Доказательство |
|---|---|---|---|
| Каталог | Уникальные ID и поля каждой из 51 карточки | PASS (51/51) | data.js; tests/site-check.cjs |
| Зарплатные источники | ID, ссылка, числовой диапазон, регион и метрика | PASS (51/51) | salary-sources.js |
| Соответствие зарплаты опубликованному источнику | Независимая сверка цифр и дат по каждой странице | NOT VERIFIED | Требуется внешний фактчекинг |
| Профстандарты | Наличие кандидатов по ID | 7/51 CANDIDATE | script.js; нет проверки действующей редакции и трудовых функций |
| Профстандарты | Проверка действующей редакции и применимости | NOT VERIFIED | Реестр ВНИИ труда / Минтруд |
| Образование | Отсутствие неподтверждённых универсальных сроков | PASS (51/51) | data.js; tests/site-check.cjs |
| Карьера | Отсутствие неподтверждённых сроков и зарплат ступеней | PASS (51/51) | data.js; tests/site-check.cjs |
| Демография | Отсутствие неподтверждённых показателей | PASS (51/51) | data.js; tests/site-check.cjs |
| UI | Браузерные smoke-тесты и адаптивность | PASS для коммита 028eded | GitHub Actions Browser smoke checks #39409607797 |
| Автотесты | Site checks | PASS для коммита 028eded | GitHub Actions Site checks #39409607739 |
| Публикация | GitHub Pages | IN PROGRESS на момент составления | GitHub Actions run #39409607593 |
| Безопасность | Проверка всех внешних ссылок на текущем коммите | NOT VERIFIED | Нужен отдельный актуальный прогон |
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
| 7 | automotive-engineer | Инженер-автомобилестроитель | PASS | PASS | source_page_checked | UNMAPPED | NOT VERIFIED | NOT VERIFIED |
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

## Критерий завершения

Закрывать NOT VERIFIED разрешено только после записи проверенного источника, даты обращения, области применимости и конкретного результата. Нельзя превращать наличие ссылки или успешно пройденный тест в отметку о содержательной достоверности.
