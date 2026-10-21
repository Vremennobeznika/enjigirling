# ENJIGIRLING — Калькуляторы инженера

Страница: https://vremennobeznika.github.io/enjigirling/calculator.html

Справочные данные. Файл передаётся в контекст ИИ и не дообучает модель. Технические, юридические и финансовые утверждения необходимо проверять по первоисточникам.

## Содержимое страницы

Этот раздел для ИИ Полное содержимое для загрузки в нейросеть: не только ссылка на страницу. Markdown JSON Как передать ИИ → Инженерные калькуляторы Мастерская расчётов ENJIGIRLING От бита до цеха: вычисления на вашем устройстве без отправки введённых значений на сервер. Раскройте только нужную мастерскую. Цифровые данные Битоскоп Системы счисления Электротехника Электроцех Сигнал 4–20 мА Производство Цеховой расчёт Швейное дело Раскрой и поток Настил и усадка Море и суда Морской блокнот Корпус и течение Единицы и измерения Инженерный конвертер Шкаломер Атлас идей: 734 калькулятора по 34 отраслям → Поиск, источники и CSV. Пока это каталог идей, а не готовые 734 расчёта. Цифровые данные Форматы чисел и перевод систем счисления 2 инструмента Битоскоп — паспорт двоичного числа FP16 · bfloat16 · TF32 · FP32 · FP64 · HEX ↔ биты ↔ десятичное Разбор знака, порядка и мантиссы. Можно изменить отдельный бит кнопкой, декодировать HEX или двоичную строку и увидеть разницу с введённым десятичным значением. Формат FP32 — 32 бита FP64 — 64 бита FP16 — 16 бит bfloat16 — 16 бит TF32 — 19 значащих битов Исходное представление Десятичное значение HEX-код (побитный) Биты (0/1) Число или битовый код 0.1 −0 1.5 ∞ NaN Разверните калькулятор, чтобы начать. Паспорт числа · редактируемые разряды Знак Порядок Мантисса Хранимое значение — HEX — Бинарная запись — Знак — Порядок (со смещением) — Мантисса — Ошибка представления относительно десятичного ввода — Копировать HEX Копировать биты Округление: к ближайшему, при равенстве — к чётному. FP16 и bfloat16 рассчитаны программно; FP32 и FP64 используют DataView браузера. NaN, бесконечность, субнормальные числа и −0 поддерживаются. Представление HEX показывается в сетевом порядке (старший байт первым). TF32 представлен логическими 19 битами (1+8+10), а не 32-битной аппаратной раскладкой с пустыми битами. Системы счисления BIN / OCT / DEC / HEX Перевод систем счисления Введите число в выбранной системе — получите его в двоичной, восьмеричной, десятичной и шестнадцатеричной. Система счисления Двоичная (2) Восьмеричная (8) Десятичная (10) Шестнадцатеричная (16) Число Результат — Двоичная (2) — Восьмеричная (8) — Шестнадцатеричная (16) — Электротехника и автоматика Цепи, датчики, Modbus и токовый сигнал 2 инструмента Электроцех — сигналы, цепи и допуски Закон Ома · делитель · RC · допусковая цепь · регистры Float32 Электрическая цепь: закон Ома (постоянный ток) Известные величины U и R U и I I и R Напряжение U (В) Сопротивление R (Ом) — Идеальная цепь постоянного тока. Не учитывает нагрев, динамические и нелинейные нагрузки. Резистивный делитель напряжения Вход, В Верхнее плечо, Ом Нижнее плечо, Ом — Делитель без нагрузки: вход измерителя считается бесконечно высокоомным. RC-цепь: постоянная времени и частота среза Сопротивление, Ом Ёмкость, мкФ — τ = R·C; f = 1/(2πRC). Идеальная цепь первого порядка без паразитных элементов. Допусковая цепь размеров Один размер в строке: номинал;симметричный допуск 10;0.1 -2;0.2 — Максимальный допуск — сумма модулей допусков. RSS — статистическая оценка при независимых отклонениях; она не заменяет расчёт гарантированной взаимозаменяемости. Modbus: два регистра → Float32 Регистр 1 (HEX, 16 бит) Регистр 2 (HEX, 16 бит) Порядок байтов в дампе ABCD (старшее слово первым) BADC CDAB (слова переставлены) DCBA — Modbus не фиксирует порядок двух регистров внутри 32-битного числа. Сверьте упаковку Float32 по документации устройства. Токовая петля 4–20 мА Датчики · значение процесса ↔ ток Токовый сигнал 4–20 мА Перевод тока датчика в значение процесса и обратно по диапазону шкалы: давление, уровень, температура, расход. Начало шкалы (при токе 4 миллиампера) Конец шкалы (при токе 20 миллиампер) Ток в миллиамперах Значение процесса (в единицах шкалы) Результат — Пример: из тока 4–20 мА в значение шкалы Для линейно настроенного передатчика используйте долю диапазона: X = Xmin + (I − 4) × (Xmax − Xmin) / 16 , где I — ток в мА, а Xmin и Xmax — значения начала и конца шкалы. Проверка: шкала 0–10 условных единиц, измеренный ток 12 мА. Доля диапазона — (12 − 4) / 16 = 0,5; расчётное значение — 5 единиц . Эти значения уже установлены в калькуляторе выше по умолчанию. Формула применима к линейной шкале и не определяет состояние датчика при аварийном сигнале. Настройки диапазона, допустимые токи неисправности, единицы и алгоритм обработки проверяйте по документации конкретного прибора. Производственные расчёты Оборудование, такт, материалы и технологические режимы 1 инструмента Цеховой расчёт — производственная панель Такт · OEE · масса заготовки · удлинение · резание · расход Шесть самостоятельных проверочных расчётов. Никакой базы коэффициентов «на глаз»: исходные данные задаёт пользователь, единицы показаны в полях. Такт выпуска Доступное время смены, мин Плановый выпуск, шт — Такт = доступное время / спрос. Рассчитан для заданного выпуска; не равен фактическому времени цикла оборудования. OEE — эффективность оборудования Плановый фонд, мин Фактическая работа, мин Всего произведено, шт Годных изделий, шт Идеальный цикл, с/шт — OEE = доступность × производительность × качество. Если производительность выше 100%, проверьте норматив цикла и границы учёта времени. Масса прямоугольной заготовки Плотность, кг/м³ Длина, мм Ширина, мм Толщина, мм — m = ρV. Плотность 7850 кг/м³ только пример для расчёта — фактическое значение зависит от конкретного материала и источника. Линейное тепловое расширение Исходная длина, мм Коэффициент расширения, 10⁻⁶/K Разница температур, °C — ΔL = αLΔT. Линейная модель с постоянным коэффициентом в рассматриваемом диапазоне; для ответственных расчётов проверяйте зависимость α от температуры. Скорость резания и обороты Рассчитать из Частоты вращения Скорости резания Диаметр инструмента/заготовки, мм Частота, об/мин — v = πDn/1000. Формула описывает окружную скорость, но не подбирает безопасный режим резания для инструмента. Объёмный расход через круглое сечение Внутренний диаметр, мм Средняя скорость потока, м/с — Q = Av для известной средней скорости; без потерь давления, профиля скоростей и расчёта гидросопротивления. Швейное производство Раскрой, потери материала и эффективность потока 2 инструмента Раскрой и поток — швейные расчёты Раскладка · ткань · нитки · нормо-минуты Расчёты для конструкторов, технологов и швейного производства. Используйте реальные ширины, результаты САПР, нормы и контрольные образцы. Полезная площадь раскладки Сумма площади лекал, см² Длина раскладки, м Полезная ширина, см — Доля лекал от прямоугольной площади раскладки. Не включает концевые потери и межнастильные отходы. Формула и пояснения . Расход ткани из готовой раскладки Длина раскладки, м Изделий в раскладке, шт Дополнительные потери, % Изделий в заказе, шт — Норма по готовому маркеру. Межлекальные отходы уже включены в длину; повторно КПД не применяется. Формула и пояснения . Нитки: шов, тип стежка и партия Длина шва на изделии, м Расход нитки / длина шва Потери, % Размер партии, шт — Примерный коэффициент 5,5 относится к цепному стежку класса 401. Фактический коэффициент зависит от нитей, плотности стежка и материала. Лучше измерить на образце. Формула и пояснения . Эффективность швейного потока Годных изделий, шт SMV на изделие, мин Число учтённых работников Рабочих минут на человека — Выработанные нормо-минуты / доступные человеко-минуты. Состав работников и SMV должны быть сопоставимы между периодами. Формула и пояснения . Настил и усадка — швейный контроль Усадка материала · настил · баланс операций Усадка ткани по двум измерениям До обработки, см После обработки, см — Усадка (%) = (до − после) / до × 100. Отрицательное число означает растяжение. Не заменяет методику лабораторных испытаний. Расход ткани на многослойный настил Изделий в раскладке Слоёв настила Длина раскладки, м Припуск на каждый слой, м — Итог = число слоёв × (длина + припуск). Без отходов на брак и дополнительных потерь. Баланс потока по операциям Время операций, секунды; одна операция в строке 20 30 15 Целевой такт, с — Теоретическое минимальное число рабочих мест округляется вверх из суммы операций/такта; реальная балансировка требует учёта последовательности, переналадок и оборудования. Море и судостроение Переходы, корпус, расход топлива, течение и осадка 2 инструмента Морской блокнот — море и судостроение Переход · топливо · корпус · осадка Учебные инженерные оценки. Эти калькуляторы не заменяют судовой погрузочный компьютер, утверждённую информацию об остойчивости, навигационные документы или планирование рейса. Расчётное время перехода Дистанция по маршруту, миль морских Средняя путевая скорость, уз — Расчёт при постоянной скорости относительно грунта. Погода, течения, манёвры, ограничения движения и остановки не учтены. Формула и пояснения . Расход и дополнительный запас топлива Дистанция, морских миль Путевая скорость, уз Расход за час, л/ч Дополнительный запас, % — Постоянный часовой расход и скорость. Процент задаётся пользователем и не является нормативом безопасного резерва, требования судна и рейса определяются отдельно. Формула и пояснения . Ориентир скорости водоизмещающего корпуса Длина корпуса по ватерлинии, м — Эмпирическое соотношение 1,34 × √LWL (в футах), результат в узлах. Не предел скорости, не расчёт сопротивления и мощности; неприменимо как универсальное правило для всех судов. Формула и пояснения . Осадка: оценка через TPC Изменение массы, т (минус при выгрузке) Площадь ватерлинии, м² Плотность воды, т/м³ — TPC = A × ρ / 100; Δосадки, см = Δмассы / TPC. Локальное приближение для малого изменения средней осадки без дифферента. Для реальной грузовой операции нужны одобренные таблицы и контроль остойчивости. Формула и пояснения . Корпус и течение — морские расчёты Водоизмещение · поправка на течение Водоизмещение через коэффициент полноты Длина между перпендикулярами, м Ширина, м Средняя осадка, м Коэффициент полноты Cb Плотность воды, т/м³ — Δ = L × B × T × Cb × ρ. Это геометрическая оценка, не расчёт грузовой марки, посадки или остойчивости. Течение и результирующая скорость Ход судна относительно воды, уз Курс движения относительно воды, градусы Скорость течения, уз Направление течения КУДА, градусы — Векторная сумма скорости судна и течения; все углы от севера по часовой стрелке. Направление течения — куда течёт вода, а не откуда. Единицы и измерения Штангенциркуль и перевод физических величин 2 инструмента Шкаломер — виртуальный штангенциркуль 50 мм · нониус 0,1 / 0,05 / 0,02 мм · учебная модель Перемещайте ползунок или используйте клавиши стрелок. На схеме меняется положение подвижной губки и нониуса. Это тренажёр отсчёта, а не измерение реального предмета на экране. Цена деления нониуса 0,1 мм · 10 делений 0,05 мм · 20 делений 0,02 мм · 50 делений Раствор губок, мм Передвинуть подвижную губку — Отсчёт = целые миллиметры главной шкалы + номер совпавшего деления × цена деления. Нониус условный: при 50 делениях он показан схематично, а не в физическом масштабе прибора. Штангенциркуль без поверки не подходит для контроля реальных деталей. Конвертер инженерных единиц Длина · масса · давление · мощность · температура Инженерный конвертер единиц Перевод длины, массы, давления, мощности и температуры: мм↔дюймы, кВт↔л.с., МПа↔кгс/см² и другие. Величина Длина Масса Давление Мощность Температура Значение Из В Результат —

## Исходные данные раздела

Источник: https://vremennobeznika.github.io/enjigirling/engineering-lab-core.js

~~~javascript
/* Dependency-free engineering math. No requests, no timers, no global listeners. */
(function(global){
'use strict';
const bytes=new ArrayBuffer(8), view=new DataView(bytes);
const formats={fp16:{bits:16,e:5,m:10,bias:15},bf16:{bits:16,e:8,m:7,bias:127},tf32:{bits:19,e:8,m:10,bias:127},fp32:{bits:32,e:8,m:23,bias:127},fp64:{bits:64,e:11,m:52,bias:1023}};
const power=(n,p)=>Math.pow(n,p);
function roundEven(x){
 const down=Math.floor(x),fraction=x-down;
 return fraction>.5||(fraction===.5&&down%2!==0)?down+1:down;
}
function smallEncode(x,fmt){
 const sign=x<0||Object.is(x,-0)?1:0, top=(1<<fmt.e)-1;
 const head=sign<<(fmt.e+fmt.m);
 if(Number.isNaN(x))return head|(top<<fmt.m)|(1<<(fmt.m-1));
 if(!Number.isFinite(x))return head|(top<<fmt.m);
 const a=Math.abs(x);
 if(a===0)return head;
 const min=power(2,1-fmt.bias);
 let e=Math.floor(Math.log2(a));
 if(e>fmt.bias)return head|(top<<fmt.m);
 if(a<min){
  const fraction=roundEven(a/power(2,1-fmt.bias-fmt.m));
  if(fraction>=1<<fmt.m)return head|(1<<fmt.m);
  return head|fraction;
 }
 let fraction=roundEven((a/power(2,e)-1)*power(2,fmt.m));
 if(fraction===power(2,fmt.m)){fraction=0;e++;}
 if(e+fmt.bias>=top)return head|(top<<fmt.m);
 return head|((e+fmt.bias)<<fmt.m)|fraction;
}
function smallDecode(word,fmt){
 const sign=(word>>(fmt.e+fmt.m))&1,raw=(word>>fmt.m)&((1<<fmt.e)-1),m=word&((1<<fmt.m)-1),max=(1<<fmt.e)-1;
 if(raw===max)return m?NaN:(sign?-Infinity:Infinity);
 if(raw===0)return (sign?-1:1)*m*power(2,1-fmt.bias-fmt.m);
 const n=(1+m/power(2,fmt.m))*power(2,raw-fmt.bias);
 return sign?-n:n;
}
function hexOfFloat(value,format){
 const fmt=formats[format];if(!fmt)throw Error('Неизвестный формат');
 if(fmt.bits<32)return smallEncode(value,fmt).toString(16).toUpperCase().padStart(Math.ceil(fmt.bits/4),'0');
 if(fmt.bits===32){view.setFloat32(0,value,false);return view.getUint32(0,false).toString(16).toUpperCase().padStart(8,'0');}
 view.setFloat64(0,value,false);
 return view.getUint32(0,false).toString(16).toUpperCase().padStart(8,'0')+view.getUint32(4,false).toString(16).toUpperCase().padStart(8,'0');
}
function classify(format,hex){
 const fmt=formats[format],bin=BigInt('0x'+hex).toString(2).padStart(fmt.bits,'0');
 const sign=bin[0],exp=bin.slice(1,1+fmt.e),mantissa=bin.slice(1+fmt.e);
 const biased=parseInt(exp,2),max=power(2,fmt.e)-1;
 let kind,stored;
 if(fmt.bits<32){stored=smallDecode(parseInt(hex,16),fmt);}
 else if(fmt.bits===32){view.setUint32(0,parseInt(hex,16),false);stored=view.getFloat32(0,false);}
 else {view.setUint32(0,parseInt(hex.slice(0,8),16),false);view.setUint32(4,parseInt(hex.slice(8),16),false);stored=view.getFloat64(0,false);}
 if(biased===max)kind=/1/.test(mantissa)?'NaN':'Бесконечность';
 else if(biased===0)kind=/1/.test(mantissa)?'Субнормальное':'Нуль';
 else kind='Нормальное';
 return {format,hex:'0x'+hex,bin,sign,exponent:exp,mantissa,biased,unbiased:biased===0?1-fmt.bias:biased-max===0?null:biased-fmt.bias,kind,stored,exponentBits:fmt.e,mantissaBits:fmt.m};
}
function decimalInput(s){
 let val=String(s).trim().replace(',','.');
 if(/^[+-]?inf(?:inity)?$/i.test(val))return val[0]==='-'?-Infinity:Infinity;
 if(/^nan$/i.test(val))return NaN;
 if(!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d{1,3})?$/i.test(val)||val.length>90)throw Error('Введите десятичное число, Infinity, -Infinity или NaN');
 const n=Number(val);if(Number.isNaN(n))throw Error('Некорректное число');
 return n;
}
function encode(format,input){const x=decimalInput(input);return {...classify(format,hexOfFloat(x,format)),source:input,error:Number.isFinite(x)?(classify(format,hexOfFloat(x,format)).stored-x):NaN};}
function decode(format,text,base){
 const f=formats[format];if(!f)throw Error('Неизвестный формат');
 const input=String(text).trim().replace(/[\s_]/g,'').replace(base==='hex'?/^0x/i:/^0b/i,'');
 let hex;
 if(base==='hex'){if(!/^[\da-f]+$/i.test(input)||input.length!==Math.ceil(f.bits/4))throw Error('Ожидается '+Math.ceil(f.bits/4)+' HEX-символов');hex=input.toUpperCase();}
 else {if(!/^[01]+$/.test(input)||input.length!==f.bits)throw Error('Ожидается '+f.bits+' битов');hex=BigInt('0b'+input).toString(16).toUpperCase().padStart(Math.ceil(f.bits/4),'0');}
 if(BigInt('0x'+hex)>=(1n<<BigInt(f.bits)))throw Error('Код не помещается в '+f.bits+' бит');
 return classify(format,hex);
}
function exactError(format,hex,raw){
 try{
  const parsed=String(raw).trim().replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(parsed))return '—';
  const eNum=Number(parsed.split(/e/i)[1]||0),body=parsed.split(/e/i)[0],isNeg=body[0]==='-';
  const digits=body.replace(/^[-+]/,'').replace('.','').replace(/^0+/,'')||'0';
  const decimalPlaces=(body.split('.')[1]||'').length;
  const tenPower=eNum-decimalPlaces;
  if(Math.abs(tenPower)>340||digits.length>90)return 'Вне диапазона точного сравнения';
  let n=BigInt(digits)*(isNeg?-1n:1n),den=1n;
  if(tenPower>=0)n*=10n**BigInt(tenPower);else den=10n**BigInt(-tenPower);
  const f=formats[format],b=BigInt('0x'+hex.replace(/^0x/i,'')),all=BigInt(f.bits),m=BigInt(f.m),e=BigInt(f.e);
  const sign=(b>>(all-1n))&1n;
  const rawExp=Number((b>>m)&((1n<<e)-1n));
  const mant=b&((1n<<m)-1n);
  if(rawExp===(1<<f.e)-1)return '—';
  const exp2=(rawExp===0?1-f.bias:rawExp-f.bias)-f.m;
  let stored=(rawExp===0?mant:mant+(1n<<m))*(sign===1n?-1n:1n),storedDen=1n;
  if(exp2>=0)stored*=1n<<BigInt(exp2);else storedDen=1n<<BigInt(-exp2);
  let diff=stored*den-n*storedDen,div=storedDen*den;
  if(diff===0n)return '0 (точно)';
  const negative=diff<0n;if(negative)diff=-diff;
  let power10=diff.toString().length-div.toString().length;
  let scale=power10>=0?div*10n**BigInt(power10):div;
  let numerator=power10>=0?diff:diff*10n**BigInt(-power10);
  if(numerator<scale){power10--;numerator*=10n;}
  const precision=15,scaled=numerator*10n**BigInt(precision-1)/scale;
  const str=scaled.toString().padStart(precision,'0');
  return (negative?'-':'+')+str[0]+'.'+str.slice(1).replace(/0+$/,'')+' × 10^'+power10;
 }catch{return '—';}
}
function number(text){const normalized=String(text).trim().replace(/\s/g,'').replace(',','.');return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)?Number(normalized):NaN;}
function ohm(mode,x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<=0)throw Error('Введите допустимые положительные значения');
 let u,i,r;
 if(mode==='ur'){u=x;r=y;i=u/r;}
 else if(mode==='ui'){u=x;i=y;r=u/i;}
 else if(mode==='ir'){i=x;r=y;u=i*r;}
 else throw Error('Неизвестный режим');
 if(![u,i,r,u*i].every(Number.isFinite))throw Error('Результат за пределами диапазона');
 return {u,i,r,p:u*i};
}
function divider(u,r1,r2){
 if(![u,r1,r2].every(Number.isFinite)||r1<=0||r2<=0)throw Error('Сопротивления должны быть положительными');
 return {v:u*r2/(r1+r2),i:u/(r1+r2),p1:power(u/(r1+r2),2)*r1,p2:power(u/(r1+r2),2)*r2};
}
function rc(r,cMicro){
 if(!Number.isFinite(r)||!Number.isFinite(cMicro)||r<=0||cMicro<=0)throw Error('R и C должны быть больше нуля');
 const tau=r*cMicro*1e-6;
 return {seconds:tau,frequency:1/(2*Math.PI*tau)};
}
function tolerance(raw){
 const text=String(raw).trim();if(text.length>3000)throw Error('Слишком много данных');
 const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 if(!lines.length||lines.length>25)throw Error('От 1 до 25 размеров');
 let nominal=0,worst=0,sumSquares=0;
 for(const [idx,line] of lines.entries()){
  const cells=line.split(/[;\t]/).map(x=>number(x));
  if(cells.length!==2||!cells.every(Number.isFinite)||cells[1]<0)throw Error('Строка '+(idx+1)+': формат номинал;±допуск');
  nominal+=cells[0];worst+=cells[1];sumSquares+=cells[1]**2;
 }
 return {nominal,worst,rss:Math.sqrt(sumSquares),count:lines.length};
}
function modbus(register1,register2,order){
 const valid=x=>/^(?:0x)?[0-9a-f]{1,4}$/i.test(String(x).trim());
 if(!valid(register1)||!valid(register2))throw Error('Введите два HEX-регистра 0000–FFFF');
 const a=parseInt(String(register1).replace(/^0x/i,''),16),b=parseInt(String(register2).replace(/^0x/i,''),16);
 const ordered=[a>>8,a&255,b>>8,b&255];
 const pos={ABCD:[0,1,2,3],BADC:[1,0,3,2],CDAB:[2,3,0,1],DCBA:[3,2,1,0]}[order];
 if(!pos)throw Error('Неизвестный порядок байтов');
 pos.forEach((p,i)=>view.setUint8(i,ordered[p]));
 return {value:view.getFloat32(0,false),hex:view.getUint32(0,false).toString(16).toUpperCase().padStart(8,'0')};
}

/* Production quantities are standalone dimensioned calculations, not plant norms. */
function finitePositive(n,label){if(!Number.isFinite(n)||n<=0)throw Error(label+' должно быть положительным числом');return n;}
function finiteNonnegative(n,label){if(!Number.isFinite(n)||n<0)throw Error(label+' должно быть неотрицательным числом');return n;}
function finish(values){if(!values.every(Number.isFinite))throw Error('Результат вне диапазона вычислений');}
function takt(availableMinutes,requiredPieces){
 finitePositive(availableMinutes,'Доступное время');
 finitePositive(requiredPieces,'Потребность в выпуске');
 const seconds=availableMinutes*60/requiredPieces;
 finish([seconds]);if(seconds<=0)throw Error('Недопустимое время такта');
 return {seconds,perHour:3600/seconds};
}
function oee(plannedMinutes,runMinutes,total,good,idealSeconds){
 finitePositive(plannedMinutes,'Плановый фонд');
 finitePositive(runMinutes,'Фактическая работа');
 finitePositive(total,'Количество изделий');
 finiteNonnegative(good,'Годные изделия');
 finitePositive(idealSeconds,'Идеальный цикл');
 if(runMinutes>plannedMinutes)throw Error('Время работы больше планового фонда');
 if(good>total)throw Error('Годных изделий не может быть больше всего выпущенных');
 const availability=runMinutes/plannedMinutes;
 const performance=idealSeconds*total/(runMinutes*60);
 const quality=good/total;
 finish([availability,performance,quality]);
 if(performance>1+1e-9)throw Error('Производительность выше 100%: проверьте идеальный цикл или данные о выпуске');
 return {availability,performance,quality,oee:availability*performance*quality};
}
function billetMass(densityKgM3,lengthMM,widthMM,heightMM){
 for(const [v,name] of [[densityKgM3,'Плотность'],[lengthMM,'Длина'],[widthMM,'Ширина'],[heightMM,'Толщина']])finitePositive(v,name);
 const cubicMeters=lengthMM*widthMM*heightMM*1e-9;
 const kilograms=cubicMeters*densityKgM3;
 finish([cubicMeters,kilograms]);
 return {cubicMeters,kilograms};
}
function thermalLength(lengthMM,alphaPPM,deltaC){
 finitePositive(lengthMM,'Исходная длина');
 if(!Number.isFinite(alphaPPM))throw Error('Коэффициент расширения должен быть числом');
 if(!Number.isFinite(deltaC))throw Error('Изменение температуры некорректно');
 const deltaMM=lengthMM*alphaPPM*1e-6*deltaC,finalMM=lengthMM+deltaMM;
 finish([deltaMM,finalMM]);
 if(finalMM<0)throw Error('Расчётная длина отрицательна — проверьте допущения');
 return {deltaMM,finalMM};
}
function cutSpeed(mode,diameterMM,quantity){
 finitePositive(diameterMM,'Диаметр');
 finitePositive(quantity,'Частота или скорость');
 const constant=Math.PI*diameterMM/1000;
 const mPerMin=mode==='rpm'?constant*quantity:mode==='speed'?quantity:NaN;
 const rpm=mode==='rpm'?quantity:mode==='speed'?quantity/constant:NaN;
 finish([mPerMin,rpm]);
 return {mPerMin,rpm};
}
function pipeFlow(diameterMM,speedMS){
 finitePositive(diameterMM,'Диаметр проходного сечения');
 finiteNonnegative(speedMS,'Скорость потока');
 const areaM2=Math.PI*(diameterMM/1000)**2/4;
 const m3Hour=areaM2*speedMS*3600;
 finish([areaM2,m3Hour]);
 return {m3Hour,litersMinute:m3Hour*1000/60};
}


/* Textile shop: figures depend on actual marker layouts, seam types and standards. */
function percentRange(n,label,max=100){
 finiteNonnegative(n,label);
 if(n>max)throw Error(label+' вне диапазона 0–'+max+' %');
}
function integerPositive(n,label){
 finitePositive(n,label);
 if(!Number.isSafeInteger(n))throw Error(label+' должно быть целым числом');
}
function markerEfficiency(areaCm2,lengthM,widthCm){
 finitePositive(areaCm2,'Площадь лекал');finitePositive(lengthM,'Длина раскладки');finitePositive(widthCm,'Полезная ширина');
 const markerCm2=lengthM*100*widthCm;
 finish([markerCm2]);
 if(areaCm2>markerCm2*(1+1e-10))throw Error('Площадь лекал превышает площадь раскладки');
 const fraction=areaCm2/markerCm2;
 return {percent:fraction*100,wastePercent:(1-fraction)*100,markerM2:markerCm2/10000,wasteM2:(markerCm2-areaCm2)/10000};
}
function fabricBooking(markerLengthM,piecesInMarker,allowancePct,orderPieces){
 finitePositive(markerLengthM,'Длина раскладки');
 integerPositive(piecesInMarker,'Изделий в раскладке');
 integerPositive(orderPieces,'Количество изделий в заказе');
 percentRange(allowancePct,'Припуск',100);
 const perPiece=markerLengthM/piecesInMarker*(1+allowancePct/100);
 const totalM=perPiece*orderPieces;
 finish([perPiece,totalM]);
 return {perPiece,totalM};
}
function threadBooking(seamMeters,ratio,lossPct,orderPieces){
 finitePositive(seamMeters,'Длина шва');
 finitePositive(ratio,'Расход нитки на 1 м шва');
 percentRange(lossPct,'Потери',100);
 integerPositive(orderPieces,'Размер партии');
 const perPieceM=seamMeters*ratio*(1+lossPct/100);
 const totalM=perPieceM*orderPieces;
 finish([perPieceM,totalM]);
 return {perPieceM,totalM};
}
function sewingEfficiency(goodPieces,smvMin,staff,workedMin){
 finiteNonnegative(goodPieces,'Годный выпуск');
 if(!Number.isSafeInteger(goodPieces))throw Error('Годный выпуск должен быть целым числом');
 finitePositive(smvMin,'SMV');
 integerPositive(staff,'Число сотрудников');
 finitePositive(workedMin,'Минут на человека');
 const earnedMin=goodPieces*smvMin,availableMin=staff*workedMin;
 const percent=earnedMin/availableMin*100;
 finish([earnedMin,availableMin,percent]);
 return {earnedMin,availableMin,percent};
}
/* Maritime: dimensional arithmetic for teaching and desk estimates, not approved navigation. */
const NM_METRES=1852;
function marinePassage(distanceNm,speedKn){
 finitePositive(distanceNm,'Дистанция');
 finitePositive(speedKn,'Скорость относительно грунта');
 const hours=distanceNm/speedKn;
 finish([hours]);
 return {hours,minutes:hours*60,distanceKm:distanceNm*NM_METRES/1000,speedKmh:speedKn*NM_METRES/1000};
}
function marineFuel(distanceNm,speedKn,litresHour,reservePct){
 const voyage=marinePassage(distanceNm,speedKn);
 finiteNonnegative(litresHour,'Расход топлива');
 percentRange(reservePct,'Дополнительный запас',1000);
 const usedL=voyage.hours*litresHour;
 const totalL=usedL*(1+reservePct/100);
 finish([usedL,totalL]);
 return {hours:voyage.hours,usedL,extraL:totalL-usedL,totalL};
}
function hullSpeed(lwlM){
 finitePositive(lwlM,'Длина ватерлинии');
 const knots=1.34*Math.sqrt(lwlM/0.3048);
 finish([knots]);
 return {knots,kilometresHour:knots*NM_METRES/1000};
}
function draftByTPC(changedTonnes,waterplaneM2,densityTonM3){
 if(!Number.isFinite(changedTonnes))throw Error('Изменение массы должно быть числом');
 finitePositive(waterplaneM2,'Площадь ватерлинии');
 finitePositive(densityTonM3,'Плотность воды');
 const tpc=waterplaneM2*densityTonM3/100;
 const deltaCm=changedTonnes/tpc;
 finish([tpc,deltaCm]);
 return {tpc,deltaCm,deltaM:deltaCm/100};
}


/* Further textile/marine desk models with explicit simplifying assumptions. */
function shrinkage(before,after){
 finitePositive(before,'Исходный размер');finitePositive(after,'Размер после обработки');
 return {percent:(before-after)/before*100,change:after-before};
}
function layLength(piecesPerLay,plyCount,patternLengthM,endAllowanceM){
 integerPositive(piecesPerLay,'Изделий в раскладке');
 integerPositive(plyCount,'Число слоёв');
 finitePositive(patternLengthM,'Длина настила');
 finiteNonnegative(endAllowanceM,'Припуск на слой');
 const output=piecesPerLay*plyCount,consumption=plyCount*(patternLengthM+endAllowanceM);
 finish([output,consumption]);return {output,consumption,perPiece:consumption/output};
}
function lineBalance(raw,taktSeconds){
 finitePositive(taktSeconds,'Такт');
 const lines=String(raw).trim().split(/\r?\n/).filter(x=>x.trim());
 if(!lines.length||lines.length>60)throw Error('Введите 1–60 операций');
 let sum=0,max=0;for(const row of lines){
  const x=number(row);finitePositive(x,'Время операции');
  sum+=x;max=Math.max(max,x);
 }
 const theoretical=Math.ceil(sum/taktSeconds);
 const cycle=Math.max(taktSeconds,max);
 finish([sum,cycle,theoretical]);
 return {sum,operations:lines.length,theoretical,bottleneck:max,withinTakt:max<=taktSeconds};
}
function displacement(lengthM,beamM,draftM,coefficient,density){
 for(const [n,label] of [[lengthM,'Длина'],[beamM,'Ширина'],[draftM,'Средняя осадка'],[density,'Плотность воды']])finitePositive(n,label);
 finitePositive(coefficient,'Коэффициент полноты');if(coefficient>1)throw Error('Коэффициент полноты не может превышать единицу');
 const volume=lengthM*beamM*draftM*coefficient,tonnes=volume*density;
 finish([volume,tonnes]);return {volume,tonnes};
}
function currentVector(shipSpeed,courseDeg,currentSpeed,currentDirectionDeg){
 finiteNonnegative(shipSpeed,'Скорость судна относительно воды');finiteNonnegative(currentSpeed,'Скорость течения');
 for(const x of [courseDeg,currentDirectionDeg])if(!Number.isFinite(x))throw Error('Направления должны быть числами');
 const rad=Math.PI/180;
 const x=shipSpeed*Math.sin(courseDeg*rad)+currentSpeed*Math.sin(currentDirectionDeg*rad);
 const y=shipSpeed*Math.cos(courseDeg*rad)+currentSpeed*Math.cos(currentDirectionDeg*rad);
 const sog=Math.hypot(x,y),cog=(Math.atan2(x,y)*180/Math.PI+360)%360;
 finish([sog,cog]);return {sog,cog};
}
function vernier(mm,step){
 finiteNonnegative(mm,'Раствор губок');
 if(mm>50)throw Error('Диапазон учебной модели 0–50 мм');
 if(![.1,.05,.02].includes(step))throw Error('Выберите цену деления');
 const ticks=Math.round(mm/step),read=ticks*step;
 const whole=Math.floor(ticks*step+1e-9),fraction=Math.round((read-whole)/step);
 return {read:Math.round(read*100)/100,whole,fraction,step};
}

global.EngineeringMath={formats,encode,decode,exactError,number,ohm,divider,rc,tolerance,modbus,takt,oee,billetMass,thermalLength,cutSpeed,pipeFlow,markerEfficiency,fabricBooking,threadBooking,sewingEfficiency,marinePassage,marineFuel,hullSpeed,draftByTPC,shrinkage,layLength,lineBalance,displacement,currentVector,vernier};
})(typeof window!=='undefined'?window:globalThis);

~~~

## Правила использования

Различать непроверенные редакционные сведения, данные и предположения. Для расчётов, зарплат и нормативов нужна независимая проверка.
