# Академия — построчный реестр утверждений: группа B

Снимок исходников: ветка `draft/engineering-academy`, 22.11.2026. Основание: HTML-файлы четырёх страниц академии.

**Важно:** машинное выделение по предложениям — инвентаризация, а не экспертное доказательство. Для каждого фактического тезиса требуется соответствующий раздел оригинала, расчёт или отдельный предметный вывод. Ссылки в заголовках — лишь кандидаты, если не указано PASS.

Шкала: PASS — адресно проверенная формула/арифметика в ограниченных рамках; UNVERIFIED — не подтверждено в данном проходе; SOURCE/META — сведения о ссылке или статусе, нуждаются в отдельной проверке; QUESTION/CONDITION — вопрос/условие; INSTRUCTION/REVIEW — предписание или процедура, для которых требуется предметная оценка безопасности.

В этой группе: **3 уроков, 64 текстовых единиц, 15 адресно отмеченных PASS**.

## ohm — Закон Ома: напряжение, ток, сопротивление

Файл: `engineering-lessons.html`. Кандидаты источников: https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law.

| ID | Статус | Точное утверждение / фрагмент | Проверяемое основание |
|---|---|---|---|
| `ohm.P01.S01` | UNVERIFIED | УРОК 01 / ЭЛЕКТРОТЕХНИКА | — |
| `ohm.P02.S01` | PASS — МОДЕЛЬ+РАСЧЁТ | Для идеального резистивного участка цепи при постоянном токе U = I × R , где U — напряжение в вольтах (В), I — ток в амперах (А), R — сопротивление в омах (Ом). | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P02.S02` | PASS — МОДЕЛЬ+РАСЧЁТ | Чтобы получить ток, разделите напряжение на сопротивление: I = U / R . | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P03.S01` | PASS — МОДЕЛЬ+РАСЧЁТ | Пример: при 12 В и 600 Ом ток равен 12 / 600 = 0,02 А, то есть 20 мА. | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P03.S02` | PASS — МОДЕЛЬ+РАСЧЁТ | Это расчёт идеальной модели; реальный источник и компоненты имеют ограничения. | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P04.S01` | UNVERIFIED | Граница применимости. | — |
| `ohm.P04.S02` | UNVERIFIED | Закон Ома здесь применяется к идеальному резистору при постоянном токе. | — |
| `ohm.P04.S03` | UNVERIFIED | Он не подтверждает допустимую мощность, нагрев или безопасность подключения реальной цепи. | — |
| `ohm.P04.S04` | UNVERIFIED | Перед работой с оборудованием проверяются номиналы компонентов и документация изготовителя. | — |
| `ohm.P05.S01` | UNVERIFIED | Задача. | — |
| `ohm.P05.S02` | UNVERIFIED | К идеальному резистору 400 Ом приложено постоянное напряжение 8 В. | — |
| `ohm.P05.S03` | UNVERIFIED | Какой ток через него протекает в миллиамперах? | — |
| `ohm.P07.S01` | PASS — МОДЕЛЬ+РАСЧЁТ | I = 8 / 400 = 0,02 А = 20 мА . | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P07.S02` | PASS — МОДЕЛЬ+РАСЧЁТ | Умножение ампер на 1000 даёт миллиамперы. | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P08.S01` | QUESTION/CONDITION | Задача 2 — изменённые условия. | — |
| `ohm.P08.S02` | UNVERIFIED | На том же идеальном резисторе сопротивлением 400 Ом измерен ток 30 мА. | — |
| `ohm.P08.S03` | UNVERIFIED | Каково напряжение в вольтах? | — |
| `ohm.P10.S01` | PASS — МОДЕЛЬ+РАСЧЁТ | 30 мА = 0,03 А; U = 0,03 × 400 = 12 В. | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P10.S02` | PASS — МОДЕЛЬ+РАСЧЁТ | Нельзя умножать 30 на 400 без перевода мА в А. | https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law |
| `ohm.P11.S01` | UNVERIFIED | Граница применимости: соотношение U = IR не означает, что любое устройство имеет постоянное сопротивление. | — |
| `ohm.P11.S02` | UNVERIFIED | Диод — пример нелинейного элемента. | — |
| `ohm.P11.S03` | UNVERIFIED | OpenStax, University Physics, §9.4 (источник физической модели, текст урока авторский). | — |

**Предметный статус ohm: не аттестован целиком.**

## signal — Аналоговый сигнал 4–20 мА

Файл: `engineering-lessons.html`. Кандидаты источников: https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html.

| ID | Статус | Точное утверждение / фрагмент | Проверяемое основание |
|---|---|---|---|
| `signal.P01.S01` | UNVERIFIED | УРОК 02 / АВТОМАТИЗАЦИЯ | — |
| `signal.P02.S01` | PASS — NI 4–20 мА | В учебной линейной модели ток 4 мА соответствует нижней границе измеряемой величины, а 20 мА — верхней. | https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html |
| `signal.P02.S02` | PASS — ЛИНЕЙНАЯ АЛГЕБРА | Нормированная доля диапазона: (I − 4) / 16 , где I выражен в мА. | https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html |
| `signal.P02.S03` | PASS — ЛИНЕЙНАЯ АЛГЕБРА | Для шкалы от 0 до 100 условных единиц значение равно (I − 4) / 16 × 100 . | https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html |
| `signal.P03.S01` | PASS — ЛИНЕЙНАЯ АЛГЕБРА | Пример: 12 мА — середина диапазона, значит показание равно 50 условным единицам. | https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html |
| `signal.P03.S02` | UNVERIFIED | Диагностические пороги и поведение вне диапазона зависят от конкретного устройства и его документации. | — |
| `signal.P04.S01` | UNVERIFIED | Инженерная проверка. | — |
| `signal.P04.S02` | UNVERIFIED | Масштабирование 4–20 мА применимо при правильной конфигурации датчика и входа ПЛК. | — |
| `signal.P04.S03` | UNVERIFIED | Значения за пределами рабочего диапазона, обрыв петли и диагностические состояния требуют отдельной обработки; числовой пересчёт не заменяет диагностику. | — |
| `signal.P05.S01` | UNVERIFIED | Задача. | — |
| `signal.P05.S02` | UNVERIFIED | Датчик линейно отображает температуру от 0 до 200 °C в сигнал 4–20 мА. | — |
| `signal.P05.S03` | UNVERIFIED | Ток равен 8 мА. | — |
| `signal.P05.S04` | UNVERIFIED | Какую температуру показывает идеальная модель? | — |
| `signal.P07.S01` | PASS — ПЕРЕСЧЁТ | (8 − 4) / 16 = 0,25; 0,25 × 200 = 50 °C . | https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html |
| `signal.P07.S02` | UNVERIFIED | В модели нет погрешности датчика, смещения нуля и нелинейности. | — |
| `signal.P08.S01` | QUESTION/CONDITION | Задача 2 — обратное масштабирование. | — |
| `signal.P08.S02` | UNVERIFIED | Линейная шкала датчика — от −50 до +150 °C. | — |
| `signal.P08.S03` | UNVERIFIED | Какой ток в мА соответствует температуре 100 °C в идеальной модели 4–20 мА? | — |
| `signal.P10.S01` | PASS — ПЕРЕСЧЁТ | Доля диапазона: (100 − (−50)) / 200 = 0,75. | https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html |
| `signal.P10.S02` | PASS — ПЕРЕСЧЁТ | Ток: 4 + 16 × 0,75 = 16 мА. | https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/current-measurements-how-to-guide.html |
| `signal.P11.S01` | SOURCE/META | Статус: авторская учебная модель линейного преобразования, не характеристика конкретного датчика. | — |
| `signal.P11.S02` | UNVERIFIED | Для реального устройства необходимы паспорт, пределы диагностики и конфигурация входа. | — |
| `signal.P11.S03` | SOURCE/META | NI, Measuring Current, раздел «Current Loops/4-20 mA Convention» подтверждает 4 мА = 0% и 20 мА = 100%; формулы и численные ответы получены линейной интерполяцией, без претензии на диагностику конкретного прибора. | — |

**Предметный статус signal: не аттестован целиком.**

## tolerance — Размер с двусторонним допуском

Файл: `engineering-lessons.html`. Кандидаты источников: не указаны.

| ID | Статус | Точное утверждение / фрагмент | Проверяемое основание |
|---|---|---|---|
| `tolerance.P01.S01` | UNVERIFIED | УРОК 03 / КОНСТРУИРОВАНИЕ | — |
| `tolerance.P02.S01` | UNVERIFIED | Номинальный размер — заданное исходное значение. | — |
| `tolerance.P02.S02` | UNVERIFIED | При симметричном допуске ±t нижняя граница равна N − t , верхняя — N + t . | — |
| `tolerance.P02.S03` | UNVERIFIED | Это только проверка числового интервала, а не полный анализ посадки, геометрических допусков или измерительной неопределённости. | — |
| `tolerance.P03.S01` | UNVERIFIED | Пример: 30 ± 0,2 мм допускает размеры от 29,8 до 30,2 мм включительно. | — |
| `tolerance.P04.S01` | UNVERIFIED | Правило принятия решения. | — |
| `tolerance.P04.S02` | UNVERIFIED | Для учебного интервала границы включены. | — |
| `tolerance.P04.S03` | UNVERIFIED | В реальном контроле применяются заданные методика измерения, неопределённость и правило решения о соответствии; округлённое показание на границе не всегда достаточно для приёмки. | — |
| `tolerance.P05.S01` | UNVERIFIED | Задача. | — |
| `tolerance.P05.S02` | UNVERIFIED | Размер детали задан как 25 ± 0,15 мм. | — |
| `tolerance.P05.S03` | UNVERIFIED | Какова верхняя граница допустимого размера в миллиметрах? | — |
| `tolerance.P07.S01` | UNVERIFIED | 25 + 0,15 = 25,15 мм . | — |
| `tolerance.P07.S02` | UNVERIFIED | Нижняя граница составляет 24,85 мм. | — |
| `tolerance.P08.S01` | QUESTION/CONDITION | Задача 2 — контроль детали. | — |
| `tolerance.P08.S02` | UNVERIFIED | Для размера 25 ± 0,15 мм измеренное значение составляет 24,82 мм. | — |
| `tolerance.P08.S03` | UNVERIFIED | На сколько миллиметров оно ниже нижней границы допуска? | — |
| `tolerance.P10.S01` | UNVERIFIED | Нижняя граница 24,85 мм; 24,85 − 24,82 = 0,03 мм. | — |
| `tolerance.P10.S02` | UNVERIFIED | Это сравнение чисел, без учёта неопределённости измерения. | — |
| `tolerance.P11.S01` | UNVERIFIED | Статус: авторский учебный пример. | — |
| `tolerance.P11.S02` | UNVERIFIED | Он не заменяет требований конкретного чертежа, системы допусков и правил принятия решения с учётом неопределённости. | — |

**Предметный статус tolerance: не аттестован целиком.**
