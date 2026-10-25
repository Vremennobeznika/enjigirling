# Индивидуальная проверка инженерных утверждений — 25.10.2026

**Частичный результат. Поручение по полной проверке 342 карточек остаётся открытым.**

## Цель и приёмка

Для каждой исходной карточки подтвердить инженерные утверждения прочитанными профильными первичными документами, указать раздел и границы подтверждения, исправить выявленные ошибки. Совпадение названия, доступный URL и успешный программный тест не подтверждают техническое содержание. Проверка определения не подтверждает этапы, контроль, марки и нормативную применимость.

## Фактический объём

| Показатель | Результат |
|---|---:|
| База | 172 материала + 208 процессов = 380 |
| До прохода: карточки с хотя бы одним подтверждённым тезисом | 38 |
| Исходная очередь | 342 |
| Подтверждённые частные тезисы прохода | 181 у 181 карточек |
| Впервые охвачены из исходных 342 | 177 |
| Другие тезисы повторно проверенных карточек | 4 |
| Итого в базе есть хотя бы один подтверждённый тезис | 215 из 380 |
| Без подтверждённого тезиса из исходной очереди | 165 из 342 |
| Прочитанные и использованные страницы/документы | 88 |
| Исправленные или уточнённые поля и связи | 49 |
| Полностью аттестованные карточки | Не заявляются |

Остаток — не только 165 карточек без подтверждённого тезиса. У частично охваченных карточек также остаются непроверенные поля и части полей. Автоматическая матрица содержит все 342 ID, текущее содержание технических полей, частные подтверждения и явные открытые статусы. Генерация этой матрицы не засчитана как индивидуальная инженерная проверка.

## Проверки и ограничения

| Направление | Метод и результат | Ограничение |
|---|---|---|
| Предметная проверка | 181 тезисов сопоставлены с релевантным текстом 88 первичных страниц/документов; см. разделы ниже | Только приведённые тезисы |
| Основные сценарии / целостность / кодировка / внутренние ссылки | Локальная сборка экспортов и test:static: 23/23 группы прошли, синтаксис 102 JS-файлов проверен | Не доказывает истинность инженерных утверждений |
| Регрессия текста | SHA-256 проверенного поля, равенство журнала и реестра, проверка 49 исправлений | Хеш защищает от незаметной локальной правки, но не отслеживает изменение удалённого источника |
| Негативный сценарий | Отдельная копия: изменение проверенного поля без новой экспертизы отклонено тестом с text changed; source review required | Содержательность тезиса проверяется человеком/экспертом, не тестом |
| Браузерная регрессия, ширины, темы, фильтры и ссылки | На опубликованном контрольном коммите 9dddf342: Browser Smoke — 104 passed; Process Atlas Browser QA — success, 4 ширины и 2 темы; Publish — build/deploy success | Эти результаты относятся к указанному коммиту; новый коммит требует нового CI |
| Слабые устройства / производительность / безопасность | Специальные аппаратные, нагрузочные и атакующие проверки в этом проходе не выполнялись | Не аттестовано |
| Внешние ссылки | Чтение источников отдельно от проверки доступности. Часть OSHA/USGS вернула 403; отдельные страницы — 401/404/502 или ошибку извлечения | Недоступный текст не засчитан; это не означает недоступности всех оставшихся источников |
| Нормативная применимость | Не выполнена полная сверка актуальных норм РФ/ЕАЭС, фармакопей, изменений стандартов, конкретных марок и партий | Обзорный источник не заменяет техкарту или допуск |

Промежуточный прогон 20/23 завершился ошибкой из-за преждевременной очистки временных экспортов. После исправления порядка действий полный повторный прогон дал 23/23. Негативный тест повторён на текущих данных: изменение проверенного поля refractory-ceramics отклонено.

## Воспроизведение

```sh
node scripts/build-knowledge.cjs
node scripts/build-ai-packs.cjs
node scripts/build-quality.cjs
node scripts/audit-atlas-cards.cjs --write
npm run test:static
```

Исходная версия: `43fd6eaa5a998116207e7fe2affec80368e449aa`. Зависимости, CSS и исполняемый код страниц в рамках этого предметного аудита не расширены. Подтверждения ограничены `verifiedClaim` и `sourceSection`. Обновлять хеш после изменения текста без повторного чтения источника нельзя.

## Исправления и уточнения

| Карточка | Поле | Было | Стало | Основание |
|---|---|---|---|---|
| ground-penetrating-radar | materials | ["09g2s", "steel-45"] | [] | [review-asnt-gpr](https://www.asnt.org/what-is-nondestructive-testing/methods/ground-penetrating-radar); Стальные марки — необоснованный список среды зондирования; металл может быть отражающим объектом, а не средой проникновения. |
| cement-clinker-firing | materials | ["alumina"] | ["cement-clinker"] | [review-epa-cement](https://www.epa.gov/system/files/documents/2025-02/c11s06_final_2-2025_0.pdf); Чистая оксидная керамика Al2O3 не заменяет многокомпонентную сырьевую смесь; сохранена связь с продуктом операции. |
| brick-extrusion | materials | ["alumina"] | ["fireclay-raw"] | [review-epa-ceramics](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf); Оксидная керамика заменена связью с глинистым сырьём; точная рецептура не утверждается. |
| glass-melting | materials | ["alumina"] | ["glass-raw"] | [review-epa-glass](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf); Оксидная керамика Al2O3 не является стеклом или его шихтой. |
| glass-annealing | materials | ["alumina"] | [] | [review-epa-glass](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf); Оксидная керамика Al2O3 не является стеклом или его шихтой. |
| heat-setting-textiles | description | Тепловая стабилизация структуры подходящего волокнистого материала. | Тепловая стабилизация текстиля с термопластичными волокнами, например полиэфирными или полиамидными. Чистый хлопок не термофиксируется этим механизмом. | [review-cotton-heatset](https://cottonworks.com/wp-content/uploads/2018/01/Dyeing_Booklet.pdf); В источнике прямо различены термопластичные волокна и хлопок. |
| heat-setting-textiles | materials | ["cotton", "woven-fabric"] | ["polyester-fiber", "polyamide-textile-yarn"] | [review-cotton-heatset](https://cottonworks.com/wp-content/uploads/2018/01/Dyeing_Booklet.pdf); Убрано неподходящее хлопковое сырьё; ткань без состава не подтверждает применимость. |
| concrete-mixing | materials | ["09g2s"] | ["ready-mix-concrete"] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); 09Г2С заменена бетоном как предметом операции; это не подтверждение технологии самой операции. |
| concrete-placing | materials | ["09g2s"] | ["ready-mix-concrete"] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); 09Г2С заменена бетоном как предметом операции; это не подтверждение технологии самой операции. |
| concrete-vibration | materials | ["09g2s"] | ["ready-mix-concrete"] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); 09Г2С заменена бетоном как предметом операции; это не подтверждение технологии самой операции. |
| concrete-curing | materials | ["09g2s"] | ["ready-mix-concrete"] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); 09Г2С заменена бетоном как предметом операции; это не подтверждение технологии самой операции. |
| formwork-erection | materials | ["09g2s"] | [] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); Шаблонная связь с маркой 09Г2С не подтверждена; снята без подстановки новой неподтверждённой марки. |
| rebar-installation | materials | ["09g2s"] | [] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); Шаблонная связь с маркой 09Г2С не подтверждена; снята без подстановки новой неподтверждённой марки. |
| masonry-works | materials | ["09g2s"] | [] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); Шаблонная связь с маркой 09Г2С не подтверждена; снята без подстановки новой неподтверждённой марки. |
| road-asphalt-placement | materials | ["09g2s"] | [] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); Шаблонная связь с маркой 09Г2С не подтверждена; снята без подстановки новой неподтверждённой марки. |
| geotechnical-grouting | materials | ["09g2s"] | [] | [review-aci-concrete](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640); Шаблонная связь с маркой 09Г2С не подтверждена; снята без подстановки новой неподтверждённой марки. |
| perlite-raw | detail | Пористое минеральное сырьё для технических изделий; свойства зависят от обработки. | Природное аморфное вулканическое стекло. При быстром нагреве сырьё вспучивается и превращается в лёгкий пористый материал; сырой и вспученный перлит следует различать. | [review-usgs-perlite](https://www.usgs.gov/centers/national-minerals-information-center/perlite-statistics-and-information); Пористость вспученного продукта нельзя автоматически приписывать исходной породе. |
| adhesive | detail | Многокомпонентные составы для соединения материалов, имеющие разные механизмы отверждения. | Клеевые составы для соединения материалов. Существуют одно- и многокомпонентные системы; механизм отверждения зависит от химии продукта. | [review-henkel-adhesive](https://next.henkel-adhesives.com/fr/en/articles/3-reasons-to-use-single-side-adhesives.html); Однокомпонентные PUR-системы опровергают прежнее определение всех клеёв как многокомпонентных. |
| polymer-transfer-molding | materials | ["pe-hd", "pa6"] | [] | [review-trelleborg-transfer](https://www.trelleborg.com/medical/-/media/tss-media-repository/tss_website/services-and-tools/technical-library/whitepapers/mnr_customrubberpart_whitepaper.pdf?rev=6530d866405a40029b42636d82d9f331); HDPE и PA6 не подтверждены как сырьё для заявленных реактопластов/вулканизуемых эластомеров; общая принадлежность к полимерам недостаточна. |
| rubber-vulcanization | materials | ["pe-hd", "pa6"] | [] | [review-trelleborg-transfer](https://www.trelleborg.com/medical/-/media/tss-media-repository/tss_website/services-and-tools/technical-library/whitepapers/mnr_customrubberpart_whitepaper.pdf?rev=6530d866405a40029b42636d82d9f331); HDPE и PA6 не подтверждены как сырьё для заявленных реактопластов/вулканизуемых эластомеров; общая принадлежность к полимерам недостаточна. |
| pharma-lactose | note | Обозначение полимера/волокна; конкретная рецептура и добавки; условия переработки; свойства партии и ограничения применения. | Точная идентификация вещества и формы; применимая фармакопейная монография; паспорт качества, чистота, влажность и совместимость с лекарственной формой. | Редакционная правка без фармакопейной аттестации; Удалена ошибочная универсальная памятка «Обозначение полимера/волокна». Это редакционная правка, не фармакопейная экспертиза. |
| pharma-mcc | note | Обозначение полимера/волокна; конкретная рецептура и добавки; условия переработки; свойства партии и ограничения применения. | Точная идентификация вещества и формы; применимая фармакопейная монография; паспорт качества, чистота, влажность и совместимость с лекарственной формой. | Редакционная правка без фармакопейной аттестации; Удалена ошибочная универсальная памятка «Обозначение полимера/волокна». Это редакционная правка, не фармакопейная экспертиза. |
| pharma-gelatin | note | Обозначение полимера/волокна; конкретная рецептура и добавки; условия переработки; свойства партии и ограничения применения. | Точная идентификация вещества и формы; применимая фармакопейная монография; паспорт качества, чистота, влажность и совместимость с лекарственной формой. | Редакционная правка без фармакопейной аттестации; Удалена ошибочная универсальная памятка «Обозначение полимера/волокна». Это редакционная правка, не фармакопейная экспертиза. |
| pharma-povidone | note | Обозначение полимера/волокна; конкретная рецептура и добавки; условия переработки; свойства партии и ограничения применения. | Точная идентификация вещества и формы; применимая фармакопейная монография; паспорт качества, чистота, влажность и совместимость с лекарственной формой. | Редакционная правка без фармакопейной аттестации; Удалена ошибочная универсальная памятка «Обозначение полимера/волокна». Это редакционная правка, не фармакопейная экспертиза. |
| pharma-hpmc | note | Обозначение полимера/волокна; конкретная рецептура и добавки; условия переработки; свойства партии и ограничения применения. | Точная идентификация вещества и формы; применимая фармакопейная монография; паспорт качества, чистота, влажность и совместимость с лекарственной формой. | Редакционная правка без фармакопейной аттестации; Удалена ошибочная универсальная памятка «Обозначение полимера/волокна». Это редакционная правка, не фармакопейная экспертиза. |
| pharma-starch | note | Обозначение полимера/волокна; конкретная рецептура и добавки; условия переработки; свойства партии и ограничения применения. | Точная идентификация вещества и формы; применимая фармакопейная монография; паспорт качества, чистота, влажность и совместимость с лекарственной формой. | Редакционная правка без фармакопейной аттестации; Удалена ошибочная универсальная памятка «Обозначение полимера/волокна». Это редакционная правка, не фармакопейная экспертиза. |
| compression-molding-plastics | checks | Пустоты, облой, степень отверждения | Пустоты, облой, размеры; для реактопластов — степень отверждения, для термопластов — условия охлаждения. | [review-epa-polymers](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT); Отверждение не является универсальным критерием для всех пластмасс. |
| brazing | description | Соединение основного металла расплавленным припоем без расплавления основы. | Соединение без расплавления основного металла с использованием припоя, температура плавления которого выше 450 °C. | [review-twi-solder](https://www.twi-global.com/technical-knowledge/faqs/welding-brazing-and-soldering); Добавлена граница, отличающая высокотемпературную пайку от низкотемпературной. |
| soft-soldering | description | Соединение деталей припойным металлом с более низкой температурой плавления. | Соединение без расплавления основного металла с использованием припоя, температура плавления которого ниже 450 °C. | [review-twi-solder](https://www.twi-global.com/technical-knowledge/faqs/welding-brazing-and-soldering); Прежнее «более низкая температура» не задавало базу сравнения и отличие от brazing. |
| al-series-5xxx | detail | Группа алюминиевых материалов, для которых нужно установить сплав и состояние поставки; серии нельзя считать взаимозаменяемыми. | Серия деформируемых алюминиевых сплавов, в которой основным легирующим элементом является магний. Свойства и применимость уточняются для конкретного сплава и состояния поставки. | [review-aa-series](https://www.aluminum.org/standards); Вместо общего описания добавлен подтверждённый отличительный легирующий элемент. |
| al-series-7xxx | detail | Группа алюминиевых сплавов; прочность и коррозионные ограничения зависят от конкретной марки и термообработки. | Серия алюминиевых сплавов с цинком как основным легирующим элементом. Сочетание состава и термообработки определяет свойства конкретной марки. | [review-aa-series](https://www.aluminum.org/standards); Добавлен подтверждённый признак серии без переноса численных свойств на все марки. |
| aseptic-filling | description | Наполнение предварительно подготовленной тары стерильным продуктом в контролируемой среде. | Наполнение стерилизованной тары стерильным продуктом с последующей укупоркой в контролируемой асептической среде; подготовка и контроль компонентов зависят от процесса. | [review-fda-aseptic](https://www.fda.gov/media/71026/download); Уточнена стерильность компонентов; одной неопределённой подготовки тары недостаточно. |
| aseptic-filling | sources | [{"title": "FDA — контроль твёрдых лекарственных форм — обзор; не технологическая инструкция", "url": "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/dosage-form-drug-manufacturers-cgmps-1093"}] | [{"title": "Sterile Drug Products Produced by Aseptic Processing — CGMP", "url": "https://www.fda.gov/media/71026/download"}] | [review-fda-aseptic](https://www.fda.gov/media/71026/download); Источник о твёрдых лекарственных формах не подтверждает асептическое наполнение; заменён профильным руководством FDA. |
| ozonation-water | steps | Генерация озона → контакт с водой → контроль | Генерация озона → контакт с водой → разрушение остаточного озона в отходящем газе → контроль | [review-epa-ozone](https://www.epa.gov/sites/default/files/2015-06/documents/ozon.pdf); В обзорной цепочке отсутствовала обработка отходящего озонсодержащего газа, указанная EPA как необходимая. |
| bronze-alloys | detail | Семейство медных сплавов без единого набора механических или коррозионных свойств. | Семейство медных сплавов, включающее оловянные, алюминиевые, кремниевые и бериллиевые бронзы; единого набора механических или коррозионных свойств для семейства нет. | [review-ica-copper](https://internationalcopper.org/sustainable-copper/about-copper/); Добавлена предметная идентификация семейства вместо одного общего ограничения. |
| kaolin-industrial | detail | Классы каолина различаются по чистоте, дисперсности и назначению. | Каолин — глинистое сырьё, применяемое в керамическом производстве. Классы различаются по чистоте, дисперсности и назначению. | [review-epa-ceramics](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| soda-ash | detail | Сырьё для различных промышленных смесей; чистота и сорт должны соответствовать задаче. | Кальцинированная сода используется, в частности, как компонент стекольной шихты; чистота и сорт должны соответствовать конкретному производству. | [review-epa-glass](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| mdf | detail | Плитный древесный материал; показатели зависят от плотности и типа связующего. | MDF — древесноволокнистая плита средней плотности; показатели зависят от плотности и типа связующего. | [review-usda-composites](https://research.fs.usda.gov/download/treesearch/62258.pdf); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| timber | detail | Геометрия, порода, влажность и сортность определяются спецификацией. | Влажность влияет на свойства древесины. Геометрия, порода, влажность и сортность определяются спецификацией. | [review-usda-moisture](https://research.fs.usda.gov/download/treesearch/62243.pdf); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| pine-lumber | detail | Натуральные пиломатериалы, требующие контроля породы, влажности и сортировки. | Натуральные пиломатериалы; изменение влажности влияет на свойства древесины. Требуются контроль породы, влажности и сортировка. | [review-usda-moisture](https://research.fs.usda.gov/download/treesearch/62243.pdf); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| abs | detail | Сополимерное семейство; отдельные марки могут иметь разные присадки, прочность и термостойкость. | ABS — сополимерное семейство на основе акрилонитрила, бутадиена и стирола; соотношение компонентов и модификации меняют свойства. | [review-ensinger-abs](https://www.ensingerplastics.com/en/thermoplastic-materials/abs-plastic); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| pbt | detail | Полимерные композиции для формования; электрические и механические параметры зависят от наполнения. | PBT — полукристаллический термопластичный полиэфир; доступны стеклонаполненные композиции. Электрические и механические параметры зависят от марки и наполнения. | [review-ensinger-pbt](https://www.ensingerplastics.com/en/thermoplastic-materials/pbt-material); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| pc | detail | Группа полимеров для формования деталей; свойства зависят от марки и технологического состояния. | Поликарбонат — аморфный термопласт для формования деталей; армирование и конкретная марка влияют на свойства и прозрачность. | [review-ensinger-pc](https://www.ensingerplastics.com/en/thermoplastic-materials/pc-polycarbonate); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| polymer-pet | detail | Полимер, используемый в разных формах, включая упаковочные изделия и волокна, в зависимости от марки. | PET — полиэфир; существуют аморфные и полукристаллические формы. Упаковочные и иные применения требуют выбора конкретной марки. | [review-ensinger-polymer-pet](https://www.ensingerplastics.com/en/thermoplastic-materials/pet-polyester); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| polymer-pp | detail | Полимерное сырьё; потребительские свойства определяются маркой, составом и переработкой. | PP — полукристаллический термопласт группы полиолефинов; существует несколько модификаций. Потребительские свойства определяются маркой, составом и переработкой. | [review-ensinger-polymer-pp](https://www.ensingerplastics.com/en/thermoplastic-materials/pp-plastic); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| pps | detail | Материал для технических изделий; требования по работе при температуре задаются маркой и испытанием. | PPS — полукристаллический термопласт для технических изделий; выпускаются наполненные модификации. Требования по работе при температуре задаются маркой и испытанием. | [review-ensinger-pps](https://www.ensingerplastics.com/en/thermoplastic-materials/pps-plastic); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| ptfe | detail | Полимерный материал, подбираемый под температуру, среду и требования к ползучести. | PTFE — фторполимер; стеклянные, углеродные и другие наполнители меняют механические свойства. Материал подбирается под температуру, среду и требования к ползучести. | [review-ensinger-ptfe](https://www.ensingerplastics.com/en/thermoplastic-materials/ptfe-material); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| pharma-starch | detail | Сырьё для лекарственных форм; качество и назначение определяются фармакопейной монографией. | Крахмальные вспомогательные вещества используются, в частности, как наполнители и связующие твёрдых пероральных лекарственных форм. Качество конкретного продукта требует отдельной фармакопейной проверки. | [review-dfe-portfolio](https://dfepharma.com/media/2ianc2oo/dpi-corporate-brochure.pdf); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |
| ps | detail | Термопластичный полимер; ударные свойства и переработка зависят от типа и марки. | Полистирол — термопластичный полимер; GPPS перерабатывают литьём под давлением и экструзией. Ударные свойства и условия переработки зависят от типа и марки. | [review-basf-ps](https://chemicals.basf.com/global/en/Petrochemicals/Styrenics-Europe/Polystyrol); Уточнение описания по уже прочитанному первичному источнику: подтверждённый тезис должен явно содержаться в поле карточки, а не только в журнале. |

## Подтверждённые части — индивидуально

| Карточка и поле | Подтверждённая часть | Источник и раздел |
|---|---|---|
| processes/magnetic-particle-ndt · description | Магнитопорошковый контроль выявляет поверхностные и близкие к поверхности несплошности ферромагнетиков. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Magnetic Particle Testing |
| processes/eddy-current-ndt · description | Вихретоковый контроль использует электромагнитную индукцию в проводящих материалах. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Electromagnetic Testing |
| processes/visual-ndt · description | Визуальный контроль выполняется непосредственно или с оптическими средствами. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Visual Testing |
| processes/leak-testing · description | Контроль герметичности включает методы перепада давления и индикаторного газа. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Leak Testing |
| processes/acoustic-emission-ndt · description | Акустическая эмиссия регистрирует высвобождение энергии при изменениях нагруженного материала. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Acoustic Emission |
| processes/infrared-thermography · description | Инфракрасный контроль выявляет температурные неоднородности. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Infrared Testing |
| processes/ground-penetrating-radar · description | Георадар использует радиолокационные импульсы для обследования подповерхностных объектов. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Ground Penetrating Radar |
| processes/guided-wave-ndt · description | Направленные ультразвуковые волны распространяются вдоль протяжённой конструкции. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Guided Wave Testing |
| processes/magnetic-flux-leakage · description | Метод регистрирует поле рассеяния около несплошностей намагниченной стали. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Magnetic Flux Leakage |
| processes/neutron-radiography · description | Нейтронная радиография использует нейтроны для получения изображения объекта. | [ASNT — Nondestructive Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods) · Neutron Radiography |
| processes/laser-shearography · description | Шерография выявляет изменения поверхности при приложенной нагрузке, в том числе у композитов и клеевых соединений. | [ASNT — Laser Testing Methods](https://www.asnt.org/what-is-nondestructive-testing/methods/laser-methods) · Surface Inspection; Holography/Shearography |
| processes/phased-array-ut · description | Фазированная решётка использует несколько элементов для формирования и фокусировки ультразвукового пучка. | [ASNT — Ultrasonic Testing](https://www.asnt.org/what-is-nondestructive-testing/methods/ultrasonic-testing) · Phased Array Ultrasonic Testing |
| processes/powder-bed-fusion · description | Порошковый слой сплавляется источником энергии, например лазером или электронным пучком. | [NIST — Additive Manufacturing Technologies](https://www.nist.gov/additive-manufacturing/research-areas/technologies) · Powder Bed Fusion |
| processes/directed-energy-deposition · description | Материал подаётся и плавится направленным источником энергии. | [NIST — Additive Manufacturing Technologies](https://www.nist.gov/additive-manufacturing/research-areas/technologies) · Directed Energy Deposition |
| processes/binder-jetting · description | Порошковый материал соединяется выборочным нанесением связующего. | [NIST — Additive Manufacturing Technologies](https://www.nist.gov/additive-manufacturing/research-areas/technologies) · Binder Jetting |
| processes/material-jetting · description | Изделие формируется нанесением капель материала. | [NIST — Additive Manufacturing Technologies](https://www.nist.gov/additive-manufacturing/research-areas/technologies) · Material Jetting |
| processes/vat-photopolymerization · description | Фотополимерная смола отверждается светом при последовательном построении. | [NIST — Additive Manufacturing Technologies](https://www.nist.gov/additive-manufacturing/research-areas/technologies) · Vat Photopolymerization |
| processes/additive-extrusion · description | Экструдируемый материал укладывается послойно. | [NIST — Additive Manufacturing Technologies](https://www.nist.gov/additive-manufacturing/research-areas/technologies) · Material Extrusion |
| processes/casting · description | Отливку получают заливкой расплава в форму и затвердеванием. | [Bodycote — Technical glossary](https://www.bodycote.com/technical-glossary/) · Casting |
| processes/forging · description | Ковка формирует металл сжимающим усилием; применяются прессы и молоты. | [Bodycote — Technical glossary](https://www.bodycote.com/technical-glossary/) · Forging |
| processes/annealing · description | Отжиг включает нагрев и последующее охлаждение для изменения состояния металла. | [Bodycote — Technical glossary](https://www.bodycote.com/technical-glossary/) · Annealing; Full annealing |
| processes/quenching · description | Закалка стали включает ускоренное охлаждение после нагрева. | [Bodycote — Technical glossary](https://www.bodycote.com/technical-glossary/) · Quenching |
| processes/tempering · description | Отпуск изменяет механические свойства стали после закалки. | [Bodycote — Technical glossary](https://www.bodycote.com/technical-glossary/) · Tempering |
| processes/induction-hardening · description | Индукционная закалка сочетает индукционный нагрев и последующее охлаждение. | [Bodycote — Technical glossary](https://www.bodycote.com/technical-glossary/) · Induction hardening |
| materials/refractory-ceramics · detail | Огнеупоры предназначены для высоких температур; среди примеров — оксид алюминия и кремнезём. | [Bodycote — Technical glossary](https://www.bodycote.com/technical-glossary/) · Refractory |
| materials/al-6061 · detail | 6061 — термоупрочняемый сплав серии 6xxx с магнием и кремнием; состояние поставки имеет значение. | [Hydro — 6061 alloy](https://www.hydro.com/en/global/aluminium/products/extruded-profiles/alloys-for-extruded-profiles/6061-alloy/) · Introduction; When should you choose 6061? |
| materials/al-6063 · detail | Сплав 6063 легирован магнием и кремнием и применяется для прессованных профилей. | [Hydro — 6063 alloy](https://www.hydro.com/en/global/aluminium/products/extruded-profiles/alloys-for-extruded-profiles/6063-alloy/) · Introduction; Architectural profiles |
| materials/cement-portland · detail | Портландцемент получают помолом клинкера с добавлением гипса и при необходимости других компонентов. | [EPA AP-42 11.6 — Portland Cement Manufacturing](https://www.epa.gov/system/files/documents/2025-02/c11s06_final_2-2025_0.pdf) · 11.6.1 / finish grinding, p.7 |
| materials/cement-clinker · detail | Клинкер образуется при пиропереработке подготовленной сырьевой смеси. | [EPA AP-42 11.6 — Portland Cement Manufacturing](https://www.epa.gov/system/files/documents/2025-02/c11s06_final_2-2025_0.pdf) · 11.6.1 / pyroprocessing, p.5 |
| materials/gypsum · detail | Гипс добавляют на стадии окончательного помола цемента. | [EPA AP-42 11.6 — Portland Cement Manufacturing](https://www.epa.gov/system/files/documents/2025-02/c11s06_final_2-2025_0.pdf) · 11.6.1 / p.1, p.7 |
| processes/cement-clinker-firing · description | Подготовленная минеральная смесь преобразуется в клинкер при обжиге. | [EPA AP-42 11.6 — Portland Cement Manufacturing](https://www.epa.gov/system/files/documents/2025-02/c11s06_final_2-2025_0.pdf) · 11.6.1 / pyroprocessing |
| processes/ceramic-calcination · description | Кальцинация удаляет газообразные компоненты и изменяет состояние керамического сырья. | [EPA AP-42 11.7 — Ceramic Products Manufacturing](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) · 11.7.2.2 |
| processes/ceramic-sintering · description | Спекание термически уплотняет керамическую заготовку. | [EPA AP-42 11.7 — Ceramic Products Manufacturing](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) · 11.7.2.9 |
| processes/slip-casting-ceramics · description | Шликерное литьё использует керамическую суспензию и пористую форму. | [EPA AP-42 11.7 — Ceramic Products Manufacturing](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) · 11.7.2.4 |
| processes/dry-pressing-ceramics · description | Сухое формование совмещает уплотнение и придание формы порошку. | [EPA AP-42 11.7 — Ceramic Products Manufacturing](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) · 11.7.2.4 |
| processes/brick-extrusion · description | Экструзия применяется для конструкционных глиняных изделий. | [EPA AP-42 11.7 — Ceramic Products Manufacturing](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) · 11.7.2.4 |
| materials/ceramic-glaze · detail | Глазурь образует покрытие керамики; сырьё и режим созревания зависят от состава. | [EPA AP-42 11.7 — Ceramic Products Manufacturing](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) · 11.7.2.8 |
| materials/kaolin-industrial · detail | Каолин относится к коммерческому глинистому сырью для производства керамики. | [EPA AP-42 11.7 — Ceramic Products Manufacturing](https://www.epa.gov/system/files/documents/2025-06/c11s07_2025_final.pdf) · 11.7.1; 11.7.2.1 |
| materials/glass-raw · detail | Шихта для натриево-кальциевого стекла включает несколько компонентов. | [EPA AP-42 11.15 — Glass Manufacturing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf) · 11.15.1 |
| materials/glass-cullet · detail | Стеклобой возвращают в шихту стекловарения. | [EPA AP-42 11.15 — Glass Manufacturing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf) · 11.15.1 |
| materials/soda-ash · detail | Кальцинированная сода используется как компонент стекольной шихты. | [EPA AP-42 11.15 — Glass Manufacturing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf) · 11.15.1 |
| processes/glass-melting · description | Подготовленная стекольная шихта расплавляется в печи. | [EPA AP-42 11.15 — Glass Manufacturing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf) · 11.15.1 |
| processes/glass-annealing · description | Отжиг применяется для снятия нежелательных напряжений в стекле. | [EPA AP-42 11.15 — Glass Manufacturing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s15.pdf) · 11.15.1 |
| processes/ore-crushing · description | Дробление уменьшает крупность руды. | [EPA AP-42 11.24 — Metallic Minerals Processing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s24.pdf) · 11.24.1 |
| processes/ore-grinding · description | Измельчение уменьшает крупность руды, в том числе в шаровых и стержневых мельницах. | [EPA AP-42 11.24 — Metallic Minerals Processing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s24.pdf) · 11.24.1 |
| processes/magnetic-separation-ore · description | Магнитные методы применяются при обогащении части железистых и титансодержащих минералов. | [EPA AP-42 11.24 — Metallic Minerals Processing](https://www.epa.gov/sites/default/files/2020-10/documents/c11s24.pdf) · 11.24.1 |
| processes/weaving · description | Ткань формируется переплетением основы и утка. | [CottonWorks — Weaving Basics](https://cottonworks.com/learning-hub/weaving/weaving-basics/) · What is Weaving? |
| processes/warping · description | Снование объединяет нити в параллельную систему основы. | [CottonWorks — Weaving Basics](https://cottonworks.com/learning-hub/weaving/weaving-basics/) · Direct Warping; Indirect Warping |
| processes/warp-sizing · description | Шлихтование входит в подготовку основы к ткачеству. | [CottonWorks — Weaving Basics](https://cottonworks.com/learning-hub/weaving/weaving-basics/) · Warp Preparation |
| materials/warp-yarn · detail | Нити основы проходят вдоль ткани и испытывают натяжение и истирание при ткачестве. | [CottonWorks — Weaving Basics](https://cottonworks.com/learning-hub/weaving/weaving-basics/) · Components of a Woven Fabric Structure |
| processes/knitting · description | Трикотаж образуется системой взаимосвязанных петель. | [CottonWorks — Knit Basics](https://cottonworks.com/learning-hub/knitting/knit-basics/) · Loops; stitches |
| materials/knitted-fabric · detail | Структура и длина петли влияют на свойства трикотажного полотна. | [CottonWorks — Knit Basics](https://cottonworks.com/learning-hub/knitting/knit-basics/) · Stitch Length |
| processes/spinning · description | При прядении подготовленные хлопковые волокна формируются в пряжу с круткой. | [CottonWorks — Yarn Spinning](https://cottonworks.com/learning-hub/yarn-manufacturing/yarn-spinning/) · Yarn Spinning; Yarn Twist |
| materials/cotton-yarn · detail | Разные способы прядения дают различную структуру и прочность хлопковой пряжи. | [CottonWorks — Yarn Spinning](https://cottonworks.com/learning-hub/yarn-manufacturing/yarn-spinning/) · Yarn Spinning |
| processes/heat-setting-textiles · description | Термофиксация относится к термопластичным волокнам; чистый хлопок не термопластичен. | [Cotton Incorporated — Textile Dyeing](https://cottonworks.com/wp-content/uploads/2018/01/Dyeing_Booklet.pdf) · 2.7 Heat Setting |
| materials/ready-mix-concrete · detail | Бетонная смесь содержит цемент, заполнители и воду; возможны добавки. | [ACI — Definition of concrete, hydraulic cement, mortar, and grout](https://www.concrete.org/frequentlyaskedquestions.aspx?faqid=640) · Definition of concrete |
| materials/perlite-raw · detail | Перлит — вулканическое стекло; лёгкая пористая структура появляется при вспучивании. | [USGS — Perlite Statistics and Information](https://www.usgs.gov/centers/national-minerals-information-center/perlite-statistics-and-information) · Introductory mineral description |
| materials/adhesive · detail | Существуют однокомпонентные PUR-клеи, отверждаемые влагой. | [Henkel — Three reasons to use single-side PUR adhesives](https://next.henkel-adhesives.com/fr/en/articles/3-reasons-to-use-single-side-adhesives.html) · Advantages of PUR adhesives |
| processes/extrusion · description | Расплав непрерывно формуется через фильеру. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Extrusion, p.18 |
| processes/blow-molding · description | Полое изделие формуется раздувом пластиковой заготовки. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Blow Molding, p.19 |
| processes/rotomolding · description | Полимер нагревается и распределяется по внутренней поверхности вращающейся формы. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Rotational Molding, p.19 |
| processes/thermoforming · description | Нагретому листу придают форму давлением или вакуумом. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Thermoforming, pp.19–20 |
| processes/calendering · description | Тонкая непрерывная плёнка получается между валками. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Calendering, p.21 |
| processes/compounding · description | Добавки смешивают с полимером для изменения свойств. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Plastic additives, pp.15–17 |
| processes/polymer-foaming · description | Вспенивание формирует ячеистую структуру полимера. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Foamed Plastic, p.21 |
| processes/compression-molding-plastics · description | Материал формуется нагревом и сдавливанием в полости формы. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Compression and Transfer Molding, p.20 |
| processes/polymer-transfer-molding · description | Материал перемещается из отдельной камеры в закрытую форму. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · Compression and Transfer Molding, p.20 |
| processes/rubber-vulcanization · description | При вулканизации формируются поперечные связи полимерных цепей. | [EPA/310-R-05-003 — Profile of the Rubber and Plastics Industry, 2nd ed.](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30006HA1.TXT) · III.A.2 / Vulcanizing, p.26 |
| processes/food-drying · description | Сушка удаляет воду и снижает активность воды; хранение зависит также от упаковки. | [FAO — Technical manual on small-scale processing of fruits and vegetables](https://www.fao.org/4/x0209e/x0209e06.htm) · Drying |
| processes/fermentation · description | Пищевая ферментация включает преобразование субстратов микроорганизмами, например образование молочной кислоты. | [FAO — Technical manual on small-scale processing of fruits and vegetables](https://www.fao.org/4/x0209e/x0209e06.htm) · Fermentation and acidification |
| processes/freezing-food · description | Замораживание снижает температуру пищевого продукта с изменением его физического состояния. | [FAO — Freezing of fruits and vegetables, Chapter 1](https://www.fao.org/4/y5979e/y5979e03.htm) · Introduction; 1.2 |
| processes/deaeration-water · description | Деаэратор удаляет растворённые газы из питательной воды котла. | [DOE — Deaerators in Industrial Steam Systems, Tip Sheet 18](https://www.energy.gov/sites/prod/files/2014/05/f16/steam18_steam_systems.pdf) · How They Work |
| processes/steam-trap-monitoring · description | Конденсатоотводчики проверяют на исправность и утечку рабочего пара. | [DOE — Inspect and Repair Steam Traps, Tip Sheet 1](https://www.energy.gov/sites/prod/files/2014/05/f16/steam1_traps.pdf) · Suggested Actions |
| processes/condensate-return · description | Конденсат возвращают в котёл для повторного использования воды и теплоты. | [DOE — Return Condensate to the Boiler, Tip Sheet 8](https://www.energy.gov/sites/prod/files/2014/05/f16/steam8_boiler.pdf) · Return Condensate to the Boiler |
| processes/economizer-heat-recovery · description | Экономайзер передаёт теплоту дымовых газов поступающей питательной воде. | [DOE — Use Feedwater Economizers for Waste Heat Recovery, Tip Sheet 3](https://www.energy.gov/sites/prod/files/2014/05/f16/steam3_recovery.pdf) · Opening paragraph |
| processes/turning · description | При точении вращается заготовка, а резание выполняет однолезвийный инструмент. | [Sandvik Coromant — General turning](https://www.sandvik.coromant.com/en-us/knowledge/general-turning) · What is turning? |
| processes/reaming · description | Развёртывание — чистовая обработка отверстия многолезвийным инструментом. | [Sandvik Coromant — Reaming](https://www.sandvik.coromant.com/en-us/knowledge/reaming) · What is reaming? |
| processes/boring · description | Растачивание увеличивает или улучшает уже существующее отверстие. | [Sandvik Coromant — Boring holes](https://www.sandvik.coromant.com/en-us/knowledge/boring) · Boring holes |
| processes/brazing · description | Высокотемпературная пайка использует припой выше 450 °C без плавления основы. | [TWI — Difference Between Welding, Brazing and Soldering](https://www.twi-global.com/technical-knowledge/faqs/welding-brazing-and-soldering) · Soldering; Brazing |
| processes/soft-soldering · description | Низкотемпературная пайка использует припой ниже 450 °C без плавления основы. | [TWI — Difference Between Welding, Brazing and Soldering](https://www.twi-global.com/technical-knowledge/faqs/welding-brazing-and-soldering) · Soldering; Brazing |
| processes/electron-beam-welding · description | Электронно-лучевая сварка плавит материал сфокусированным потоком ускоренных электронов. | [TWI — In-Chamber Electron Beam Welding](https://www.twi-global.com/what-we-do/research-and-technology/technologies/welding-joining-and-cutting/electron-beam-technology/in-chamber-electron-beam-welding) · Main process description |
| materials/birch-plywood · detail | Фанера — слоистая панель преимущественно из шпона; это определение класса, не паспорт берёзовой фанеры. | [USDA FPL-GTR-282 — Chapter 11: Wood-Based Composite Materials](https://research.fs.usda.gov/download/treesearch/62258.pdf) · Plywood, p.11–6 |
| materials/osb-board · detail | OSB получают из ориентированных древесных элементов со связующим. | [USDA FPL-GTR-282 — Chapter 11: Wood-Based Composite Materials](https://research.fs.usda.gov/download/treesearch/62258.pdf) · Oriented Strandboard, p.11–10 |
| materials/particleboard · detail | ДСП получают соединением древесных частиц клеем и прессованием. | [USDA FPL-GTR-282 — Chapter 11: Wood-Based Composite Materials](https://research.fs.usda.gov/download/treesearch/62258.pdf) · Particleboard, p.11–11 |
| materials/mdf · detail | MDF относится к древесноволокнистым плитам; плотность и связующее влияют на свойства. | [USDA FPL-GTR-282 — Chapter 11: Wood-Based Composite Materials](https://research.fs.usda.gov/download/treesearch/62258.pdf) · Fiberboard, p.11–13 |
| materials/glulam · detail | Клеёная древесина glulam состоит из склеенных слоёв с параллельным направлением волокон. | [USDA FPL-GTR-282 — Chapter 11: Wood-Based Composite Materials](https://research.fs.usda.gov/download/treesearch/62258.pdf) · Glued Laminated Timber, p.11–18 |
| materials/clt · detail | В CLT соседние слои древесины располагаются с взаимно перпендикулярным направлением волокон. | [USDA FPL-GTR-282 — Chapter 11: Wood-Based Composite Materials](https://research.fs.usda.gov/download/treesearch/62258.pdf) · Glued Laminated Timber, p.11–18 |
| materials/timber · detail | Изменение влажности влияет на свойства древесины; конкретный сорт и порода отдельно не аттестованы. | [USDA FPL-GTR-282 — Chapter 4: Moisture Relations and Physical Properties of Wood](https://research.fs.usda.gov/download/treesearch/62243.pdf) · Introduction, p.4–1 |
| materials/spruce-lumber · detail | Изменение влажности влияет на свойства древесины; конкретный сорт и порода отдельно не аттестованы. | [USDA FPL-GTR-282 — Chapter 4: Moisture Relations and Physical Properties of Wood](https://research.fs.usda.gov/download/treesearch/62243.pdf) · Introduction, p.4–1 |
| materials/pine-lumber · detail | Изменение влажности влияет на свойства древесины; конкретный сорт и порода отдельно не аттестованы. | [USDA FPL-GTR-282 — Chapter 4: Moisture Relations and Physical Properties of Wood](https://research.fs.usda.gov/download/treesearch/62243.pdf) · Introduction, p.4–1 |
| processes/mercerization · description | Мерсеризация обрабатывает хлопок щёлочью под натяжением и изменяет структуру волокон. | [Cotton Incorporated — Textile Dyeing](https://cottonworks.com/wp-content/uploads/2018/01/Dyeing_Booklet.pdf) · 2.6 Mercerization, printed pp.16–17 |
| materials/steel-20 · family | Сталь 20 включена в ГОСТ 1050–2013 как нелегированная конструкционная сталь; условия поставки различаются. | [ГОСТ 1050–2013 — Металлопродукция из нелегированных конструкционных качественных и специальных сталей](https://mmk-metiz.ru/buyers/product/gost/gost1050-2013.pdf) · Раздел 4; таблица 1 |
| materials/steel-45 · family | Сталь 45 включена в ГОСТ 1050–2013 как нелегированная конструкционная сталь; условия поставки различаются. | [ГОСТ 1050–2013 — Металлопродукция из нелегированных конструкционных качественных и специальных сталей](https://mmk-metiz.ru/buyers/product/gost/gost1050-2013.pdf) · Раздел 4; таблица 1 |
| processes/flocculation-water · description | Мягкое перемешивание способствует образованию крупных хлопьев. | [CDC — How Water Treatment Works](https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html) · Flocculation |
| processes/sedimentation-water · description | Более тяжёлые хлопья оседают под действием тяжести. | [CDC — How Water Treatment Works](https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html) · Sedimentation |
| processes/granular-filtration · description | Воду пропускают через фильтры, в том числе песчаные и гравийные. | [CDC — How Water Treatment Works](https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html) · Filtration |
| processes/ultrafiltration-water · description | Ультрафильтрация использует мелкопористый барьер, пропускающий воду и малые растворённые компоненты. | [CDC — How Water Treatment Works](https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html) · Filtration |
| processes/coagulation-water · description | Коагулянт помогает удалить мелкие взвешенные частицы; эффект зависит от химии воды, дозы и pH. | [Drinking Water Inspectorate — Physical removal of contaminants](https://www.dwi.gov.uk/private-water-supplies/pws-installations/treatment-guide-2/physical-removal-of-contaminants/) · Coagulation and flocculation |
| materials/coagulant-iron · detail | Соли железа применяются как коагулянты; дозу и режим подбирают на испытаниях исходной воды. | [Drinking Water Inspectorate — Physical removal of contaminants](https://www.dwi.gov.uk/private-water-supplies/pws-installations/treatment-guide-2/physical-removal-of-contaminants/) · Coagulation and flocculation |
| materials/activated-alumina-adsorbent · detail | Активированный оксид алюминия используется как адсорбционная загрузка; ёмкость зависит от загрязнителя и химии воды. | [EPA — обзор технологий очистки воды — обзор; не технологическая инструкция](https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies) · Adsorptive Media |
| materials/ferric-oxide-media · detail | Гранулированный оксид железа применяется как сорбент; эффективность зависит от среды. | [EPA — обзор технологий очистки воды — обзор; не технологическая инструкция](https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies) · Adsorptive Media |
| processes/industrial-centrifugation · description | Центрифуги разделяют твёрдую и жидкие фазы центробежным воздействием при различии плотностей. | [Alfa Laval — How centrifugal separation works](https://www.alfalaval.com/products/separation/centrifugal-separators/separators/innovations/separator-innovator/how-separation-works/) · Different separation technologies |
| processes/industrial-evaporation · description | Выпаривание удаляет часть воды или другого растворителя и повышает концентрацию продукта. | [GEA — Evaporation Technology](https://www.gea.com/en/assets/170546/) · Introduction; Reference products |
| processes/food-evaporation · description | Выпаривание удаляет часть воды или другого растворителя и повышает концентрацию продукта. | [GEA — Evaporation Technology](https://www.gea.com/en/assets/170546/) · Introduction; Reference products |
| processes/crystallization · description | Пересыщение раствора вызывает образование и рост кристаллов; один из путей — испарение растворителя. | [GEA — meVap Crystallization](https://www.gea.com/en/products/evaporators-crystallizers/gea-mevap/gea-mevap-crystallization/) · How does the meVap Crystallization work? |
| processes/fluid-bed-pharma-drying · description | Воздух проходит через распределитель и высушивает материал до заданной остаточной влажности. | [GEA — Fluid Bed Processing of Pharmaceuticals](https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/) · Dryer |
| processes/wet-granulation-pharma · description | Распыление жидкости в псевдоожиженный порошок формирует гранулы. | [GEA — Fluid Bed Processing of Pharmaceuticals](https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/) · Top Spray Granulator |
| processes/tablet-coating · description | Псевдоожиженный слой применяется, в частности, для покрытия таблеток. | [GEA — Fluid Bed Processing of Pharmaceuticals](https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/) · FlexStream |
| processes/pharma-spray-drying · description | Распыление раствора или суспензии в тёплый воздух сопровождается сушкой продукта. | [GEA — Fluid Bed Processing of Pharmaceuticals](https://www.gea.com/en/products/dryers-particle-processing/fluid-beds/fluid-bed-processors/) · Spray Dryer Granulator |
| materials/stainless-ferritic · detail | Ферритные стали выделяются в самостоятельную группу нержавеющих сталей. | [worldstainless — Categories, grades and product forms](https://worldstainless.org/about-stainless/what-are-stainless-steels/categories-grades-and-product-forms/) · Ferritic |
| materials/stainless-martensitic · detail | Мартенситные нержавеющие стали проходят специальные термические обработки. | [worldstainless — Categories, grades and product forms](https://worldstainless.org/about-stainless/what-are-stainless-steels/categories-grades-and-product-forms/) · Martensitic |
| materials/stainless-duplex · detail | Дуплексные нержавеющие стали имеют аустенитно-ферритную микроструктуру. | [worldstainless — Categories, grades and product forms](https://worldstainless.org/about-stainless/what-are-stainless-steels/categories-grades-and-product-forms/) · Austenitic-Ferritic (Duplex) |
| materials/al-series-5xxx · detail | Магний — основной легирующий элемент серии 5xxx. | [The Aluminum Association — Standards / Aluminum Alloys](https://www.aluminum.org/standards) · 5xxx |
| materials/al-series-7xxx · detail | Цинк — основной легирующий элемент серии 7xxx; свойства зависят от состава и обработки. | [The Aluminum Association — Standards / Aluminum Alloys](https://www.aluminum.org/standards) · 7xxx; Hot and Cold |
| materials/cotton · detail | Длину, зрелость/тонину, прочность и засорённость хлопка измеряют для его производственного использования. | [USDA AMS — Cotton Classing Services](https://www.ams.usda.gov/services/grading/cotton-classing) · Instrument Testing |
| materials/woven-fabric · detail | Переплетение влияет на жёсткость, драпируемость и устойчивость ткани. | [CottonWorks — Basic Woven Fabric Designs](https://cottonworks.com/learning-hub/weaving/basic-woven-fabric-designs/) · Plain Weaves; Basket Weave; Satin Weaves |
| materials/cotton-denim · detail | Конструкция переплетения, размер пряжи и плотность ткани влияют на массу и свойства денима. | [CottonWorks — Denim Basics](https://cottonworks.com/learning-hub/denim/denim-basics/) · Denim Construction, Weaves, & Weights |
| materials/pe-hd · detail | HDPE — полиэтилен высокой плотности; разные типы и модификации PE имеют разные свойства. | [Ensinger — PE plastic / Polyethylene](https://www.ensingerplastics.com/en/thermoplastic-materials/pe-plastic) · Introduction; Manufactured PE products |
| materials/ldpe · detail | LDPE относится к разновидностям полиэтилена низкой плотности. | [Ensinger — PE plastic / Polyethylene](https://www.ensingerplastics.com/en/thermoplastic-materials/pe-plastic) · Introduction |
| materials/pa6 · detail | Полиамиды, включая PA6, поглощают воду; это меняет размеры и механические свойства. | [Ensinger — PA plastic / Polyamide](https://www.ensingerplastics.com/en/thermoplastic-materials/pa-polyamide) · Introduction / water absorption; PA 6 |
| materials/pom · detail | Гомополимер POM-H и сополимер POM-C отличаются строением и свойствами. | [Ensinger — POM plastic / Polyoxymethylene](https://www.ensingerplastics.com/en/thermoplastic-materials/pom-acetal) · Introduction / POM-H and POM-C |
| materials/abs · detail | ABS — терполимер акрилонитрила, бутадиена и стирола; соотношение компонентов меняет свойства. | [Ensinger — ABS](https://www.ensingerplastics.com/en/thermoplastic-materials/abs-plastic) · Introduction |
| materials/pbt · detail | PBT — полукристаллический термопластичный полиэфир; доступны стеклонаполненные модификации. | [Ensinger — PBT](https://www.ensingerplastics.com/en/thermoplastic-materials/pbt-material) · Introduction; Manufactured PBT products |
| materials/pc · detail | Поликарбонат — аморфный термопласт; армирование меняет свойства и прозрачность. | [Ensinger — PC](https://www.ensingerplastics.com/en/thermoplastic-materials/pc-polycarbonate) · Introduction; glass filled PC |
| materials/polymer-pet · detail | PET — полиэфир, выпускаемый в аморфном и полукристаллическом состояниях; упаковочное применение зависит от формы материала. | [Ensinger — PET](https://www.ensingerplastics.com/en/thermoplastic-materials/pet-polyester) · Introduction |
| materials/polymer-pp · detail | PP — полукристаллический термопласт группы полиолефинов; существует несколько модификаций продукта. | [Ensinger — PP](https://www.ensingerplastics.com/en/thermoplastic-materials/pp-plastic) · Introduction; Manufactured polypropylene products |
| materials/pps · detail | PPS — полукристаллический термопласт; выпускаются наполненные и другие специальные модификации. | [Ensinger — PPS](https://www.ensingerplastics.com/en/thermoplastic-materials/pps-plastic) · Introduction; Manufactured PPS products |
| materials/peek · detail | PEEK выпускается в различных модификациях, включая специально выделенные медицинские марки; свойства общей группы не заменяют документацию марки. | [Ensinger — PEEK](https://www.ensingerplastics.com/en/thermoplastic-materials/peek-plastic) · PEEK variants; Medical grade |
| materials/ptfe · detail | PTFE — фторполимер; наполнение стеклом, углеродом и другими добавками меняет механические свойства. | [Ensinger — PTFE](https://www.ensingerplastics.com/en/thermoplastic-materials/ptfe-material) · Introduction; PTFE stock shapes |
| materials/raw-milk · detail | Химический состав и микробиологическое качество сырого молока определяют его пригодность для переработки; необходим контроль в цепочке поставки. | [Tetra Pak Dairy Processing Handbook — Raw Milk Quality](https://dairyprocessinghandbook.tetrapak.com/de/node/2482) · Where can milk quality go wrong? |
| materials/milk-powder · detail | Стабильность сухого молока зависит от влажности, поглощения воды и упаковки; низкая влажность не гарантирует безопасность сама по себе. | [Tetra Pak Dairy Processing Handbook — Milk and Whey Powdered Ingredients](https://dairyprocessinghandbook.tetrapak.com/chapter/milk-and-whey-powdered-ingredients) · Storage and stability of dried foods |
| processes/spray-drying-food · description | Жидкость распыляют в мелкие капли, вода испаряется, порошок отделяется от сушильного воздуха. | [Tetra Pak Dairy Processing Handbook — Milk and Whey Powdered Ingredients](https://dairyprocessinghandbook.tetrapak.com/chapter/milk-and-whey-powdered-ingredients) · Spray drying; Principles of spray drying |
| materials/pharma-lactose · detail | Фармацевтический моногидрат лактозы выпускается с разным распределением частиц для подбора под лекарственную форму. | [DFE Pharma — Lactochem Crystals](https://dfepharma.com/excipients/lactochem-crystals/) · Product information |
| materials/pharma-mcc · detail | Для конкретной марки MCC Pharmacel 101 изготовитель задаёт идентификацию, физико-химические и микробиологические показатели; это не аттестация всех марок MCC. | [DFE Pharma — Pharmacel 101 Product Specification PD-0472](https://dfepharma.com/document/4762/cardid/4YBJ5OKLAREQVFWFTY) · Product description; Physical-Chemical data; Microbiological data |
| materials/pharma-starch · detail | Крахмальные вспомогательные вещества входят в группу наполнителей/связующих для твёрдых пероральных лекарственных форм. | [DFE Pharma — Inhalation Grade Lactose / company portfolio](https://dfepharma.com/media/2ianc2oo/dpi-corporate-brochure.pdf) · We are DFE Pharma, p.2 / portfolio |
| processes/cutting · description | Механическая обработка формирует геометрию удалением материала режущими кромками. | [Current State and Emerging Trends in Advanced Manufacturing: Process Technologies — полный авторский текст](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957755) · §2.1, стр.2–3 |
| processes/grinding · description | Шлифование относится к абразивному удалению материала; применяется для уточнения размеров и поверхности. | [Current State and Emerging Trends in Advanced Manufacturing: Process Technologies — полный авторский текст](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957755) · §2.1.3, стр.8 |
| processes/stamping · description | Формоизменяющая часть штамповки относится к деформированию листа давлением. Разделительные операции этим разделом не подтверждены. | [Current State and Emerging Trends in Advanced Manufacturing: Process Technologies — полный авторский текст](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957755) · §2.2.2, стр.11 |
| processes/friction-stir-welding · description | FSW соединяет материал в твёрдом состоянии вращающимся неплавящимся инструментом, перемещаемым по стыку. | [Friction Stir Welding Services](https://www.twi-global.com/what-we-do/research-and-technology/technologies/welding-joining-and-cutting/friction-welding/friction-stir-welding) · Основной текст перед Benefits |
| processes/diffusion-bonding · description | Диффузионное соединение обеспечивается контактом поверхностей, повышенной температурой и давлением без плавления основного материала. | [Diffusion Bonding](https://www.twi-global.com/what-we-do/services-and-support/diffusion-bonding) · What is Diffusion Bonding; Bonding Environment and Preparation |
| processes/submerged-arc · description | Дуга между подаваемым электродом и изделием скрыта слоем флюса, обеспечивающим защиту зоны сварки. | [What is Submerged-arc Welding?](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-submerged-arc-welding) · Первый и второй абзацы |
| processes/flash-butt-welding · description | При стыковой сварке оплавлением торцы нагреваются током с оплавлением контактов; затем усилием осадки формируют соединение. | [What is Flash (Butt) Welding?](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-flash-butt-welding) · Описание нагрева и заключительной осадки |
| processes/plasma-arc-welding · description | Плазменная сварка использует дугу, сжатую узким медным соплом, и плазмообразующий газ. | [What is Plasma Welding?](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-plasma-welding) · Первый абзац |
| processes/laser-welding · description | Лазерный пучок служит концентрированным источником тепла для формирования сварного соединения. | [What is Laser Welding and How Does it Work?](https://www.twi-global.com/technical-knowledge/faqs/faq-how-does-laser-welding-work) · Первый абзац и описание двух режимов |
| processes/resistance-seam · description | Шовная контактная сварка формирует последовательность перекрывающихся ядер с помощью вращающихся роликовых электродов. | [What is resistance seam welding?](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-resistance-seam-welding) · Первый и второй абзацы |
| processes/laser-plastic-welding · description | При просвечивающей лазерной сварке пластмасс верхний материал пропускает излучение, нижний поглощает; локальный нагрев образует соединение. | [What is laser melting?](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-laser-melting) · Абзац о transmission laser welding |
| processes/manual-metal-arc · description | Ручная дуговая сварка использует покрытый металлический электрод; стержень расходуется при плавлении. | [Manual Metal Arc Welding (MMA, SMAW or Stick Welding)](https://www.twi-global.com/technical-knowledge/job-knowledge/the-manual-metal-arc-process-mma-welding-002) · Вводное определение Job Knowledge 2 |
| processes/ultrasonic-plastic-welding · description | Ультразвуковые механические колебания размягчают или плавят термопласт в зоне стыка деталей, удерживаемых под давлением. | [Ultrasonic welding of injection moulded components](https://www.twi-global.com/technical-knowledge/job-knowledge/ultrasonic-welding-of-injection-moulded-components-part-1-process-and-equipment-061) · Process overview |
| processes/resistance-spot · description | Точечная контактная сварка соединяет нахлёсточные листы пропусканием тока при приложенном усилии между электродами. | [What is resistance seam welding?](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-resistance-seam-welding) · Первый абзац: механизм spot welding |
| processes/hand-layup · description | При ручной выкладке армирующие слои помещают в форму и пропитывают смолой кистью или валиком. | [Methods of Composite Manufacture](https://compositesuk.co.uk/composite-materials/processes/) · Wet Lay-Up |
| processes/vacuum-infusion · description | Сухие слои под герметичным вакуумным пакетом пропитываются смолой из резервуара при перепаде давлений. | [Methods of Composite Manufacture](https://compositesuk.co.uk/composite-materials/processes/) · Vacuum Infusion |
| processes/resin-transfer-molding · description | При RTM жидкую смолу подают в закрытую форму с сухим армированием. | [Methods of Composite Manufacture](https://compositesuk.co.uk/composite-materials/processes/) · Resin Transfer Moulding |
| processes/autoclave-composites · description | Автоклавное отверждение препрега сочетает нагрев и давление; конкретный цикл зависит от системы. | [Methods of Composite Manufacture](https://compositesuk.co.uk/composite-materials/processes/) · Prepreg — Autoclave |
| processes/carding · description | Кардочесание разделяет и ориентирует хлопковые волокна; формирует ленту. | [Fiber Preparation for Spinning](https://cottonworks.com/learning-hub/yarn-manufacturing/fiber-preparation-for-spinning/) · Fiber Carding |
| processes/drawing-textile · description | Вытяжные пары с различными скоростями утоняют и выравнивают объединённые волокнистые ленты. | [Fiber Preparation for Spinning](https://cottonworks.com/learning-hub/yarn-manufacturing/fiber-preparation-for-spinning/) · Drawing |
| processes/combing-textile · description | Гребнечесание удаляет короткие волокна и дополнительно упорядочивает волокнистую массу. | [Fiber Preparation for Spinning](https://cottonworks.com/learning-hub/yarn-manufacturing/fiber-preparation-for-spinning/) · Combing |
| processes/offset-lithography · description | Офсет переносит изображение с формы через промежуточное резиновое полотно на подложку. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Offset Lithography |
| processes/flexography · description | Флексография переносит краску выступающими участками эластичной пластиковой или резиновой формы. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Flexography |
| processes/gravure-printing · description | Глубокая печать переносит краску из углублённых ячеек цилиндра. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Publication Rotogravure and Product Rotogravure |
| processes/screen-printing · description | Трафаретная печать переносит краску через открытые участки сетки; закрытые участки блокирует трафарет. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Screen Printing |
| processes/print-binding · description | Послепечатная обработка включает скрепление листов, в том числе шитьё и клеевое скрепление. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Post-Press Operations |
| materials/flexo-plate · detail | Флексографская форма имеет выступающие печатающие участки и выполняется из эластичного пластика или резины. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Flexography |
| materials/offset-blanket · detail | Офсетное полотно с резиновой поверхностью передаёт изображение с формы на подложку. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Offset Lithography |
| processes/wood-preservation · description | Защитный состав вводят в древесину; эффективность зависит от его удержания, проникновения и породы. Универсальная глубина этим не установлена. | [Wood Handbook 2021 — Chapter 15: Wood Preservatives](https://research.fs.usda.gov/treesearch/download/62259.pdf) · Введение, стр.15–1 |
| processes/aseptic-filling · description | Продукт, тара и укупорка стерилизуются раздельно и объединяются асептически в контролируемой среде. Это не терминальная стерилизация. | [Sterile Drug Products Produced by Aseptic Processing — CGMP](https://www.fda.gov/media/71026/download) · II.B Technical Framework, стр.2–3 |
| processes/pultrusion · description | При пултрузии волокна проходят пропитку и протягиваются через нагретую формующую фильеру с отверждением смолы. | [Methods of Composite Manufacture](https://compositesuk.co.uk/composite-materials/processes/) · Continuous Processes — Pultrusion |
| processes/filament-winding · description | При намотке армирующие нити укладываются на вращающуюся оправку с заданной ориентацией. | [Methods of Composite Manufacture](https://compositesuk.co.uk/composite-materials/processes/) · Filament Winding |
| processes/textile-printing · description | Нанесение рисунка на текстиль возможно через сетчатый трафарет. Источник подтверждает этот вариант, а не все методы печати. | [Monitoring Information By Industry — Printing and Publishing](https://www.epa.gov/air-emissions-monitoring-knowledge-base/monitoring-information-industry-printing-and-publishing) · Screen Printing |
| processes/laser-cutting · description | Лазерная резка локально воздействует сфокусированным пучком; при резке плавлением расплав удаляется газовой струёй. | [What is laser melting?](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-laser-melting) · Последние абзацы о laser cutting |
| processes/sludge-dewatering · description | Обезвоживание осадка отделяет жидкость от твёрдой фазы; центрифугирование является одним из способов получения кека. | [Fact Sheet: Centrifuge Thickening and Dewatering](https://www.epa.gov/biosolids/fact-sheet-centrifuge-thickening-and-dewatering) · Первый абзац |
| processes/ozonation-water · steps | Озонирование использует окислительную способность озона в воде; остаточный озон в отходящем газе подлежит разрушению. | [Wastewater Technology Fact Sheet: Ozone Disinfection EPA 832-F-99-063](https://www.epa.gov/sites/default/files/2015-06/documents/ozon.pdf) · Description, стр.1–3 |
| processes/blanching-food · description | Бланширование — предварительная тепловая обработка с последующим охлаждением; одна из целей — инактивация ферментов. | [FAO — технология переработки фруктов и овощей](https://www.fao.org/4/x0209e/x0209e06.htm) · Blanching |
| processes/thermal-sterilization-food · description | Термическая обработка применяется для микробиологической стабилизации продукта; защита от повторного загрязнения зависит от упаковки. Режимы не подтверждены. | [FAO — технология переработки фруктов и овощей](https://www.fao.org/4/x0209e/x0209e06.htm) · High-Temperature Preservation; Commercial sterilization |
| processes/milling · description | При фрезеровании режущие кромки периодически входят в заготовку и выходят из неё, снимая материал. | [Cutter path and chip formation in milling](https://www.sandvik.coromant.com/en-gb/knowledge/milling/cutter-path-and-chip-formation) · Введение и три фазы контакта кромки |
| processes/drilling · checks | Диаметр является одним из основных контролируемых требований к отверстию. Увод, положение оси и заусенцы этим абзацем не проверены. | [Drilling a hole](https://www.sandvik.coromant.com/en-gb/knowledge/drilling) · Initial considerations — The hole |
| processes/gear-cutting · checks | При контроле зубчатых колёс оценивают точность профиля, отклонение шага и биение; допуски определяет спецификация. | [Gear manufacturing](https://www.sandvik.coromant.com/en-gb/knowledge/milling/gear-manufacturing) · Gear Quality and Process Capability |
| materials/brass-alloys · detail | Латунь относится к медно-цинковым сплавам; конкретные механические свойства этим не подтверждены. | [About Copper](https://internationalcopper.org/sustainable-copper/about-copper/) · Copper Facts — пункт о сплавах |
| materials/bronze-alloys · detail | Бронзы — семейство медных сплавов с различными легирующими компонентами, включая Sn, Al, Si и Be; состав каждой марки проверяют отдельно. | [About Copper](https://internationalcopper.org/sustainable-copper/about-copper/) · Copper Facts — пункт о сплавах |
| materials/ps · detail | Полистирол GPPS перерабатывается литьём под давлением и экструзией; свойства GPPS не перенесены на все типы PS. | [Polystyrene — the crystal clear polymer](https://chemicals.basf.com/global/en/Petrochemicals/Styrenics-Europe/Polystyrol) · Введение и Portfolio |
| materials/eps · uses | Материалы на основе вспениваемого полистирола применяются для теплоизоляции и защитной упаковки. Плотность, пожарный класс и допуск изделия не подтверждены. | [Styropor — The Classic](https://chemicals.basf.com/global/en/Petrochemicals/Styrenics-Europe/EPS-by-BASF/verpacken-und-schuetzen) · Вводный абзац и Benefits |
| materials/pmma · detail | PMMA является термопластичным материалом; PLEXIGLAS выпускают, в частности, листами, трубами и стержнями. Это не подтверждает стойкость всех марок. | [PLEXIGLAS GS/XT](https://www.plexiglas.de/en/products/plexiglas/plexiglas-gs-xt) · Описание материала и форм поставки |

## Карточки без подтверждённого тезиса в исходной очереди

Эти карточки остаются открытыми из-за неполного объёма выполненной предметной экспертизы. Для части выбранных документов были ошибки доступа; оснований считать недоступными все возможные источники нет. Это не список ошибочных карточек.

| Тип | ID | Название |
|---|---|---|
| materials | 09g2s | 09Г2С |
| materials | alumina | Оксидная керамика Al₂O₃ |
| materials | alumina-ceramic | Техническая корундовая керамика |
| materials | aramid | Арамидная ткань |
| materials | asphalt-binder | Битум дорожный |
| materials | asphalt-mix | Асфальтобетонная смесь |
| materials | basalt-fiber | Базальтовое армирующее волокно |
| materials | bauxite-ore | Боксит |
| materials | bentonite-clay | Бентонитовая глина |
| materials | building-aggregate | Заполнители для бетона |
| materials | carbon-fiber-laminate | Углепластик (CFRP) |
| materials | carbon-fiber-preform | Углеродное армирующее волокно |
| materials | cast-iron-ductile | Чугун с шаровидным графитом |
| materials | cast-iron-gray | Серый чугун |
| materials | composite-epoxy-resin | Эпоксидная связующая система |
| materials | composite-honeycomb | Сотовый заполнитель |
| materials | conformal-coating-material | Лак для защитного покрытия плат |
| materials | copper-electric-wire | Медный провод электротехнический |
| materials | copper-m1 | Медь М1 |
| materials | copper-ore | Медные руды |
| materials | crushed-stone | Щебень строительный |
| materials | diatomite-raw | Диатомит промышленный |
| materials | electrical-steel | Электротехническая листовая сталь |
| materials | electronic-encapsulant | Компаунд для заливки электронных узлов |
| materials | energy-copper | Медные полуфабрикаты для теплообменников |
| materials | epdm | Этиленпропилендиеновый каучук (EPDM) |
| materials | eva-polymer | Этиленвинилацетат (EVA) |
| materials | fireclay-raw | Огнеупорная глина |
| materials | flax-fiber | Льняное волокно |
| materials | flocculant-polyelectrolyte | Флокулянт-полиэлектролит |
| materials | fluorite-ore | Плавиковый шпат (флюорит) |
| materials | food-pack | Пищевые упаковочные материалы |
| materials | fruit-juice-base | Плодово-ягодные соки как сырьё |
| materials | fruit-puree | Плодовоягодные пюре |
| materials | geotextile | Геотекстиль |
| materials | gfrp | Стеклопластик (GFRP) |
| materials | grain-wheat | Пшеница продовольственная |
| materials | graphite-concentrate | Природный графитовый концентрат |
| materials | graphite-electrode | Графитовые электроды промышленного назначения |
| materials | heat-exchanger-steel | Коррозионностойкий прокат для теплообменников |
| materials | industrial-salt | Соль техническая |
| materials | industrial-silica | Кварцевый песок технический |
| materials | industrial-sulfur | Сера промышленная |
| materials | industrial-zeolite | Цеолиты технические |
| materials | iron-ore | Железная руда |
| materials | lime-stone | Известняк промышленный |
| materials | lime-technical | Известь техническая |
| materials | lithium-concentrate | Литиевый минеральный концентрат |
| materials | lldpe | Линейный полиэтилен низкой плотности (LLDPE) |
| materials | magnesium-alloys | Магниевые конструкционные сплавы |
| materials | manganese-ore | Марганцевые руды |
| materials | meat-raw | Мясное сырьё |
| materials | mining-quartz | Кварцевое сырьё высокой чистоты |
| materials | nickel-alloys | Никелевые сплавы |
| materials | nickel-ore | Никелевые руды |
| materials | nonwoven-fabric | Нетканое полотно |
| materials | pcb-copper-foil | Медная фольга для печатных плат |
| materials | pcb-laminate | Ламинат для жёстких печатных плат |
| materials | pcb-prepreg | Препрег для печатных плат |
| materials | pharma-gelatin | Желатин для капсул |
| materials | pharma-hpmc | Гипромеллоза (HPMC) фармацевтическая |
| materials | pharma-povidone | Повидон (PVP) фармацевтический |
| materials | phosphate-rock | Фосфатное сырьё |
| materials | polyamide-textile-yarn | Полиамидная техническая нить |
| materials | polyester-fiber | Полиэфирное текстильное волокно |
| materials | polymer-pvc | Поливинилхлорид (PVC) |
| materials | potash-raw | Калийное минеральное сырьё |
| materials | prepreg-composite | Препрег для композитов |
| materials | printing-film-substrate | Полимерная плёнка для печати |
| materials | printing-inks | Полиграфические краски |
| materials | printing-paper | Печатная бумага и картон |
| materials | rare-earth-concentrate | Концентрат редкоземельного сырья |
| materials | rebar-steel | Арматурный стальной прокат |
| materials | sand-building | Песок строительный |
| materials | sbr | Бутадиенстирольный каучук (SBR) |
| materials | screen-print-mesh | Сетка для трафаретной печати |
| materials | sewing-thread | Швейные нитки |
| materials | silica-refractory | Кремнезёмистый огнеупор |
| materials | solder | Материалы для пайки электронных узлов |
| materials | solder-flux | Флюс для электронного монтажа |
| materials | solder-paste | Паяльная паста |
| materials | steel-scrap | Стальной лом |
| materials | sugar-crystal | Сахар-песок |
| materials | talc-industrial | Тальк промышленный |
| materials | technical-dye | Текстильный краситель |
| materials | technical-felt | Технический войлок |
| materials | thermal-insulation-wool | Минеральная теплоизоляционная вата |
| materials | titanium-industrial | Титан и титановые сплавы |
| materials | tpu | Термопластичный полиуретан (TPU) |
| materials | uf-membrane | Мембрана для ультрафильтрации |
| materials | uv-curing-ink | УФ-отверждаемая печатная краска |
| materials | vegetable-oils | Растительные пищевые масла |
| materials | viscose-fiber | Вискозное волокно |
| materials | wheat-flour | Пшеничная мука |
| materials | wood-impregnant | Древесные защитные составы |
| materials | wood-veneer | Лущёный шпон |
| materials | wool-fiber | Шерстяное волокно |
| materials | yeast-food | Пищевые дрожжи |
| materials | zinc-concentrate | Цинковый минеральный концентрат |
| materials | zinc-diecast | Цинковые литейные сплавы |
| processes | aoi-pcb | Автоматизированная оптическая инспекция плат |
| processes | asphalt-mix-production | Производство асфальтобетонной смеси |
| processes | blown-film-extrusion | Экструзия рукавной плёнки |
| processes | broaching | Протягивание |
| processes | capsule-filling | Наполнение капсул |
| processes | catalytic-reaction | Каталитическая реакция в промышленном реакторе |
| processes | chemical-membrane | Мембранное разделение промышленных смесей |
| processes | concrete-curing | Уход за твердеющим бетоном |
| processes | concrete-mixing | Приготовление бетонной смеси |
| processes | concrete-placing | Укладка бетонной смеси |
| processes | concrete-vibration | Виброуплотнение бетона |
| processes | conformal-coating | Защитное покрытие электронных сборок |
| processes | distillation | Дистилляция |
| processes | dry-granulation-pharma | Сухая грануляция фармацевтических порошков |
| processes | electrodischarge-machining | Электроэрозионная обработка |
| processes | extrusion-coating | Экструзионное покрытие полимером |
| processes | fiberboard-pressing | Прессование древесных плит |
| processes | food-extrusion | Экструзионная обработка пищевых смесей |
| processes | formwork-erection | Монтаж опалубки |
| processes | gas-absorption | Абсорбция газовых компонентов |
| processes | gas-stripping | Стриппинг растворённых компонентов |
| processes | geotechnical-grouting | Инъекционное закрепление грунта |
| processes | grain-milling | Помол зерна |
| processes | gravity-concentration | Гравитационное обогащение |
| processes | industrial-embroidery | Машинная вышивка |
| processes | industrial-heat-exchange | Промышленный теплообмен |
| processes | industrial-induction-heating | Индукционный нагрев в производстве |
| processes | juice-clarification | Осветление соков |
| processes | masonry-works | Каменная кладка |
| processes | needle-punching-nonwovens | Иглопробивное производство нетканых материалов |
| processes | ore-flotation | Флотационное обогащение |
| processes | ore-leaching | Выщелачивание руды |
| processes | ore-screening | Грохочение руды |
| processes | pcb-drilling | Сверление отверстий печатных плат |
| processes | pcb-etching | Травление печатных проводников |
| processes | pcb-plating | Металлизация отверстий печатных плат |
| processes | pcb-xray-inspection | Рентгеновский контроль электронных сборок |
| processes | pharma-inprocess-control | Внутрипроизводственный контроль таблеток |
| processes | pharma-micronization | Микронизация фармацевтических веществ |
| processes | pharma-powder-blending | Смешение фармацевтических порошков |
| processes | pharma-sieving | Фармацевтическое просеивание |
| processes | plywood-bonding | Склеивание фанеры |
| processes | print-die-cutting | Высечка печатной продукции |
| processes | printing-plate-making | Изготовление печатных форм |
| processes | rebar-installation | Монтаж арматуры |
| processes | reflow-soldering | Пайка оплавлением |
| processes | road-asphalt-placement | Укладка асфальтобетона |
| processes | rolling | Прокатка |
| processes | selective-soldering | Селективная пайка узлов плат |
| processes | sewing | Швейная сборка изделий |
| processes | smt-placement | Автоматическая установка SMD-компонентов |
| processes | solder-paste-printing | Трафаретное нанесение паяльной пасты |
| processes | solvent-extraction | Экстракция растворителем |
| processes | steam-generation | Генерация технологического пара |
| processes | stretch-blow-molding | Инжекционно-выдувное формование с вытяжкой |
| processes | stud-welding | Приварка шпилек |
| processes | tablet-compression | Таблетирование |
| processes | textile-bleaching | Отбеливание текстиля |
| processes | textile-calendering | Каландрование тканей |
| processes | uv-curing-print | УФ-отверждение печатных покрытий |
| processes | veneer-peeling | Лущение шпона |
| processes | waterjet-cutting | Гидроабразивная резка |
| processes | wave-soldering | Пайка волной припоя |
| processes | winding-yarn | Перемотка пряжи |
| processes | wood-planing | Строгание пиломатериалов |

## Проверяемые файлы

- `audit/claim-review-baseline-2026-10-25.json` — неизменяемый исходный состав 342 ID.
- `audit/individual-claim-review-2026-10-25.json` — источники, разделы, тезисы, SHA-256, исправления и остаток.
- `audit/card-verification-matrix-2026-10-25.json` — автоматическая поимённая инвентаризация всех 342 карточек и открытых полей.
- `knowledge/source-registry.json` — рабочие связи доказательств.

**Критерий полного завершения не достигнут.** Для закрытия требуется продолжить предметное подтверждение оставшихся утверждений, а не массово менять статусы.
