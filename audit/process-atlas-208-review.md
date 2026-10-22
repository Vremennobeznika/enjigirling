# ENJIGIRLING — предметная матрица атласа процессов

Дата структурной сверки: **2026-10-22**. Источник: `processes-data.js`; реестр: `knowledge/source-registry.json`.

## Как трактовать статусы

- **Структура PASS** означает проверку ID, наличия карточки, ссылок на известные профессии и материалы, отрасли, описания, этапов, контроля и записи источника. Не доказывает техническую корректность этапов или применимость к конкретной марке.
- **Узкий тезис** означает как минимум один `claim_checked` в реестре для отдельного поля или утверждения. Остальная карточка остаётся непроверенной.
- **Источник найден** (`source_located`) означает наличие связанной публикации, а не проверку конкретных операций, дефектов, нормативных требований, режимов и безопасности.
- Для использования в проектировании, производстве или экспертизе все карточки требуют проверки актуальных норм и первичных технологических документов.

**Итог:** 208 записи; 16 отраслей; 36 записей с хотя бы одним узким проверенным тезисом; 172 записей только с найденным источником/обзором.

## Построчный контроль

| Отрасль | Процесс / ID | Источник | Предметный статус | Итог структуры |
|---|---|---|---|---|
| metals | [Литьё](https://vremennobeznika.github.io/enjigirling/processes.html#casting) · `casting` | atlas-casting, atlas-inspection | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [Дуговая сварка](https://vremennobeznika.github.io/enjigirling/processes.html#welding) · `welding` | iso-4063-2023, checked3-welding | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [Термическая обработка](https://vremennobeznika.github.io/enjigirling/processes.html#heat) · `heat` | atlas-heat, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [MIG/MAG-сварка](https://vremennobeznika.github.io/enjigirling/processes.html#mig-mag) · `mig-mag` | iso-4063-2023, checked3-mig-mag | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [TIG-сварка](https://vremennobeznika.github.io/enjigirling/processes.html#tig) · `tig` | iso-4063-2023, checked3-tig | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [Ковка и объёмная штамповка](https://vremennobeznika.github.io/enjigirling/processes.html#forging) · `forging` | atlas-casting, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [Прокатка](https://vremennobeznika.github.io/enjigirling/processes.html#rolling) · `rolling` | atlas-casting, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [Листовая штамповка](https://vremennobeznika.github.io/enjigirling/processes.html#stamping) · `stamping` | atlas-casting, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [Шлифование](https://vremennobeznika.github.io/enjigirling/processes.html#grinding) · `grinding` | atlas-casting, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| metals | [Точение](https://vremennobeznika.github.io/enjigirling/processes.html#turning) · `turning` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Фрезерование](https://vremennobeznika.github.io/enjigirling/processes.html#milling) · `milling` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Сверление](https://vremennobeznika.github.io/enjigirling/processes.html#drilling) · `drilling` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Растачивание](https://vremennobeznika.github.io/enjigirling/processes.html#boring) · `boring` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Развёртывание](https://vremennobeznika.github.io/enjigirling/processes.html#reaming) · `reaming` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Протягивание](https://vremennobeznika.github.io/enjigirling/processes.html#broaching) · `broaching` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Зубонарезание](https://vremennobeznika.github.io/enjigirling/processes.html#gear-cutting) · `gear-cutting` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Электроэрозионная обработка](https://vremennobeznika.github.io/enjigirling/processes.html#electrodischarge-machining) · `electrodischarge-machining` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Лазерная резка](https://vremennobeznika.github.io/enjigirling/processes.html#laser-cutting) · `laser-cutting` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Гидроабразивная резка](https://vremennobeznika.github.io/enjigirling/processes.html#waterjet-cutting) · `waterjet-cutting` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Отжиг](https://vremennobeznika.github.io/enjigirling/processes.html#annealing) · `annealing` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Закалка сталей](https://vremennobeznika.github.io/enjigirling/processes.html#quenching) · `quenching` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Отпуск стали](https://vremennobeznika.github.io/enjigirling/processes.html#tempering) · `tempering` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Индукционная поверхностная закалка](https://vremennobeznika.github.io/enjigirling/processes.html#induction-hardening) · `induction-hardening` | validated-cutting | Источник найден; REVIEW | PASS · структура |
| metals | [Ручная дуговая сварка покрытым электродом](https://vremennobeznika.github.io/enjigirling/processes.html#manual-metal-arc) · `manual-metal-arc` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Сварка под флюсом](https://vremennobeznika.github.io/enjigirling/processes.html#submerged-arc) · `submerged-arc` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Контактная точечная сварка](https://vremennobeznika.github.io/enjigirling/processes.html#resistance-spot) · `resistance-spot` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Лазерная сварка](https://vremennobeznika.github.io/enjigirling/processes.html#laser-welding) · `laser-welding` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Сварка трением с перемешиванием](https://vremennobeznika.github.io/enjigirling/processes.html#friction-stir-welding) · `friction-stir-welding` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Высокотемпературная пайка](https://vremennobeznika.github.io/enjigirling/processes.html#brazing) · `brazing` | atlas-source-002 | Источник найден; REVIEW | PASS · структура |
| metals | [Низкотемпературная пайка](https://vremennobeznika.github.io/enjigirling/processes.html#soft-soldering) · `soft-soldering` | atlas-source-002 | Источник найден; REVIEW | PASS · структура |
| metals | [Контактная шовная сварка](https://vremennobeznika.github.io/enjigirling/processes.html#resistance-seam) · `resistance-seam` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Стыковая сварка оплавлением](https://vremennobeznika.github.io/enjigirling/processes.html#flash-butt-welding) · `flash-butt-welding` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Электронно-лучевая сварка](https://vremennobeznika.github.io/enjigirling/processes.html#electron-beam-welding) · `electron-beam-welding` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Плазменная дуговая сварка](https://vremennobeznika.github.io/enjigirling/processes.html#plasma-arc-welding) · `plasma-arc-welding` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Приварка шпилек](https://vremennobeznika.github.io/enjigirling/processes.html#stud-welding) · `stud-welding` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| metals | [Диффузионная сварка](https://vremennobeznika.github.io/enjigirling/processes.html#diffusion-bonding) · `diffusion-bonding` | atlas-source-001 | Источник найден; REVIEW | PASS · структура |
| general | [Обработка резанием](https://vremennobeznika.github.io/enjigirling/processes.html#cutting) · `cutting` | atlas-cutting, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Аддитивное производство](https://vremennobeznika.github.io/enjigirling/processes.html#additive) · `additive` | iso-astm-52900-2021, validated-additive | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Неразрушающий контроль](https://vremennobeznika.github.io/enjigirling/processes.html#inspection) · `inspection` | atlas-inspection, validated-inspection | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Ультразвуковой контроль](https://vremennobeznika.github.io/enjigirling/processes.html#ultrasonic) · `ultrasonic` | asnt-ut | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Радиографический контроль](https://vremennobeznika.github.io/enjigirling/processes.html#radiographic) · `radiographic` | asnt-radiographic | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Капиллярный контроль](https://vremennobeznika.github.io/enjigirling/processes.html#dye) · `dye` | asnt-pt-2022, atlas-inspection | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Измерение твёрдости](https://vremennobeznika.github.io/enjigirling/processes.html#hardness) · `hardness` | atlas-hardness | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Покрытия и обработка поверхности](https://vremennobeznika.github.io/enjigirling/processes.html#surface-finishing) · `surface-finishing` | atlas-casting, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Механическая сборка](https://vremennobeznika.github.io/enjigirling/processes.html#assembly) · `assembly` | atlas-casting, iso-10209-assembly | Узкий тезис; остальное REVIEW | PASS · структура |
| general | [Сплавление порошкового слоя](https://vremennobeznika.github.io/enjigirling/processes.html#powder-bed-fusion) · `powder-bed-fusion` | atlas-source-003 | Источник найден; REVIEW | PASS · структура |
| general | [Направленное энергетическое осаждение](https://vremennobeznika.github.io/enjigirling/processes.html#directed-energy-deposition) · `directed-energy-deposition` | atlas-source-003 | Источник найден; REVIEW | PASS · структура |
| general | [Струйное нанесение связующего](https://vremennobeznika.github.io/enjigirling/processes.html#binder-jetting) · `binder-jetting` | atlas-source-003 | Источник найден; REVIEW | PASS · структура |
| general | [Струйное нанесение материала](https://vremennobeznika.github.io/enjigirling/processes.html#material-jetting) · `material-jetting` | atlas-source-003 | Источник найден; REVIEW | PASS · структура |
| general | [Ванночная фотополимеризация](https://vremennobeznika.github.io/enjigirling/processes.html#vat-photopolymerization) · `vat-photopolymerization` | atlas-source-003 | Источник найден; REVIEW | PASS · структура |
| general | [Аддитивная экструзия материала](https://vremennobeznika.github.io/enjigirling/processes.html#additive-extrusion) · `additive-extrusion` | atlas-source-003 | Источник найден; REVIEW | PASS · структура |
| general | [Магнитопорошковый контроль](https://vremennobeznika.github.io/enjigirling/processes.html#magnetic-particle-ndt) · `magnetic-particle-ndt` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Вихретоковый контроль](https://vremennobeznika.github.io/enjigirling/processes.html#eddy-current-ndt) · `eddy-current-ndt` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Визуальный и измерительный контроль](https://vremennobeznika.github.io/enjigirling/processes.html#visual-ndt) · `visual-ndt` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Испытание на герметичность](https://vremennobeznika.github.io/enjigirling/processes.html#leak-testing) · `leak-testing` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Акустико-эмиссионный контроль](https://vremennobeznika.github.io/enjigirling/processes.html#acoustic-emission-ndt) · `acoustic-emission-ndt` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Инфракрасная термография](https://vremennobeznika.github.io/enjigirling/processes.html#infrared-thermography) · `infrared-thermography` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Георадарное обследование](https://vremennobeznika.github.io/enjigirling/processes.html#ground-penetrating-radar) · `ground-penetrating-radar` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Контроль направленными ультразвуковыми волнами](https://vremennobeznika.github.io/enjigirling/processes.html#guided-wave-ndt) · `guided-wave-ndt` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Контроль утечкой магнитного потока](https://vremennobeznika.github.io/enjigirling/processes.html#magnetic-flux-leakage) · `magnetic-flux-leakage` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Нейтронная радиография](https://vremennobeznika.github.io/enjigirling/processes.html#neutron-radiography) · `neutron-radiography` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Лазерная шерография](https://vremennobeznika.github.io/enjigirling/processes.html#laser-shearography) · `laser-shearography` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| general | [Ультразвуковой контроль фазированной решёткой](https://vremennobeznika.github.io/enjigirling/processes.html#phased-array-ut) · `phased-array-ut` | atlas-inspection | Источник найден; REVIEW | PASS · структура |
| polymers | [Литьё термопластов под давлением](https://vremennobeznika.github.io/enjigirling/processes.html#injection-molding) · `injection-molding` | atlas-injection-molding, checked3-injection-molding | Узкий тезис; остальное REVIEW | PASS · структура |
| polymers | [Экструзия полимеров](https://vremennobeznika.github.io/enjigirling/processes.html#extrusion) · `extrusion` | atlas-casting, validated-cutting | Узкий тезис; остальное REVIEW | PASS · структура |
| polymers | [Выдувное формование](https://vremennobeznika.github.io/enjigirling/processes.html#blow-molding) · `blow-molding` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Ротационное формование](https://vremennobeznika.github.io/enjigirling/processes.html#rotomolding) · `rotomolding` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Термоформование листа](https://vremennobeznika.github.io/enjigirling/processes.html#thermoforming) · `thermoforming` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Каландрование пластмасс](https://vremennobeznika.github.io/enjigirling/processes.html#calendering) · `calendering` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Компаундирование полимеров](https://vremennobeznika.github.io/enjigirling/processes.html#compounding) · `compounding` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Вспенивание пластмасс](https://vremennobeznika.github.io/enjigirling/processes.html#polymer-foaming) · `polymer-foaming` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Ультразвуковая сварка термопластов](https://vremennobeznika.github.io/enjigirling/processes.html#ultrasonic-plastic-welding) · `ultrasonic-plastic-welding` | atlas-source-005 | Источник найден; REVIEW | PASS · структура |
| polymers | [Лазерная сварка термопластов](https://vremennobeznika.github.io/enjigirling/processes.html#laser-plastic-welding) · `laser-plastic-welding` | atlas-source-005 | Источник найден; REVIEW | PASS · структура |
| polymers | [Компрессионное формование пластмасс](https://vremennobeznika.github.io/enjigirling/processes.html#compression-molding-plastics) · `compression-molding-plastics` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Инжекционно-выдувное формование с вытяжкой](https://vremennobeznika.github.io/enjigirling/processes.html#stretch-blow-molding) · `stretch-blow-molding` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Экструзия рукавной плёнки](https://vremennobeznika.github.io/enjigirling/processes.html#blown-film-extrusion) · `blown-film-extrusion` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Трансферное формование реактопластов](https://vremennobeznika.github.io/enjigirling/processes.html#polymer-transfer-molding) · `polymer-transfer-molding` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Вулканизация эластомеров](https://vremennobeznika.github.io/enjigirling/processes.html#rubber-vulcanization) · `rubber-vulcanization` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| polymers | [Экструзионное покрытие полимером](https://vremennobeznika.github.io/enjigirling/processes.html#extrusion-coating) · `extrusion-coating` | atlas-source-004 | Источник найден; REVIEW | PASS · структура |
| food | [Пастеризация](https://vremennobeznika.github.io/enjigirling/processes.html#pasteurization) · `pasteurization` | atlas-pasteurization, checked2-pasteurization | Узкий тезис; остальное REVIEW | PASS · структура |
| food | [Сушка пищевых продуктов](https://vremennobeznika.github.io/enjigirling/processes.html#food-drying) · `food-drying` | atlas-pasteurization, checked2-pasteurization | Узкий тезис; остальное REVIEW | PASS · структура |
| food | [Пищевая ферментация](https://vremennobeznika.github.io/enjigirling/processes.html#fermentation) · `fermentation` | atlas-pasteurization | Узкий тезис; остальное REVIEW | PASS · структура |
| food | [Фасовка и упаковка пищевой продукции](https://vremennobeznika.github.io/enjigirling/processes.html#food-packaging) · `food-packaging` | atlas-pasteurization, checked2-pasteurization | Узкий тезис; остальное REVIEW | PASS · структура |
| food | [Бланширование пищевого сырья](https://vremennobeznika.github.io/enjigirling/processes.html#blanching-food) · `blanching-food` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| food | [Тепловая стерилизация пищевой продукции](https://vremennobeznika.github.io/enjigirling/processes.html#thermal-sterilization-food) · `thermal-sterilization-food` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| food | [Промышленное замораживание пищевых продуктов](https://vremennobeznika.github.io/enjigirling/processes.html#freezing-food) · `freezing-food` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| food | [Распылительная сушка пищевых жидкостей](https://vremennobeznika.github.io/enjigirling/processes.html#spray-drying-food) · `spray-drying-food` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| food | [Выпаривание пищевых растворов](https://vremennobeznika.github.io/enjigirling/processes.html#food-evaporation) · `food-evaporation` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| food | [Помол зерна](https://vremennobeznika.github.io/enjigirling/processes.html#grain-milling) · `grain-milling` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| food | [Экструзионная обработка пищевых смесей](https://vremennobeznika.github.io/enjigirling/processes.html#food-extrusion) · `food-extrusion` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| food | [Осветление соков](https://vremennobeznika.github.io/enjigirling/processes.html#juice-clarification) · `juice-clarification` | atlas-pasteurization | Источник найден; REVIEW | PASS · структура |
| textiles | [Прядение](https://vremennobeznika.github.io/enjigirling/processes.html#spinning) · `spinning` | atlas-spinning, checked2-spinning | Узкий тезис; остальное REVIEW | PASS · структура |
| textiles | [Ткачество](https://vremennobeznika.github.io/enjigirling/processes.html#weaving) · `weaving` | atlas-spinning, checked2-spinning | Узкий тезис; остальное REVIEW | PASS · структура |
| textiles | [Вязальное производство](https://vremennobeznika.github.io/enjigirling/processes.html#knitting) · `knitting` | atlas-spinning, checked2-spinning | Узкий тезис; остальное REVIEW | PASS · структура |
| textiles | [Крашение и отделка текстиля](https://vremennobeznika.github.io/enjigirling/processes.html#textile-finishing) · `textile-finishing` | atlas-spinning, validated-textile-finishing | Узкий тезис; остальное REVIEW | PASS · структура |
| textiles | [Швейная сборка изделий](https://vremennobeznika.github.io/enjigirling/processes.html#sewing) · `sewing` | atlas-sewing, checked2-sewing | Узкий тезис; остальное REVIEW | PASS · структура |
| textiles | [Кардочесание волокон](https://vremennobeznika.github.io/enjigirling/processes.html#carding) · `carding` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Гребнечесание волокон](https://vremennobeznika.github.io/enjigirling/processes.html#combing-textile) · `combing-textile` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Вытяжка текстильной ленты](https://vremennobeznika.github.io/enjigirling/processes.html#drawing-textile) · `drawing-textile` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Перемотка пряжи](https://vremennobeznika.github.io/enjigirling/processes.html#winding-yarn) · `winding-yarn` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Снование основы](https://vremennobeznika.github.io/enjigirling/processes.html#warping) · `warping` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Шлихтование основы](https://vremennobeznika.github.io/enjigirling/processes.html#warp-sizing) · `warp-sizing` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Отбеливание текстиля](https://vremennobeznika.github.io/enjigirling/processes.html#textile-bleaching) · `textile-bleaching` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Печать по ткани](https://vremennobeznika.github.io/enjigirling/processes.html#textile-printing) · `textile-printing` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Иглопробивное производство нетканых материалов](https://vremennobeznika.github.io/enjigirling/processes.html#needle-punching-nonwovens) · `needle-punching-nonwovens` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Мерсеризация хлопка](https://vremennobeznika.github.io/enjigirling/processes.html#mercerization) · `mercerization` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Термофиксация текстиля](https://vremennobeznika.github.io/enjigirling/processes.html#heat-setting-textiles) · `heat-setting-textiles` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Каландрование тканей](https://vremennobeznika.github.io/enjigirling/processes.html#textile-calendering) · `textile-calendering` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| textiles | [Машинная вышивка](https://vremennobeznika.github.io/enjigirling/processes.html#industrial-embroidery) · `industrial-embroidery` | checked2-spinning | Источник найден; REVIEW | PASS · структура |
| wood | [Распиловка и обработка древесины](https://vremennobeznika.github.io/enjigirling/processes.html#sawmilling) · `sawmilling` | atlas-sawmilling | Узкий тезис; остальное REVIEW | PASS · структура |
| wood | [Камерная сушка древесины](https://vremennobeznika.github.io/enjigirling/processes.html#wood-drying) · `wood-drying` | atlas-wood-drying, atlas-sawmilling | Узкий тезис; остальное REVIEW | PASS · структура |
| wood | [Строгание пиломатериалов](https://vremennobeznika.github.io/enjigirling/processes.html#wood-planing) · `wood-planing` | atlas-source-007 | Источник найден; REVIEW | PASS · структура |
| wood | [Лущение шпона](https://vremennobeznika.github.io/enjigirling/processes.html#veneer-peeling) · `veneer-peeling` | atlas-source-007 | Источник найден; REVIEW | PASS · структура |
| wood | [Склеивание фанеры](https://vremennobeznika.github.io/enjigirling/processes.html#plywood-bonding) · `plywood-bonding` | atlas-source-007 | Источник найден; REVIEW | PASS · структура |
| wood | [Защитная пропитка древесины](https://vremennobeznika.github.io/enjigirling/processes.html#wood-preservation) · `wood-preservation` | atlas-source-007 | Источник найден; REVIEW | PASS · структура |
| wood | [Прессование древесных плит](https://vremennobeznika.github.io/enjigirling/processes.html#fiberboard-pressing) · `fiberboard-pressing` | atlas-source-007 | Источник найден; REVIEW | PASS · структура |
| electronics | [Монтаж печатных плат](https://vremennobeznika.github.io/enjigirling/processes.html#pcb-assembly) · `pcb-assembly` | atlas-pcb-assembly | Узкий тезис; остальное REVIEW | PASS · структура |
| electronics | [Контроль электронных сборок](https://vremennobeznika.github.io/enjigirling/processes.html#electronic-inspection) · `electronic-inspection` | atlas-pcb-assembly | Узкий тезис; остальное REVIEW | PASS · структура |
| electronics | [Трафаретное нанесение паяльной пасты](https://vremennobeznika.github.io/enjigirling/processes.html#solder-paste-printing) · `solder-paste-printing` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Автоматическая установка SMD-компонентов](https://vremennobeznika.github.io/enjigirling/processes.html#smt-placement) · `smt-placement` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Пайка оплавлением](https://vremennobeznika.github.io/enjigirling/processes.html#reflow-soldering) · `reflow-soldering` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Пайка волной припоя](https://vremennobeznika.github.io/enjigirling/processes.html#wave-soldering) · `wave-soldering` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Защитное покрытие электронных сборок](https://vremennobeznika.github.io/enjigirling/processes.html#conformal-coating) · `conformal-coating` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Автоматизированная оптическая инспекция плат](https://vremennobeznika.github.io/enjigirling/processes.html#aoi-pcb) · `aoi-pcb` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Сверление отверстий печатных плат](https://vremennobeznika.github.io/enjigirling/processes.html#pcb-drilling) · `pcb-drilling` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Травление печатных проводников](https://vremennobeznika.github.io/enjigirling/processes.html#pcb-etching) · `pcb-etching` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Металлизация отверстий печатных плат](https://vremennobeznika.github.io/enjigirling/processes.html#pcb-plating) · `pcb-plating` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Селективная пайка узлов плат](https://vremennobeznika.github.io/enjigirling/processes.html#selective-soldering) · `selective-soldering` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| electronics | [Рентгеновский контроль электронных сборок](https://vremennobeznika.github.io/enjigirling/processes.html#pcb-xray-inspection) · `pcb-xray-inspection` | atlas-pcb-assembly | Источник найден; REVIEW | PASS · структура |
| chemicals | [Промышленное смешение](https://vremennobeznika.github.io/enjigirling/processes.html#chemical-mixing) · `chemical-mixing` | atlas-chemical-mixing | Узкий тезис; остальное REVIEW | PASS · структура |
| chemicals | [Дистилляция](https://vremennobeznika.github.io/enjigirling/processes.html#distillation) · `distillation` | atlas-distillation, checked2-distillation | Узкий тезис; остальное REVIEW | PASS · структура |
| chemicals | [Промышленная фильтрация](https://vremennobeznika.github.io/enjigirling/processes.html#industrial-filtration) · `industrial-filtration` | atlas-industrial-filtration, checked3-industrial-filtration | Узкий тезис; остальное REVIEW | PASS · структура |
| chemicals | [Промышленное выпаривание](https://vremennobeznika.github.io/enjigirling/processes.html#industrial-evaporation) · `industrial-evaporation` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| chemicals | [Кристаллизация растворов](https://vremennobeznika.github.io/enjigirling/processes.html#crystallization) · `crystallization` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| chemicals | [Абсорбция газовых компонентов](https://vremennobeznika.github.io/enjigirling/processes.html#gas-absorption) · `gas-absorption` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| chemicals | [Стриппинг растворённых компонентов](https://vremennobeznika.github.io/enjigirling/processes.html#gas-stripping) · `gas-stripping` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| chemicals | [Промышленное центрифугирование](https://vremennobeznika.github.io/enjigirling/processes.html#industrial-centrifugation) · `industrial-centrifugation` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| chemicals | [Мембранное разделение промышленных смесей](https://vremennobeznika.github.io/enjigirling/processes.html#chemical-membrane) · `chemical-membrane` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| chemicals | [Каталитическая реакция в промышленном реакторе](https://vremennobeznika.github.io/enjigirling/processes.html#catalytic-reaction) · `catalytic-reaction` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| chemicals | [Экстракция растворителем](https://vremennobeznika.github.io/enjigirling/processes.html#solvent-extraction) · `solvent-extraction` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| composites | [Ручная выкладка композитов](https://vremennobeznika.github.io/enjigirling/processes.html#hand-layup) · `hand-layup` | atlas-source-006 | Источник найден; REVIEW | PASS · структура |
| composites | [Вакуумная инфузия](https://vremennobeznika.github.io/enjigirling/processes.html#vacuum-infusion) · `vacuum-infusion` | atlas-source-006 | Источник найден; REVIEW | PASS · структура |
| composites | [Трансферное формование композитов (RTM)](https://vremennobeznika.github.io/enjigirling/processes.html#resin-transfer-molding) · `resin-transfer-molding` | atlas-source-006 | Источник найден; REVIEW | PASS · структура |
| composites | [Пултрузия](https://vremennobeznika.github.io/enjigirling/processes.html#pultrusion) · `pultrusion` | atlas-source-006 | Источник найден; REVIEW | PASS · структура |
| composites | [Намотка композитов](https://vremennobeznika.github.io/enjigirling/processes.html#filament-winding) · `filament-winding` | atlas-source-006 | Источник найден; REVIEW | PASS · структура |
| composites | [Автоклавное отверждение композитов](https://vremennobeznika.github.io/enjigirling/processes.html#autoclave-composites) · `autoclave-composites` | atlas-source-006 | Источник найден; REVIEW | PASS · структура |
| construction | [Приготовление бетонной смеси](https://vremennobeznika.github.io/enjigirling/processes.html#concrete-mixing) · `concrete-mixing` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Укладка бетонной смеси](https://vremennobeznika.github.io/enjigirling/processes.html#concrete-placing) · `concrete-placing` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Виброуплотнение бетона](https://vremennobeznika.github.io/enjigirling/processes.html#concrete-vibration) · `concrete-vibration` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Уход за твердеющим бетоном](https://vremennobeznika.github.io/enjigirling/processes.html#concrete-curing) · `concrete-curing` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Монтаж опалубки](https://vremennobeznika.github.io/enjigirling/processes.html#formwork-erection) · `formwork-erection` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Монтаж арматуры](https://vremennobeznika.github.io/enjigirling/processes.html#rebar-installation) · `rebar-installation` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Каменная кладка](https://vremennobeznika.github.io/enjigirling/processes.html#masonry-works) · `masonry-works` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Укладка асфальтобетона](https://vremennobeznika.github.io/enjigirling/processes.html#road-asphalt-placement) · `road-asphalt-placement` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Инъекционное закрепление грунта](https://vremennobeznika.github.io/enjigirling/processes.html#geotechnical-grouting) · `geotechnical-grouting` | atlas-source-009 | Источник найден; REVIEW | PASS · структура |
| construction | [Производство асфальтобетонной смеси](https://vremennobeznika.github.io/enjigirling/processes.html#asphalt-mix-production) · `asphalt-mix-production` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| energy | [Генерация технологического пара](https://vremennobeznika.github.io/enjigirling/processes.html#steam-generation) · `steam-generation` | atlas-source-011 | Источник найден; REVIEW | PASS · структура |
| energy | [Возврат конденсата](https://vremennobeznika.github.io/enjigirling/processes.html#condensate-return) · `condensate-return` | atlas-source-011 | Источник найден; REVIEW | PASS · структура |
| energy | [Деаэрация котловой воды](https://vremennobeznika.github.io/enjigirling/processes.html#deaeration-water) · `deaeration-water` | atlas-source-011 | Источник найден; REVIEW | PASS · структура |
| energy | [Теплоутилизация в экономайзере](https://vremennobeznika.github.io/enjigirling/processes.html#economizer-heat-recovery) · `economizer-heat-recovery` | atlas-source-011 | Источник найден; REVIEW | PASS · структура |
| energy | [Контроль конденсатоотводчиков](https://vremennobeznika.github.io/enjigirling/processes.html#steam-trap-monitoring) · `steam-trap-monitoring` | atlas-source-011 | Источник найден; REVIEW | PASS · структура |
| energy | [Индукционный нагрев в производстве](https://vremennobeznika.github.io/enjigirling/processes.html#industrial-induction-heating) · `industrial-induction-heating` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| energy | [Промышленный теплообмен](https://vremennobeznika.github.io/enjigirling/processes.html#industrial-heat-exchange) · `industrial-heat-exchange` | atlas-source-008 | Источник найден; REVIEW | PASS · структура |
| water | [Коагуляция при водоподготовке](https://vremennobeznika.github.io/enjigirling/processes.html#coagulation-water) · `coagulation-water` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Флокуляция воды](https://vremennobeznika.github.io/enjigirling/processes.html#flocculation-water) · `flocculation-water` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Отстаивание воды](https://vremennobeznika.github.io/enjigirling/processes.html#sedimentation-water) · `sedimentation-water` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Зернистая фильтрация воды](https://vremennobeznika.github.io/enjigirling/processes.html#granular-filtration) · `granular-filtration` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Адсорбция на активированном угле](https://vremennobeznika.github.io/enjigirling/processes.html#carbon-adsorption) · `carbon-adsorption` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Обратный осмос](https://vremennobeznika.github.io/enjigirling/processes.html#reverse-osmosis) · `reverse-osmosis` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Нанофильтрация воды](https://vremennobeznika.github.io/enjigirling/processes.html#nanofiltration-water) · `nanofiltration-water` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Ультрафильтрация воды](https://vremennobeznika.github.io/enjigirling/processes.html#ultrafiltration-water) · `ultrafiltration-water` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Озонирование воды](https://vremennobeznika.github.io/enjigirling/processes.html#ozonation-water) · `ozonation-water` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| water | [Обезвоживание осадка](https://vremennobeznika.github.io/enjigirling/processes.html#sludge-dewatering) · `sludge-dewatering` | atlas-source-012 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Обжиг цементного клинкера](https://vremennobeznika.github.io/enjigirling/processes.html#cement-clinker-firing) · `cement-clinker-firing` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Кальцинация керамического сырья](https://vremennobeznika.github.io/enjigirling/processes.html#ceramic-calcination) · `ceramic-calcination` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Спекание керамики](https://vremennobeznika.github.io/enjigirling/processes.html#ceramic-sintering) · `ceramic-sintering` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Шликерное литьё керамики](https://vremennobeznika.github.io/enjigirling/processes.html#slip-casting-ceramics) · `slip-casting-ceramics` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Сухое прессование керамики](https://vremennobeznika.github.io/enjigirling/processes.html#dry-pressing-ceramics) · `dry-pressing-ceramics` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Экструзия глиняных изделий](https://vremennobeznika.github.io/enjigirling/processes.html#brick-extrusion) · `brick-extrusion` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Варка стекломассы](https://vremennobeznika.github.io/enjigirling/processes.html#glass-melting) · `glass-melting` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| ceramics | [Отжиг стекла](https://vremennobeznika.github.io/enjigirling/processes.html#glass-annealing) · `glass-annealing` | atlas-source-010 | Источник найден; REVIEW | PASS · структура |
| pharma | [Влажная грануляция фармацевтических порошков](https://vremennobeznika.github.io/enjigirling/processes.html#wet-granulation-pharma) · `wet-granulation-pharma` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Сухая грануляция фармацевтических порошков](https://vremennobeznika.github.io/enjigirling/processes.html#dry-granulation-pharma) · `dry-granulation-pharma` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Таблетирование](https://vremennobeznika.github.io/enjigirling/processes.html#tablet-compression) · `tablet-compression` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Покрытие фармацевтических таблеток](https://vremennobeznika.github.io/enjigirling/processes.html#tablet-coating) · `tablet-coating` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Наполнение капсул](https://vremennobeznika.github.io/enjigirling/processes.html#capsule-filling) · `capsule-filling` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Асептическое наполнение стерильных форм](https://vremennobeznika.github.io/enjigirling/processes.html#aseptic-filling) · `aseptic-filling` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Распылительная сушка фармацевтических растворов](https://vremennobeznika.github.io/enjigirling/processes.html#pharma-spray-drying) · `pharma-spray-drying` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Фармацевтическое просеивание](https://vremennobeznika.github.io/enjigirling/processes.html#pharma-sieving) · `pharma-sieving` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Смешение фармацевтических порошков](https://vremennobeznika.github.io/enjigirling/processes.html#pharma-powder-blending) · `pharma-powder-blending` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Микронизация фармацевтических веществ](https://vremennobeznika.github.io/enjigirling/processes.html#pharma-micronization) · `pharma-micronization` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Сушка в псевдоожиженном слое](https://vremennobeznika.github.io/enjigirling/processes.html#fluid-bed-pharma-drying) · `fluid-bed-pharma-drying` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| pharma | [Внутрипроизводственный контроль таблеток](https://vremennobeznika.github.io/enjigirling/processes.html#pharma-inprocess-control) · `pharma-inprocess-control` | atlas-source-013 | Источник найден; REVIEW | PASS · структура |
| printing | [Офсетная печать](https://vremennobeznika.github.io/enjigirling/processes.html#offset-lithography) · `offset-lithography` | atlas-source-014 | Источник найден; REVIEW | PASS · структура |
| printing | [Флексографская печать](https://vremennobeznika.github.io/enjigirling/processes.html#flexography) · `flexography` | atlas-source-014 | Источник найден; REVIEW | PASS · структура |
| printing | [Трафаретная печать](https://vremennobeznika.github.io/enjigirling/processes.html#screen-printing) · `screen-printing` | atlas-source-014 | Источник найден; REVIEW | PASS · структура |
| printing | [Глубокая печать](https://vremennobeznika.github.io/enjigirling/processes.html#gravure-printing) · `gravure-printing` | atlas-source-014 | Источник найден; REVIEW | PASS · структура |
| printing | [Послепечатная фальцовка и переплёт](https://vremennobeznika.github.io/enjigirling/processes.html#print-binding) · `print-binding` | atlas-source-014 | Источник найден; REVIEW | PASS · структура |
| printing | [Изготовление печатных форм](https://vremennobeznika.github.io/enjigirling/processes.html#printing-plate-making) · `printing-plate-making` | atlas-source-016 | Источник найден; REVIEW | PASS · структура |
| printing | [Высечка печатной продукции](https://vremennobeznika.github.io/enjigirling/processes.html#print-die-cutting) · `print-die-cutting` | atlas-source-016 | Источник найден; REVIEW | PASS · структура |
| printing | [УФ-отверждение печатных покрытий](https://vremennobeznika.github.io/enjigirling/processes.html#uv-curing-print) · `uv-curing-print` | atlas-source-016 | Источник найден; REVIEW | PASS · структура |
| mining | [Дробление руды](https://vremennobeznika.github.io/enjigirling/processes.html#ore-crushing) · `ore-crushing` | atlas-source-015 | Источник найден; REVIEW | PASS · структура |
| mining | [Измельчение руды](https://vremennobeznika.github.io/enjigirling/processes.html#ore-grinding) · `ore-grinding` | atlas-source-015 | Источник найден; REVIEW | PASS · структура |
| mining | [Грохочение руды](https://vremennobeznika.github.io/enjigirling/processes.html#ore-screening) · `ore-screening` | atlas-source-015 | Источник найден; REVIEW | PASS · структура |
| mining | [Флотационное обогащение](https://vremennobeznika.github.io/enjigirling/processes.html#ore-flotation) · `ore-flotation` | atlas-source-015 | Источник найден; REVIEW | PASS · структура |
| mining | [Магнитная сепарация руды](https://vremennobeznika.github.io/enjigirling/processes.html#magnetic-separation-ore) · `magnetic-separation-ore` | atlas-source-015 | Источник найден; REVIEW | PASS · структура |
| mining | [Гравитационное обогащение](https://vremennobeznika.github.io/enjigirling/processes.html#gravity-concentration) · `gravity-concentration` | atlas-source-015 | Источник найден; REVIEW | PASS · структура |
| mining | [Выщелачивание руды](https://vremennobeznika.github.io/enjigirling/processes.html#ore-leaching) · `ore-leaching` | atlas-source-015 | Источник найден; REVIEW | PASS · структура |

## Список обязательной последующей предметной проверки

1. Сопоставить конкретное определение процесса с соответствующим первичным учебником, стандартом или техническим руководством, указать редакцию и допустимую область применения.
2. Для описаний этапов проверить различия вариантов процесса, оборудование и выходы; не использовать общий обзор отрасли как технологическую карту.
3. Для дефектов и контроля указать, какие методы применимы к конкретному виду изделия и материалу; не делать универсальных допусков.
4. Для опасных процессов оставить режимы и меры защиты только из действующей технологической документации и требований безопасности.
5. Для каждой карточки фиксировать отдельные claimPath, sourceId, источник и предел проверки, переводить статус в `claim_checked` только после сверки конкретного тезиса.
6. После исправления первичных данных повторно генерировать JSON/Markdown, поисковый индекс и граф, затем запускать полный CI.

