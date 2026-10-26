# Поимённый аудит процессов и материалов — 22.10.2026

> Это автоматизированная индивидуальная проверка каждой карточки по базовой матрице. Научная экспертиза полной карточки НЕ подтверждена. Наличие источника и статус частного тезиса не означают проверки её технических свойств.

## Сводка

Всего: 382; процессы: 210; материалы: 172. Приоритеты P0: 0, P1: 133, P2: 249.

P0 — битый ID или обязательные поля; P1 — недостаточная доказательная база/спорная полнота; P2 — уточнения. P1 НЕ значит, что запись обязательно неверна.

## Замечания по типам

| Код | Количество | Описание |
|---|---:|---|
| E02 | 380 | Проверка отдельных тезисов не подтверждает всю карточку |
| T02 | 179 | Уточнить методы контроля и критерии дефектов |
| S07 | 130 | Общие источники (R05); они не подтверждают параметры конкретного процесса/марки |
| T03 | 108 | Описание поверхностное; нужны инженерные различия и ограничения |
| L02 | 74 | Нет конкретных материалов: не добавлять неподтверждённых связей |
| L03 | 7 | Нет достоверно связанного процесса; не подставлять неподходящий |
| E01 | 2 | Частный проверенный тезис в реестре отсутствует; нужна предметная проверка первоисточника |
| S04 | 1 | Зарегистрировано дополнительных ссылок, не показанных в карточке: 1 |

## Процессы — каждая карточка

| Карточка | Отрасль | Статус доказательств | Очередь | Проблемы |
|---|---|---|---|---|
| [Литьё (casting)](../processes.html#casting) | metals | частный тезис | P1 | S07, E02, L02 |
| [Дуговая сварка (welding)](../processes.html#welding) | metals | частный тезис | P2 | E02 |
| [Обработка резанием (cutting)](../processes.html#cutting) | general | частный тезис | P1 | S07, E02 |
| [Термическая обработка (heat)](../processes.html#heat) | metals | частный тезис | P1 | S07, E02 |
| [Аддитивное производство (additive)](../processes.html#additive) | general | частный тезис | P2 | E02 |
| [Неразрушающий контроль (inspection)](../processes.html#inspection) | general | частный тезис | P1 | S07, E02 |
| [MIG/MAG-сварка (mig-mag)](../processes.html#mig-mag) | metals | частный тезис | P2 | E02 |
| [TIG-сварка (tig)](../processes.html#tig) | metals | частный тезис | P2 | E02 |
| [Ультразвуковой контроль (ultrasonic)](../processes.html#ultrasonic) | general | частный тезис | P1 | S07, E02 |
| [Радиографический контроль (radiographic)](../processes.html#radiographic) | general | частный тезис | P1 | S07, E02 |
| [Капиллярный контроль (dye)](../processes.html#dye) | general | частный тезис | P1 | S07, E02 |
| [Измерение твёрдости (hardness)](../processes.html#hardness) | general | частный тезис | P2 | E02 |
| [Ковка и объёмная штамповка (forging)](../processes.html#forging) | metals | частный тезис | P1 | S07, E02 |
| [Прокатка (rolling)](../processes.html#rolling) | metals | частный тезис | P1 | S07, E02 |
| [Листовая штамповка (stamping)](../processes.html#stamping) | metals | частный тезис | P1 | S07, E02, T02 |
| [Литьё термопластов под давлением (injection-molding)](../processes.html#injection-molding) | polymers | частный тезис | P2 | E02 |
| [Экструзия полимеров (extrusion)](../processes.html#extrusion) | polymers | частный тезис | P1 | S07, E02 |
| [Шлифование (grinding)](../processes.html#grinding) | metals | частный тезис | P1 | S07, E02 |
| [Покрытия и обработка поверхности (surface-finishing)](../processes.html#surface-finishing) | general | частный тезис | P1 | S07, E02, L02 |
| [Механическая сборка (assembly)](../processes.html#assembly) | general | частный тезис | P1 | S07, E02, L02 |
| [Пастеризация (pasteurization)](../processes.html#pasteurization) | food | частный тезис | P1 | S07, E02, T02 |
| [Сушка пищевых продуктов (food-drying)](../processes.html#food-drying) | food | частный тезис | P1 | S07, E02, T02 |
| [Пищевая ферментация (fermentation)](../processes.html#fermentation) | food | частный тезис | P1 | S07, E02 |
| [Фасовка и упаковка пищевой продукции (food-packaging)](../processes.html#food-packaging) | food | частный тезис | P1 | S07, E02 |
| [Прядение (spinning)](../processes.html#spinning) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Ткачество (weaving)](../processes.html#weaving) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Вязальное производство (knitting)](../processes.html#knitting) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Крашение и отделка текстиля (textile-finishing)](../processes.html#textile-finishing) | textiles | частный тезис | P2 | E02 |
| [Швейная сборка изделий (sewing)](../processes.html#sewing) | textiles | частный тезис | P1 | S07, E02 |
| [Распиловка и обработка древесины (sawmilling)](../processes.html#sawmilling) | wood | частный тезис | P2 | E02, T02 |
| [Камерная сушка древесины (wood-drying)](../processes.html#wood-drying) | wood | частный тезис | P2 | E02, T02 |
| [Монтаж печатных плат (pcb-assembly)](../processes.html#pcb-assembly) | electronics | частный тезис | P1 | S07, E02 |
| [Контроль электронных сборок (electronic-inspection)](../processes.html#electronic-inspection) | electronics | частный тезис | P1 | S07, E02 |
| [Промышленное смешение (chemical-mixing)](../processes.html#chemical-mixing) | chemicals | частный тезис | P2 | E02, L02 |
| [Дистилляция (distillation)](../processes.html#distillation) | chemicals | частный тезис | P2 | E02, L02 |
| [Промышленная фильтрация (industrial-filtration)](../processes.html#industrial-filtration) | chemicals | частный тезис | P1 | S07, E02, L02 |
| [Точение (turning)](../processes.html#turning) | metals | частный тезис | P1 | S07, E02, T02 |
| [Фрезерование (milling)](../processes.html#milling) | metals | частный тезис | P1 | S07, E02, T02 |
| [Сверление (drilling)](../processes.html#drilling) | metals | частный тезис | P1 | S07, E02, T02 |
| [Растачивание (boring)](../processes.html#boring) | metals | частный тезис | P1 | S07, E02, T02 |
| [Развёртывание (reaming)](../processes.html#reaming) | metals | частный тезис | P1 | S07, E02, T02 |
| [Протягивание (broaching)](../processes.html#broaching) | metals | частный тезис | P1 | S07, E02, T02 |
| [Зубонарезание (gear-cutting)](../processes.html#gear-cutting) | metals | частный тезис | P1 | S07, E02, T02 |
| [Электроэрозионная обработка (electrodischarge-machining)](../processes.html#electrodischarge-machining) | metals | частный тезис | P1 | S07, E02, T02 |
| [Лазерная резка (laser-cutting)](../processes.html#laser-cutting) | metals | частный тезис | P1 | S07, E02, T02 |
| [Гидроабразивная резка (waterjet-cutting)](../processes.html#waterjet-cutting) | metals | частный тезис | P1 | S07, E02, T02 |
| [Отжиг (annealing)](../processes.html#annealing) | metals | частный тезис | P1 | S07, E02, T02 |
| [Закалка сталей (quenching)](../processes.html#quenching) | metals | частный тезис | P1 | S07, E02, T02 |
| [Отпуск стали (tempering)](../processes.html#tempering) | metals | частный тезис | P1 | S07, E02, T02 |
| [Индукционная поверхностная закалка (induction-hardening)](../processes.html#induction-hardening) | metals | частный тезис | P1 | S07, E02, T02 |
| [Ручная дуговая сварка покрытым электродом (manual-metal-arc)](../processes.html#manual-metal-arc) | metals | частный тезис | P2 | E02, T02 |
| [Сварка под флюсом (submerged-arc)](../processes.html#submerged-arc) | metals | частный тезис | P2 | E02, T02 |
| [Контактная точечная сварка (resistance-spot)](../processes.html#resistance-spot) | metals | частный тезис | P2 | E02, T02 |
| [Лазерная сварка (laser-welding)](../processes.html#laser-welding) | metals | частный тезис | P2 | E02, T02 |
| [Сварка трением с перемешиванием (friction-stir-welding)](../processes.html#friction-stir-welding) | metals | частный тезис | P2 | E02, T02 |
| [Высокотемпературная пайка (brazing)](../processes.html#brazing) | metals | частный тезис | P2 | E02, T02 |
| [Низкотемпературная пайка (soft-soldering)](../processes.html#soft-soldering) | metals | частный тезис | P2 | E02, T02 |
| [Сплавление порошкового слоя (powder-bed-fusion)](../processes.html#powder-bed-fusion) | general | частный тезис | P2 | E02, L02, T02 |
| [Направленное энергетическое осаждение (directed-energy-deposition)](../processes.html#directed-energy-deposition) | general | частный тезис | P2 | E02, L02, T02 |
| [Струйное нанесение связующего (binder-jetting)](../processes.html#binder-jetting) | general | частный тезис | P2 | E02, L02, T02 |
| [Струйное нанесение материала (material-jetting)](../processes.html#material-jetting) | general | частный тезис | P2 | E02, L02, T02 |
| [Ванночная фотополимеризация (vat-photopolymerization)](../processes.html#vat-photopolymerization) | general | частный тезис | P2 | E02, L02, T02 |
| [Аддитивная экструзия материала (additive-extrusion)](../processes.html#additive-extrusion) | general | частный тезис | P2 | E02, L02, T02 |
| [Выдувное формование (blow-molding)](../processes.html#blow-molding) | polymers | частный тезис | P2 | E02, T02 |
| [Ротационное формование (rotomolding)](../processes.html#rotomolding) | polymers | частный тезис | P2 | E02, T02 |
| [Термоформование листа (thermoforming)](../processes.html#thermoforming) | polymers | частный тезис | P2 | E02, T02 |
| [Каландрование пластмасс (calendering)](../processes.html#calendering) | polymers | частный тезис | P2 | E02, T02 |
| [Компаундирование полимеров (compounding)](../processes.html#compounding) | polymers | частный тезис | P2 | E02, T02 |
| [Вспенивание пластмасс (polymer-foaming)](../processes.html#polymer-foaming) | polymers | частный тезис | P2 | E02, T02 |
| [Ультразвуковая сварка термопластов (ultrasonic-plastic-welding)](../processes.html#ultrasonic-plastic-welding) | polymers | частный тезис | P2 | E02, T02 |
| [Лазерная сварка термопластов (laser-plastic-welding)](../processes.html#laser-plastic-welding) | polymers | частный тезис | P2 | E02, T02 |
| [Ручная выкладка композитов (hand-layup)](../processes.html#hand-layup) | composites | частный тезис | P2 | E02, T02 |
| [Вакуумная инфузия (vacuum-infusion)](../processes.html#vacuum-infusion) | composites | частный тезис | P2 | E02, T02 |
| [Трансферное формование композитов (RTM) (resin-transfer-molding)](../processes.html#resin-transfer-molding) | composites | частный тезис | P2 | E02, T02 |
| [Пултрузия (pultrusion)](../processes.html#pultrusion) | composites | частный тезис | P2 | E02, T02 |
| [Намотка композитов (filament-winding)](../processes.html#filament-winding) | composites | частный тезис | P2 | E02, T02 |
| [Автоклавное отверждение композитов (autoclave-composites)](../processes.html#autoclave-composites) | composites | частный тезис | P2 | E02, T02 |
| [Трафаретное нанесение паяльной пасты (solder-paste-printing)](../processes.html#solder-paste-printing) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Автоматическая установка SMD-компонентов (smt-placement)](../processes.html#smt-placement) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Пайка оплавлением (reflow-soldering)](../processes.html#reflow-soldering) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Пайка волной припоя (wave-soldering)](../processes.html#wave-soldering) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Защитное покрытие электронных сборок (conformal-coating)](../processes.html#conformal-coating) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Автоматизированная оптическая инспекция плат (aoi-pcb)](../processes.html#aoi-pcb) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Бланширование пищевого сырья (blanching-food)](../processes.html#blanching-food) | food | частный тезис | P1 | S07, E02, T02 |
| [Тепловая стерилизация пищевой продукции (thermal-sterilization-food)](../processes.html#thermal-sterilization-food) | food | частный тезис | P1 | S07, E02, T02 |
| [Промышленное замораживание пищевых продуктов (freezing-food)](../processes.html#freezing-food) | food | частный тезис | P1 | S07, E02, T02 |
| [Распылительная сушка пищевых жидкостей (spray-drying-food)](../processes.html#spray-drying-food) | food | частный тезис | P1 | S07, E02, T02 |
| [Выпаривание пищевых растворов (food-evaporation)](../processes.html#food-evaporation) | food | частный тезис | P1 | S07, E02, T02 |
| [Помол зерна (grain-milling)](../processes.html#grain-milling) | food | частный тезис | P1 | S07, E02, T02 |
| [Экструзионная обработка пищевых смесей (food-extrusion)](../processes.html#food-extrusion) | food | частный тезис | P1 | S07, E02, T02 |
| [Осветление соков (juice-clarification)](../processes.html#juice-clarification) | food | частный тезис | P1 | S07, E02, T02 |
| [Кардочесание волокон (carding)](../processes.html#carding) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Гребнечесание волокон (combing-textile)](../processes.html#combing-textile) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Вытяжка текстильной ленты (drawing-textile)](../processes.html#drawing-textile) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Перемотка пряжи (winding-yarn)](../processes.html#winding-yarn) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Снование основы (warping)](../processes.html#warping) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Шлихтование основы (warp-sizing)](../processes.html#warp-sizing) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Отбеливание текстиля (textile-bleaching)](../processes.html#textile-bleaching) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Печать по ткани (textile-printing)](../processes.html#textile-printing) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Строгание пиломатериалов (wood-planing)](../processes.html#wood-planing) | wood | частный тезис | P2 | E02, T02 |
| [Лущение шпона (veneer-peeling)](../processes.html#veneer-peeling) | wood | частный тезис | P2 | E02, T02 |
| [Склеивание фанеры (plywood-bonding)](../processes.html#plywood-bonding) | wood | частный тезис | P2 | E02, T02 |
| [Защитная пропитка древесины (wood-preservation)](../processes.html#wood-preservation) | wood | частный тезис | P2 | E02, T02 |
| [Прессование древесных плит (fiberboard-pressing)](../processes.html#fiberboard-pressing) | wood | частный тезис | P2 | E02, T02 |
| [Промышленное выпаривание (industrial-evaporation)](../processes.html#industrial-evaporation) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Кристаллизация растворов (crystallization)](../processes.html#crystallization) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Абсорбция газовых компонентов (gas-absorption)](../processes.html#gas-absorption) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Стриппинг растворённых компонентов (gas-stripping)](../processes.html#gas-stripping) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Промышленное центрифугирование (industrial-centrifugation)](../processes.html#industrial-centrifugation) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Мембранное разделение промышленных смесей (chemical-membrane)](../processes.html#chemical-membrane) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Каталитическая реакция в промышленном реакторе (catalytic-reaction)](../processes.html#catalytic-reaction) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Экстракция растворителем (solvent-extraction)](../processes.html#solvent-extraction) | chemicals | частный тезис | P2 | E02, L02, T02 |
| [Приготовление бетонной смеси (concrete-mixing)](../processes.html#concrete-mixing) | construction | частный тезис | P2 | E02, T02 |
| [Укладка бетонной смеси (concrete-placing)](../processes.html#concrete-placing) | construction | частный тезис | P2 | E02, T02 |
| [Виброуплотнение бетона (concrete-vibration)](../processes.html#concrete-vibration) | construction | частный тезис | P2 | E02, T02 |
| [Уход за твердеющим бетоном (concrete-curing)](../processes.html#concrete-curing) | construction | частный тезис | P2 | E02, T02 |
| [Монтаж опалубки (formwork-erection)](../processes.html#formwork-erection) | construction | частный тезис | P2 | E02, L02, T02 |
| [Монтаж арматуры (rebar-installation)](../processes.html#rebar-installation) | construction | частный тезис | P2 | E02, L02, T02 |
| [Каменная кладка (masonry-works)](../processes.html#masonry-works) | construction | частный тезис | P2 | E02, L02, T02 |
| [Укладка асфальтобетона (road-asphalt-placement)](../processes.html#road-asphalt-placement) | construction | частный тезис | P2 | E02, L02, T02 |
| [Инъекционное закрепление грунта (geotechnical-grouting)](../processes.html#geotechnical-grouting) | construction | частный тезис | P2 | E02, L02, T02 |
| [Производство асфальтобетонной смеси (asphalt-mix-production)](../processes.html#asphalt-mix-production) | construction | частный тезис | P2 | E02, L02, T02 |
| [Генерация технологического пара (steam-generation)](../processes.html#steam-generation) | energy | частный тезис | P2 | E02, L02, T02 |
| [Возврат конденсата (condensate-return)](../processes.html#condensate-return) | energy | частный тезис | P2 | E02, L02, T02 |
| [Деаэрация котловой воды (deaeration-water)](../processes.html#deaeration-water) | energy | частный тезис | P2 | E02, L02, T02 |
| [Теплоутилизация в экономайзере (economizer-heat-recovery)](../processes.html#economizer-heat-recovery) | energy | частный тезис | P2 | E02, L02, T02 |
| [Контроль конденсатоотводчиков (steam-trap-monitoring)](../processes.html#steam-trap-monitoring) | energy | частный тезис | P2 | E02, L02, T02 |
| [Индукционный нагрев в производстве (industrial-induction-heating)](../processes.html#industrial-induction-heating) | energy | частный тезис | P2 | E02, L02, T02 |
| [Промышленный теплообмен (industrial-heat-exchange)](../processes.html#industrial-heat-exchange) | energy | частный тезис | P2 | E02, L02, T02 |
| [Коагуляция при водоподготовке (coagulation-water)](../processes.html#coagulation-water) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Флокуляция воды (flocculation-water)](../processes.html#flocculation-water) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Отстаивание воды (sedimentation-water)](../processes.html#sedimentation-water) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Зернистая фильтрация воды (granular-filtration)](../processes.html#granular-filtration) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Адсорбция на активированном угле (carbon-adsorption)](../processes.html#carbon-adsorption) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Обратный осмос (reverse-osmosis)](../processes.html#reverse-osmosis) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Нанофильтрация воды (nanofiltration-water)](../processes.html#nanofiltration-water) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Ультрафильтрация воды (ultrafiltration-water)](../processes.html#ultrafiltration-water) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Озонирование воды (ozonation-water)](../processes.html#ozonation-water) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Обезвоживание осадка (sludge-dewatering)](../processes.html#sludge-dewatering) | water | частный тезис | P1 | S07, E02, L02, T02 |
| [Обжиг цементного клинкера (cement-clinker-firing)](../processes.html#cement-clinker-firing) | ceramics | частный тезис | P2 | E02, T02 |
| [Кальцинация керамического сырья (ceramic-calcination)](../processes.html#ceramic-calcination) | ceramics | частный тезис | P2 | E02, T02 |
| [Спекание керамики (ceramic-sintering)](../processes.html#ceramic-sintering) | ceramics | частный тезис | P2 | E02, T02 |
| [Шликерное литьё керамики (slip-casting-ceramics)](../processes.html#slip-casting-ceramics) | ceramics | частный тезис | P2 | E02, T02 |
| [Сухое прессование керамики (dry-pressing-ceramics)](../processes.html#dry-pressing-ceramics) | ceramics | частный тезис | P2 | E02, T02 |
| [Экструзия глиняных изделий (brick-extrusion)](../processes.html#brick-extrusion) | ceramics | частный тезис | P2 | E02, T02 |
| [Варка стекломассы (glass-melting)](../processes.html#glass-melting) | ceramics | частный тезис | P2 | E02, T02 |
| [Отжиг стекла (glass-annealing)](../processes.html#glass-annealing) | ceramics | частный тезис | P2 | E02, L02, T02 |
| [Влажная грануляция фармацевтических порошков (wet-granulation-pharma)](../processes.html#wet-granulation-pharma) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Сухая грануляция фармацевтических порошков (dry-granulation-pharma)](../processes.html#dry-granulation-pharma) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Таблетирование (tablet-compression)](../processes.html#tablet-compression) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Покрытие фармацевтических таблеток (tablet-coating)](../processes.html#tablet-coating) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Наполнение капсул (capsule-filling)](../processes.html#capsule-filling) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Асептическое наполнение стерильных форм (aseptic-filling)](../processes.html#aseptic-filling) | pharma | частный тезис | P1 | S04, E02, L02, T02 |
| [Распылительная сушка фармацевтических растворов (pharma-spray-drying)](../processes.html#pharma-spray-drying) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Фармацевтическое просеивание (pharma-sieving)](../processes.html#pharma-sieving) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Офсетная печать (offset-lithography)](../processes.html#offset-lithography) | printing | частный тезис | P2 | E02, L02, T02 |
| [Флексографская печать (flexography)](../processes.html#flexography) | printing | частный тезис | P2 | E02, L02, T02 |
| [Трафаретная печать (screen-printing)](../processes.html#screen-printing) | printing | частный тезис | P2 | E02, L02, T02 |
| [Глубокая печать (gravure-printing)](../processes.html#gravure-printing) | printing | частный тезис | P2 | E02, L02, T02 |
| [Послепечатная фальцовка и переплёт (print-binding)](../processes.html#print-binding) | printing | частный тезис | P2 | E02, L02, T02 |
| [Дробление руды (ore-crushing)](../processes.html#ore-crushing) | mining | частный тезис | P2 | E02, L02, T02 |
| [Измельчение руды (ore-grinding)](../processes.html#ore-grinding) | mining | частный тезис | P2 | E02, L02, T02 |
| [Грохочение руды (ore-screening)](../processes.html#ore-screening) | mining | частный тезис | P2 | E02, L02, T02 |
| [Флотационное обогащение (ore-flotation)](../processes.html#ore-flotation) | mining | частный тезис | P2 | E02, L02, T02 |
| [Магнитная сепарация руды (magnetic-separation-ore)](../processes.html#magnetic-separation-ore) | mining | частный тезис | P2 | E02, L02, T02 |
| [Гравитационное обогащение (gravity-concentration)](../processes.html#gravity-concentration) | mining | частный тезис | P2 | E02, L02, T02 |
| [Выщелачивание руды (ore-leaching)](../processes.html#ore-leaching) | mining | частный тезис | P2 | E02, L02, T02 |
| [Магнитопорошковый контроль (magnetic-particle-ndt)](../processes.html#magnetic-particle-ndt) | general | частный тезис | P1 | S07, E02, T02 |
| [Вихретоковый контроль (eddy-current-ndt)](../processes.html#eddy-current-ndt) | general | частный тезис | P1 | S07, E02, T02 |
| [Визуальный и измерительный контроль (visual-ndt)](../processes.html#visual-ndt) | general | частный тезис | P1 | S07, E02, T02 |
| [Испытание на герметичность (leak-testing)](../processes.html#leak-testing) | general | частный тезис | P1 | S07, E02, T02 |
| [Акустико-эмиссионный контроль (acoustic-emission-ndt)](../processes.html#acoustic-emission-ndt) | general | частный тезис | P1 | S07, E02, T02 |
| [Инфракрасная термография (infrared-thermography)](../processes.html#infrared-thermography) | general | частный тезис | P1 | S07, E02, T02 |
| [Георадарное обследование (ground-penetrating-radar)](../processes.html#ground-penetrating-radar) | general | частный тезис | P1 | S07, E02, L02, T02 |
| [Контроль направленными ультразвуковыми волнами (guided-wave-ndt)](../processes.html#guided-wave-ndt) | general | частный тезис | P1 | S07, E02, T02 |
| [Контроль утечкой магнитного потока (magnetic-flux-leakage)](../processes.html#magnetic-flux-leakage) | general | частный тезис | P1 | S07, E02, T02 |
| [Нейтронная радиография (neutron-radiography)](../processes.html#neutron-radiography) | general | частный тезис | P1 | S07, E02, T02 |
| [Лазерная шерография (laser-shearography)](../processes.html#laser-shearography) | general | частный тезис | P1 | S07, E02, T02 |
| [Ультразвуковой контроль фазированной решёткой (phased-array-ut)](../processes.html#phased-array-ut) | general | частный тезис | P1 | S07, E02, T02 |
| [Контактная шовная сварка (resistance-seam)](../processes.html#resistance-seam) | metals | частный тезис | P2 | E02, T02 |
| [Стыковая сварка оплавлением (flash-butt-welding)](../processes.html#flash-butt-welding) | metals | частный тезис | P2 | E02, T02 |
| [Электронно-лучевая сварка (electron-beam-welding)](../processes.html#electron-beam-welding) | metals | частный тезис | P2 | E02, T02 |
| [Плазменная дуговая сварка (plasma-arc-welding)](../processes.html#plasma-arc-welding) | metals | частный тезис | P2 | E02, T02 |
| [Приварка шпилек (stud-welding)](../processes.html#stud-welding) | metals | частный тезис | P2 | E02, T02 |
| [Диффузионная сварка (diffusion-bonding)](../processes.html#diffusion-bonding) | metals | частный тезис | P2 | E02, T02 |
| [Компрессионное формование пластмасс (compression-molding-plastics)](../processes.html#compression-molding-plastics) | polymers | частный тезис | P2 | E02 |
| [Инжекционно-выдувное формование с вытяжкой (stretch-blow-molding)](../processes.html#stretch-blow-molding) | polymers | частный тезис | P2 | E02, T02 |
| [Экструзия рукавной плёнки (blown-film-extrusion)](../processes.html#blown-film-extrusion) | polymers | частный тезис | P2 | E02, T02 |
| [Трансферное формование реактопластов (polymer-transfer-molding)](../processes.html#polymer-transfer-molding) | polymers | частный тезис | P2 | E02, L02, T02 |
| [Вулканизация эластомеров (rubber-vulcanization)](../processes.html#rubber-vulcanization) | polymers | частный тезис | P2 | E02, L02, T02 |
| [Экструзионное покрытие полимером (extrusion-coating)](../processes.html#extrusion-coating) | polymers | частный тезис | P2 | E02, T02 |
| [Иглопробивное производство нетканых материалов (needle-punching-nonwovens)](../processes.html#needle-punching-nonwovens) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Мерсеризация хлопка (mercerization)](../processes.html#mercerization) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Термофиксация текстиля (heat-setting-textiles)](../processes.html#heat-setting-textiles) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Каландрование тканей (textile-calendering)](../processes.html#textile-calendering) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Машинная вышивка (industrial-embroidery)](../processes.html#industrial-embroidery) | textiles | частный тезис | P1 | S07, E02, T02 |
| [Сверление отверстий печатных плат (pcb-drilling)](../processes.html#pcb-drilling) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Травление печатных проводников (pcb-etching)](../processes.html#pcb-etching) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Металлизация отверстий печатных плат (pcb-plating)](../processes.html#pcb-plating) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Селективная пайка узлов плат (selective-soldering)](../processes.html#selective-soldering) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Рентгеновский контроль электронных сборок (pcb-xray-inspection)](../processes.html#pcb-xray-inspection) | electronics | частный тезис | P1 | S07, E02, T02 |
| [Смешение фармацевтических порошков (pharma-powder-blending)](../processes.html#pharma-powder-blending) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Микронизация фармацевтических веществ (pharma-micronization)](../processes.html#pharma-micronization) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Сушка в псевдоожиженном слое (fluid-bed-pharma-drying)](../processes.html#fluid-bed-pharma-drying) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Внутрипроизводственный контроль таблеток (pharma-inprocess-control)](../processes.html#pharma-inprocess-control) | pharma | частный тезис | P2 | E02, L02, T02 |
| [Изготовление печатных форм (printing-plate-making)](../processes.html#printing-plate-making) | printing | частный тезис | P2 | E02, L02, T02 |
| [Высечка печатной продукции (print-die-cutting)](../processes.html#print-die-cutting) | printing | частный тезис | P2 | E02, L02, T02 |
| [УФ-отверждение печатных покрытий (uv-curing-print)](../processes.html#uv-curing-print) | printing | частный тезис | P2 | E02, L02, T02 |
| [Производство многослойных печатных плат (multilayer-pcb-manufacturing)](../processes.html#multilayer-pcb-manufacturing) | electronics | только источник | P1 | E01 |
| [Автоматический поверхностный монтаж печатных плат (SMT) (automated-smt-assembly)](../processes.html#automated-smt-assembly) | electronics | только источник | P1 | E01 |

## Материалы — каждая карточка

| Карточка | Отрасли | Статус доказательств | Очередь | Проблемы |
|---|---|---|---|---|
| [Сталь 20 (steel-20)](../materials.html#steel-20) | metals, general | частный тезис | P2 | E02 |
| [Сталь 45 (steel-45)](../materials.html#steel-45) | metals, general | частный тезис | P2 | E02, T03 |
| [09Г2С (09g2s)](../materials.html#09g2s) | metals, construction | частный тезис | P2 | E02 |
| [AISI 304 (aisi-304)](../materials.html#aisi-304) | metals, chemicals, food, energy | частный тезис | P2 | E02 |
| [Алюминиевый сплав 6061 (al-6061)](../materials.html#al-6061) | metals, construction | частный тезис | P2 | E02, T03 |
| [Медь М1 (copper-m1)](../materials.html#copper-m1) | metals, electronics, energy | частный тезис | P2 | E02, T03 |
| [ПЭНД (HDPE) (pe-hd)](../materials.html#pe-hd) | polymers, food, water | частный тезис | P1 | S07, E02, T03 |
| [Полиамид 6 (PA6) (pa6)](../materials.html#pa6) | polymers, textiles | частный тезис | P1 | S07, E02 |
| [Стеклопластик (GFRP) (gfrp)](../materials.html#gfrp) | composites, construction, energy | частный тезис | P2 | E02 |
| [Оксидная керамика Al₂O₃ (alumina)](../materials.html#alumina) | ceramics, electronics | частный тезис | P2 | E02 |
| [Берёзовая фанера (birch-plywood)](../materials.html#birch-plywood) | wood, construction | частный тезис | P2 | E02 |
| [Арамидная ткань (aramid)](../materials.html#aramid) | textiles, composites | частный тезис | P2 | E02, T03 |
| [Пищевое сырьё растительного происхождения (food-raw)](../materials.html#food-raw) | food | частный тезис | P2 | E02, T03 |
| [Пищевые упаковочные материалы (food-pack)](../materials.html#food-pack) | food, polymers | частный тезис | P2 | E02, T03 |
| [Хлопковое волокно (cotton)](../materials.html#cotton) | textiles | частный тезис | P2 | E02, T03 |
| [Хлопковая пряжа (cotton-yarn)](../materials.html#cotton-yarn) | textiles | частный тезис | P2 | E02, T03 |
| [Ткань текстильная (woven-fabric)](../materials.html#woven-fabric) | textiles | частный тезис | P2 | E02, T03 |
| [Пиломатериалы из древесины (timber)](../materials.html#timber) | wood, construction | частный тезис | P2 | E02 |
| [Печатная плата (основание) (pcb)](../materials.html#pcb) | electronics | частный тезис | P2 | E02 |
| [Материалы для пайки электронных узлов (solder)](../materials.html#solder) | electronics, metals | частный тезис | P2 | E02, T03 |
| [Алюминиевый сплав 6063 (al-6063)](../materials.html#al-6063) | metals, construction | частный тезис | P2 | E02, T03 |
| [Аустенитные нержавеющие стали (stainless-austenitic)](../materials.html#stainless-austenitic) | metals, chemicals, food, pharma, energy | частный тезис | P2 | E02, T03 |
| [Стальной лом (steel-scrap)](../materials.html#steel-scrap) | metals, mining | частный тезис | P2 | E02, T03 |
| [Железная руда (iron-ore)](../materials.html#iron-ore) | mining, metals | частный тезис | P2 | E02, T03 |
| [Боксит (bauxite-ore)](../materials.html#bauxite-ore) | mining, metals, ceramics | частный тезис | P2 | E02, T03 |
| [Портландцемент (cement-portland)](../materials.html#cement-portland) | construction, ceramics | частный тезис | P2 | E02, T03 |
| [Цементный клинкер (cement-clinker)](../materials.html#cement-clinker) | ceramics, construction | частный тезис | P2 | E02, T03 |
| [Гипс природный (gypsum)](../materials.html#gypsum) | ceramics, construction, mining | частный тезис | P2 | E02, T03 |
| [Кварцевый песок технический (industrial-silica)](../materials.html#industrial-silica) | ceramics, mining, water, construction | частный тезис | P2 | E02, T03 |
| [Активированный уголь гранулированный (water-carbon)](../materials.html#water-carbon) | water, chemicals | частный тезис | P1 | S07, E02 |
| [Ионообменная смола (water-resin)](../materials.html#water-resin) | water, chemicals | частный тезис | P1 | S07, E02, L03, T03 |
| [Мембранный материал обратного осмоса (ro-membrane)](../materials.html#ro-membrane) | water, chemicals | частный тезис | P1 | S07, E02 |
| [Полипропилен (PP) (polymer-pp)](../materials.html#polymer-pp) | polymers, food | частный тезис | P1 | S07, E02 |
| [Полиэтилентерефталат (PET) (polymer-pet)](../materials.html#polymer-pet) | polymers, food, textiles | частный тезис | P1 | S07, E02 |
| [Поливинилхлорид (PVC) (polymer-pvc)](../materials.html#polymer-pvc) | polymers, construction, chemicals | частный тезис | P1 | S07, E02, T03 |
| [Промышленные клеевые системы (adhesive)](../materials.html#adhesive) | chemicals, composites, wood, construction | частный тезис | P2 | E02 |
| [Древесноволокнистая плита (MDF) (mdf)](../materials.html#mdf) | wood, construction | частный тезис | P2 | E02 |
| [Стекольная шихта (glass-raw)](../materials.html#glass-raw) | ceramics | частный тезис | P2 | E02, T03 |
| [Фармацевтические вспомогательные вещества (pharma-excipients)](../materials.html#pharma-excipients) | pharma | частный тезис | P2 | E02, T03 |
| [Активные фармацевтические субстанции (АФС) (pharma-api)](../materials.html#pharma-api) | pharma | частный тезис | P2 | E02, T03 |
| [Полиграфические краски (printing-inks)](../materials.html#printing-inks) | printing, chemicals | частный тезис | P2 | E02, T03 |
| [Печатная бумага и картон (printing-paper)](../materials.html#printing-paper) | printing, food | частный тезис | P2 | E02, T03 |
| [Деним (хлопчатобумажная ткань) (cotton-denim)](../materials.html#cotton-denim) | textiles | частный тезис | P2 | E02, T03 |
| [Медные полуфабрикаты для теплообменников (energy-copper)](../materials.html#energy-copper) | energy, metals | частный тезис | P2 | E02, T03 |
| [Огнеупорные керамические материалы (refractory-ceramics)](../materials.html#refractory-ceramics) | ceramics, energy, metals | частный тезис | P2 | E02, T03 |
| [Кварцевое сырьё высокой чистоты (mining-quartz)](../materials.html#mining-quartz) | mining, ceramics, electronics | частный тезис | P2 | E02, T03 |
| [Ферритные нержавеющие стали (stainless-ferritic)](../materials.html#stainless-ferritic) | metals | частный тезис | P2 | E02, T03 |
| [Мартенситные нержавеющие стали (stainless-martensitic)](../materials.html#stainless-martensitic) | metals, energy | частный тезис | P2 | E02, T03 |
| [Дуплексные нержавеющие стали (stainless-duplex)](../materials.html#stainless-duplex) | metals, chemicals, energy | частный тезис | P2 | E02 |
| [Алюминиевые сплавы серии 5xxx (al-series-5xxx)](../materials.html#al-series-5xxx) | metals, construction | частный тезис | P2 | E02 |
| [Алюминиевые сплавы серии 7xxx (al-series-7xxx)](../materials.html#al-series-7xxx) | metals, composites | частный тезис | P2 | E02 |
| [Серый чугун (cast-iron-gray)](../materials.html#cast-iron-gray) | metals | частный тезис | P2 | E02 |
| [Чугун с шаровидным графитом (cast-iron-ductile)](../materials.html#cast-iron-ductile) | metals | частный тезис | P2 | E02 |
| [Латуни (brass-alloys)](../materials.html#brass-alloys) | metals, electronics | частный тезис | P2 | E02, T03 |
| [Бронзы (bronze-alloys)](../materials.html#bronze-alloys) | metals, energy | частный тезис | P2 | E02 |
| [Титан и титановые сплавы (titanium-industrial)](../materials.html#titanium-industrial) | metals, chemicals | частный тезис | P2 | E02, T03 |
| [Никелевые сплавы (nickel-alloys)](../materials.html#nickel-alloys) | metals, energy, chemicals | частный тезис | P2 | E02, T03 |
| [Цинковые литейные сплавы (zinc-diecast)](../materials.html#zinc-diecast) | metals, electronics | частный тезис | P2 | E02 |
| [Магниевые конструкционные сплавы (magnesium-alloys)](../materials.html#magnesium-alloys) | metals | частный тезис | P2 | E02 |
| [Полиэтилен низкой плотности (LDPE) (ldpe)](../materials.html#ldpe) | polymers, food | частный тезис | P1 | S07, E02, T03 |
| [Линейный полиэтилен низкой плотности (LLDPE) (lldpe)](../materials.html#lldpe) | polymers, food | частный тезис | P1 | S07, E02, T03 |
| [Полистирол (PS) (ps)](../materials.html#ps) | polymers | частный тезис | P1 | S07, E02 |
| [Пенополистирол (EPS) (eps)](../materials.html#eps) | polymers, construction | частный тезис | P1 | S07, E02 |
| [Акрилонитрилбутадиенстирол (ABS) (abs)](../materials.html#abs) | polymers, electronics | частный тезис | P1 | S07, E02 |
| [Поликарбонат (PC) (pc)](../materials.html#pc) | polymers, electronics | частный тезис | P1 | S07, E02 |
| [Полиметилметакрилат (PMMA) (pmma)](../materials.html#pmma) | polymers, construction | частный тезис | P1 | S07, E02 |
| [Полиоксиметилен (POM) (pom)](../materials.html#pom) | polymers, metals | частный тезис | P1 | S07, E02 |
| [Полибутилентерефталат (PBT) (pbt)](../materials.html#pbt) | polymers, electronics | частный тезис | P1 | S07, E02 |
| [Полифениленсульфид (PPS) (pps)](../materials.html#pps) | polymers, electronics | частный тезис | P1 | S07, E02 |
| [Полиэфирэфиркетон (PEEK) (peek)](../materials.html#peek) | polymers, pharma | частный тезис | P1 | S07, E02 |
| [Политетрафторэтилен (PTFE) (ptfe)](../materials.html#ptfe) | polymers, chemicals | частный тезис | P1 | S07, E02 |
| [Этиленвинилацетат (EVA) (eva-polymer)](../materials.html#eva-polymer) | polymers, textiles | частный тезис | P1 | S07, E02 |
| [Этиленпропилендиеновый каучук (EPDM) (epdm)](../materials.html#epdm) | polymers, construction | частный тезис | P1 | S07, E02 |
| [Бутадиенстирольный каучук (SBR) (sbr)](../materials.html#sbr) | polymers, construction | частный тезис | P1 | S07, E02 |
| [Термопластичный полиуретан (TPU) (tpu)](../materials.html#tpu) | polymers, textiles | частный тезис | P1 | S07, E02 |
| [Пшеница продовольственная (grain-wheat)](../materials.html#grain-wheat) | food | частный тезис | P2 | E02, T03 |
| [Пшеничная мука (wheat-flour)](../materials.html#wheat-flour) | food | частный тезис | P2 | E02, T03 |
| [Растительные пищевые масла (vegetable-oils)](../materials.html#vegetable-oils) | food, chemicals | частный тезис | P2 | E02, T03 |
| [Сырое молоко (raw-milk)](../materials.html#raw-milk) | food | частный тезис | P2 | E02, T03 |
| [Сухое молоко (milk-powder)](../materials.html#milk-powder) | food | частный тезис | P2 | E02, T03 |
| [Плодово-ягодные соки как сырьё (fruit-juice-base)](../materials.html#fruit-juice-base) | food | частный тезис | P2 | E02, T03 |
| [Плодовоягодные пюре (fruit-puree)](../materials.html#fruit-puree) | food | частный тезис | P2 | E02, T03 |
| [Сахар-песок (sugar-crystal)](../materials.html#sugar-crystal) | food | частный тезис | P2 | E02, T03 |
| [Пищевые дрожжи (yeast-food)](../materials.html#yeast-food) | food | частный тезис | P2 | E02, T03 |
| [Мясное сырьё (meat-raw)](../materials.html#meat-raw) | food | частный тезис | P2 | E02, T03 |
| [Шерстяное волокно (wool-fiber)](../materials.html#wool-fiber) | textiles | частный тезис | P2 | E02, T03 |
| [Льняное волокно (flax-fiber)](../materials.html#flax-fiber) | textiles | частный тезис | P2 | E02, T03 |
| [Полиэфирное текстильное волокно (polyester-fiber)](../materials.html#polyester-fiber) | textiles, polymers | частный тезис | P2 | E02, T03 |
| [Полиамидная техническая нить (polyamide-textile-yarn)](../materials.html#polyamide-textile-yarn) | textiles, composites | частный тезис | P2 | E02, T03 |
| [Вискозное волокно (viscose-fiber)](../materials.html#viscose-fiber) | textiles | частный тезис | P2 | E02 |
| [Нетканое полотно (nonwoven-fabric)](../materials.html#nonwoven-fabric) | textiles, food | частный тезис | P2 | E02, T03 |
| [Трикотажное полотно (knitted-fabric)](../materials.html#knitted-fabric) | textiles | частный тезис | P2 | E02, T03 |
| [Швейные нитки (sewing-thread)](../materials.html#sewing-thread) | textiles | частный тезис | P2 | E02, T03 |
| [Основная пряжа (warp-yarn)](../materials.html#warp-yarn) | textiles | частный тезис | P2 | E02 |
| [Текстильный краситель (technical-dye)](../materials.html#technical-dye) | textiles, chemicals | частный тезис | P2 | E02, T03 |
| [Технический войлок (technical-felt)](../materials.html#technical-felt) | textiles, construction | частный тезис | P2 | E02, T03 |
| [Пиломатериалы из ели (spruce-lumber)](../materials.html#spruce-lumber) | wood, construction | частный тезис | P2 | E02, T03 |
| [Сосновые пиломатериалы (pine-lumber)](../materials.html#pine-lumber) | wood, construction | частный тезис | P2 | E02 |
| [Лущёный шпон (wood-veneer)](../materials.html#wood-veneer) | wood | частный тезис | P2 | E02, T03 |
| [Ориентированно-стружечная плита (OSB) (osb-board)](../materials.html#osb-board) | wood, construction | частный тезис | P2 | E02, L03 |
| [Древесно-стружечная плита (ДСП) (particleboard)](../materials.html#particleboard) | wood, construction | частный тезис | P2 | E02, L03, T03 |
| [Клеёная древесина (glulam) (glulam)](../materials.html#glulam) | wood, construction | частный тезис | P2 | E02, L03 |
| [Перекрёстно-клеёная древесина (CLT) (clt)](../materials.html#clt) | wood, construction | частный тезис | P2 | E02, L03 |
| [Древесные защитные составы (wood-impregnant)](../materials.html#wood-impregnant) | wood, chemicals | частный тезис | P2 | E02, T03 |
| [Препрег для печатных плат (pcb-prepreg)](../materials.html#pcb-prepreg) | electronics, composites | частный тезис | P2 | E02, L03, T03 |
| [Ламинат для жёстких печатных плат (pcb-laminate)](../materials.html#pcb-laminate) | electronics | частный тезис | P2 | E02, T03 |
| [Медная фольга для печатных плат (pcb-copper-foil)](../materials.html#pcb-copper-foil) | electronics, metals | частный тезис | P2 | E02, T03 |
| [Паяльная паста (solder-paste)](../materials.html#solder-paste) | electronics, chemicals | частный тезис | P2 | E02, T03 |
| [Флюс для электронного монтажа (solder-flux)](../materials.html#solder-flux) | electronics, chemicals | частный тезис | P2 | E02 |
| [Компаунд для заливки электронных узлов (electronic-encapsulant)](../materials.html#electronic-encapsulant) | electronics, polymers | частный тезис | P1 | S07, E02 |
| [Лак для защитного покрытия плат (conformal-coating-material)](../materials.html#conformal-coating-material) | electronics, polymers | частный тезис | P2 | E02, T03 |
| [Известняк промышленный (lime-stone)](../materials.html#lime-stone) | chemicals, construction, mining | частный тезис | P2 | E02, T03 |
| [Кальцинированная сода (soda-ash)](../materials.html#soda-ash) | chemicals, ceramics | частный тезис | P2 | E02 |
| [Сера промышленная (industrial-sulfur)](../materials.html#industrial-sulfur) | chemicals, mining | частный тезис | P2 | E02, T03 |
| [Фосфатное сырьё (phosphate-rock)](../materials.html#phosphate-rock) | chemicals, mining | частный тезис | P2 | E02, T03 |
| [Калийное минеральное сырьё (potash-raw)](../materials.html#potash-raw) | chemicals, mining | частный тезис | P2 | E02 |
| [Цеолиты технические (industrial-zeolite)](../materials.html#industrial-zeolite) | water, chemicals | частный тезис | P2 | E02, T03 |
| [Бентонитовая глина (bentonite-clay)](../materials.html#bentonite-clay) | chemicals, construction, mining | частный тезис | P2 | E02, T03 |
| [Соль техническая (industrial-salt)](../materials.html#industrial-salt) | chemicals, water | частный тезис | P2 | E02 |
| [Углеродное армирующее волокно (carbon-fiber-preform)](../materials.html#carbon-fiber-preform) | composites, energy | частный тезис | P1 | S07, E02 |
| [Углепластик (CFRP) (carbon-fiber-laminate)](../materials.html#carbon-fiber-laminate) | composites, metals | частный тезис | P1 | S07, E02, T03 |
| [Сотовый заполнитель (composite-honeycomb)](../materials.html#composite-honeycomb) | composites, construction | частный тезис | P1 | S07, E02, T03 |
| [Эпоксидная связующая система (composite-epoxy-resin)](../materials.html#composite-epoxy-resin) | composites, chemicals | частный тезис | P1 | S07, E02, T03 |
| [Препрег для композитов (prepreg-composite)](../materials.html#prepreg-composite) | composites | частный тезис | P1 | S07, E02, T03 |
| [Базальтовое армирующее волокно (basalt-fiber)](../materials.html#basalt-fiber) | composites, textiles | частный тезис | P1 | S07, E02 |
| [Заполнители для бетона (building-aggregate)](../materials.html#building-aggregate) | construction, mining | частный тезис | P2 | E02, T03 |
| [Щебень строительный (crushed-stone)](../materials.html#crushed-stone) | construction, mining | частный тезис | P2 | E02, T03 |
| [Песок строительный (sand-building)](../materials.html#sand-building) | construction, mining | частный тезис | P2 | E02, T03 |
| [Битум дорожный (asphalt-binder)](../materials.html#asphalt-binder) | construction, chemicals | частный тезис | P2 | E02, T03 |
| [Асфальтобетонная смесь (asphalt-mix)](../materials.html#asphalt-mix) | construction | частный тезис | P2 | E02, T03 |
| [Арматурный стальной прокат (rebar-steel)](../materials.html#rebar-steel) | construction, metals | частный тезис | P2 | E02, T03 |
| [Бетонная смесь товарная (ready-mix-concrete)](../materials.html#ready-mix-concrete) | construction | частный тезис | P2 | E02 |
| [Геотекстиль (geotextile)](../materials.html#geotextile) | construction, textiles | частный тезис | P1 | S07, E02, T03 |
| [Электротехническая листовая сталь (electrical-steel)](../materials.html#electrical-steel) | energy, electronics, metals | частный тезис | P2 | E02, T03 |
| [Графитовые электроды промышленного назначения (graphite-electrode)](../materials.html#graphite-electrode) | energy, metals | частный тезис | P2 | E02 |
| [Медный провод электротехнический (copper-electric-wire)](../materials.html#copper-electric-wire) | energy, electronics | частный тезис | P2 | E02, T03 |
| [Минеральная теплоизоляционная вата (thermal-insulation-wool)](../materials.html#thermal-insulation-wool) | energy, construction | частный тезис | P2 | E02, T03 |
| [Коррозионностойкий прокат для теплообменников (heat-exchanger-steel)](../materials.html#heat-exchanger-steel) | energy, chemicals | частный тезис | P2 | E02 |
| [Мембрана для ультрафильтрации (uf-membrane)](../materials.html#uf-membrane) | water, chemicals | частный тезис | P1 | S07, E02, T03 |
| [Активированный оксид алюминия (адсорбент) (activated-alumina-adsorbent)](../materials.html#activated-alumina-adsorbent) | water, ceramics | частный тезис | P1 | S07, E02, L03, T03 |
| [Гранулированный сорбент на основе оксидов железа (ferric-oxide-media)](../materials.html#ferric-oxide-media) | water, chemicals | частный тезис | P1 | S07, E02, T03 |
| [Флокулянт-полиэлектролит (flocculant-polyelectrolyte)](../materials.html#flocculant-polyelectrolyte) | water, chemicals | частный тезис | P1 | S07, E02, T03 |
| [Коагулянт на основе соли железа (coagulant-iron)](../materials.html#coagulant-iron) | water, chemicals | частный тезис | P1 | S07, E02, T03 |
| [Техническая корундовая керамика (alumina-ceramic)](../materials.html#alumina-ceramic) | ceramics, electronics | частный тезис | P2 | E02, T03 |
| [Кремнезёмистый огнеупор (silica-refractory)](../materials.html#silica-refractory) | ceramics, energy | частный тезис | P2 | E02, T03 |
| [Огнеупорная глина (fireclay-raw)](../materials.html#fireclay-raw) | ceramics, mining | частный тезис | P2 | E02, T03 |
| [Каолин технический (kaolin-industrial)](../materials.html#kaolin-industrial) | ceramics, printing | частный тезис | P2 | E02 |
| [Стеклобой технологический (glass-cullet)](../materials.html#glass-cullet) | ceramics | частный тезис | P2 | E02, T03 |
| [Керамическая глазурная масса (ceramic-glaze)](../materials.html#ceramic-glaze) | ceramics, chemicals | частный тезис | P2 | E02, T03 |
| [Известь техническая (lime-technical)](../materials.html#lime-technical) | ceramics, construction, chemicals | частный тезис | P2 | E02 |
| [Микрокристаллическая целлюлоза фармацевтическая (pharma-mcc)](../materials.html#pharma-mcc) | pharma | частный тезис | P2 | E02 |
| [Лактоза фармацевтическая (pharma-lactose)](../materials.html#pharma-lactose) | pharma, food | частный тезис | P2 | E02, T03 |
| [Желатин для капсул (pharma-gelatin)](../materials.html#pharma-gelatin) | pharma, food | частный тезис | P2 | E02, T03 |
| [Повидон (PVP) фармацевтический (pharma-povidone)](../materials.html#pharma-povidone) | pharma, chemicals | частный тезис | P2 | E02 |
| [Гипромеллоза (HPMC) фармацевтическая (pharma-hpmc)](../materials.html#pharma-hpmc) | pharma | частный тезис | P2 | E02, T03 |
| [Крахмал фармацевтический (pharma-starch)](../materials.html#pharma-starch) | pharma, food | частный тезис | P2 | E02 |
| [Фотополимерная флексографская форма (flexo-plate)](../materials.html#flexo-plate) | printing, polymers | частный тезис | P2 | E02, T03 |
| [Сетка для трафаретной печати (screen-print-mesh)](../materials.html#screen-print-mesh) | printing, textiles | частный тезис | P2 | E02, T03 |
| [Офсетное печатное полотно (offset-blanket)](../materials.html#offset-blanket) | printing | частный тезис | P2 | E02 |
| [УФ-отверждаемая печатная краска (uv-curing-ink)](../materials.html#uv-curing-ink) | printing, chemicals | частный тезис | P2 | E02, T03 |
| [Полимерная плёнка для печати (printing-film-substrate)](../materials.html#printing-film-substrate) | printing, polymers, food | частный тезис | P2 | E02, T03 |
| [Медные руды (copper-ore)](../materials.html#copper-ore) | mining, metals | частный тезис | P2 | E02 |
| [Никелевые руды (nickel-ore)](../materials.html#nickel-ore) | mining, metals | частный тезис | P2 | E02, T03 |
| [Марганцевые руды (manganese-ore)](../materials.html#manganese-ore) | mining, metals | частный тезис | P2 | E02, T03 |
| [Литиевый минеральный концентрат (lithium-concentrate)](../materials.html#lithium-concentrate) | mining, chemicals | частный тезис | P2 | E02, T03 |
| [Природный графитовый концентрат (graphite-concentrate)](../materials.html#graphite-concentrate) | mining, energy | частный тезис | P2 | E02 |
| [Концентрат редкоземельного сырья (rare-earth-concentrate)](../materials.html#rare-earth-concentrate) | mining, electronics | частный тезис | P2 | E02, T03 |
| [Плавиковый шпат (флюорит) (fluorite-ore)](../materials.html#fluorite-ore) | mining, chemicals | частный тезис | P2 | E02, T03 |
| [Тальк промышленный (talc-industrial)](../materials.html#talc-industrial) | mining, polymers | частный тезис | P2 | E02 |
| [Перлит промышленный (perlite-raw)](../materials.html#perlite-raw) | mining, construction | частный тезис | P2 | E02 |
| [Диатомит промышленный (diatomite-raw)](../materials.html#diatomite-raw) | mining, water | частный тезис | P2 | E02 |
| [Цинковый минеральный концентрат (zinc-concentrate)](../materials.html#zinc-concentrate) | mining, metals | частный тезис | P2 | E02, T03 |

## Индивидуальные рекомендации и источники

Подробные замечания, URL источников из карточки и дополнительные ссылки реестра, следующий индивидуальный шаг для каждого ID: knowledge/atlas-card-audit.json. После исправления регенерировать командой node scripts/audit-atlas-cards.cjs --write и выполнить --check.

### Что остаётся неисполненным

Проверка каждого инженерного тезиса по методологии первичного документа, действующим нормативам, сорту, марке, применимым условиям, протоколам и ограничениям — ручная содержательная работа. Её нельзя выдавать за выполненную потому, что прошли 380 программных проверок.
