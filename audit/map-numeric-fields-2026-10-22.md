# Аудит всех числовых полей программ — 22.10.2026

Объект: `map-data.js`. 70 исходных полей `budgetPlaces`, `paidPlaces`, `tuitionAnnualRub`, `tuitionSemesterRub`, `duration` в карточках 80 учреждений.

**Критерий:** одного совпадения числа на странице недостаточно. Нужно связать значение со строкой нужного кода, базой/формой и годом. Записи со сбоями доступа и без достаточной привязки скрыты из пользовательского каталога. Статус `ОСТАВЛЕНО` означает наличие признаков подтверждения конкретной строкой источника в проведённой проверке, но не независимую нотариальную или государственную экспертизу.

| № | Учреждение | Код | Поле | Значение | Результат | Источник |
|---:|---|---|---|---|---|---|
| 1 | БГТУ «ВОЕНМЕХ» им. Д. Ф. Устинова | 15.03.01 | tuitionAnnualRub | 310000 | ОСТАВЛЕНО: источник/строка | https://priem.voenmeh.ru/stoimost-obucheniya |
| 2 | Колледж технологии, моделирования и управления СПбГУПТД | 09.02.11 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://sutd.ru/ktmu/education/0/37402/ |
| 3 | Политехнический колледж городского хозяйства | 09.02.06 | budgetPlaces | 50 | ОСТАВЛЕНО: источник/строка | https://pkgh.ru/abitur/specialties-plan/ |
| 4 | Политехнический колледж городского хозяйства | 09.02.06 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://pkgh.ru/abitur/specialties-plan/ |
| 5 | Мурманский индустриальный колледж | 26.01.01 | budgetPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://murindkol.ru/abiturientu/priemnaya-komissiya-1/nabor-na-obuchenie/ |
| 6 | Мурманский индустриальный колледж | 26.01.01 | paidPlaces | 5 | ОСТАВЛЕНО: источник/строка | https://murindkol.ru/abiturientu/priemnaya-komissiya-1/nabor-na-obuchenie/ |
| 7 | Мурманский индустриальный колледж | 26.01.01 | duration | 2 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://murindkol.ru/abiturientu/priemnaya-komissiya-1/nabor-na-obuchenie/ |
| 8 | МГТУ им. Баумана | 15.03.01 | tuitionAnnualRub | 529000 | ОСТАВЛЕНО: источник/строка | https://isot.bmstu.ru/edu/cost |
| 9 | Московский техникум космического приборостроения | 09.02.11 | budgetPlaces | 60 | ОСТАВЛЕНО: источник/строка | https://mtkp.bmstu.ru/entrant/plan-priema |
| 10 | Московский техникум космического приборостроения | 09.02.11 | paidPlaces | 40 | ОСТАВЛЕНО: источник/строка | https://mtkp.bmstu.ru/entrant/plan-priema |
| 11 | Московский техникум космического приборостроения | 09.02.11 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://mtkp.bmstu.ru/entrant/plan-priema |
| 12 | Воронежский политехнический техникум (реорганизация 2026) | 15.02.16 | budgetPlaces | 100 | ОСТАВЛЕНО: источник/строка | https://profcopp.ru/WhereToGoStudy/GetInfo?spo=7e50cbcc-47b3-48e1-b427-2e89c0eb62d9 |
| 13 | Воронежский политехнический техникум (реорганизация 2026) | 15.02.16 | duration | 46 месяцев | ОСТАВЛЕНО: источник/строка | https://profcopp.ru/WhereToGoStudy/GetInfo?spo=7e50cbcc-47b3-48e1-b427-2e89c0eb62d9 |
| 14 | Колледж «Коломна» | 15.02.16 | budgetPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://college-kolomna.ru/tehnologiya-mashinostroeniya/ |
| 15 | Колледж «Коломна» | 15.02.16 | paidPlaces | 5 | ОСТАВЛЕНО: источник/строка | https://college-kolomna.ru/tehnologiya-mashinostroeniya/ |
| 16 | Колледж «Коломна» | 15.02.16 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://college-kolomna.ru/tehnologiya-mashinostroeniya/ |
| 17 | Ростовский-на-Дону колледж связи и информатики | 09.02.11 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://www.rksi.ru/admission |
| 18 | СКФУ | 08.03.01 | duration | 4 года 6 месяцев | ОСТАВЛЕНО: источник/строка | https://sveden.pf.ncfu.ru/sveden/education/programs/gorodskoe-stroitelystvo-i-hozyaystvo-ozfo-2026-08.03.01.html |
| 19 | Грозненский ГНТУ | 21.03.01 | duration | 4 года | ОСТАВЛЕНО: источник/строка | https://gstou.ru/sveden/education/programs/ekspluataciya-i-obslughivanie-obyektov-dobychi-nefti-21.03.01_1.html |
| 20 | Ставропольский строительный техникум | 08.02.01 | duration | 4 года 2 месяца | ОСТАВЛЕНО: источник/строка | https://www.xn--80aejpylecgdd1b.xn--p1ai/index.php/deyatelnost/dostizheniya/item/4114-2026-2030-08-02-01-stroitelstvo-i-ekspluatatsiya-zdanij-i-sooruzhenij |
| 21 | Саратовский ГТУ | 15.03.01 | duration | 4 года | ОСТАВЛЕНО: источник/строка | https://www.sstu.ru/obrazovanie/obrazovatelnye-programmy/bakalavriat-i-spetsialitet/imm/mashinostroenie-mnst |
| 22 | Ульяновский ГТУ | 15.03.01 | duration | 4 года | ОСТАВЛЕНО: источник/строка | https://ulstu.ru/education_programs/element.php?ELEMENT_ID=13303 |
| 23 | Международный центр компетенций — Казанский техникум информационных технологий и связи | 09.02.01 | budgetPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://mck-ktits.ru/%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D1%86%D0%B8%D1%84%D1%80%D1%8B-%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%B0/ |
| 24 | Международный центр компетенций — Казанский техникум информационных технологий и связи | 09.02.01 | paidPlaces | 30 | ОСТАВЛЕНО: источник/строка | https://mck-ktits.ru/%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D1%86%D0%B8%D1%84%D1%80%D1%8B-%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%B0/ |
| 25 | Международный центр компетенций — Казанский техникум информационных технологий и связи | 09.02.01 | tuitionSemesterRub | 56950 | ОСТАВЛЕНО: источник/строка | https://mck-ktits.ru/%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D1%86%D0%B8%D1%84%D1%80%D1%8B-%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%B0/ |
| 26 | Международный центр компетенций — Казанский техникум информационных технологий и связи | 09.02.01 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://mck-ktits.ru/%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D1%86%D0%B8%D1%84%D1%80%D1%8B-%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%B0/ |
| 27 | Уфимский машиностроительный колледж | 15.02.16 | budgetPlaces | 125 | ОСТАВЛЕНО: источник/строка | https://umkufa.ru/abitur/spo/ |
| 28 | Тюменский Индустриальный Университет | 21.03.01 | duration | 4 года | ОСТАВЛЕНО: источник/строка | https://tyuiu.ru/sveden/education/programs/burenie-neftyanyh-i-gazovyh-skvaghin-21.03.01.html |
| 29 | Екатеринбургский политехникум | 15.02.16 | budgetPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://ekpt.ru/abiturientam/komissiya/kontrolnye_cifry_priema/ |
| 30 | Екатеринбургский политехникум | 15.02.16 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://ekpt.ru/abiturientam/komissiya/kontrolnye_cifry_priema/ |
| 31 | Челябинский механико-технологический техникум | 15.02.16 | budgetPlaces | 95 | ОСТАВЛЕНО: источник/строка | https://chelmtt.ru/index.php/2020-04-23-16-04-19?id=224 |
| 32 | Омский государственный технический университет (ОмГТУ) | 15.03.01 | duration | 4 года | ОСТАВЛЕНО: источник/строка | https://www.omgtu.ru/general_information/institutes/engineering_institute/department_quot_equipment_and_technology_of_welding_quot/OiTSP/the-applicant.php |
| 33 | Новосибирский техникум железнодорожного транспорта СГУПС | 23.02.06 | budgetPlaces | 55 | ОСТАВЛЕНО: источник/строка | https://www.ntgt.ru/abiturient/priyemnaya-kampaniya-2026/ |
| 34 | Новосибирский техникум железнодорожного транспорта СГУПС | 23.02.06 | paidPlaces | 10 | ОСТАВЛЕНО: источник/строка | https://www.ntgt.ru/abiturient/priyemnaya-kampaniya-2026/ |
| 35 | Томский техникум информационных технологий | 09.02.06 | budgetPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://tomtit.gosuslugi.ru/abiturientam/ |
| 36 | Томский техникум информационных технологий | 09.02.06 | duration | 3 года 9 месяцев | ОСТАВЛЕНО: источник/строка | https://tomtit.gosuslugi.ru/abiturientam/ |
| 37 | Красноярский техникум промышленного сервиса | 15.02.16 | budgetPlaces | 50 | ОСТАВЛЕНО: источник/строка | https://ktps24.ru/abitur/plan-priema/plan-priema.php |
| 38 | Владивостокский судостроительный колледж | 26.02.02 | budgetPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://vstehn.ru/priemnaya_komissiya/nashi-specialnosti-2/sudostroenie/ |
| 39 | Владивостокский судостроительный колледж | 26.02.02 | paidPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://vstehn.ru/priemnaya_komissiya/nashi-specialnosti-2/sudostroenie/ |
| 40 | Владивостокский судостроительный колледж | 26.02.02 | tuitionAnnualRub | 187000 | ОСТАВЛЕНО: источник/строка | https://vstehn.ru/priemnaya_komissiya/nashi-specialnosti-2/sudostroenie/ |
| 41 | Владивостокский судостроительный колледж | 26.02.02 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://vstehn.ru/priemnaya_komissiya/nashi-specialnosti-2/sudostroenie/ |
| 42 | Хабаровский техникум транспортных технологий имени А. С. Панова | 23.02.06 | budgetPlaces | 50 | ОСТАВЛЕНО: источник/строка | https://py16dv.ru/abiturientu/kontrolnye-tsifry-prijoma |
| 43 | Хабаровский техникум транспортных технологий имени А. С. Панова | 23.02.06 | paidPlaces | 25 | ОСТАВЛЕНО: источник/строка | https://py16dv.ru/abiturientu/kontrolnye-tsifry-prijoma |
| 44 | Хабаровский техникум транспортных технологий имени А. С. Панова | 23.02.06 | tuitionAnnualRub | 123515 | ОСТАВЛЕНО: источник/строка | https://py16dv.ru/abiturientu/kontrolnye-tsifry-prijoma |
| 45 | Хабаровский техникум транспортных технологий имени А. С. Панова | 23.02.06 | duration | 3 года 10 месяцев | ОСТАВЛЕНО: источник/строка | https://py16dv.ru/abiturientu/kontrolnye-tsifry-prijoma |
| 46 | БГТУ «ВОЕНМЕХ» им. Д. Ф. Устинова | 15.03.01 | duration | 4 года, очная форма | СКРЫТО: строка/условия не подтверждены | https://priem.voenmeh.ru/stoimost-obucheniya |
| 47 | ГУАП | 11.03.01 | budgetPlaces | 125 | СКРЫТО: строка/условия не подтверждены | https://priem.guap.ru/calc |
| 48 | ГУАП | 11.03.01 | paidPlaces | 10 | СКРЫТО: строка/условия не подтверждены | https://priem.guap.ru/calc |
| 49 | ГУАП | 11.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://priem.guap.ru/calc |
| 50 | Московский авиационный институт (МАИ) | 25.03.01 | budgetPlaces | 50 | СКРЫТО: строка/условия не подтверждены | https://priem.mai.ru/base/programs/index.php/ |
| 51 | Московский авиационный институт (МАИ) | 25.03.01 | paidPlaces | 40 | СКРЫТО: строка/условия не подтверждены | https://priem.mai.ru/base/programs/index.php/ |
| 52 | Московский авиационный институт (МАИ) | 25.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://priem.mai.ru/base/programs/index.php/ |
| 53 | МИРЭА — Российский технологический университет | 09.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://stavropol.mirea.ru/sveden/education |
| 54 | НИУ МГСУ | 08.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://iiesm.mgsu.ru/postupayushchim/Bakalavriat-spetsialitet/Napravleniya-podgotovki-spetsialnosti/stroitelstvo_bakalavriat/promyshlennoe-i-grazhdanskoe-stroitelstvo.php |
| 55 | МАДИ | 23.03.01 | budgetPlaces | 118 | СКРЫТО: строка/условия не подтверждены | https://pk.madi.ru/59-plan-priema.html |
| 56 | МАДИ | 23.03.01 | paidPlaces | 32 | СКРЫТО: строка/условия не подтверждены | https://pk.madi.ru/59-plan-priema.html |
| 57 | Воронежский ГТУ | 15.03.01 | budgetPlaces | 21 | СКРЫТО: строка/условия не подтверждены | https://abiturient.cchgeu.ru/osnovnye-svedeniya-postupayushchim/bak-spec/plan-reception-bak/ |
| 58 | Воронежский ГТУ | 15.03.01 | paidPlaces | 10 | СКРЫТО: строка/условия не подтверждены | https://abiturient.cchgeu.ru/osnovnye-svedeniya-postupayushchim/bak-spec/plan-reception-bak/ |
| 59 | ДГТУ | 15.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://itf.donstu.ru/sveden/education/programs/oborudovanie-i-tehnologiya-svarochnogo-proizvodstva-15.03.01.html |
| 60 | ЮРГПУ (НПИ) им. М. И. Платова | 15.03.04 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://npi-tu.ru/sveden/education/eduaccred |
| 61 | ВолгГТУ | 15.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://www.vstu.ru/sveden/education/ |
| 62 | КНИТУ-КАИ | 24.03.04 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://kai.ru/sveden/education |
| 63 | ПНИПУ | 15.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://pstu.ru/sveden/education/?act=discip&key=%7Be9ad059f-f525-4553-8de7-374b701c1c37%7D |
| 64 | Чувашский государственный университет им. И. Н. Ульянова | 13.03.02 | duration | 4 года (очная) | СКРЫТО: строка/условия не подтверждены | https://www.chuvsu.ru/sveden/education/programs/inghenernoe-konstruirovanie-i-tehnologiya-sozdaniya-elektricheskih-apparatov-13.03.02.html |
| 65 | Пермский техникум промышленных и информационных технологий им. Б. Г. Изгагина | 15.02.16 | duration | 3 года 10 месяцев | СКРЫТО: строка/условия не подтверждены | https://ptpit.ru/?page_id=6838 |
| 66 | Уральский федеральный университет им. Б. Н. Ельцина (УрФУ) | 15.03.01 | duration | 5 лет | СКРЫТО: строка/условия не подтверждены | https://programms.edu.urfu.ru/ru/10936/ |
| 67 | ЮУрГУ | 15.03.01 | duration | 4 года | СКРЫТО: строка/условия не подтверждены | https://www.susu.ru/ru/about/official/plans?field_department_filter_value_1=All&field_year_begin_value=All&page=3 |
| 68 | Курганский государственный университет (КГУ) | 15.03.01 | tuitionAnnualRub | 169900 | СКРЫТО: строка/условия не подтверждены | https://abit.kgsu.ru/page/3 |
| 69 | ТПУ | 13.03.02 | duration | 4 года, очная | СКРЫТО: строка/условия не подтверждены | https://abiturient.tpu.ru/programmy/upravlenie-obektami-elektroenergeticheskikh-sistem-1873/ |
| 70 | Губернаторский авиастроительный колледж г. Комсомольска-на-Амуре (МЦК) | 24.02.01 | duration | 2 года 10 месяцев | СКРЫТО: строка/условия не подтверждены | http://gaskk-mck.ru/index.php/abiturientu/itemlist/category/24-professii-i-spetsialnosti |

## Существенные замечания
- **Челябинский механико-технологический техникум**: 95 — общее количество по 15.02.16, распределено по базе/форме 80 + 15. Нельзя называть это 95 местами только для очного обучения после 9 классов.
- **Хабаровский техникум**: 123515 рублей действительно повторяется как для 23.02.01, так и для 23.02.06 в таблице платного очного приёма 2026/27; отсутствие уникальности суммы не доказывает ошибку. Число проверено в строке 23.02.06.
- **Томский техникум**: срок опубликован в сокращении «3 г. 9 м», что равнозначно 3 годам 9 месяцам, при базе 9 классов.
- **Владивостокский судостроительный колледж**: сумма 187.000 ₽/год опубликована с точкой как разделителем тысяч; здесь это 187000 ₽.

## Отдельный незакрытый перечень
- Номера кодов программ, годы публикации, даты в метаданных, числовые сведения в свободном тексте `note`, `verifiedScope`, `reviewMethod`, значения калькуляторов `map-calc.js` и числа в HTML не входят в эти 70 полей. Они требуют самостоятельного аудит-трека. Нельзя называть это сверкой всех цифр всего раздела.
- Для полного фактического PASS каждому сохранённому числовому значению нужны конкретные фрагменты источника с периодом и базой; в этой таблице указан первичный адрес для последующей перепроверки.
