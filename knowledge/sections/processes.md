# ENJIGIRLING — Производственные процессы

**Исходная страница:** https://vremennobeznika.github.io/enjigirling/processes.html

**Статус:** обзорные редакционные материалы; точность и актуальность технических утверждений не гарантированы. Если первичный источник не указан, считайте утверждение непроверенным. Не придумывайте стандарты, цифры и ссылки. Для инженерных решений сверяйтесь с действующими нормативами, методиками и паспортами.

**Что загружать в ИИ:** этот Markdown-файл или соответствующий JSON. Для вопросов о других разделах дополнительно используйте index.json и другие пакеты.

## Текст и описание раздела

[ENJIGIRLING / ENGINEERING INDEX](https://vremennobeznika.github.io/enjigirling/index.html)[Для ИИ](https://vremennobeznika.github.io/enjigirling/ai.html?section=processes) ☾
Разделы сайта
Карьера
[Профессии](https://vremennobeznika.github.io/enjigirling/index.html)
[Сравнение](https://vremennobeznika.github.io/enjigirling/compare.html)
[Обучение](https://vremennobeznika.github.io/enjigirling/map.html)
Технологии
[Процессы](https://vremennobeznika.github.io/enjigirling/processes.html)
[Материалы](https://vremennobeznika.github.io/enjigirling/materials.html)
Инструменты
[Калькуляторы инженера](https://vremennobeznika.github.io/enjigirling/calculator.html)
База знаний
[Словарь инженера](https://vremennobeznika.github.io/enjigirling/dictionary.html)
Сообщество
[Календарь праздников](https://vremennobeznika.github.io/enjigirling/calendar.html)
[Ресурсы сообщества 18+](https://vremennobeznika.github.io/enjigirling/resources.html)
СПРАВОЧНИК / 02
## Атлас производственных процессов.
Технологические цепочки, типовые дефекты и связь с профессиями. Обзорные описания, не технологические инструкции.
### Единый поиск по технологиям
Найдите материал или производственный процесс в обоих каталогах, не переключаясь между страницами.
Название, применение, операция или дефект Введите не менее двух символов.
Каталоги: [процессы](https://vremennobeznika.github.io/enjigirling/processes.html) · [материалы](https://vremennobeznika.github.io/enjigirling/materials.html)
Поиск по процессам
Отрасль Все отрасли Металлы и машиностроение Полимеры Пищевая промышленность Текстиль и швейное производство Деревообработка Электроника Химическое производство Межотраслевые процессы Композиты Строительство и дороги Энергетика и теплообмен Водоподготовка и очистка Керамика, цемент и стекло Фармацевтическое производство Полиграфия Горное производство
Тип операции Все процессы Формообразование и резание Соединение и сборка Обработка и свойства Контроль
Сортировка По каталогу По названию А — Я По названию Я — А
Фильтры можно сочетать. Отрасль указывает основное применение, а не исключает применение в других отраслях. Источники и степень проверки указаны в карточках.
Пакет для ИИ: процессы + материалы
Одна отрасль — один файл с обоими каталогами. Можно скачать весь атлас без повторов или ZIP со всеми 16 отраслевыми пакетами. Источники и пределы проверки сохраняются.
Отрасль пакета Выберите отрасль Все отрасли — целиком без дублей
Состав файла Процессы + материалы Только процессы Только материалы
Markdown для чата
JSON
JSONL для базы
Копировать
ZIP: все 16 отраслей
Выберите отрасль.
ZIP создаётся прямо в браузере, без облака и платного сервиса. Для ИИ прикрепите Markdown или JSON; большие базы удобнее загружать по отраслям.
Этапы обобщены; конкретная технология, режимы, безопасность и методы контроля устанавливаются документацией для изделия и производства.
### Как разбирать технологическую цепочку
Для каждого процесса отдельно определите исходный материал, результат операции, оборудование, точки контроля и документ, в котором утверждены режимы.
- Вход: что поступает на операцию и какие свойства уже подтверждены?
- Преобразование: какое изменение должно произойти и чем оно ограничено?
- Контроль: какие отклонения нужно обнаружить и чем подтвердить соответствие?
- Ответственность: какие специалисты отвечают за технологию, качество и оборудование?
Пример цепочки из каталога: [дуговая сварка](https://vremennobeznika.github.io/enjigirling/processes.html#welding) → [сталь 09Г2С](https://vremennobeznika.github.io/enjigirling/materials.html#09g2s) → [инженер-механик](https://vremennobeznika.github.io/enjigirling/index.html#profession=mechanical-engineer). Описание здесь обзорное, не инструкция по выполнению опасных работ.
[Скачать CSV-карту анализа производственного дефекта](https://vremennobeznika.github.io/enjigirling/templates/production-defect-review.csv) · [Инструкция по заполнению](https://vremennobeznika.github.io/enjigirling/templates/README.md)

## Полные записи справочника (208 записей/групп)

### Литьё
- **id:** casting
- **name:** Литьё
- **category:** forming
- **description:** Получение отливки заливкой расплава в литейную форму. Материал и марку выбирают по документации на отливку, а не по обозначению стали для проката.
- **steps:** Выбор литейной технологии и материала → подготовка модели и формы → плавка и подготовка расплава → заливка → затвердевание и охлаждение → извлечение и очистка → контроль
- **checks:** Усадочные раковины и пористость, газовые поры, неметаллические включения, трещины и отклонения размеров. Метод обнаружения и критерии приёмки зависят от отливки.
- **materials:** []
- **profession:** metallurgical-engineer
- **sources:** [{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"},{"title":"ASNT — возможности и ограничения методов неразрушающего контроля","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"},{"title":"Bodycote — Technical glossary","url":"https://www.bodycote.com/technical-glossary/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Отливку получают заливкой расплава в форму и затвердеванием.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **industry:** metals
- **reviewStatus:** source_located

### Дуговая сварка
- **id:** welding
- **name:** Дуговая сварка
- **category:** joining
- **description:** Группа процессов соединения материалов электрической дугой. Конкретный способ, подготовка кромок, расходные материалы и контроль выбираются для соединения и условий производства.
- **steps:** Выбор способа и технологической документации → подготовка кромок → сборка и фиксация → сварка → очистка (при необходимости) → контроль
- **checks:** Несплавление, непровар, поры, трещины, подрезы и деформации; допустимость устанавливается требованиями к конкретному соединению.
- **materials:** ["09g2s","aisi-304","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — общий обзор сварки плавлением","url":"https://www.twi-global.com/technical-knowledge/faqs/what-is-fusion-welding"},{"title":"TWI — классификация способов сварки (обзор с прежними редакциями стандартов)","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"ISO 4063:2023 — международная номенклатура сварочных процессов (не режимы)","url":"https://www.iso.org/standard/75108.html"}]
- **evidence:** {"verifiedClaim":"Дуговая сварка использует электрическую дугу для формирования сварного соединения.","reviewScope":"Проверен только приведённый частный тезис, а не вся технологическая карточка.","checkedAt":"2026-10-22"}
- **industry:** metals

### Обработка резанием
- **id:** cutting
- **name:** Обработка резанием
- **category:** forming
- **description:** Формирование геометрии удалением материала режущим инструментом.
- **steps:** Анализ чертежа и заготовки → выбор инструмента и баз → закрепление → обработка → измерение и контроль поверхности
- **checks:** Геометрические размеры, допуски формы и расположения, шероховатость, заусенцы, состояние инструмента. Требования определяет чертёж.
- **materials:** ["steel-20","steel-45","al-6061","pa6","copper-m1","birch-plywood","09g2s","aisi-304"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Sandvik Coromant — справочник по токарной обработке (частный вид резания)","url":"https://www.sandvik.coromant.com/en-gb/tools/silent-tools/what-is-silent-tools/application-guide-silent-tools/turning-appl-guide"},{"title":"Current State and Emerging Trends in Advanced Manufacturing: Process Technologies — полный авторский текст","url":"https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957755"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Механическая обработка формирует геометрию удалением материала режущими кромками.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **industry:** general
- **reviewStatus:** source_located

### Термическая обработка
- **id:** heat
- **name:** Термическая обработка
- **category:** treatment
- **description:** Тепловая обработка для изменения структуры и свойств материала; результат зависит от состава, состояния материала и полного цикла.
- **steps:** Проверка марки и исходного состояния → выбор утверждённого цикла → нагрев → выдержка → охлаждение → контроль свойств и геометрии
- **checks:** Твёрдость и другие требуемые свойства, коробление, трещины, состояние поверхности. Не всякая сталь приобретает высокую твёрдость при закалке.
- **materials:** ["steel-20","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Bodycote — технический словарь термической обработки","url":"https://www.bodycote.com/technical-glossary/"}]
- **evidence:** {"verifiedClaim":"Термическая обработка относится к производственным процессам изменения свойств без изменения формы.","reviewScope":"Проверено только приведённое утверждение, не вся карточка.","checkedAt":"2026-10-22"}
- **industry:** metals

### Аддитивное производство
- **id:** additive
- **name:** Аддитивное производство
- **category:** forming
- **description:** Послойное создание изделий по цифровой модели; технология, ориентация, поддерживающие структуры и постобработка определяются конкретным процессом и материалом. Для HDPE и армированных композитов применимость зависит от конкретного процесса и рецептуры сырья.
- **steps:** Проверка модели и требований → подготовка сборки и ориентации → изготовление → удаление поддержек (если есть) → постобработка → контроль
- **checks:** Точность геометрии, межслойные дефекты, качество поверхности, а для некоторых технологий — внутренние поры и анизотропия свойств.
- **materials:** ["pa6","gfrp","pe-hd"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — обзор аддитивного производства","url":"https://www.nist.gov/additive-manufacturing/what-additive-manufacturing"},{"title":"NIST — аддитивное производство методом экструзии материала","url":"https://www.nist.gov/additive-manufacturing/research-areas/technologies/material-extrusion"},{"title":"ASTM F3489-23 — свойства полимерных изделий при экструзионной 3D-печати","url":"https://store.astm.org/f3489-23.html"},{"title":"ISO/ASTM 52900:2021 — определение и терминология аддитивного производства","url":"https://www.iso.org/standard/74514.html"}]
- **evidence:** {"verifiedClaim":"Аддитивное производство создаёт изделия по цифровой модели последовательным добавлением слоёв материала.","reviewScope":"Проверен принцип, не применимость к HDPE или GFRP.","checkedAt":"2026-10-22"}
- **industry:** general

### Неразрушающий контроль
- **id:** inspection
- **name:** Неразрушающий контроль
- **category:** inspection
- **description:** Совокупность методов оценки объекта без нарушения его пригодности к эксплуатации; разные методы выявляют разные типы несплошностей.
- **steps:** Определение задачи и критериев приёмки → выбор пригодного метода → подготовка → проведение контроля → интерпретация показаний → протокол
- **checks:** Обнаруживаемость нужного типа дефекта, чувствительность, ограничения по материалу и геометрии, квалификация персонала и прослеживаемость результата.
- **materials:** ["09g2s","gfrp","alumina","aramid"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — обзор неразрушающего контроля","url":"https://www.asnt.org/what-is-nondestructive-testing"},{"title":"ASNT — методы НК","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"},{"title":"ISO 9712:2021 — квалификация персонала","url":"https://committee.iso.org/cms/live/live/en/sites/isoorg/contents/data/standard/07/56/75614.html"}]
- **evidence:** {"verifiedClaim":"Разные методы неразрушающего контроля обнаруживают разные виды несплошностей без повреждения детали.","reviewScope":"Проверена обзорная характеристика, не процедура и квалификация.","checkedAt":"2026-10-22"}
- **industry:** general

### MIG/MAG-сварка
- **id:** mig-mag
- **name:** MIG/MAG-сварка
- **category:** joining
- **description:** Дуговая сварка плавящимся проволочным электродом в защитном газе: MIG использует инертную, MAG — активную газовую среду.
- **steps:** Подготовка соединения → выбор проволоки и защитного газа → настройка оборудования по утверждённой технологии → сварка → контроль
- **checks:** Поры из-за нарушения газовой защиты, несплавление, подрезы, брызги и деформации. Брызги сами по себе не равнозначны недопустимому дефекту.
- **materials:** ["09g2s","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — различия MIG/MAG и типы защитных газов","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-the-difference-between-mig-and-mag"},{"title":"ISO 4063:2023 — классификация сварочных процессов, не режимы MIG/MAG","url":"https://www.iso.org/standard/75108.html"}]
- **evidence:** {"verifiedClaim":"MIG применяет инертные защитные газы, а MAG — активные газовые смеси.","reviewScope":"Проверен только приведённый частный тезис, а не вся технологическая карточка.","checkedAt":"2026-10-22"}
- **industry:** metals

### TIG-сварка
- **id:** tig
- **name:** TIG-сварка
- **category:** joining
- **description:** Дуговая сварка неплавящимся вольфрамовым электродом в защитной газовой среде; присадочный материал используется не всегда.
- **steps:** Подготовка соединения → выбор электрода, защитного газа и при необходимости присадки → сварка → контроль
- **checks:** Поры, несплавление, трещины, геометрия шва, окисление из-за недостаточной защиты; оценка по требованиям к соединению.
- **materials:** ["aisi-304","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — особенности TIG-сварки и защитных газов","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/tungsten-inert-gas-tig-or-gta-welding-006"},{"title":"ISO 4063:2023 — классификация сварочных процессов, не режимы TIG","url":"https://www.iso.org/standard/75108.html"}]
- **evidence:** {"verifiedClaim":"TIG использует неплавящийся вольфрамовый электрод и инертную газовую защиту.","reviewScope":"Проверен только приведённый частный тезис, а не вся технологическая карточка.","checkedAt":"2026-10-22"}
- **industry:** metals

### Ультразвуковой контроль
- **id:** ultrasonic
- **name:** Ультразвуковой контроль
- **category:** inspection
- **description:** Неразрушающий контроль с использованием ультразвуковых волн; эффективность зависит от материала, геометрии, состояния поверхности и ориентации несплошностей.
- **steps:** Выбор методики и преобразователя → настройка по образцам → подготовка поверхности → сканирование → оценка показаний → протокол
- **checks:** Мёртвые зоны, акустический контакт, затухание и структура материала, ориентация отражателей, калибровка. Не все дефекты обнаружимы ультразвуком.
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"Ultrasonic Testing: A Versatile Method for NDT","url":"https://www.asnt.org/what-is-nondestructive-testing/methods/ultrasonic-testing"},{"title":"ASNT — ультразвуковой метод НК","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verifiedClaim":"Ультразвуковой контроль использует высокочастотные звуковые волны для оценки материала.","reviewScope":"Проверен физический принцип.","checkedAt":"2026-10-22"}
- **industry:** general

### Радиографический контроль
- **id:** radiographic
- **name:** Радиографический контроль
- **category:** inspection
- **description:** Неразрушающий контроль с помощью рентгеновского или гамма-излучения для получения изображения различий в ослаблении излучения внутри объекта.
- **steps:** Выбор методики и обеспечение радиационной безопасности → подготовка объекта и средств контроля → экспонирование → обработка изображения → оценка → протокол
- **checks:** Качество изображения, чувствительность, толщина и геометрия объекта, ориентация несплошности. Плоские дефекты могут выявляться хуже; применяются требования радиационной безопасности.
- **materials:** ["09g2s","aisi-304"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — радиографический контроль","url":"https://www.asnt.org/what-is-nondestructive-testing/methods/radiographic-testing"}]
- **evidence:** {"verifiedClaim":"Радиографический контроль использует рентгеновское или гамма-излучение для изображения внутренней структуры.","reviewScope":"Проверен принцип.","checkedAt":"2026-10-22"}
- **industry:** general

### Капиллярный контроль
- **id:** dye
- **name:** Капиллярный контроль
- **category:** inspection
- **description:** Капиллярный метод выявления несплошностей, открытых на поверхность непористых материалов; внутренние закрытые дефекты он не обнаруживает.
- **steps:** Предварительная очистка и сушка → нанесение пенетранта → выдержка → удаление избытка → нанесение проявителя → оценка → окончательная очистка
- **checks:** Открытость дефекта на поверхность, загрязнения и шероховатость, выдержка, совместимость материалов, условия освещения и критерии оценки.
- **materials:** ["aisi-304","al-6061"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — капиллярный контроль","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"},{"title":"ASNT — Liquid Penetrant Testing: процесс, применимость, ограничения","url":"https://www.asnt.org/standards-publications/blog/ndt-method-overview-what-is-liquid-penetrant-testing"}]
- **evidence:** {"verifiedClaim":"Капиллярный контроль выявляет несплошности, открытые на поверхность непористых материалов.","reviewScope":"Проверены назначение и поверхностный характер метода.","checkedAt":"2026-10-22"}
- **industry:** general

### Измерение твёрдости
- **id:** hardness
- **name:** Измерение твёрдости
- **category:** inspection
- **description:** Определение твёрдости выбранным методом вдавливания; получаемые числа зависят от метода, шкалы и условий измерения.
- **steps:** Выбор метода и шкалы → проверка прибора и образцов → подготовка поверхности → измерения → оценка результатов → протокол
- **checks:** Толщина и размеры образца, расстояния между отпечатками и от края, качество поверхности, нагрузка, точность прибора; шкалы нельзя безусловно пересчитывать.
- **materials:** ["steel-20","steel-45","al-6061"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASTM E18-25 — определение твёрдости по Роквеллу","url":"https://store.astm.org/standards/e18"}]
- **evidence:** {"verifiedClaim":"Метод Роквелла основан на вдавливании индентора и предназначен для определения твёрдости металлических материалов.","reviewScope":"Этот стандарт подтверждает только метод Роквелла, не все методики измерения твёрдости.","checkedAt":"2026-10-22"}
- **industry:** general

### Ковка и объёмная штамповка
- **id:** forging
- **name:** Ковка и объёмная штамповка
- **category:** forming
- **description:** Пластическое деформирование металлической заготовки в объёме, в том числе с использованием штамповой оснастки.
- **steps:** Выбор заготовки и маршрута → нагрев (если предусмотрен) → деформирование → удаление облоя (если есть) → дальнейшая обработка → контроль
- **checks:** Недоштамповка, складки, трещины, отклонения размеров, направление волокон; режимы зависят от сплава и изделия.
- **materials:** ["steel-45"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"},{"title":"OSHA — определения операций ковки и объёмной штамповки","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.211"},{"title":"Bodycote — Technical glossary","url":"https://www.bodycote.com/technical-glossary/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Ковка формирует металл сжимающим усилием; применяются прессы и молоты.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **industry:** metals
- **reviewStatus:** source_located

### Прокатка
- **id:** rolling
- **name:** Прокатка
- **category:** forming
- **description:** Изменение поперечного сечения и размеров материала пропусканием между валками; холодная и горячая прокатка предъявляют разные требования. Указанные в каталоге стали приведены лишь как примеры марок для прокатной продукции; вид и условия поставки необходимо уточнять.
- **steps:** Подготовка исходной заготовки → настройка клети → прокатка → охлаждение или промежуточная обработка → контроль
- **checks:** Толщина, профиль, плоскостность, состояние поверхности, трещины и остаточные напряжения.
- **materials:** ["steel-20","steel-45"]
- **profession:** metallurgical-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"}]
- **evidence:** {"verifiedClaim":"Прокатка относится к процессам формообразования металлических заготовок.","reviewScope":"Проверено только приведённое утверждение, не вся карточка.","checkedAt":"2026-10-22"}
- **industry:** metals

### Листовая штамповка
- **id:** stamping
- **name:** Листовая штамповка
- **category:** forming
- **description:** Разделительные и формоизменяющие операции с листовым материалом на прессовом оборудовании.
- **steps:** Подготовка листа и оснастки → подача и позиционирование → вырубка или гибка/вытяжка → удаление отходов → контроль
- **checks:** Заусенцы, трещины, пружинение, складки, геометрия и износ инструмента.
- **materials:** ["steel-20","aisi-304","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"},{"title":"Current State and Emerging Trends in Advanced Manufacturing: Process Technologies — полный авторский текст","url":"https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957755"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Формоизменяющая часть штамповки относится к деформированию листа давлением. Разделительные операции этим разделом не подтверждены.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **industry:** metals
- **reviewStatus:** source_located

### Литьё термопластов под давлением
- **id:** injection-molding
- **name:** Литьё термопластов под давлением
- **category:** forming
- **description:** Формование изделий из расплава термопласта в пресс-форме; не следует смешивать с литьём металлов.
- **steps:** Подготовка гранулята и формы → пластификация → впрыск → выдержка и охлаждение → извлечение → контроль
- **checks:** Усадка, коробление, утяжины, облой, неполное заполнение, влажность и термодеструкция материала.
- **materials:** ["pa6","pe-hd"]
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — исследование энергопотребления литья под давлением (не технологический регламент)","url":"https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=912839"},{"title":"Protolabs — технология литья пластмасс и типовые дефекты","url":"https://www.protolabs.com/en-gb/resources/guides-and-trend-reports/injection-moulding-guide-process-design-tips-materials/"}]
- **evidence:** {"verifiedClaim":"При литье термопластов под давлением расплав полимера впрыскивают в форму, охлаждают и извлекают изделие.","reviewScope":"Проверен только приведённый частный тезис, а не вся технологическая карточка.","checkedAt":"2026-10-22"}
- **industry:** polymers

### Экструзия полимеров
- **id:** extrusion
- **name:** Экструзия полимеров
- **category:** forming
- **description:** Непрерывное формирование профилей, плёнок или труб из расплава полимера через формующую головку.
- **steps:** Подготовка сырья → пластификация → продавливание через головку → охлаждение и калибрование → резка или намотка → контроль
- **checks:** Геометрия, колебания толщины, неоднородность расплава, дефекты поверхности и стабильность размеров.
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"},{"title":"EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Расплав непрерывно формуется через фильеру.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **industry:** polymers
- **reviewStatus:** source_located

### Шлифование
- **id:** grinding
- **name:** Шлифование
- **category:** forming
- **description:** Абразивная финишная обработка для получения требуемой точности размеров и качества поверхности.
- **steps:** Подготовка баз и круга → выбор режима → шлифование → охлаждение (при необходимости) → контроль
- **checks:** Прижоги, микротрещины, шероховатость, точность формы, износ и состояние абразивного инструмента.
- **materials:** ["steel-45"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"},{"title":"OSHA — опасности операций механической обработки","url":"https://www.osha.gov/metalworking-fluids/manual"},{"url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.215","title":"OSHA — безопасность абразивного шлифования"},{"title":"Current State and Emerging Trends in Advanced Manufacturing: Process Technologies — полный авторский текст","url":"https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957755"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Шлифование относится к абразивному удалению материала; применяется для уточнения размеров и поверхности.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **industry:** metals
- **reviewStatus:** source_located

### Покрытия и обработка поверхности
- **id:** surface-finishing
- **name:** Покрытия и обработка поверхности
- **category:** treatment
- **description:** Нанесение защитного или функционального слоя; подготовка поверхности, метод покрытия и критерии качества зависят от системы.
- **steps:** Подготовка поверхности → подготовка состава или оборудования → нанесение покрытия → отверждение или сушка (если нужно) → контроль
- **checks:** Адгезия, сплошность, толщина, поры, отслаивание, коррозионная стойкость в заданной среде.
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — обзор производственных технологий (общий контекст)","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"}]
- **evidence:** {"verifiedClaim":"Поверхностная обработка выделяется как направление производственных процессов.","reviewScope":"Проверено только приведённое утверждение, не вся карточка.","checkedAt":"2026-10-22"}
- **industry:** general

### Механическая сборка
- **id:** assembly
- **name:** Механическая сборка
- **category:** joining
- **description:** Формирование узлов из деталей с разъёмными или неразъёмными механическими соединениями.
- **steps:** Комплектация и идентификация деталей → подготовка баз → сборка → затяжка или фиксация по документации → функциональный контроль
- **checks:** Посадка, взаимное положение, момент затяжки (когда нормирован), повреждения деталей и прослеживаемость.
- **materials:** []
- **profession:** mechanical-engineer
- **sources:** [{"title":"ISO 10209:2022 — определение сборки","url":"https://www.iso.org/cms/live/live/en/sites/isoorg/contents/data/standard/07/38/73872.html"},{"title":"IPC — J-STD-001J и IPC-A-610J: производство электронных сборок","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"},{"title":"NIST (2013) — обзор оценки устойчивости производственных процессов (общий контекст)","url":"https://www.nist.gov/publications/review-sustainability-characterization-manufacturing-processes"}]
- **evidence:** {"verifiedClaim":"Сборка объединяет компоненты в функционально связанный узел.","reviewScope":"Подтверждено только определение, а не способы крепления или нормативные моменты затяжки.","checkedAt":"2026-10-22"}
- **industry:** general

### Пастеризация
- **id:** pasteurization
- **name:** Пастеризация
- **category:** treatment
- **description:** Тепловая обработка пищевого продукта для снижения микробной нагрузки; не обеспечивает стерильность.
- **steps:** Приёмка сырья → подготовка → тепловая обработка по утверждённому режиму → охлаждение → контроль
- **checks:** Температурно-временной профиль, микробиология и повторное загрязнение.
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — обзор переработки пищевых продуктов","url":"https://www.fao.org/4/y5113e/y5113e04.htm"},{"title":"FAO — маломасштабная переработка овощей и фруктов","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verifiedClaim":"Пастеризация является одним из методов тепловой обработки пищевых продуктов.","reviewScope":"Проверено только приведённое утверждение, не вся карточка.","checkedAt":"2026-10-22"}
- **industry:** food

### Сушка пищевых продуктов
- **id:** food-drying
- **name:** Сушка пищевых продуктов
- **category:** treatment
- **description:** Удаление влаги для получения заданных характеристик хранения; показатели зависят от продукта.
- **steps:** Подготовка → загрузка → сушка → выравнивание влаги → контроль → упаковка
- **checks:** Активность воды, остаточная влажность, загрязнение и неравномерность сушки.
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — обзор переработки пищевых продуктов","url":"https://www.fao.org/4/y5113e/y5113e04.htm"},{"title":"FAO — маломасштабная переработка овощей и фруктов","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Сушка удаляет воду и снижает активность воды; хранение зависит также от упаковки.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **industry:** food
- **reviewStatus:** source_located

### Пищевая ферментация
- **id:** fermentation
- **name:** Пищевая ферментация
- **category:** treatment
- **description:** Биохимическое преобразование сырья микроорганизмами или ферментами в контролируемых условиях.
- **steps:** Подготовка субстрата → внесение культуры (если предусмотрено) → ферментация → стабилизация → контроль
- **checks:** Микробиологическая безопасность, pH, температура, время, загрязнение посторонней микрофлорой.
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — маломасштабная переработка овощей и фруктов","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Пищевая ферментация включает преобразование субстратов микроорганизмами, например образование молочной кислоты.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **industry:** food
- **reviewStatus:** source_located

### Фасовка и упаковка пищевой продукции
- **id:** food-packaging
- **name:** Фасовка и упаковка пищевой продукции
- **category:** joining
- **description:** Дозирование продукта и формирование закрытой упаковки с контролем целостности и маркировки.
- **steps:** Подготовка тары → дозирование → укупорка или запайка → проверка герметичности → маркировка
- **checks:** Масса нетто, герметичность, совместимость упаковки с продуктом, прослеживаемость.
- **materials:** ["food-raw","food-pack"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — обзор переработки пищевых продуктов","url":"https://www.fao.org/4/y5113e/y5113e04.htm"},{"title":"FAO — маломасштабная переработка овощей и фруктов","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verifiedClaim":"Упаковка применяется для защиты продуктов от внешних воздействий.","reviewScope":"Проверено только приведённое утверждение, не вся карточка.","checkedAt":"2026-10-22"}
- **industry:** food

### Прядение
- **id:** spinning
- **name:** Прядение
- **category:** forming
- **description:** Подготовка волокнистой массы и формирование пряжи с заданными показателями линейной плотности и крутки.
- **steps:** Разрыхление и очистка → кардочесание → вытягивание → прядение → намотка → контроль
- **checks:** Неровнота пряжи, обрывность, засорённость, прочность.
- **materials:** ["cotton"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA SIC 22 — классификация текстильных производств","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"OSHA — основные процессы текстильной промышленности","url":"https://www.osha.gov/textiles"},{"title":"CottonWorks — Yarn Spinning","url":"https://cottonworks.com/learning-hub/yarn-manufacturing/yarn-spinning/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При прядении подготовленные хлопковые волокна формируются в пряжу с круткой.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **industry:** textiles
- **reviewStatus:** source_located

### Ткачество
- **id:** weaving
- **name:** Ткачество
- **category:** forming
- **description:** Формирование ткани переплетением продольных и поперечных нитей.
- **steps:** Подготовка основы и утка → заправка станка → ткачество → съём ткани → разбраковка
- **checks:** Плотность нитей, обрывы, пропуски, полосатость и дефекты переплетения.
- **materials:** ["cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA SIC 22 — классификация текстильных производств","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"OSHA — основные процессы текстильной промышленности","url":"https://www.osha.gov/textiles"},{"title":"CottonWorks — Weaving Basics","url":"https://cottonworks.com/learning-hub/weaving/weaving-basics/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Ткань формируется переплетением основы и утка.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **industry:** textiles
- **reviewStatus:** source_located

### Вязальное производство
- **id:** knitting
- **name:** Вязальное производство
- **category:** forming
- **description:** Формирование трикотажного полотна из петель одной или нескольких систем нитей.
- **steps:** Подготовка пряжи → настройка машины → вязание → стабилизация → контроль
- **checks:** Спущенные петли, затяжки, разнооттеночность и плотность петель.
- **materials:** ["cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA SIC 22 — классификация текстильных производств","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"OSHA — основные процессы текстильной промышленности","url":"https://www.osha.gov/textiles"},{"title":"CottonWorks — Knit Basics","url":"https://cottonworks.com/learning-hub/knitting/knit-basics/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Трикотаж образуется системой взаимосвязанных петель.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **industry:** textiles
- **reviewStatus:** source_located

### Крашение и отделка текстиля
- **id:** textile-finishing
- **name:** Крашение и отделка текстиля
- **category:** treatment
- **description:** Предварительная обработка, крашение, печать и окончательная отделка тканей или трикотажа.
- **steps:** Подготовка и очистка → крашение или печать → промывка и фиксация → сушка → финишная обработка → контроль
- **checks:** Равномерность окраски, устойчивость красителя, усадка, остаточные химические вещества.
- **materials:** ["woven-fabric"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA SIC 2261 — справочник отрасли отделки хлопчатобумажных тканей","url":"https://www.osha.gov/sic-manual/2261"},{"title":"OSHA — основные процессы текстильной промышленности","url":"https://www.osha.gov/textiles"}]
- **evidence:** {"verifiedClaim":"Текстильная отделка может включать отбеливание, крашение, печать и механическую финишную обработку.","reviewScope":"Классификация видов операций, не режимы крашения.","checkedAt":"2026-10-22"}
- **industry:** textiles

### Швейная сборка изделий
- **id:** sewing
- **name:** Швейная сборка изделий
- **category:** joining
- **description:** Соединение деталей кроя ниточными швами и выполнение сборочных операций по документации.
- **steps:** Настил и раскрой → комплектование → соединение деталей → влажно-тепловая обработка → контроль
- **checks:** Прочность швов, пропуски стежков, посадка, смещение срезов, соответствие размеров.
- **materials:** ["woven-fabric"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA SIC 23 — классификация швейных производств","url":"https://www.osha.gov/data/sic-manual/major-group-23"},{"title":"Coats — дефекты строчки, сборка швов и причины","url":"https://www.coats.com/en-us/info-hub/solving-your-sewing-problems/"},{"title":"OSHA — основные процессы текстильной промышленности","url":"https://www.osha.gov/textiles"}]
- **evidence:** {"verifiedClaim":"Швейное производство включает раскрой и соединение текстильных материалов.","reviewScope":"Проверено только приведённое утверждение, не вся карточка.","checkedAt":"2026-10-22"}
- **industry:** textiles

### Распиловка и обработка древесины
- **id:** sawmilling
- **name:** Распиловка и обработка древесины
- **category:** forming
- **description:** Продольное или поперечное пиление древесины для получения пиломатериалов и заготовок.
- **steps:** Сортировка сырья → раскрой → пиление → сортировка → контроль размеров
- **checks:** Геометрия, трещины, коробление, сучки, повреждения поверхности.
- **materials:** ["timber"]
- **profession:** forest-engineer
- **sources:** [{"title":"OSHA — виды лесопильных и строгальных операций","url":"https://www.osha.gov/sic-manual/2421"}]
- **evidence:** {"verifiedClaim":"Лесопильные производства выполняют распиловку древесины на пиломатериалы.","reviewScope":"Классификация отрасли, не нормы качества.","checkedAt":"2026-10-22"}
- **industry:** wood

### Камерная сушка древесины
- **id:** wood-drying
- **name:** Камерная сушка древесины
- **category:** treatment
- **description:** Снижение влажности древесины при управляемых условиях для последующего применения.
- **steps:** Сортировка и штабелирование → сушка → кондиционирование → измерение влажности → сортировка
- **checks:** Остаточная влажность, внутренние напряжения, растрескивание и коробление.
- **materials:** ["timber"]
- **profession:** forest-engineer
- **sources:** [{"title":"OSHA — виды лесопильных и строгальных операций","url":"https://www.osha.gov/sic-manual/2421"},{"title":"US Forest Service — Drying Hardwood Lumber, обзор методов и дефектов","url":"https://research.fs.usda.gov/treesearch/5710"}]
- **evidence:** {"verifiedClaim":"Камерная сушка пиломатериалов входит в виды операций лесопильного производства.","reviewScope":"Подтверждено существование процесса, не его технологические режимы.","checkedAt":"2026-10-22"}
- **industry:** wood

### Монтаж печатных плат
- **id:** pcb-assembly
- **name:** Монтаж печатных плат
- **category:** joining
- **description:** Установка и закрепление электронных компонентов на печатной плате с формированием соединений.
- **steps:** Проверка платы → нанесение пасты (для SMT) → установка компонентов → оплавление или пайка → контроль
- **checks:** Паяные соединения, перемычки, недостаток припоя, смещение компонентов, электростатическая защита.
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — J-STD-001J и IPC-A-610J: производство электронных сборок","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verifiedClaim":"IPC J-STD-001J устанавливает требования к паяным электронным сборкам.","reviewScope":"Подтверждены назначение стандарта и область применения, не условия пайки.","checkedAt":"2026-10-22"}
- **industry:** electronics

### Контроль электронных сборок
- **id:** electronic-inspection
- **name:** Контроль электронных сборок
- **category:** inspection
- **description:** Визуальный, оптический, рентгеновский и электрический контроль плат и электронных узлов.
- **steps:** Идентификация требований → осмотр и измерения → электрические испытания → фиксация несоответствий
- **checks:** Паяные соединения, ориентация компонентов, электрические дефекты, критерии приемки.
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — IPC-A-610J, требования к приёмке электронных сборок","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verifiedClaim":"IPC-A-610J определяет критерии приемлемости электронных сборок после изготовления.","reviewScope":"Подтверждено назначение документа, не частные критерии приёмки.","checkedAt":"2026-10-22"}
- **industry:** electronics

### Промышленное смешение
- **id:** chemical-mixing
- **name:** Промышленное смешение
- **category:** treatment
- **description:** Однородное или заданно неоднородное смешение компонентов без обязательной химической реакции.
- **steps:** Приёмка и идентификация компонентов → дозирование → смешение → отбор проб → контроль
- **checks:** Состав, равномерность, совместимость веществ, экзотермические эффекты и опасные пары.
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"OSHA — нефтепереработка: смешение продуктов и технологические опасности","url":"https://www.osha.gov/otm/section-4-safety-hazards/chapter-2"}]
- **evidence:** {"verifiedClaim":"Смешение компонентов применяется для получения продукта с заданными характеристиками.","reviewScope":"Проверен только приведённый частный тезис, а не вся технологическая карточка.","checkedAt":"2026-10-22"}
- **industry:** chemicals

### Дистилляция
- **id:** distillation
- **name:** Дистилляция
- **category:** treatment
- **description:** Разделение жидких смесей за счёт различий летучести компонентов; применимость зависит от состава и схемы.
- **steps:** Подготовка подачи → испарение и массообмен → конденсация → сбор фракций → контроль
- **checks:** Состав фракций, давление, температура, герметичность; опасности воспламеняющихся паров.
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"OSHA — перегонка и риски технологического процесса","url":"https://www.osha.gov/otm/section-4-safety-hazards/chapter-5"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"OSHA описывает применение дистилляции и обезвоживания для выделения и очистки этанола после ферментации.","reviewScope":"Проверен частный пример перегонки этанола по руководству OSHA; причинное объяснение разделения всех жидких смесей и выбор режимов этим документом не подтверждены.","checkedAt":"2026-10-22"}
- **industry:** chemicals

### Промышленная фильтрация
- **id:** industrial-filtration
- **name:** Промышленная фильтрация
- **category:** treatment
- **description:** Отделение дисперсной фазы от жидкости или газа с использованием фильтрующей среды.
- **steps:** Подбор среды → подготовка оборудования → фильтрация → выгрузка или очистка → контроль
- **checks:** Перепад давления, тонкость фильтрации, проскок частиц, загрязнение и ресурс фильтра.
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"EPA WaterSense — фильтрация в системах очистки воды (частный пример)","url":"https://www.epa.gov/system/files/documents/2024-03/ws-commercial-bmp-watersenseatwork_section7.1_waterpurification.pdf"},{"title":"US EPA — водоподготовка: фильтрация, ионный обмен и мембраны (частный пример)","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"}]
- **evidence:** {"verifiedClaim":"Фильтрация может удалять взвешенные твёрдые частицы из жидкости.","reviewScope":"Проверен только приведённый частный тезис, а не вся технологическая карточка.","checkedAt":"2026-10-22"}
- **industry:** chemicals

### Точение
- **id:** turning
- **name:** Точение
- **industry:** metals
- **category:** forming
- **parentId:** cutting
- **description:** Получение поверхностей вращающейся заготовки резцом.
- **steps:** Базирование → точение → измерение
- **checks:** Биение, размеры, шероховатость
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Sandvik Coromant — General turning","url":"https://www.sandvik.coromant.com/en-us/knowledge/general-turning"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При точении вращается заготовка, а резание выполняет однолезвийный инструмент.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Фрезерование
- **id:** milling
- **name:** Фрезерование
- **industry:** metals
- **category:** forming
- **parentId:** cutting
- **description:** Получение плоскостей и профилей вращающейся многолезвийной фрезой.
- **steps:** Базирование → проходы фрезой → измерение
- **checks:** Плоскостность, геометрия, заусенцы
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Cutter path and chip formation in milling","url":"https://www.sandvik.coromant.com/en-gb/knowledge/milling/cutter-path-and-chip-formation"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При фрезеровании режущие кромки периодически входят в заготовку и выходят из неё, снимая материал.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Сверление
- **id:** drilling
- **name:** Сверление
- **industry:** metals
- **category:** forming
- **parentId:** cutting
- **description:** Получение отверстий сверлом с осевой подачей.
- **steps:** Закрепление → сверление → контроль отверстия
- **checks:** Диаметр, увод, положение оси, заусенцы
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Drilling a hole","url":"https://www.sandvik.coromant.com/en-gb/knowledge/drilling"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Диаметр является одним из основных контролируемых требований к отверстию. Увод, положение оси и заусенцы этим абзацем не проверены.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Растачивание
- **id:** boring
- **name:** Растачивание
- **industry:** metals
- **category:** forming
- **parentId:** cutting
- **description:** Обработка предварительно полученного отверстия расточным инструментом.
- **steps:** Базирование → растачивание → контроль
- **checks:** Соосность, цилиндричность, размер
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Sandvik Coromant — Boring holes","url":"https://www.sandvik.coromant.com/en-us/knowledge/boring"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Растачивание увеличивает или улучшает уже существующее отверстие.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Развёртывание
- **id:** reaming
- **name:** Развёртывание
- **industry:** metals
- **category:** forming
- **parentId:** cutting
- **description:** Чистовая обработка подготовленного отверстия развёрткой.
- **steps:** Проверка припуска → развёртывание → измерение
- **checks:** Диаметр, форма, шероховатость
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Sandvik Coromant — Reaming","url":"https://www.sandvik.coromant.com/en-us/knowledge/reaming"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Развёртывание — чистовая обработка отверстия многолезвийным инструментом.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Протягивание
- **id:** broaching
- **name:** Протягивание
- **industry:** metals
- **category:** forming
- **parentId:** cutting
- **description:** Формирование профиля последовательными режущими зубьями протяжки.
- **steps:** Установка заготовки → проход протяжки → контроль
- **checks:** Профиль, следы зубьев, заусенцы
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Зубонарезание
- **id:** gear-cutting
- **name:** Зубонарезание
- **industry:** metals
- **category:** forming
- **parentId:** cutting
- **description:** Обработка зубчатых венцов специальным инструментом.
- **steps:** Подготовка заготовки → нарезание → измерение зубьев
- **checks:** Шаг, профиль и биение зубьев
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Gear manufacturing","url":"https://www.sandvik.coromant.com/en-gb/knowledge/milling/gear-manufacturing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При контроле зубчатых колёс оценивают точность профиля, отклонение шага и биение; допуски определяет спецификация.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Электроэрозионная обработка
- **id:** electrodischarge-machining
- **name:** Электроэрозионная обработка
- **industry:** metals
- **category:** forming
- **description:** Эрозионное удаление электропроводящего материала электрическими разрядами.
- **steps:** Позиционирование электрода → обработка → контроль
- **checks:** Геометрия, износ электрода, состояние слоя
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Лазерная резка
- **id:** laser-cutting
- **name:** Лазерная резка
- **industry:** metals
- **category:** forming
- **description:** Разделение заготовки сфокусированным лазерным излучением.
- **steps:** Раскрой → резка → отделение деталей → осмотр
- **checks:** Кромка, геометрия, термическое влияние
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"What is laser melting?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-laser-melting"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Лазерная резка локально воздействует сфокусированным пучком; при резке плавлением расплав удаляется газовой струёй.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Гидроабразивная резка
- **id:** waterjet-cutting
- **name:** Гидроабразивная резка
- **industry:** metals
- **category:** forming
- **description:** Разделение материала струёй воды с абразивом.
- **steps:** Закрепление → резка → очистка → измерение
- **checks:** Конусность реза, кромка, размер
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Отжиг
- **id:** annealing
- **name:** Отжиг
- **industry:** metals
- **category:** treatment
- **parentId:** heat
- **description:** Термический цикл нагрева и охлаждения для изменения структуры.
- **steps:** Выбор цикла по материалу → обработка → испытания
- **checks:** Структура, твёрдость, деформации
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Bodycote — Technical glossary","url":"https://www.bodycote.com/technical-glossary/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Отжиг включает нагрев и последующее охлаждение для изменения состояния металла.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Закалка сталей
- **id:** quenching
- **name:** Закалка сталей
- **industry:** metals
- **category:** treatment
- **parentId:** heat
- **description:** Термическая обработка с ускоренным охлаждением для изменения структуры стали.
- **steps:** Проверка марки → нагрев → охлаждение → контроль
- **checks:** Трещины, коробление и твёрдость
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Bodycote — Technical glossary","url":"https://www.bodycote.com/technical-glossary/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Закалка стали включает ускоренное охлаждение после нагрева.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Отпуск стали
- **id:** tempering
- **name:** Отпуск стали
- **industry:** metals
- **category:** treatment
- **parentId:** heat
- **description:** Тепловая обработка закалённой стали для изменения сочетания свойств.
- **steps:** Проверка состояния → отпуск → измерения
- **checks:** Твёрдость, деформации, требования к свойствам
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Bodycote — Technical glossary","url":"https://www.bodycote.com/technical-glossary/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Отпуск изменяет механические свойства стали после закалки.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Индукционная поверхностная закалка
- **id:** induction-hardening
- **name:** Индукционная поверхностная закалка
- **industry:** metals
- **category:** treatment
- **parentId:** heat
- **description:** Локальная закалка с нагревом электромагнитной индукцией.
- **steps:** Позиционирование → нагрев → охлаждение → проверка слоя
- **checks:** Глубина слоя, трещины, твёрдость
- **materials:** ["steel-45","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"NIST — технологии производства: обзор — общий контекст; не техкарта","url":"https://www.nist.gov/publications/current-state-and-emerging-trends-advanced-manufacturing-process-technologies"},{"title":"Bodycote — Technical glossary","url":"https://www.bodycote.com/technical-glossary/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Индукционная закалка сочетает индукционный нагрев и последующее охлаждение.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Ручная дуговая сварка покрытым электродом
- **id:** manual-metal-arc
- **name:** Ручная дуговая сварка покрытым электродом
- **industry:** metals
- **category:** joining
- **parentId:** welding
- **description:** Дуговое соединение с расходуемым покрытым электродом.
- **steps:** Подготовка → сборка → сварка → удаление шлака → контроль
- **checks:** Несплавление, трещины, включения
- **materials:** ["09g2s","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация сварочных технологий — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"Manual Metal Arc Welding (MMA, SMAW or Stick Welding)","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/the-manual-metal-arc-process-mma-welding-002"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Ручная дуговая сварка использует покрытый металлический электрод; стержень расходуется при плавлении.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Сварка под флюсом
- **id:** submerged-arc
- **name:** Сварка под флюсом
- **industry:** metals
- **category:** joining
- **parentId:** welding
- **description:** Дуговая сварка с защитой дуги гранулированным флюсом.
- **steps:** Подготовка стыка → сварка под флюсом → очистка → контроль
- **checks:** Включения, поры, геометрия
- **materials:** ["09g2s","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация сварочных технологий — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"What is Submerged-arc Welding?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-submerged-arc-welding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Дуга между подаваемым электродом и изделием скрыта слоем флюса, обеспечивающим защиту зоны сварки.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Контактная точечная сварка
- **id:** resistance-spot
- **name:** Контактная точечная сварка
- **industry:** metals
- **category:** joining
- **description:** Локальное соединение нахлёсточных листов нагревом током и усилием.
- **steps:** Совмещение листов → контактный цикл → испытания
- **checks:** Размер точки, выплеск, прочность
- **materials:** ["09g2s","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация сварочных технологий — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"What is resistance seam welding?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-resistance-seam-welding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Точечная контактная сварка соединяет нахлёсточные листы пропусканием тока при приложенном усилии между электродами.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Лазерная сварка
- **id:** laser-welding
- **name:** Лазерная сварка
- **industry:** metals
- **category:** joining
- **description:** Формирование шва концентрированным лазерным источником энергии.
- **steps:** Подготовка → позиционирование → сварка → контроль
- **checks:** Проплавление, поры, трещины
- **materials:** ["09g2s","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация сварочных технологий — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"What is Laser Welding and How Does it Work?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-how-does-laser-welding-work"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Лазерный пучок служит концентрированным источником тепла для формирования сварного соединения.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Сварка трением с перемешиванием
- **id:** friction-stir-welding
- **name:** Сварка трением с перемешиванием
- **industry:** metals
- **category:** joining
- **description:** Твердофазное соединение вращающимся инструментом вдоль линии стыка.
- **steps:** Сборка → проход инструмента → контроль соединения
- **checks:** Несплошности, проплавление не применимо, геометрия
- **materials:** ["09g2s","al-6061"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация сварочных технологий — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"Friction Stir Welding Services","url":"https://www.twi-global.com/what-we-do/research-and-technology/technologies/welding-joining-and-cutting/friction-welding/friction-stir-welding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"FSW соединяет материал в твёрдом состоянии вращающимся неплавящимся инструментом, перемещаемым по стыку.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Высокотемпературная пайка
- **id:** brazing
- **name:** Высокотемпературная пайка
- **industry:** metals
- **category:** joining
- **description:** Соединение без расплавления основного металла с использованием припоя, температура плавления которого выше 450 °C.
- **steps:** Очистка → сборка → нагрев → охлаждение → контроль
- **checks:** Смачивание, поры, зазор
- **materials:** ["copper-m1","aisi-304"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — сварка и пайка: различия — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/faqs/welding-brazing-and-soldering"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Высокотемпературная пайка использует припой выше 450 °C без плавления основы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Низкотемпературная пайка
- **id:** soft-soldering
- **name:** Низкотемпературная пайка
- **industry:** metals
- **category:** joining
- **description:** Соединение без расплавления основного металла с использованием припоя, температура плавления которого ниже 450 °C.
- **steps:** Подготовка → пайка → очистка → проверка
- **checks:** Смачивание, загрязнение, прочность
- **materials:** ["copper-m1","aisi-304"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — сварка и пайка: различия — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/faqs/welding-brazing-and-soldering"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Низкотемпературная пайка использует припой ниже 450 °C без плавления основы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Сплавление порошкового слоя
- **id:** powder-bed-fusion
- **name:** Сплавление порошкового слоя
- **industry:** general
- **category:** forming
- **parentId:** additive
- **description:** Послойное сплавление порошка направленным источником энергии.
- **steps:** Подготовка порошка → построение → извлечение → контроль
- **checks:** Пористость, деформации, размер
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — виды аддитивного производства — общий контекст; не техкарта","url":"https://www.nist.gov/additive-manufacturing/research-areas/technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Порошковый слой сплавляется источником энергии, например лазером или электронным пучком.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Направленное энергетическое осаждение
- **id:** directed-energy-deposition
- **name:** Направленное энергетическое осаждение
- **industry:** general
- **category:** forming
- **parentId:** additive
- **description:** Подача материала в область локального нагрева и формирования объёма.
- **steps:** Подготовка траектории → осаждение → охлаждение → контроль
- **checks:** Несплавление, геометрия, трещины
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — виды аддитивного производства — общий контекст; не техкарта","url":"https://www.nist.gov/additive-manufacturing/research-areas/technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Материал подаётся и плавится направленным источником энергии.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Струйное нанесение связующего
- **id:** binder-jetting
- **name:** Струйное нанесение связующего
- **industry:** general
- **category:** forming
- **parentId:** additive
- **description:** Выборочное связывание порошковых слоёв жидким связующим.
- **steps:** Подача порошка → нанесение связующего → постобработка → контроль
- **checks:** Прочность сырца, усадка, плотность
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — виды аддитивного производства — общий контекст; не техкарта","url":"https://www.nist.gov/additive-manufacturing/research-areas/technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Порошковый материал соединяется выборочным нанесением связующего.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Струйное нанесение материала
- **id:** material-jetting
- **name:** Струйное нанесение материала
- **industry:** general
- **category:** forming
- **parentId:** additive
- **description:** Послойное построение изделия дозированными каплями материала.
- **steps:** Дозирование капель → построение → отверждение → измерение
- **checks:** Слои, геометрия, качество поверхности
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — виды аддитивного производства — общий контекст; не техкарта","url":"https://www.nist.gov/additive-manufacturing/research-areas/technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Изделие формируется нанесением капель материала.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Ванночная фотополимеризация
- **id:** vat-photopolymerization
- **name:** Ванночная фотополимеризация
- **industry:** general
- **category:** forming
- **parentId:** additive
- **description:** Послойное световое отверждение фотополимерной смолы.
- **steps:** Подготовка модели → экспонирование → очистка и доотверждение → контроль
- **checks:** Размеры, остаточная смола, полнота отверждения
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — виды аддитивного производства — общий контекст; не техкарта","url":"https://www.nist.gov/additive-manufacturing/research-areas/technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Фотополимерная смола отверждается светом при последовательном построении.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Аддитивная экструзия материала
- **id:** additive-extrusion
- **name:** Аддитивная экструзия материала
- **industry:** general
- **category:** forming
- **parentId:** additive
- **description:** Послойная укладка экструдируемого полимерного материала.
- **steps:** Подготовка нити → экструзия слоёв → охлаждение → контроль
- **checks:** Межслойная связь, геометрия, пористость
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"NIST — виды аддитивного производства — общий контекст; не техкарта","url":"https://www.nist.gov/additive-manufacturing/research-areas/technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Экструдируемый материал укладывается послойно.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Выдувное формование
- **id:** blow-molding
- **name:** Выдувное формование
- **industry:** polymers
- **category:** forming
- **description:** Получение полых термопластичных изделий раздувом заготовки в форме.
- **steps:** Формование заготовки → раздув → охлаждение → извлечение
- **checks:** Толщина, герметичность, усадка
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Полое изделие формуется раздувом пластиковой заготовки.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Ротационное формование
- **id:** rotomolding
- **name:** Ротационное формование
- **industry:** polymers
- **category:** forming
- **description:** Получение полого изделия распределением нагретого полимера по вращающейся форме.
- **steps:** Загрузка сырья → нагрев и вращение → охлаждение
- **checks:** Толщина, поры, коробление
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Полимер нагревается и распределяется по внутренней поверхности вращающейся формы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Термоформование листа
- **id:** thermoforming
- **name:** Термоформование листа
- **industry:** polymers
- **category:** forming
- **description:** Придание нагретому полимерному листу формы под вакуумом или давлением.
- **steps:** Нагрев листа → формование → охлаждение → обрезка
- **checks:** Складки, истончение, размеры
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Нагретому листу придают форму давлением или вакуумом.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Каландрование пластмасс
- **id:** calendering
- **name:** Каландрование пластмасс
- **industry:** polymers
- **category:** forming
- **description:** Формирование полотна или плёнки прохождением полимерной массы между валками.
- **steps:** Подготовка массы → валки → калибрование → контроль
- **checks:** Толщина, неоднородность, полосы
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Тонкая непрерывная плёнка получается между валками.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Компаундирование полимеров
- **id:** compounding
- **name:** Компаундирование полимеров
- **industry:** polymers
- **category:** treatment
- **description:** Смешивание полимера с наполнителями и добавками для получения композиции.
- **steps:** Дозирование → смешение → гранулирование → испытания
- **checks:** Однородность, влажность, распределение добавок
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Добавки смешивают с полимером для изменения свойств.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Вспенивание пластмасс
- **id:** polymer-foaming
- **name:** Вспенивание пластмасс
- **industry:** polymers
- **category:** forming
- **description:** Формирование ячеистой структуры в полимерном материале.
- **steps:** Подготовка состава → вспенивание → охлаждение → контроль
- **checks:** Плотность, структура ячеек, усадка
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Вспенивание формирует ячеистую структуру полимера.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Ультразвуковая сварка термопластов
- **id:** ultrasonic-plastic-welding
- **name:** Ультразвуковая сварка термопластов
- **industry:** polymers
- **category:** joining
- **description:** Соединение подходящих термопластов за счёт высокочастотных механических колебаний.
- **steps:** Совмещение → прижатие → воздействие → контроль
- **checks:** Прочность, герметичность, перегрев
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"TWI — методы соединения полимеров — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/faqs/joining-methods-of-polymers?trk=public_post_reshare-text"},{"title":"Ultrasonic welding of injection moulded components","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/ultrasonic-welding-of-injection-moulded-components-part-1-process-and-equipment-061"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Ультразвуковые механические колебания размягчают или плавят термопласт в зоне стыка деталей, удерживаемых под давлением.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Лазерная сварка термопластов
- **id:** laser-plastic-welding
- **name:** Лазерная сварка термопластов
- **industry:** polymers
- **category:** joining
- **description:** Локальное лазерное соединение оптически совместимых термопластичных деталей.
- **steps:** Подготовка сопряжения → лазерное воздействие → контроль
- **checks:** Непровар, пережог, прочность
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"TWI — методы соединения полимеров — общий контекст; не техкарта","url":"https://www.twi-global.com/technical-knowledge/faqs/joining-methods-of-polymers?trk=public_post_reshare-text"},{"title":"What is laser melting?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-laser-melting"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При просвечивающей лазерной сварке пластмасс верхний материал пропускает излучение, нижний поглощает; локальный нагрев образует соединение.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Ручная выкладка композитов
- **id:** hand-layup
- **name:** Ручная выкладка композитов
- **industry:** composites
- **category:** forming
- **description:** Выкладка слоёв армирования с пропиткой связующим в оснастке.
- **steps:** Подготовка формы → укладка → пропитка → отверждение
- **checks:** Поры, сухие зоны, складки
- **materials:** ["gfrp","aramid"]
- **profession:** materials-engineer
- **sources:** [{"title":"DOE — способы изготовления композитов, 2016 — общий контекст; не техкарта","url":"https://www.energy.gov/sites/prod/files/2016/04/f30/Carbon%20Fiber%20Report.pdf"},{"title":"Methods of Composite Manufacture","url":"https://compositesuk.co.uk/composite-materials/processes/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При ручной выкладке армирующие слои помещают в форму и пропитывают смолой кистью или валиком.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Вакуумная инфузия
- **id:** vacuum-infusion
- **name:** Вакуумная инфузия
- **industry:** composites
- **category:** forming
- **description:** Пропитка сухого армирующего пакета смолой при перепаде давлений.
- **steps:** Выкладка → вакуумный пакет → инфузия → отверждение
- **checks:** Непропитка, утечки, поры
- **materials:** ["gfrp","aramid"]
- **profession:** materials-engineer
- **sources:** [{"title":"DOE — способы изготовления композитов, 2016 — общий контекст; не техкарта","url":"https://www.energy.gov/sites/prod/files/2016/04/f30/Carbon%20Fiber%20Report.pdf"},{"title":"Methods of Composite Manufacture","url":"https://compositesuk.co.uk/composite-materials/processes/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Сухие слои под герметичным вакуумным пакетом пропитываются смолой из резервуара при перепаде давлений.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Трансферное формование композитов (RTM)
- **id:** resin-transfer-molding
- **name:** Трансферное формование композитов (RTM)
- **industry:** composites
- **category:** forming
- **description:** Подача жидкой смолы в закрытую форму с армирующей преформой.
- **steps:** Укладка преформы → инжекция смолы → отверждение
- **checks:** Пористость, усадка, геометрия
- **materials:** ["gfrp","aramid"]
- **profession:** materials-engineer
- **sources:** [{"title":"DOE — способы изготовления композитов, 2016 — общий контекст; не техкарта","url":"https://www.energy.gov/sites/prod/files/2016/04/f30/Carbon%20Fiber%20Report.pdf"},{"title":"Methods of Composite Manufacture","url":"https://compositesuk.co.uk/composite-materials/processes/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При RTM жидкую смолу подают в закрытую форму с сухим армированием.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Пултрузия
- **id:** pultrusion
- **name:** Пултрузия
- **industry:** composites
- **category:** forming
- **description:** Непрерывное протягивание пропитанных волокон через формующую фильеру.
- **steps:** Подача армирования → пропитка → фильера → резка
- **checks:** Профиль, содержание волокон, поры
- **materials:** ["gfrp","aramid"]
- **profession:** materials-engineer
- **sources:** [{"title":"DOE — способы изготовления композитов, 2016 — общий контекст; не техкарта","url":"https://www.energy.gov/sites/prod/files/2016/04/f30/Carbon%20Fiber%20Report.pdf"},{"title":"Methods of Composite Manufacture","url":"https://compositesuk.co.uk/composite-materials/processes/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При пултрузии волокна проходят пропитку и протягиваются через нагретую формующую фильеру с отверждением смолы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Намотка композитов
- **id:** filament-winding
- **name:** Намотка композитов
- **industry:** composites
- **category:** forming
- **description:** Размещение армирующих нитей на вращающейся оправке.
- **steps:** Подготовка оправки → намотка → отверждение → съём
- **checks:** Угол армирования, равномерность, поры
- **materials:** ["gfrp","aramid"]
- **profession:** materials-engineer
- **sources:** [{"title":"DOE — способы изготовления композитов, 2016 — общий контекст; не техкарта","url":"https://www.energy.gov/sites/prod/files/2016/04/f30/Carbon%20Fiber%20Report.pdf"},{"title":"Methods of Composite Manufacture","url":"https://compositesuk.co.uk/composite-materials/processes/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При намотке армирующие нити укладываются на вращающуюся оправку с заданной ориентацией.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Автоклавное отверждение композитов
- **id:** autoclave-composites
- **name:** Автоклавное отверждение композитов
- **industry:** composites
- **category:** treatment
- **description:** Отверждение пакета композита при контролируемом тепловом и барическом цикле.
- **steps:** Вакуумный пакет → автоклавный цикл → извлечение → контроль
- **checks:** Пористость, степень отверждения, деформации
- **materials:** ["gfrp","aramid"]
- **profession:** materials-engineer
- **sources:** [{"title":"DOE — способы изготовления композитов, 2016 — общий контекст; не техкарта","url":"https://www.energy.gov/sites/prod/files/2016/04/f30/Carbon%20Fiber%20Report.pdf"},{"title":"Methods of Composite Manufacture","url":"https://compositesuk.co.uk/composite-materials/processes/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Автоклавное отверждение препрега сочетает нагрев и давление; конкретный цикл зависит от системы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Трафаретное нанесение паяльной пасты
- **id:** solder-paste-printing
- **name:** Трафаретное нанесение паяльной пасты
- **industry:** electronics
- **category:** joining
- **parentId:** pcb-assembly
- **description:** Дозирование пасты через трафарет на площадки печатной платы.
- **steps:** Совмещение → нанесение пасты → контроль рисунка
- **checks:** Объём, смещение, мостики пасты
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — стандарты сборки электроники (обзор) — общий контекст; не техкарта","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Автоматическая установка SMD-компонентов
- **id:** smt-placement
- **name:** Автоматическая установка SMD-компонентов
- **industry:** electronics
- **category:** joining
- **parentId:** pcb-assembly
- **description:** Автоматическое позиционирование компонентов на площадки платы.
- **steps:** Подготовка питателей → установка → оптический контроль
- **checks:** Ориентация, смещение, пропуски
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — стандарты сборки электроники (обзор) — общий контекст; не техкарта","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Пайка оплавлением
- **id:** reflow-soldering
- **name:** Пайка оплавлением
- **industry:** electronics
- **category:** joining
- **parentId:** pcb-assembly
- **description:** Образование паяных соединений при нагреве нанесённой пасты.
- **steps:** Нанесение → термопрофиль → оплавление → охлаждение
- **checks:** Пустоты, непропай, перемычки
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — стандарты сборки электроники (обзор) — общий контекст; не техкарта","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Пайка волной припоя
- **id:** wave-soldering
- **name:** Пайка волной припоя
- **industry:** electronics
- **category:** joining
- **parentId:** pcb-assembly
- **description:** Формирование соединений при контакте платы с волной расплавленного припоя.
- **steps:** Флюсование → предварительный нагрев → волна → контроль
- **checks:** Перемычки, недостаток припоя, загрязнение
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — стандарты сборки электроники (обзор) — общий контекст; не техкарта","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Защитное покрытие электронных сборок
- **id:** conformal-coating
- **name:** Защитное покрытие электронных сборок
- **industry:** electronics
- **category:** treatment
- **parentId:** pcb-assembly
- **description:** Нанесение защитной полимерной плёнки на собранную плату.
- **steps:** Очистка → маскирование → нанесение → отверждение
- **checks:** Толщина, пропуски, пузыри
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — стандарты сборки электроники (обзор) — общий контекст; не техкарта","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Автоматизированная оптическая инспекция плат
- **id:** aoi-pcb
- **name:** Автоматизированная оптическая инспекция плат
- **industry:** electronics
- **category:** inspection
- **parentId:** electronic-inspection
- **description:** Контроль сборки системой машинного зрения по заданным критериям.
- **steps:** Настройка эталона → сканирование → проверка обнаружений
- **checks:** Ложные срабатывания, пропуски, ошибки размещения
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — стандарты сборки электроники (обзор) — общий контекст; не техкарта","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Указан обзорный принцип операции; вся технологическая карточка не проверена.","reviewScope":"Источник описывает класс процессов или отрасль. Состав этапов, дефекты, применимость к марке и технологические параметры требуют отдельной сверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Бланширование пищевого сырья
- **id:** blanching-food
- **name:** Бланширование пищевого сырья
- **category:** treatment
- **industry:** food
- **description:** Кратковременная тепловая обработка до последующих операций.
- **steps:** Подготовка → нагрев → охлаждение → контроль
- **checks:** Температурное воздействие, цвет, ферментативная активность
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Бланширование — предварительная тепловая обработка с последующим охлаждением; одна из целей — инактивация ферментов.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Тепловая стерилизация пищевой продукции
- **id:** thermal-sterilization-food
- **name:** Тепловая стерилизация пищевой продукции
- **category:** treatment
- **industry:** food
- **description:** Тепловая обработка упаковки или продукта для достижения заданной микробиологической стабильности.
- **steps:** Подготовка → утверждённый тепловой цикл → охлаждение → контроль
- **checks:** Герметичность, сохранность упаковки, микробиологические критерии
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Термическая обработка применяется для микробиологической стабилизации продукта; защита от повторного загрязнения зависит от упаковки. Режимы не подтверждены.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Промышленное замораживание пищевых продуктов
- **id:** freezing-food
- **name:** Промышленное замораживание пищевых продуктов
- **category:** treatment
- **industry:** food
- **description:** Снижение температуры продуктов с переходом части влаги в лёд.
- **steps:** Подготовка → охлаждение и заморозка → хранение → контроль
- **checks:** Температура продукта, кристаллизация, потери массы
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"},{"title":"FAO — Freezing of fruits and vegetables, Chapter 1","url":"https://www.fao.org/4/y5979e/y5979e03.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Замораживание снижает температуру пищевого продукта с изменением его физического состояния.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Распылительная сушка пищевых жидкостей
- **id:** spray-drying-food
- **name:** Распылительная сушка пищевых жидкостей
- **category:** treatment
- **industry:** food
- **description:** Получение порошка из жидкого сырья при распылении и удалении влаги.
- **steps:** Подготовка жидкости → распыление → отделение порошка → контроль
- **checks:** Влажность, агломерация, изменение свойств
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"},{"title":"Tetra Pak Dairy Processing Handbook — Milk and Whey Powdered Ingredients","url":"https://dairyprocessinghandbook.tetrapak.com/chapter/milk-and-whey-powdered-ingredients"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Жидкость распыляют в мелкие капли, вода испаряется, порошок отделяется от сушильного воздуха.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Выпаривание пищевых растворов
- **id:** food-evaporation
- **name:** Выпаривание пищевых растворов
- **category:** treatment
- **industry:** food
- **description:** Концентрирование раствора удалением части растворителя при теплопередаче.
- **steps:** Подготовка → выпаривание → отвод паров → проверка концентрата
- **checks:** Сухие вещества, термическое повреждение, загрязнение
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"},{"title":"GEA — Evaporation Technology","url":"https://www.gea.com/en/assets/170546/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Выпаривание удаляет часть воды или другого растворителя и повышает концентрацию продукта.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Помол зерна
- **id:** grain-milling
- **name:** Помол зерна
- **category:** forming
- **industry:** food
- **description:** Измельчение и сортирование зернового сырья на фракции.
- **steps:** Очистка → дробление или помол → просеивание → анализ
- **checks:** Гранулометрия, загрязнения, посторонние примеси
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Экструзионная обработка пищевых смесей
- **id:** food-extrusion
- **name:** Экструзионная обработка пищевых смесей
- **category:** forming
- **industry:** food
- **description:** Формирование пищевой массы проходом через экструдер и формующий канал.
- **steps:** Подготовка рецептуры → экструзия → охлаждение → контроль
- **checks:** Структура, форма, равномерность состава
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Осветление соков
- **id:** juice-clarification
- **name:** Осветление соков
- **category:** treatment
- **industry:** food
- **description:** Снижение содержания взвесей и мутности пищевой жидкости.
- **steps:** Подготовка сока → осветление или фильтрация → измерение
- **checks:** Мутность, осадок, выход и сохранение состава
- **materials:** ["food-raw"]
- **profession:** food-engineer
- **sources:** [{"title":"FAO — руководство по переработке фруктов и овощей — обзор; не технологическая инструкция","url":"https://www.fao.org/4/x0209e/x0209e06.htm"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Кардочесание волокон
- **id:** carding
- **name:** Кардочесание волокон
- **category:** forming
- **industry:** textiles
- **parentId:** spinning
- **description:** Разделение и ориентирование волокон кардочесальным оборудованием.
- **steps:** Подача волокон → чесание → получение ленты → контроль
- **checks:** Непсы, равномерность ленты, загрязнения
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"Fiber Preparation for Spinning","url":"https://cottonworks.com/learning-hub/yarn-manufacturing/fiber-preparation-for-spinning/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Кардочесание разделяет и ориентирует хлопковые волокна; формирует ленту.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Гребнечесание волокон
- **id:** combing-textile
- **name:** Гребнечесание волокон
- **category:** forming
- **industry:** textiles
- **parentId:** spinning
- **description:** Дополнительное выравнивание волокон и удаление коротких фракций.
- **steps:** Подготовка ленты → гребнечесание → контроль
- **checks:** Короткие волокна, равномерность, потери
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"Fiber Preparation for Spinning","url":"https://cottonworks.com/learning-hub/yarn-manufacturing/fiber-preparation-for-spinning/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Гребнечесание удаляет короткие волокна и дополнительно упорядочивает волокнистую массу.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Вытяжка текстильной ленты
- **id:** drawing-textile
- **name:** Вытяжка текстильной ленты
- **category:** forming
- **industry:** textiles
- **parentId:** spinning
- **description:** Утонение и выравнивание ленты вытяжными парами.
- **steps:** Подача → вытяжка → намотка → анализ
- **checks:** Линейная плотность, неровнота, обрывы
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"Fiber Preparation for Spinning","url":"https://cottonworks.com/learning-hub/yarn-manufacturing/fiber-preparation-for-spinning/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Вытяжные пары с различными скоростями утоняют и выравнивают объединённые волокнистые ленты.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Перемотка пряжи
- **id:** winding-yarn
- **name:** Перемотка пряжи
- **category:** forming
- **industry:** textiles
- **parentId:** spinning
- **description:** Формирование паковок пряжи для дальнейших операций.
- **steps:** Подача пряжи → очистка → намотка → контроль
- **checks:** Натяжение, дефекты нити, масса паковки
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Снование основы
- **id:** warping
- **name:** Снование основы
- **category:** forming
- **industry:** textiles
- **description:** Формирование системы параллельных основных нитей для ткачества.
- **steps:** Подготовка паковок → снование → контроль основы
- **checks:** Обрывность, равномерность натяжения, число нитей
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"CottonWorks — Weaving Basics","url":"https://cottonworks.com/learning-hub/weaving/weaving-basics/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Снование объединяет нити в параллельную систему основы.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Шлихтование основы
- **id:** warp-sizing
- **name:** Шлихтование основы
- **category:** treatment
- **industry:** textiles
- **description:** Нанесение шлихты на основные нити для изменения технологических свойств.
- **steps:** Подготовка основы → нанесение → сушка → контроль
- **checks:** Равномерность покрытия, влажность, обрывность
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"CottonWorks — Weaving Basics","url":"https://cottonworks.com/learning-hub/weaving/weaving-basics/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Шлихтование входит в подготовку основы к ткачеству.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Отбеливание текстиля
- **id:** textile-bleaching
- **name:** Отбеливание текстиля
- **category:** treatment
- **industry:** textiles
- **parentId:** textile-finishing
- **description:** Изменение окраски и удаление окрашенных примесей подходящей химической обработкой.
- **steps:** Подготовка ткани → отбеливание → промывка → контроль
- **checks:** Белизна, прочность, остаточные реагенты
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Печать по ткани
- **id:** textile-printing
- **name:** Печать по ткани
- **category:** treatment
- **industry:** textiles
- **parentId:** textile-finishing
- **description:** Нанесение цветного рисунка на текстильную поверхность.
- **steps:** Подготовка ткани → нанесение рисунка → фиксация → контроль
- **checks:** Совмещение цветов, стойкость, пропуски
- **materials:** ["cotton","cotton-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — классификация текстильных операций — обзор; не технологическая инструкция","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"Monitoring Information By Industry — Printing and Publishing","url":"https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Нанесение рисунка на текстиль возможно через сетчатый трафарет. Источник подтверждает этот вариант, а не все методы печати.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Строгание пиломатериалов
- **id:** wood-planing
- **name:** Строгание пиломатериалов
- **category:** forming
- **industry:** wood
- **description:** Обработка поверхности древесины резанием до требуемой геометрии.
- **steps:** Сортировка → базирование → строгание → контроль
- **checks:** Размер, волнистость, сколы
- **materials:** ["timber","birch-plywood"]
- **profession:** forest-engineer
- **sources:** [{"title":"US Forest Service — справочник о древесине как инженерном материале — обзор; не технологическая инструкция","url":"https://research.fs.usda.gov/treesearch/37419"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Лущение шпона
- **id:** veneer-peeling
- **name:** Лущение шпона
- **category:** forming
- **industry:** wood
- **description:** Получение тонкой ленты древесины при вращении чурака относительно ножа.
- **steps:** Подготовка сырья → лущение → резка → сортировка
- **checks:** Толщина шпона, трещины, влажность
- **materials:** ["timber","birch-plywood"]
- **profession:** forest-engineer
- **sources:** [{"title":"US Forest Service — справочник о древесине как инженерном материале — обзор; не технологическая инструкция","url":"https://research.fs.usda.gov/treesearch/37419"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Склеивание фанеры
- **id:** plywood-bonding
- **name:** Склеивание фанеры
- **category:** joining
- **industry:** wood
- **description:** Соединение листов шпона связующим в пакет с заданной ориентацией слоёв.
- **steps:** Подбор шпона → нанесение клея → сборка → прессование → контроль
- **checks:** Клеевой шов, расслоение, геометрия
- **materials:** ["timber","birch-plywood"]
- **profession:** forest-engineer
- **sources:** [{"title":"US Forest Service — справочник о древесине как инженерном материале — обзор; не технологическая инструкция","url":"https://research.fs.usda.gov/treesearch/37419"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Защитная пропитка древесины
- **id:** wood-preservation
- **name:** Защитная пропитка древесины
- **category:** treatment
- **industry:** wood
- **description:** Введение защитного состава в древесину по требованиям применения.
- **steps:** Подготовка древесины → пропитка → выдержка → контроль
- **checks:** Глубина пропитки, влажность и требования безопасности
- **materials:** ["timber","birch-plywood"]
- **profession:** forest-engineer
- **sources:** [{"title":"US Forest Service — справочник о древесине как инженерном материале — обзор; не технологическая инструкция","url":"https://research.fs.usda.gov/treesearch/37419"},{"title":"Wood Handbook 2021 — Chapter 15: Wood Preservatives","url":"https://research.fs.usda.gov/treesearch/download/62259.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Защитный состав вводят в древесину; эффективность зависит от его удержания, проникновения и породы. Универсальная глубина этим не установлена.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Прессование древесных плит
- **id:** fiberboard-pressing
- **name:** Прессование древесных плит
- **category:** forming
- **industry:** wood
- **description:** Уплотнение подготовленной древесной массы или стружки с образованием плиты.
- **steps:** Подготовка массы → формирование ковра → прессование → контроль
- **checks:** Плотность, толщина, расслоение
- **materials:** ["timber","birch-plywood"]
- **profession:** forest-engineer
- **sources:** [{"title":"US Forest Service — справочник о древесине как инженерном материале — обзор; не технологическая инструкция","url":"https://research.fs.usda.gov/treesearch/37419"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Промышленное выпаривание
- **id:** industrial-evaporation
- **name:** Промышленное выпаривание
- **category:** treatment
- **industry:** chemicals
- **description:** Концентрирование раствора испарением части растворителя.
- **steps:** Подготовка смеси → подвод тепла → испарение → контроль концентрации
- **checks:** Концентрация, отложения, качество продукта
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"},{"title":"GEA — Evaporation Technology","url":"https://www.gea.com/en/assets/170546/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Выпаривание удаляет часть воды или другого растворителя и повышает концентрацию продукта.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Кристаллизация растворов
- **id:** crystallization
- **name:** Кристаллизация растворов
- **category:** treatment
- **industry:** chemicals
- **description:** Выделение твёрдой фазы при изменении условий растворимости.
- **steps:** Подготовка раствора → зарождение и рост кристаллов → отделение
- **checks:** Чистота, размер кристаллов, остаточная влага
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"},{"title":"GEA — meVap Crystallization","url":"https://www.gea.com/en/products/evaporators-crystallizers/gea-mevap/gea-mevap-crystallization/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Пересыщение раствора вызывает образование и рост кристаллов; один из путей — испарение растворителя.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Абсорбция газовых компонентов
- **id:** gas-absorption
- **name:** Абсорбция газовых компонентов
- **category:** treatment
- **industry:** chemicals
- **description:** Перенос выбранных компонентов газовой смеси в жидкий поглотитель.
- **steps:** Контакт фаз → отвод обогащённого поглотителя → контроль
- **checks:** Степень извлечения, перепад давления, унос жидкости
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Стриппинг растворённых компонентов
- **id:** gas-stripping
- **name:** Стриппинг растворённых компонентов
- **category:** treatment
- **industry:** chemicals
- **description:** Удаление летучих компонентов из жидкости при контакте с газом или паром.
- **steps:** Подготовка жидкости → контакт фаз → отвод потоков → контроль
- **checks:** Остаточная концентрация, унос, баланс потоков
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Промышленное центрифугирование
- **id:** industrial-centrifugation
- **name:** Промышленное центрифугирование
- **category:** treatment
- **industry:** chemicals
- **description:** Разделение суспензии или эмульсии в поле центробежных сил.
- **steps:** Подача → центрифугирование → отвод фаз → контроль
- **checks:** Остаточная влажность, эффективность разделения, вибрация
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"},{"title":"Alfa Laval — How centrifugal separation works","url":"https://www.alfalaval.com/products/separation/centrifugal-separators/separators/innovations/separator-innovator/how-separation-works/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Центрифуги разделяют твёрдую и жидкие фазы центробежным воздействием при различии плотностей.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Мембранное разделение промышленных смесей
- **id:** chemical-membrane
- **name:** Мембранное разделение промышленных смесей
- **category:** treatment
- **industry:** chemicals
- **description:** Разделение компонентов смеси с использованием селективной мембраны.
- **steps:** Подготовка среды → поток через мембрану → анализ фракций
- **checks:** Проницаемость, селективность, загрязнение мембраны
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Каталитическая реакция в промышленном реакторе
- **id:** catalytic-reaction
- **name:** Каталитическая реакция в промышленном реакторе
- **category:** treatment
- **industry:** chemicals
- **description:** Химическое превращение с участием катализатора в реакционной системе.
- **steps:** Подготовка реагентов → реакция → разделение продуктов → контроль
- **checks:** Конверсия, селективность, дезактивация катализатора
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Экстракция растворителем
- **id:** solvent-extraction
- **name:** Экстракция растворителем
- **category:** treatment
- **industry:** chemicals
- **description:** Перераспределение компонентов между контактирующими фазами.
- **steps:** Подготовка фаз → контакт → разделение фаз → контроль состава
- **checks:** Извлечение, остаточный растворитель, эмульгирование
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"DOE — технологии промышленного нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Приготовление бетонной смеси
- **id:** concrete-mixing
- **name:** Приготовление бетонной смеси
- **category:** treatment
- **industry:** construction
- **description:** Смешение компонентов бетона до получения требуемых свойств свежей смеси.
- **steps:** Дозирование → перемешивание → доставка → контроль
- **checks:** Однородность, удобоукладываемость, отклонения состава
- **materials:** ["ready-mix-concrete"]
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Укладка бетонной смеси
- **id:** concrete-placing
- **name:** Укладка бетонной смеси
- **category:** forming
- **industry:** construction
- **description:** Заполнение конструктивного объёма свежей бетонной смесью.
- **steps:** Подготовка захватки → укладка → уплотнение → уход → контроль
- **checks:** Расслоение, пустоты, геометрия
- **materials:** ["ready-mix-concrete"]
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Виброуплотнение бетона
- **id:** concrete-vibration
- **name:** Виброуплотнение бетона
- **category:** forming
- **industry:** construction
- **description:** Уплотнение свежей бетонной смеси механическими колебаниями.
- **steps:** Подача смеси → виброуплотнение → осмотр поверхности
- **checks:** Пустоты, расслоение, качество уплотнения
- **materials:** ["ready-mix-concrete"]
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Уход за твердеющим бетоном
- **id:** concrete-curing
- **name:** Уход за твердеющим бетоном
- **category:** treatment
- **industry:** construction
- **description:** Контроль условий твердения бетона для формирования проектных свойств.
- **steps:** Завершение укладки → поддержание условий твердения → контроль
- **checks:** Температура, влажность, трещинообразование
- **materials:** ["ready-mix-concrete"]
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Монтаж опалубки
- **id:** formwork-erection
- **name:** Монтаж опалубки
- **category:** joining
- **industry:** construction
- **description:** Установка временной оснастки для задания формы монолитного бетона.
- **steps:** Проверка чертежей → монтаж → закрепление → приёмка
- **checks:** Устойчивость, геометрия, положение креплений
- **materials:** []
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Монтаж арматуры
- **id:** rebar-installation
- **name:** Монтаж арматуры
- **category:** joining
- **industry:** construction
- **description:** Размещение арматурных элементов по проекту до бетонирования.
- **steps:** Проверка арматуры → установка фиксаторов → вязка или крепление → контроль
- **checks:** Защитный слой, положение стержней, стыки
- **materials:** []
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Каменная кладка
- **id:** masonry-works
- **name:** Каменная кладка
- **category:** joining
- **industry:** construction
- **description:** Соединение штучных каменных элементов в конструкцию согласно проекту.
- **steps:** Подготовка основания → укладка элементов и раствора → контроль
- **checks:** Перевязка, ровность, заполнение швов
- **materials:** []
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Укладка асфальтобетона
- **id:** road-asphalt-placement
- **name:** Укладка асфальтобетона
- **category:** forming
- **industry:** construction
- **description:** Формирование слоя покрытия из горячей или холодной смеси с последующим уплотнением.
- **steps:** Подготовка основания → укладка → уплотнение → проверка
- **checks:** Плотность, ровность, толщина, температура
- **materials:** []
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Инъекционное закрепление грунта
- **id:** geotechnical-grouting
- **name:** Инъекционное закрепление грунта
- **category:** treatment
- **industry:** construction
- **description:** Введение закрепляющего состава в грунтовый массив по проекту.
- **steps:** Обследование → инъектирование по проекту → испытания
- **checks:** Распределение состава, проницаемость, смещения
- **materials:** []
- **profession:** civil-engineer
- **sources:** [{"title":"OSHA — нормы бетонных и каменных строительных работ — обзор; не технологическая инструкция","url":"https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.701"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Производство асфальтобетонной смеси
- **id:** asphalt-mix-production
- **name:** Производство асфальтобетонной смеси
- **category:** treatment
- **industry:** construction
- **description:** Приготовление смеси минеральных заполнителей и битумного вяжущего.
- **steps:** Подготовка компонентов → нагрев и смешение → выпуск → контроль
- **checks:** Температура, гранулометрия, доля вяжущего
- **materials:** []
- **profession:** road-engineer
- **sources:** [{"title":"EPA AP-42 — производство асфальтобетонных смесей — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Генерация технологического пара
- **id:** steam-generation
- **name:** Генерация технологического пара
- **category:** treatment
- **industry:** energy
- **description:** Производство пара в котельной или парогенераторной системе.
- **steps:** Подготовка питательной воды → подвод тепла → парообразование → контроль
- **checks:** Качество воды, давление, паропроизводительность
- **materials:** []
- **profession:** power-engineer
- **sources:** [{"title":"DOE — промышленные паровые системы — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/steam-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Возврат конденсата
- **id:** condensate-return
- **name:** Возврат конденсата
- **category:** treatment
- **industry:** energy
- **description:** Сбор и подача конденсата для повторного использования в паровой системе.
- **steps:** Сбор конденсата → проверка качества → возврат → контроль
- **checks:** Загрязнения, потери тепла, утечки
- **materials:** []
- **profession:** power-engineer
- **sources:** [{"title":"DOE — промышленные паровые системы — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/steam-systems"},{"title":"DOE — Return Condensate to the Boiler, Tip Sheet 8","url":"https://www.energy.gov/sites/prod/files/2014/05/f16/steam8_boiler.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Конденсат возвращают в котёл для повторного использования воды и теплоты.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Деаэрация котловой воды
- **id:** deaeration-water
- **name:** Деаэрация котловой воды
- **category:** treatment
- **industry:** energy
- **description:** Удаление растворённых газов из питательной воды паровой системы.
- **steps:** Подача воды → деаэрация → проверка остаточных газов
- **checks:** Остаточный кислород, температура, стабильность режима
- **materials:** []
- **profession:** power-engineer
- **sources:** [{"title":"DOE — промышленные паровые системы — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/steam-systems"},{"title":"DOE — Deaerators in Industrial Steam Systems, Tip Sheet 18","url":"https://www.energy.gov/sites/prod/files/2014/05/f16/steam18_steam_systems.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Деаэратор удаляет растворённые газы из питательной воды котла.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Теплоутилизация в экономайзере
- **id:** economizer-heat-recovery
- **name:** Теплоутилизация в экономайзере
- **category:** treatment
- **industry:** energy
- **description:** Передача теплоты дымовых газов потоку технологической воды.
- **steps:** Обход газов и воды → теплообмен → контроль параметров
- **checks:** Температура, загрязнение поверхности, перепад давления
- **materials:** []
- **profession:** power-engineer
- **sources:** [{"title":"DOE — промышленные паровые системы — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/steam-systems"},{"title":"DOE — Use Feedwater Economizers for Waste Heat Recovery, Tip Sheet 3","url":"https://www.energy.gov/sites/prod/files/2014/05/f16/steam3_recovery.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Экономайзер передаёт теплоту дымовых газов поступающей питательной воде.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Контроль конденсатоотводчиков
- **id:** steam-trap-monitoring
- **name:** Контроль конденсатоотводчиков
- **category:** inspection
- **industry:** energy
- **description:** Проверка работы устройств удаления конденсата из паровой сети.
- **steps:** Инвентаризация → обследование → анализ потерь → протокол
- **checks:** Пропуск пара, застой конденсата, исправность
- **materials:** []
- **profession:** power-engineer
- **sources:** [{"title":"DOE — промышленные паровые системы — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/steam-systems"},{"title":"DOE — Inspect and Repair Steam Traps, Tip Sheet 1","url":"https://www.energy.gov/sites/prod/files/2014/05/f16/steam1_traps.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Конденсатоотводчики проверяют на исправность и утечку рабочего пара.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Индукционный нагрев в производстве
- **id:** industrial-induction-heating
- **name:** Индукционный нагрев в производстве
- **category:** treatment
- **industry:** energy
- **description:** Нагрев проводящего материала под действием переменного электромагнитного поля.
- **steps:** Позиционирование → индуцирование нагрева → контроль температуры
- **checks:** Равномерность нагрева, перегрев, деформации
- **materials:** []
- **profession:** power-engineer
- **sources:** [{"title":"DOE — технологии промышленного теплового нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Промышленный теплообмен
- **id:** industrial-heat-exchange
- **name:** Промышленный теплообмен
- **category:** treatment
- **industry:** energy
- **description:** Передача тепловой энергии между средами через разделяющую поверхность.
- **steps:** Подача потоков → теплообмен → контроль выхода
- **checks:** Перепад температур, загрязнение, утечки
- **materials:** []
- **profession:** power-engineer
- **sources:** [{"title":"DOE — технологии промышленного теплового нагрева — обзор; не технологическая инструкция","url":"https://www.energy.gov/cmei/ito/what-are-different-kinds-process-heating-systems"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Коагуляция при водоподготовке
- **id:** coagulation-water
- **name:** Коагуляция при водоподготовке
- **category:** treatment
- **industry:** water
- **description:** Дестабилизация коллоидных частиц для последующего удаления из воды.
- **steps:** Дозирование реагента → смешение → контроль
- **checks:** Доза реагента, мутность, pH
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"},{"title":"Drinking Water Inspectorate — Physical removal of contaminants","url":"https://www.dwi.gov.uk/private-water-supplies/pws-installations/treatment-guide-2/physical-removal-of-contaminants/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Коагулянт помогает удалить мелкие взвешенные частицы; эффект зависит от химии воды, дозы и pH.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Флокуляция воды
- **id:** flocculation-water
- **name:** Флокуляция воды
- **category:** treatment
- **industry:** water
- **description:** Укрупнение взвешенных частиц в хлопья перед разделением.
- **steps:** Подготовка воды → мягкое перемешивание → контроль
- **checks:** Размер хлопьев, мутность и прочность агрегатов
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"},{"title":"CDC — How Water Treatment Works","url":"https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Мягкое перемешивание способствует образованию крупных хлопьев.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Отстаивание воды
- **id:** sedimentation-water
- **name:** Отстаивание воды
- **category:** treatment
- **industry:** water
- **description:** Гравитационное отделение оседающих взвесей из водного потока.
- **steps:** Входной поток → отстаивание → отвод осадка → контроль
- **checks:** Вынос взвесей, гидравлическая нагрузка
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"},{"title":"CDC — How Water Treatment Works","url":"https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Более тяжёлые хлопья оседают под действием тяжести.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Зернистая фильтрация воды
- **id:** granular-filtration
- **name:** Зернистая фильтрация воды
- **category:** treatment
- **industry:** water
- **parentId:** industrial-filtration
- **description:** Удаление взвесей прохождением воды через зернистый фильтрующий слой.
- **steps:** Подача воды → фильтрация → промывка фильтра → контроль
- **checks:** Мутность, перепад давления, загрязнение загрузки
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"},{"title":"CDC — How Water Treatment Works","url":"https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Воду пропускают через фильтры, в том числе песчаные и гравийные.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Адсорбция на активированном угле
- **id:** carbon-adsorption
- **name:** Адсорбция на активированном угле
- **category:** treatment
- **industry:** water
- **description:** Удаление части растворённых веществ при контакте с активированным углём.
- **steps:** Подготовка воды → контакт с сорбентом → контроль
- **checks:** Прорыв загрязнителей, ресурс сорбента
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Обратный осмос
- **id:** reverse-osmosis
- **name:** Обратный осмос
- **category:** treatment
- **industry:** water
- **parentId:** industrial-filtration
- **description:** Мембранное разделение воды и части растворённых компонентов при перепаде давления.
- **steps:** Предочистка → мембранный блок → контроль потоков
- **checks:** Качество пермеата, загрязнение мембраны, баланс
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Нанофильтрация воды
- **id:** nanofiltration-water
- **name:** Нанофильтрация воды
- **category:** treatment
- **industry:** water
- **parentId:** industrial-filtration
- **description:** Мембранное разделение по селективности к растворённым компонентам.
- **steps:** Предочистка → нанофильтрация → анализ пермеата
- **checks:** Селективность, мембранное загрязнение, расход
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Ультрафильтрация воды
- **id:** ultrafiltration-water
- **name:** Ультрафильтрация воды
- **category:** treatment
- **industry:** water
- **parentId:** industrial-filtration
- **description:** Удаление коллоидов и взвешенных веществ мембранными барьерами.
- **steps:** Подготовка → фильтрация → промывка → контроль
- **checks:** Турбидность, поток через мембрану, целостность
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"},{"title":"CDC — How Water Treatment Works","url":"https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Ультрафильтрация использует мелкопористый барьер, пропускающий воду и малые растворённые компоненты.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Озонирование воды
- **id:** ozonation-water
- **name:** Озонирование воды
- **category:** treatment
- **industry:** water
- **description:** Обработка воды озоном для окисления отдельных компонентов.
- **steps:** Генерация озона → контакт с водой → разрушение остаточного озона в отходящем газе → контроль
- **checks:** Остаточный озон, эффективность контакта и окисления
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"},{"title":"Wastewater Technology Fact Sheet: Ozone Disinfection EPA 832-F-99-063","url":"https://www.epa.gov/sites/default/files/2015-06/documents/ozon.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Озонирование использует окислительную способность озона в воде; остаточный озон в отходящем газе подлежит разрушению.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Обезвоживание осадка
- **id:** sludge-dewatering
- **name:** Обезвоживание осадка
- **category:** treatment
- **industry:** water
- **description:** Отделение части воды от осадка после очистных процессов.
- **steps:** Кондиционирование → механическое обезвоживание → контроль
- **checks:** Влажность кека, качество фильтрата, выход
- **materials:** []
- **profession:** water-engineer
- **sources:** [{"title":"EPA — обзор технологий очистки воды — обзор; не технологическая инструкция","url":"https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies"},{"title":"Fact Sheet: Centrifuge Thickening and Dewatering","url":"https://www.epa.gov/biosolids/fact-sheet-centrifuge-thickening-and-dewatering"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обезвоживание осадка отделяет жидкость от твёрдой фазы; центрифугирование является одним из способов получения кека.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Обжиг цементного клинкера
- **id:** cement-clinker-firing
- **name:** Обжиг цементного клинкера
- **category:** treatment
- **industry:** ceramics
- **description:** Тепловое преобразование минеральной сырьевой смеси при выпуске клинкера.
- **steps:** Подготовка шихты → обжиг → охлаждение → контроль
- **checks:** Минеральный состав, степень обжига, выбросы
- **materials:** ["cement-clinker"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.6 — Portland Cement Manufacturing","url":"https://www.epa.gov/system/files/documents/2025-02/c11s06_final_2-2025_0.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Подготовленная минеральная смесь преобразуется в клинкер при обжиге.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Кальцинация керамического сырья
- **id:** ceramic-calcination
- **name:** Кальцинация керамического сырья
- **category:** treatment
- **industry:** ceramics
- **description:** Термическая обработка минерального сырья с удалением летучих компонентов.
- **steps:** Подготовка сырья → нагрев → охлаждение → анализ
- **checks:** Потери при прокаливании, остаточные фазы
- **materials:** ["alumina"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.7 — Ceramic Products Manufacturing","url":"https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Кальцинация удаляет газообразные компоненты и изменяет состояние керамического сырья.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Спекание керамики
- **id:** ceramic-sintering
- **name:** Спекание керамики
- **category:** treatment
- **industry:** ceramics
- **description:** Уплотнение сформованной керамической заготовки при высокотемпературном цикле.
- **steps:** Формовка → спекание → охлаждение → испытания
- **checks:** Пористость, усадка, микротрещины
- **materials:** ["alumina"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.7 — Ceramic Products Manufacturing","url":"https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Спекание термически уплотняет керамическую заготовку.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Шликерное литьё керамики
- **id:** slip-casting-ceramics
- **name:** Шликерное литьё керамики
- **category:** forming
- **industry:** ceramics
- **description:** Формирование керамического изделия из суспензии в пористой форме.
- **steps:** Подготовка шликера → формование → извлечение → сушка
- **checks:** Равномерность стенок, трещины, поры
- **materials:** ["alumina"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.7 — Ceramic Products Manufacturing","url":"https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Шликерное литьё использует керамическую суспензию и пористую форму.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Сухое прессование керамики
- **id:** dry-pressing-ceramics
- **name:** Сухое прессование керамики
- **category:** forming
- **industry:** ceramics
- **description:** Формирование заготовки уплотнением сухого или полусухого порошка в пресс-форме.
- **steps:** Дозирование порошка → прессование → извлечение → контроль
- **checks:** Плотность, расслоение, размер
- **materials:** ["alumina"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.7 — Ceramic Products Manufacturing","url":"https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Сухое формование совмещает уплотнение и придание формы порошку.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Экструзия глиняных изделий
- **id:** brick-extrusion
- **name:** Экструзия глиняных изделий
- **category:** forming
- **industry:** ceramics
- **description:** Формование глиняной массы через фильеру с последующей резкой.
- **steps:** Подготовка массы → экструзия → резка → сушка
- **checks:** Геометрия, трещины, неоднородность
- **materials:** ["fireclay-raw"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.7 — Ceramic Products Manufacturing","url":"https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Экструзия применяется для конструкционных глиняных изделий.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Варка стекломассы
- **id:** glass-melting
- **name:** Варка стекломассы
- **category:** treatment
- **industry:** ceramics
- **description:** Получение расплава из подготовленной стекольной шихты.
- **steps:** Подготовка шихты → плавление → осветление → контроль
- **checks:** Пузырьки, включения, состав
- **materials:** ["glass-raw"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.15 — Glass Manufacturing","url":"https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Подготовленная стекольная шихта расплавляется в печи.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Отжиг стекла
- **id:** glass-annealing
- **name:** Отжиг стекла
- **category:** treatment
- **industry:** ceramics
- **description:** Управляемое охлаждение стекла для снижения остаточных напряжений.
- **steps:** Подача изделия → отжиг → охлаждение → контроль
- **checks:** Остаточные напряжения, коробление, трещины
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"EPA AP-42 — производство керамики, кирпича, цемента и стекла — обзор; не технологическая инструкция","url":"https://www.epa.gov/air-emissions-factors-and-quantification/ap-42-fifth-edition-volume-i-chapter-11-mineral-products-0"},{"title":"EPA AP-42 11.15 — Glass Manufacturing","url":"https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Отжиг применяется для снятия нежелательных напряжений в стекле.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Влажная грануляция фармацевтических порошков
- **id:** wet-granulation-pharma
- **name:** Влажная грануляция фармацевтических порошков
- **category:** treatment
- **industry:** pharma
- **description:** Образование гранул из порошковой смеси с введением жидкого связующего.
- **steps:** Дозирование → грануляция → сушка → анализ
- **checks:** Размер гранул, влажность, равномерность состава
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"},{"title":"GEA — Fluid Bed Processing of Pharmaceuticals","url":"https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Распыление жидкости в псевдоожиженный порошок формирует гранулы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Сухая грануляция фармацевтических порошков
- **id:** dry-granulation-pharma
- **name:** Сухая грануляция фармацевтических порошков
- **category:** forming
- **industry:** pharma
- **description:** Укрупнение частиц уплотнением без обязательного введения жидкости.
- **steps:** Смешение → уплотнение → дробление → просеивание
- **checks:** Распределение гранул, пыль, однородность
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Таблетирование
- **id:** tablet-compression
- **name:** Таблетирование
- **category:** forming
- **industry:** pharma
- **description:** Формирование дозированных таблеток из порошка или гранулята прессованием.
- **steps:** Дозирование → прессование → отбраковка → контроль
- **checks:** Масса, твёрдость, распадаемость, вариабельность
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Покрытие фармацевтических таблеток
- **id:** tablet-coating
- **name:** Покрытие фармацевтических таблеток
- **category:** treatment
- **industry:** pharma
- **description:** Нанесение покрывающего слоя на таблеточные ядра.
- **steps:** Подготовка ядер → напыление покрытия → сушка → проверка
- **checks:** Равномерность покрытия, дефекты поверхности
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"},{"title":"GEA — Fluid Bed Processing of Pharmaceuticals","url":"https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Псевдоожиженный слой применяется, в частности, для покрытия таблеток.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Наполнение капсул
- **id:** capsule-filling
- **name:** Наполнение капсул
- **category:** joining
- **industry:** pharma
- **description:** Дозирование подготовленного материала в капсульную оболочку.
- **steps:** Подача капсул → дозирование → закрытие → контроль
- **checks:** Масса наполнения, целостность оболочки
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Асептическое наполнение стерильных форм
- **id:** aseptic-filling
- **name:** Асептическое наполнение стерильных форм
- **category:** joining
- **industry:** pharma
- **description:** Наполнение стерилизованной тары стерильным продуктом с последующей укупоркой в контролируемой асептической среде; подготовка и контроль компонентов зависят от процесса.
- **steps:** Подготовка компонентов → асептическое наполнение → укупорка → контроль
- **checks:** Контроль загрязнения, целостность закрытия
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"Sterile Drug Products Produced by Aseptic Processing — CGMP","url":"https://www.fda.gov/media/71026/download"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Продукт, тара и укупорка стерилизуются раздельно и объединяются асептически в контролируемой среде. Это не терминальная стерилизация.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Распылительная сушка фармацевтических растворов
- **id:** pharma-spray-drying
- **name:** Распылительная сушка фармацевтических растворов
- **category:** treatment
- **industry:** pharma
- **description:** Получение сухого порошка из жидкости распылением с удалением растворителя.
- **steps:** Подготовка раствора → распыление → сепарация → контроль
- **checks:** Размер частиц, влажность, остаточный растворитель
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"},{"title":"GEA — Fluid Bed Processing of Pharmaceuticals","url":"https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Распыление раствора или суспензии в тёплый воздух сопровождается сушкой продукта.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Фармацевтическое просеивание
- **id:** pharma-sieving
- **name:** Фармацевтическое просеивание
- **category:** forming
- **industry:** pharma
- **description:** Разделение частиц порошка по размерным фракциям.
- **steps:** Подача порошка → просеивание → отбор фракций → контроль
- **checks:** Гранулометрия, загрязнения, выход
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Офсетная печать
- **id:** offset-lithography
- **name:** Офсетная печать
- **category:** forming
- **industry:** printing
- **description:** Перенос печатного изображения через промежуточное полотно с печатной формы на материал.
- **steps:** Подготовка формы → настройка подачи → печать → контроль оттиска
- **checks:** Приводка, равномерность красочного слоя
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — отрасли полиграфии, офсет, флексо и трафарет — обзор; не технологическая инструкция","url":"https://www.osha.gov/printing-industry/industry-segments"},{"title":"Monitoring Information By Industry — Printing and Publishing","url":"https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Офсет переносит изображение с формы через промежуточное резиновое полотно на подложку.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Флексографская печать
- **id:** flexography
- **name:** Флексографская печать
- **category:** forming
- **industry:** printing
- **description:** Ротационная печать с эластичной рельефной формой на различных подложках.
- **steps:** Подготовка формы и красок → подача материала → печать → осмотр
- **checks:** Приводка, растискивание, дефекты покрытия
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — отрасли полиграфии, офсет, флексо и трафарет — обзор; не технологическая инструкция","url":"https://www.osha.gov/printing-industry/industry-segments"},{"title":"Monitoring Information By Industry — Printing and Publishing","url":"https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Флексография переносит краску выступающими участками эластичной пластиковой или резиновой формы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Трафаретная печать
- **id:** screen-printing
- **name:** Трафаретная печать
- **category:** forming
- **industry:** printing
- **description:** Нанесение краски через открытые участки сетчатого трафарета.
- **steps:** Подготовка трафарета → печать → сушка → контроль
- **checks:** Толщина слоя, пропуски, контур
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — отрасли полиграфии, офсет, флексо и трафарет — обзор; не технологическая инструкция","url":"https://www.osha.gov/printing-industry/industry-segments"},{"title":"Monitoring Information By Industry — Printing and Publishing","url":"https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Трафаретная печать переносит краску через открытые участки сетки; закрытые участки блокирует трафарет.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Глубокая печать
- **id:** gravure-printing
- **name:** Глубокая печать
- **category:** forming
- **industry:** printing
- **description:** Перенос краски из углублений печатной формы на подложку.
- **steps:** Подготовка вала → подача краски → печать → контроль
- **checks:** Перенос краски, полосы, приводка
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — отрасли полиграфии, офсет, флексо и трафарет — обзор; не технологическая инструкция","url":"https://www.osha.gov/printing-industry/industry-segments"},{"title":"Monitoring Information By Industry — Printing and Publishing","url":"https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Глубокая печать переносит краску из углублённых ячеек цилиндра.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Послепечатная фальцовка и переплёт
- **id:** print-binding
- **name:** Послепечатная фальцовка и переплёт
- **category:** joining
- **industry:** printing
- **description:** Формирование и скрепление отпечатанных листов в изделие.
- **steps:** Фальцовка → подборка → скрепление → обрезка → контроль
- **checks:** Комплектность, совмещение листов, прочность
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — отрасли полиграфии, офсет, флексо и трафарет — обзор; не технологическая инструкция","url":"https://www.osha.gov/printing-industry/industry-segments"},{"title":"Monitoring Information By Industry — Printing and Publishing","url":"https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Послепечатная обработка включает скрепление листов, в том числе шитьё и клеевое скрепление.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Дробление руды
- **id:** ore-crushing
- **name:** Дробление руды
- **category:** forming
- **industry:** mining
- **description:** Снижение крупности добытого материала в дробильном оборудовании.
- **steps:** Подача руды → дробление → сортировка → контроль
- **checks:** Размер куска, пыление, загрязнение
- **materials:** []
- **profession:** mining-engineer
- **sources:** [{"title":"EPA — руда и обогащение: водоотведение, дробление и сортировка — обзор; не технологическая инструкция","url":"https://www.epa.gov/eg/ore-mining-and-dressing-effluent-guidelines"},{"title":"EPA AP-42 11.24 — Metallic Minerals Processing","url":"https://www.epa.gov/sites/default/files/2020-10/documents/c11s24.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Дробление уменьшает крупность руды.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Измельчение руды
- **id:** ore-grinding
- **name:** Измельчение руды
- **category:** forming
- **industry:** mining
- **description:** Дальнейшее снижение крупности материала в измельчающем оборудовании.
- **steps:** Подготовка → измельчение → классификация → контроль
- **checks:** Гранулометрия, переизмельчение, расход энергии
- **materials:** []
- **profession:** mining-engineer
- **sources:** [{"title":"EPA — руда и обогащение: водоотведение, дробление и сортировка — обзор; не технологическая инструкция","url":"https://www.epa.gov/eg/ore-mining-and-dressing-effluent-guidelines"},{"title":"EPA AP-42 11.24 — Metallic Minerals Processing","url":"https://www.epa.gov/sites/default/files/2020-10/documents/c11s24.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Измельчение уменьшает крупность руды, в том числе в шаровых и стержневых мельницах.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Грохочение руды
- **id:** ore-screening
- **name:** Грохочение руды
- **category:** inspection
- **industry:** mining
- **description:** Разделение сыпучей массы на размерные классы через ситовые поверхности.
- **steps:** Подача → грохочение → отвод фракций → проверка
- **checks:** Разделение по крупности, забивание сит
- **materials:** []
- **profession:** mining-engineer
- **sources:** [{"title":"EPA — руда и обогащение: водоотведение, дробление и сортировка — обзор; не технологическая инструкция","url":"https://www.epa.gov/eg/ore-mining-and-dressing-effluent-guidelines"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Флотационное обогащение
- **id:** ore-flotation
- **name:** Флотационное обогащение
- **category:** treatment
- **industry:** mining
- **description:** Разделение минеральных частиц по различиям их поверхностных свойств.
- **steps:** Подготовка пульпы → флотация → разделение потоков → анализ
- **checks:** Извлечение, качество концентрата, реагентный баланс
- **materials:** []
- **profession:** mining-engineer
- **sources:** [{"title":"EPA — руда и обогащение: водоотведение, дробление и сортировка — обзор; не технологическая инструкция","url":"https://www.epa.gov/eg/ore-mining-and-dressing-effluent-guidelines"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Магнитная сепарация руды
- **id:** magnetic-separation-ore
- **name:** Магнитная сепарация руды
- **category:** treatment
- **industry:** mining
- **description:** Разделение фракций минералов в магнитном поле.
- **steps:** Подача измельчённой руды → сепарация → контроль фракций
- **checks:** Извлечение магнитной фазы, примеси
- **materials:** []
- **profession:** mining-engineer
- **sources:** [{"title":"EPA — руда и обогащение: водоотведение, дробление и сортировка — обзор; не технологическая инструкция","url":"https://www.epa.gov/eg/ore-mining-and-dressing-effluent-guidelines"},{"title":"EPA AP-42 11.24 — Metallic Minerals Processing","url":"https://www.epa.gov/sites/default/files/2020-10/documents/c11s24.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Магнитные методы применяются при обогащении части железистых и титансодержащих минералов.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Гравитационное обогащение
- **id:** gravity-concentration
- **name:** Гравитационное обогащение
- **category:** treatment
- **industry:** mining
- **description:** Концентрирование минералов по различиям их плотности и динамики движения.
- **steps:** Подготовка питания → гравитационное разделение → анализ
- **checks:** Содержание полезного компонента, потери
- **materials:** []
- **profession:** mining-engineer
- **sources:** [{"title":"EPA — руда и обогащение: водоотведение, дробление и сортировка — обзор; не технологическая инструкция","url":"https://www.epa.gov/eg/ore-mining-and-dressing-effluent-guidelines"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Выщелачивание руды
- **id:** ore-leaching
- **name:** Выщелачивание руды
- **category:** treatment
- **industry:** mining
- **description:** Перевод выбранных компонентов твёрдой руды в раствор при химическом воздействии.
- **steps:** Подготовка руды → контакт с раствором → отделение → контроль
- **checks:** Извлечение, примеси, обращение с растворами
- **materials:** []
- **profession:** mining-engineer
- **sources:** [{"title":"EPA — руда и обогащение: водоотведение, дробление и сортировка — обзор; не технологическая инструкция","url":"https://www.epa.gov/eg/ore-mining-and-dressing-effluent-guidelines"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Технологическая схема является обзорной редакционной моделью, не нормативно проверенной процедурой.","reviewScope":"Открыт официальный источник, подтверждающий отраслевую группу или существование операции; отдельные этапы, дефекты и применимость требуют независимого предметного аудита.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Магнитопорошковый контроль
- **id:** magnetic-particle-ndt
- **name:** Магнитопорошковый контроль
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Выявление поверхностных и подповерхностных нарушений в ферромагнитных материалах.
- **steps:** Подготовка → намагничивание → нанесение частиц → оценка
- **checks:** Направление поля, чистота поверхности, индикации
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Магнитопорошковый контроль выявляет поверхностные и близкие к поверхности несплошности ферромагнетиков.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Вихретоковый контроль
- **id:** eddy-current-ndt
- **name:** Вихретоковый контроль
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Контроль проводящих изделий по изменению наведённых вихревых токов.
- **steps:** Выбор датчика → калибровка → сканирование → протокол
- **checks:** Проводимость, зазор, чувствительность, глубина
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Вихретоковый контроль использует электромагнитную индукцию в проводящих материалах.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Визуальный и измерительный контроль
- **id:** visual-ndt
- **name:** Визуальный и измерительный контроль
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Осмотр доступных поверхностей с визуальными и измерительными средствами.
- **steps:** Подготовка поверхности → осмотр → измерение → протокол
- **checks:** Освещённость, доступность, допуски, критерии
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Визуальный контроль выполняется непосредственно или с оптическими средствами.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Испытание на герметичность
- **id:** leak-testing
- **name:** Испытание на герметичность
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Поиск утечек в системах с помощью перепада давления или индикаторной среды.
- **steps:** Подготовка → испытание → оценка потерь → запись
- **checks:** Чувствительность, утечки, перепад давления
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Контроль герметичности включает методы перепада давления и индикаторного газа.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Акустико-эмиссионный контроль
- **id:** acoustic-emission-ndt
- **name:** Акустико-эмиссионный контроль
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Регистрация акустических сигналов, связанных с активными изменениями материала.
- **steps:** Установка датчиков → нагружение по методике → анализ сигналов
- **checks:** Помехи, локализация, активность источников
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Акустическая эмиссия регистрирует высвобождение энергии при изменениях нагруженного материала.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Инфракрасная термография
- **id:** infrared-thermography
- **name:** Инфракрасная термография
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Выявление температурных неоднородностей по тепловому излучению поверхности.
- **steps:** Подготовка → тепловизионная съёмка → интерпретация
- **checks:** Коэффициент излучения, отражения, условия съёмки
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Инфракрасный контроль выявляет температурные неоднородности.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Георадарное обследование
- **id:** ground-penetrating-radar
- **name:** Георадарное обследование
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Зондирование подповерхностных объектов электромагнитными импульсами.
- **steps:** Выбор трассы → зондирование → интерпретация профиля
- **checks:** Влажность, глубина, разрешение, помехи
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Георадар использует радиолокационные импульсы для обследования подповерхностных объектов.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Контроль направленными ультразвуковыми волнами
- **id:** guided-wave-ndt
- **name:** Контроль направленными ультразвуковыми волнами
- **category:** inspection
- **industry:** general
- **parentId:** ultrasonic
- **description:** Обследование протяжённого объекта направленными волнами.
- **steps:** Установка преобразователей → возбуждение → анализ отражений
- **checks:** Мёртвые зоны, затухание, локализация
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Направленные ультразвуковые волны распространяются вдоль протяжённой конструкции.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Контроль утечкой магнитного потока
- **id:** magnetic-flux-leakage
- **name:** Контроль утечкой магнитного потока
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Обнаружение неоднородностей ферромагнитной стенки по полю рассеяния.
- **steps:** Намагничивание → сканирование → оценка изменений
- **checks:** Геометрия, насыщение, глубина дефектов
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Метод регистрирует поле рассеяния около несплошностей намагниченной стали.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Нейтронная радиография
- **id:** neutron-radiography
- **name:** Нейтронная радиография
- **category:** inspection
- **industry:** general
- **parentId:** radiographic
- **description:** Получение изображения по ослаблению нейтронного потока объектом.
- **steps:** Подготовка образца → экспонирование по методике → анализ
- **checks:** Контраст материалов, радиационная безопасность
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Нейтронная радиография использует нейтроны для получения изображения объекта.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Лазерная шерография
- **id:** laser-shearography
- **name:** Лазерная шерография
- **category:** inspection
- **industry:** general
- **parentId:** inspection
- **description:** Оптическая регистрация деформационных полей при заданной нагрузке.
- **steps:** Подготовка поверхности → воздействие → сравнение изображений
- **checks:** Вибрации, чувствительность, интерпретация
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"},{"title":"ASNT — Laser Testing Methods","url":"https://www.asnt.org/what-is-nondestructive-testing/methods/laser-methods"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Шерография выявляет изменения поверхности при приложенной нагрузке, в том числе у композитов и клеевых соединений.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Ультразвуковой контроль фазированной решёткой
- **id:** phased-array-ut
- **name:** Ультразвуковой контроль фазированной решёткой
- **category:** inspection
- **industry:** general
- **parentId:** ultrasonic
- **description:** Электронное управление направлением ультразвукового пучка массивом элементов.
- **steps:** Выбор закона фокусировки → сканирование → протокол
- **checks:** Калибровка, покрытие зоны, ложные показания
- **materials:** ["09g2s","steel-45"]
- **profession:** materials-engineer
- **sources:** [{"title":"ASNT — каталог методов неразрушающего контроля — обзор без технологических режимов","url":"https://www.asnt.org/what-is-nondestructive-testing/methods"},{"title":"ASNT — Ultrasonic Testing","url":"https://www.asnt.org/what-is-nondestructive-testing/methods/ultrasonic-testing"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Фазированная решётка использует несколько элементов для формирования и фокусировки ультразвукового пучка.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Контактная шовная сварка
- **id:** resistance-seam
- **name:** Контактная шовная сварка
- **category:** joining
- **industry:** metals
- **description:** Формирование соединения последовательными контактными точками при движении роликов.
- **steps:** Подготовка листов → проход роликов → испытание
- **checks:** Герметичность, перекрытие точек, деформации
- **materials:** ["steel-20","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация процессов сварки и соединения — обзор без технологических режимов","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"What is resistance seam welding?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-resistance-seam-welding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Шовная контактная сварка формирует последовательность перекрывающихся ядер с помощью вращающихся роликовых электродов.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Стыковая сварка оплавлением
- **id:** flash-butt-welding
- **name:** Стыковая сварка оплавлением
- **category:** joining
- **industry:** metals
- **description:** Соединение торцов с нагревом при оплавлении и последующей осадке.
- **steps:** Совмещение → оплавление → осадка → контроль
- **checks:** Соосность, дефекты стыка, облой
- **materials:** ["steel-20","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация процессов сварки и соединения — обзор без технологических режимов","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"What is Flash (Butt) Welding?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-flash-butt-welding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При стыковой сварке оплавлением торцы нагреваются током с оплавлением контактов; затем усилием осадки формируют соединение.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Электронно-лучевая сварка
- **id:** electron-beam-welding
- **name:** Электронно-лучевая сварка
- **category:** joining
- **industry:** metals
- **description:** Получение шва сфокусированным пучком электронов.
- **steps:** Подготовка → вакуумная операция → сварка → контроль
- **checks:** Проплавление, поры, геометрия
- **materials:** ["steel-20","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация процессов сварки и соединения — обзор без технологических режимов","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"TWI — In-Chamber Electron Beam Welding","url":"https://www.twi-global.com/what-we-do/research-and-technology/technologies/welding-joining-and-cutting/electron-beam-technology/in-chamber-electron-beam-welding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Электронно-лучевая сварка плавит материал сфокусированным потоком ускоренных электронов.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Плазменная дуговая сварка
- **id:** plasma-arc-welding
- **name:** Плазменная дуговая сварка
- **category:** joining
- **industry:** metals
- **parentId:** welding
- **description:** Дуговая сварка с плазмообразующим газом и сжатой дугой.
- **steps:** Подготовка → настройка оснастки → сварка → контроль
- **checks:** Геометрия, поры, несплавление
- **materials:** ["steel-20","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация процессов сварки и соединения — обзор без технологических режимов","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"What is Plasma Welding?","url":"https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-plasma-welding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Плазменная сварка использует дугу, сжатую узким медным соплом, и плазмообразующий газ.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Приварка шпилек
- **id:** stud-welding
- **name:** Приварка шпилек
- **category:** joining
- **industry:** metals
- **parentId:** welding
- **description:** Дуговое или контактное присоединение крепёжного элемента к поверхности.
- **steps:** Подготовка зоны → позиционирование шпильки → соединение → проверка
- **checks:** Соосность, прочность, подрезы
- **materials:** ["steel-20","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация процессов сварки и соединения — обзор без технологических режимов","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Диффузионная сварка
- **id:** diffusion-bonding
- **name:** Диффузионная сварка
- **category:** joining
- **industry:** metals
- **description:** Твердофазное соединение контактирующих поверхностей под действием температуры и давления.
- **steps:** Подготовка поверхностей → сближение → цикл → испытания
- **checks:** Несплошности, качество контакта, изменения структуры
- **materials:** ["steel-20","09g2s"]
- **profession:** mechanical-engineer
- **sources:** [{"title":"TWI — классификация процессов сварки и соединения — обзор без технологических режимов","url":"https://www.twi-global.com/technical-knowledge/job-knowledge/welding-and-joining-process-classification-001?vAction=swpTextOnly"},{"title":"Diffusion Bonding","url":"https://www.twi-global.com/what-we-do/services-and-support/diffusion-bonding"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Диффузионное соединение обеспечивается контактом поверхностей, повышенной температурой и давлением без плавления основного материала.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Компрессионное формование пластмасс
- **id:** compression-molding-plastics
- **name:** Компрессионное формование пластмасс
- **category:** forming
- **industry:** polymers
- **description:** Формование материала сдавливанием в нагретой пресс-форме.
- **steps:** Подготовка навески → прессование → охлаждение → контроль
- **checks:** Пустоты, облой, размеры; для реактопластов — степень отверждения, для термопластов — условия охлаждения.
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Материал формуется нагревом и сдавливанием в полости формы.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Инжекционно-выдувное формование с вытяжкой
- **id:** stretch-blow-molding
- **name:** Инжекционно-выдувное формование с вытяжкой
- **category:** forming
- **industry:** polymers
- **description:** Формование полой тары из предварительно полученной заготовки с вытяжкой.
- **steps:** Изготовление преформы → разогрев → вытяжка и раздув → контроль
- **checks:** Толщина, прозрачность, геометрия
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Экструзия рукавной плёнки
- **id:** blown-film-extrusion
- **name:** Экструзия рукавной плёнки
- **category:** forming
- **industry:** polymers
- **parentId:** extrusion
- **description:** Получение плёнки из полимерного рукава при экструзии и раздуве.
- **steps:** Пластикация → кольцевая фильера → раздув → намотка
- **checks:** Толщина, складки, пузырь, стабильность рукава
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Трансферное формование реактопластов
- **id:** polymer-transfer-molding
- **name:** Трансферное формование реактопластов
- **category:** forming
- **industry:** polymers
- **description:** Заполнение формы подготовленным реактопластом из передаточной камеры.
- **steps:** Подготовка сырья → передача в форму → отверждение → контроль
- **checks:** Недолив, облой, время отверждения
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Материал перемещается из отдельной камеры в закрытую форму.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Вулканизация эластомеров
- **id:** rubber-vulcanization
- **name:** Вулканизация эластомеров
- **category:** treatment
- **industry:** polymers
- **description:** Формирование связанной структуры эластомера в предусмотренном цикле.
- **steps:** Подготовка смеси → вулканизация → охлаждение → испытания
- **checks:** Степень вулканизации, твёрдость, трещины
- **materials:** []
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"При вулканизации формируются поперечные связи полимерных цепей.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Экструзионное покрытие полимером
- **id:** extrusion-coating
- **name:** Экструзионное покрытие полимером
- **category:** treatment
- **industry:** polymers
- **description:** Нанесение расплава полимера на подложку в процессе экструзии.
- **steps:** Подача подложки → нанесение расплава → охлаждение
- **checks:** Толщина, адгезия, сплошность
- **materials:** ["pe-hd","pa6"]
- **profession:** materials-engineer
- **sources:** [{"title":"EPA (2005) — отраслевой обзор производства изделий из резины и пластмасс","url":"https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Иглопробивное производство нетканых материалов
- **id:** needle-punching-nonwovens
- **name:** Иглопробивное производство нетканых материалов
- **category:** forming
- **industry:** textiles
- **description:** Связывание волокнистого холста множественными проходами игл.
- **steps:** Подготовка холста → иглопробивание → контроль
- **checks:** Поверхностная плотность, разрывы, равномерность
- **materials:** ["cotton","woven-fabric"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — отраслевой каталог текстильных процессов — обзор без технологических режимов","url":"https://www.osha.gov/data/sic-manual/major-group-22"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Мерсеризация хлопка
- **id:** mercerization
- **name:** Мерсеризация хлопка
- **category:** treatment
- **industry:** textiles
- **parentId:** textile-finishing
- **description:** Химическая обработка хлопкового материала с изменением структуры волокон.
- **steps:** Подготовка ткани → обработка → промывка → контроль
- **checks:** Равномерность, усадка, остаточные реагенты
- **materials:** ["cotton","woven-fabric"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — отраслевой каталог текстильных процессов — обзор без технологических режимов","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"Cotton Incorporated — Textile Dyeing","url":"https://cottonworks.com/wp-content/uploads/2018/01/Dyeing_Booklet.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Мерсеризация обрабатывает хлопок щёлочью под натяжением и изменяет структуру волокон.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Термофиксация текстиля
- **id:** heat-setting-textiles
- **name:** Термофиксация текстиля
- **category:** treatment
- **industry:** textiles
- **parentId:** textile-finishing
- **description:** Тепловая стабилизация текстиля с термопластичными волокнами, например полиэфирными или полиамидными. Чистый хлопок не термофиксируется этим механизмом.
- **steps:** Подготовка → термообработка → охлаждение → испытания
- **checks:** Усадка, деформации, цвет
- **materials:** ["polyester-fiber","polyamide-textile-yarn"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — отраслевой каталог текстильных процессов — обзор без технологических режимов","url":"https://www.osha.gov/data/sic-manual/major-group-22"},{"title":"Cotton Incorporated — Textile Dyeing","url":"https://cottonworks.com/wp-content/uploads/2018/01/Dyeing_Booklet.pdf"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Термофиксация относится к термопластичным волокнам; чистый хлопок не термопластичен.","reviewScope":"Подтверждён только указанный тезис. Остальные поля, технологическая применимость к маркам и критерии приёмки остаются непроверенными.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Каландрование тканей
- **id:** textile-calendering
- **name:** Каландрование тканей
- **category:** treatment
- **industry:** textiles
- **parentId:** textile-finishing
- **description:** Механическая финишная обработка ткани между валками.
- **steps:** Подача полотна → валки → контроль поверхности
- **checks:** Складки, равномерность отделки, блеск
- **materials:** ["cotton","woven-fabric"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — отраслевой каталог текстильных процессов — обзор без технологических режимов","url":"https://www.osha.gov/data/sic-manual/major-group-22"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Машинная вышивка
- **id:** industrial-embroidery
- **name:** Машинная вышивка
- **category:** joining
- **industry:** textiles
- **parentId:** sewing
- **description:** Формирование шовного рисунка нитями на текстильной основе.
- **steps:** Подготовка рисунка → закрепление ткани → вышивка → осмотр
- **checks:** Натяжение нитей, смещение, плотность стежков
- **materials:** ["cotton","woven-fabric"]
- **profession:** textile-engineer
- **sources:** [{"title":"OSHA — отраслевой каталог текстильных процессов — обзор без технологических режимов","url":"https://www.osha.gov/data/sic-manual/major-group-22"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Сверление отверстий печатных плат
- **id:** pcb-drilling
- **name:** Сверление отверстий печатных плат
- **category:** forming
- **industry:** electronics
- **description:** Формирование сквозных или технологических отверстий в заготовке платы.
- **steps:** Позиционирование → сверление → очистка → проверка
- **checks:** Размеры, смещение, заусенцы, повреждение основы
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — сборка плат и границы стандартов — обзор без технологических режимов","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Травление печатных проводников
- **id:** pcb-etching
- **name:** Травление печатных проводников
- **category:** treatment
- **industry:** electronics
- **description:** Удаление незащищённых участков металлического слоя по рисунку.
- **steps:** Нанесение защитного рисунка → травление → промывка
- **checks:** Подтравливание, ширина дорожек, остатки
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — сборка плат и границы стандартов — обзор без технологических режимов","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Металлизация отверстий печатных плат
- **id:** pcb-plating
- **name:** Металлизация отверстий печатных плат
- **category:** treatment
- **industry:** electronics
- **description:** Формирование проводящего слоя на стенках отверстий платы.
- **steps:** Подготовка поверхности → осаждение слоя → контроль
- **checks:** Сплошность, толщина, пустоты
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — сборка плат и границы стандартов — обзор без технологических режимов","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Селективная пайка узлов плат
- **id:** selective-soldering
- **name:** Селективная пайка узлов плат
- **category:** joining
- **industry:** electronics
- **parentId:** pcb-assembly
- **description:** Локальное формирование паяных соединений на отдельных участках платы.
- **steps:** Подготовка → локальная пайка → инспекция
- **checks:** Смачиваемость, перемычки, термовлияние
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — сборка плат и границы стандартов — обзор без технологических режимов","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Рентгеновский контроль электронных сборок
- **id:** pcb-xray-inspection
- **name:** Рентгеновский контроль электронных сборок
- **category:** inspection
- **industry:** electronics
- **parentId:** electronic-inspection
- **description:** Получение рентгеновского изображения скрытых паяных соединений.
- **steps:** Подготовка платы → съёмка → интерпретация → протокол
- **checks:** Пустоты, перемычки, предел разрешения
- **materials:** ["pcb","solder"]
- **profession:** electrical-engineer
- **sources:** [{"title":"IPC — сборка плат и границы стандартов — обзор без технологических режимов","url":"https://www.ipc.org/news-release/ipc-releases-j-revisions-two-leading-standards-electronics-assembly"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Смешение фармацевтических порошков
- **id:** pharma-powder-blending
- **name:** Смешение фармацевтических порошков
- **category:** treatment
- **industry:** pharma
- **description:** Обеспечение однородности состава подготовленных порошковых компонентов.
- **steps:** Дозирование → смешение → контроль смеси
- **checks:** Однородность, сегрегация, загрязнение
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — инспекционное руководство по производству твёрдых лекарственных форм — обзор без технологических режимов","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Микронизация фармацевтических веществ
- **id:** pharma-micronization
- **name:** Микронизация фармацевтических веществ
- **category:** forming
- **industry:** pharma
- **description:** Снижение размера частиц активного вещества механическим способом.
- **steps:** Подготовка → измельчение → классификация → испытания
- **checks:** Размер частиц, нагрев, загрязнение
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — инспекционное руководство по производству твёрдых лекарственных форм — обзор без технологических режимов","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Сушка в псевдоожиженном слое
- **id:** fluid-bed-pharma-drying
- **name:** Сушка в псевдоожиженном слое
- **category:** treatment
- **industry:** pharma
- **description:** Удаление влаги из гранулята в потоке газа, поддерживающего псевдоожижение.
- **steps:** Подготовка гранулята → сушка → отделение → измерение
- **checks:** Влажность, потери мелких фракций, однородность
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — инспекционное руководство по производству твёрдых лекарственных форм — обзор без технологических режимов","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"},{"title":"GEA — Fluid Bed Processing of Pharmaceuticals","url":"https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Воздух проходит через распределитель и высушивает материал до заданной остаточной влажности.","reviewScope":"Проверен только сформулированный тезис. Остальные поля, режимы, марки и критерии приёмки не подтверждены.","checkedAt":"2026-10-25"}
- **reviewStatus:** source_located

### Внутрипроизводственный контроль таблеток
- **id:** pharma-inprocess-control
- **name:** Внутрипроизводственный контроль таблеток
- **category:** inspection
- **industry:** pharma
- **description:** Измерение свойств таблеток на промежуточных этапах выпуска.
- **steps:** Отбор → измерение массы и твёрдости → запись
- **checks:** Вариация массы, распадаемость и прочность
- **materials:** []
- **profession:** chemical-engineer
- **sources:** [{"title":"FDA — инспекционное руководство по производству твёрдых лекарственных форм — обзор без технологических режимов","url":"https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Изготовление печатных форм
- **id:** printing-plate-making
- **name:** Изготовление печатных форм
- **category:** forming
- **industry:** printing
- **description:** Получение носителя печатного изображения из подготовленных цифровых данных.
- **steps:** Подготовка макета → изготовление формы → проверка
- **checks:** Растровое изображение, приводка, дефекты формы
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — терминология печати и послепечатных операций — обзор без технологических режимов","url":"https://www.osha.gov/etools/printing-industry/glossary"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### Высечка печатной продукции
- **id:** print-die-cutting
- **name:** Высечка печатной продукции
- **category:** forming
- **industry:** printing
- **description:** Формирование контура изделия резанием высекальным штампом.
- **steps:** Совмещение заготовки → высечка → удаление отходов
- **checks:** Размер, заусенцы, совмещение
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — терминология печати и послепечатных операций — обзор без технологических режимов","url":"https://www.osha.gov/etools/printing-industry/glossary"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located

### УФ-отверждение печатных покрытий
- **id:** uv-curing-print
- **name:** УФ-отверждение печатных покрытий
- **category:** treatment
- **industry:** printing
- **description:** Отверждение совместимых красочных систем ультрафиолетовым излучением.
- **steps:** Нанесение краски → облучение → контроль покрытия
- **checks:** Неполное отверждение, липкость, стойкость
- **materials:** []
- **profession:** polygraph-engineer
- **sources:** [{"title":"OSHA — терминология печати и послепечатных операций — обзор без технологических режимов","url":"https://www.osha.gov/etools/printing-industry/glossary"}]
- **evidence:** {"verificationStatus":"source_located","verifiedClaim":"Обзорное описание отдельного метода, без независимо подтверждённой технологической карты.","reviewScope":"Открыта страница издателя о классе методов. Режимы, частные дефекты и применимость к изделию требуют отдельной проверки.","checkedAt":"2026-10-22"}
- **reviewStatus:** source_located


## Машиночитаемые исходники

- Стандартный JSON-справочник: https://vremennobeznika.github.io/enjigirling/knowledge/processes.json
- Пакет JSON этого раздела: https://vremennobeznika.github.io/enjigirling/knowledge/sections/processes.json
- Страница раздела: https://vremennobeznika.github.io/enjigirling/processes.html
