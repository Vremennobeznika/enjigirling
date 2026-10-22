/* Works both as a normal script and as a deferred-on-demand module. */
(function(){'use strict';let initialized=false;
function initEngineerCalculators(){if(initialized)return;initialized=true;
    // Профессии из data.js (нужны калькуляторам зарплаты)
    const professions = Array.isArray(window.professionsData) ? window.professionsData : [];

    // Число из поля ввода: понимает пробелы и запятую («100 000», «2,5»)
    const parseNumber = (text) => {
        const normalized = String(text).replace(/[\s\u00a0]/g, '').replace(',', '.');
        return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized) ? Number(normalized) : NaN;
    };
    const formatNumber = (n, digits = 0) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits }).format(n);
    const formatRub = (n) => `${formatNumber(Math.round(n))} ₽`;
    // Склонение по числу: plural(3, ['год', 'года', 'лет']) → «года»
    const plural = (n, [one, few, many]) => {
        const last = n % 10, lastTwo = n % 100;
        if (last === 1 && lastTwo !== 11) return one;
        if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
        return many;
    };

    const REGION_OPTIONS = [
        { id: 'central', name: 'Центральный ФО' },
        { id: 'northwest', name: 'Северо-Западный ФО' },
        { id: 'south', name: 'Южный ФО' },
        { id: 'northcaucasus', name: 'Северо-Кавказский ФО' },
        { id: 'volga', name: 'Приволжский ФО' },
        { id: 'ural', name: 'Уральский ФО' },
        { id: 'siberia', name: 'Сибирский ФО' },
        { id: 'fareast', name: 'Дальневосточный ФО' }
    ];

    /* ===== Зарплатный ориентир: только источник, никакой выдуманной региональной статистики ===== */
    const profSelect = document.getElementById('salaryProfession');
    const salaryValue = document.getElementById('salaryResultValue');
    const salaryHint = document.getElementById('salaryResultHint');
    const salaryById = new Map((window.salarySourceAudit || []).map(row => [row.id, row]));

    if (profSelect && salaryValue && salaryHint) {
        professions.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.title;
            profSelect.appendChild(option);
        });

        function renderSalary() {
            const entry = salaryById.get(profSelect.value);
            if (!entry || entry.status !== 'source_snapshot' || !Number.isFinite(entry.rangeMinRub) || !Number.isFinite(entry.rangeMaxRub)) {
                salaryValue.textContent = 'Нет подтверждённых данных';
                salaryHint.textContent = 'Проверяемого зарплатного диапазона нет. Неподтверждённые суммы скрыты.';
                return;
            }
            if (entry.validationStatus === 'adjacent_occupation_checked') {
                salaryValue.textContent = 'Нет сопоставимой оценки';
                salaryHint.textContent = `Данные относятся к смежной профессии, не переносим суммы на выбранную должность. Источник: ${entry.sourceTitle}. ${entry.sourceUrl}`;
                return;
            }
            salaryValue.textContent = entry.rangeMinRub === entry.rangeMaxRub
                ? `от ${formatNumber(entry.rangeMinRub)} ₽`
                : `${formatNumber(entry.rangeMinRub)}–${formatNumber(entry.rangeMaxRub)} ₽`;
            const kind = entry.evidenceLevel === 'single_observation'
                ? 'Отдельная вакансия, не рыночная медиана'
                : 'Опубликованные данные источника, не универсальная зарплата профессии';
            salaryHint.textContent = `${kind}. ${entry.region}; ${entry.metric}. Дата записи: ${entry.checkedAt}. Источник: ${entry.sourceTitle}. ${entry.sourceUrl}. Сопоставимость по должности, региону и дате требует отдельной проверки.`;
        }

        profSelect.addEventListener('change', renderSalary);
        if (professions.length) renderSalary();
    }

    /* ===== Калькулятор 2: инженерный конвертер единиц ===== */
    const convCategory = document.getElementById('convCategory');
    const convFrom = document.getElementById('convFrom');
    const convTo = document.getElementById('convTo');
    const convInput = document.getElementById('convInput');
    const convValue = document.getElementById('convResultValue');
    const convHint = document.getElementById('convResultHint');

    if (convCategory && convFrom && convTo && convInput && convValue && convHint) {
        const CATEGORIES = {
            length: {
                name: 'Длина',
                units: [
                    { id: 'mm', name: 'Миллиметры (мм)', factor: 0.001 },
                    { id: 'cm', name: 'Сантиметры (см)', factor: 0.01 },
                    { id: 'm', name: 'Метры (м)', factor: 1 },
                    { id: 'km', name: 'Километры (км)', factor: 1000 },
                    { id: 'in', name: 'Дюймы (in)', factor: 0.0254 },
                    { id: 'ft', name: 'Футы (ft)', factor: 0.3048 }
                ]
            },
            mass: {
                name: 'Масса',
                units: [
                    { id: 'g', name: 'Граммы (г)', factor: 0.001 },
                    { id: 'kg', name: 'Килограммы (кг)', factor: 1 },
                    { id: 't', name: 'Тонны (т)', factor: 1000 },
                    { id: 'lb', name: 'Фунты (lb)', factor: 0.45359237 }
                ]
            },
            pressure: {
                name: 'Давление',
                units: [
                    { id: 'pa', name: 'Паскали (Па)', factor: 1 },
                    { id: 'kpa', name: 'Килопаскали (кПа)', factor: 1000 },
                    { id: 'mpa', name: 'Мегапаскали (МПа)', factor: 1000000 },
                    { id: 'bar', name: 'Бары (бар)', factor: 100000 },
                    { id: 'kgscm', name: 'кгс/см²', factor: 98066.5 },
                    { id: 'atm', name: 'Атмосферы (атм)', factor: 101325 },
                    { id: 'psi', name: 'PSI', factor: 6894.757293168 }
                ]
            },
            power: {
                name: 'Мощность',
                units: [
                    { id: 'w', name: 'Ватты (Вт)', factor: 1 },
                    { id: 'kw', name: 'Киловатты (кВт)', factor: 1000 },
                    { id: 'hp', name: 'Лошадиные силы (л.с.)', factor: 735.49875 }
                ]
            },
            temperature: {
                name: 'Температура',
                units: [
                    { id: 'c', name: 'Градусы Цельсия (°C)' },
                    { id: 'f', name: 'Градусы Фаренгейта (°F)' },
                    { id: 'k', name: 'Кельвины (K)' }
                ],
                convert: (value, from, to) => {
                    let kelvin;
                    if (from === 'c') kelvin = value + 273.15;
                    else if (from === 'f') kelvin = (value - 32) * 5 / 9 + 273.15;
                    else kelvin = value;
                    if (to === 'c') return kelvin - 273.15;
                    if (to === 'f') return (kelvin - 273.15) * 9 / 5 + 32;
                    return kelvin;
                }
            }
        };

        function fillUnits(categoryId, select, keep) {
            const cat = CATEGORIES[categoryId];
            const current = keep && select.value ? select.value : cat.units[0].id;
            select.innerHTML = '';
            cat.units.forEach(u => {
                const o = document.createElement('option');
                o.value = u.id;
                o.textContent = u.name;
                select.appendChild(o);
            });
            select.value = current;
        }

        function renderConv() {
            const cat = CATEGORIES[convCategory.value];
            const from = cat.units.find(u => u.id === convFrom.value);
            const to = cat.units.find(u => u.id === convTo.value);
            const raw = parseNumber(convInput.value);
            if (!Number.isFinite(raw)) {
                convValue.textContent = '—';
                convHint.textContent = 'Введите число.';
                return;
            }
            if (cat.name === 'Температура' && ((from.id === 'k' && raw < 0) || (from.id === 'c' && raw < -273.15) || (from.id === 'f' && raw < -459.67))) {
                convValue.textContent = '—';
                convHint.textContent = 'Температура ниже абсолютного нуля невозможна.';
                return;
            }
            let result;
            if (cat.convert) {
                result = cat.convert(raw, from.id, to.id);
            } else {
                result = raw * from.factor / to.factor;
            }
            const formatted = !Number.isFinite(result) ? '—'
                : result !== 0 && Math.abs(result) < 0.000001
                ? result.toExponential(6).replace('.', ',')
                : new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 6 }).format(result);
            convValue.textContent = formatted;
            convHint.textContent = `${raw} ${from.name} = ${formatted} ${to.name}`;
        }

        convCategory.addEventListener('change', () => {
            fillUnits(convCategory.value, convFrom, false);
            fillUnits(convCategory.value, convTo, false);
            renderConv();
        });
        convFrom.addEventListener('change', renderConv);
        convTo.addEventListener('change', renderConv);
        convInput.addEventListener('input', renderConv);
        fillUnits(convCategory.value, convFrom, false);
        fillUnits(convCategory.value, convTo, false);
    }

    /* ===== Калькулятор 3: перевод систем счисления ===== */
    const numInput = document.getElementById('numInput');
    const numBase = document.getElementById('numBase');
    const numBin = document.getElementById('numBin');
    const numOct = document.getElementById('numOct');
    const numDec = document.getElementById('numDec');
    const numHex = document.getElementById('numHex');
    const numHint = document.getElementById('numResultHint');

    if (numInput && numBase && numBin && numOct && numDec && numHex && numHint) {
        function renderNum() {
            const base = parseInt(numBase.value, 10);
            const text = numInput.value.trim();
            if (!text) {
                numBin.textContent = '—';
                numOct.textContent = '—';
                numDec.textContent = '—';
                numHex.textContent = '—';
                numHint.textContent = '';
                return;
            }
            if (text.length > 256) {
                for (const element of [numBin,numOct,numDec,numHex]) element.textContent = '—';
                numHint.textContent = 'Для слабых устройств ограничение: не больше 256 цифр.';
                return;
            }
            // Проверяем ВСЮ строку: parseInt('102', 2) ошибочно принимает её за 2.
            // BigInt исключает потерю точности для больших инженерных значений.
            const validDigits = { 2: /^[01]+$/i, 8: /^[0-7]+$/i, 10: /^[0-9]+$/i, 16: /^[0-9a-f]+$/i };
            const valid = validDigits[base] && validDigits[base].test(text);
            let decimal = null;
            if (valid) {
                try {
                    const prefixes = { 2: '0b', 8: '0o', 10: '', 16: '0x' };
                    decimal = BigInt(prefixes[base] + text);
                } catch (e) { /* недопустимый ввод */ }
            }
            if (decimal === null) {
                numBin.textContent = '—';
                numOct.textContent = '—';
                numDec.textContent = '—';
                numHex.textContent = '—';
                numHint.textContent = 'Некорректное число для выбранной системы счисления.';
                return;
            }
            numBin.textContent = decimal.toString(2);
            numOct.textContent = decimal.toString(8);
            numDec.textContent = decimal.toString(10);
            numHex.textContent = decimal.toString(16).toUpperCase();
            numHint.textContent = `Число ${text} в системе с основанием ${base} = ${decimal} в десятичной.`;
        }

        numInput.addEventListener('input', renderNum);
        numBase.addEventListener('change', renderNum);
    }

    /* ===== Калькулятор 4: зарплата на руки (НДФЛ 2026) ===== */
    const netGross = document.getElementById('netGross');
    const netProfession = document.getElementById('netProfession');
    const netValue = document.getElementById('netResultValue');
    const netHint = document.getElementById('netResultHint');

    if (netGross && netProfession && netValue && netHint) {
        // Шкала НДФЛ для резидентов РФ (ст. 224 НК РФ, с 2025 года): ставка действует только на часть годового дохода внутри ступени
        const NDFL_BRACKETS = [
            { upTo: 2400000, rate: 0.13 },
            { upTo: 5000000, rate: 0.15 },
            { upTo: 20000000, rate: 0.18 },
            { upTo: 50000000, rate: 0.20 },
            { upTo: Infinity, rate: 0.22 }
        ];
        const yearlyTax = (income) => {
            let tax = 0, from = 0;
            for (const { upTo, rate } of NDFL_BRACKETS) {
                if (income > from) tax += (Math.min(income, upTo) - from) * rate;
                from = upTo;
            }
            return tax;
        };

        professions.filter(p => p.salary && p.salary.median && (window.salarySourceAudit || []).some(item => item.id === p.id && item.status === 'source_snapshot')).forEach(p => {
            const o = document.createElement('option');
            o.value = p.id;
            o.textContent = `${p.title} (ввод зарплаты вручную; прежняя медиана не проверена)`;
            netProfession.appendChild(o);
        });

        function renderNet() {
            const monthly = parseNumber(netGross.value);
            if (!Number.isFinite(monthly) || monthly < 0) {
                netValue.textContent = '—';
                netHint.textContent = 'Введите сумму в рублях.';
                return;
            }
            const yearly = monthly * 12;
            if (!Number.isFinite(yearly)) {
                netValue.textContent = '—';
                netHint.textContent = 'Сумма слишком велика для расчёта.';
                return;
            }
            const tax = yearlyTax(yearly);
            const rate = yearly ? tax / yearly * 100 : 0;
            netValue.textContent = formatRub((yearly - tax) / 12);
            netHint.textContent = `НДФЛ за год: ${formatRub(tax)} (${formatNumber(rate, 1)} % дохода). На руки за год: ${formatRub(yearly - tax)}. Оценка среднемесячной суммы при одинаковом доходе все 12 месяцев, для налогового резидента РФ, без вычетов и иных доходов. Фактическое удержание НДФЛ по месяцам может отличаться; повышенная ставка применяется только к превышению порога. Не учитываются особые категории доходов и налоговые статусы.`;
        }

        netProfession.addEventListener('change', () => {
            const p = professions.find(x => x.id === netProfession.value);
            if (!p) return;
            netGross.value = '';
            renderNet();
        });
        netGross.addEventListener('input', () => {
            netProfession.value = '';
            renderNet();
        });
        renderNet();
    }

    /* ===== Калькулятор 5: окупаемость обучения ===== */
    const roiCost = document.getElementById('roiCost');
    const roiYears = document.getElementById('roiYears');
    const roiBefore = document.getElementById('roiBefore');
    const roiAfter = document.getElementById('roiAfter');
    const roiValue = document.getElementById('roiResultValue');
    const roiHint = document.getElementById('roiResultHint');

    if (roiCost && roiYears && roiBefore && roiAfter && roiValue && roiHint) {
        function renderRoi() {
            const [cost, years, before, after] = [roiCost, roiYears, roiBefore, roiAfter].map(el => parseNumber(el.value));
            if ([cost, years, before, after].some(n => !Number.isFinite(n) || n < 0)) {
                roiValue.textContent = '—';
                roiHint.textContent = 'Заполните все поля числами.';
                return;
            }
            const total = cost * years;
            const gain = after - before;
            if (!Number.isFinite(total) || !Number.isFinite(gain)) {
                roiValue.textContent = '—';
                roiHint.textContent = 'Значения слишком велики для расчёта.';
                return;
            }
            if (total === 0) {
                roiValue.textContent = 'Сразу';
                roiHint.textContent = 'Обучение бесплатное — затрат, которые нужно возвращать, нет.';
                return;
            }
            if (gain <= 0) {
                roiValue.textContent = 'Не окупится';
                roiHint.textContent = `Затраты на обучение: ${formatRub(total)}. Ожидаемая зарплата не выше нынешней — прироста дохода нет.`;
                return;
            }
            const months = Math.ceil(total / gain);
            if (!Number.isSafeInteger(months)) {
                roiValue.textContent = '—';
                roiHint.textContent = 'Срок окупаемости выходит за пределы допустимого расчёта.';
                return;
            }
            const y = Math.floor(months / 12), m = months % 12;
            const parts = [];
            if (y) parts.push(`${y} ${plural(y, ['год', 'года', 'лет'])}`);
            if (m) parts.push(`${m} ${plural(m, ['месяц', 'месяца', 'месяцев'])}`);
            roiValue.textContent = parts.join(' ');
            roiHint.textContent = `Затраты на обучение: ${formatRub(total)}. Прирост дохода: +${formatRub(gain)} в месяц до налогов. Упрощённая модель: срок считается с момента выпуска, не учитывает упущенный заработок за время учёбы, налоги, инфляцию и изменение зарплаты.`;
        }
        [roiCost, roiYears, roiBefore, roiAfter].forEach(el => el.addEventListener('input', renderRoi));
        renderRoi();
    }

    /* ===== Калькулятор 6: токовый сигнал 4–20 мА ===== */
    const maMin = document.getElementById('maMin');
    const maMax = document.getElementById('maMax');
    const maCurrent = document.getElementById('maCurrent');
    const maValue = document.getElementById('maValue');
    const maResultValue = document.getElementById('maResultValue');
    const maResultHint = document.getElementById('maResultHint');

    if (maMin && maMax && maCurrent && maValue && maResultValue && maResultHint) {
        let lastEdited = 'current';      // какое из двух полей вводил пользователь — второе пересчитывается
        const toInput = (n) => String(+n.toFixed(3)).replace('.', ',');

        // Состояние сигнала по NAMUR NE 43
        function signalState(mA) {
            if (mA <= 3.6) return 'Сигнал диагностики отказа (≤ 3,6 мА). Причина определяется документацией датчика.';
            if (mA < 3.8) return 'Ниже измерительного диапазона NE 43 (3,6–3,8 мА).';
            if (mA < 4) return 'Ниже номинальной шкалы 4–20 мА: зона насыщения, не нормальное значение.';
            if (mA <= 20) return 'В пределах номинальной шкалы 4–20 мА.';
            if (mA < 20.5) return 'Выше номинальной шкалы 4–20 мА: зона насыщения.';
            if (mA < 21) return 'Выше измерительного диапазона NE 43 (20,5–21 мА).';
            return 'Сигнал диагностики отказа (≥ 21 мА). Причина определяется документацией датчика.';
        }

        function renderMa() {
            const min = parseNumber(maMin.value);
            const max = parseNumber(maMax.value);
            if (Number.isNaN(min) || Number.isNaN(max)) {
                maResultValue.textContent = '—';
                maResultHint.textContent = 'Введите начало и конец шкалы.';
                return;
            }
            if (min === max) {
                maResultValue.textContent = '—';
                maResultHint.textContent = 'Начало и конец шкалы должны отличаться.';
                return;
            }
            const span = max - min;
            let mA, value;
            if (lastEdited === 'current') {
                mA = parseNumber(maCurrent.value);
                if (Number.isNaN(mA)) { maValue.value = ''; maResultValue.textContent = '—'; maResultHint.textContent = 'Введите ток в миллиамперах.'; return; }
                value = min + (mA - 4) / 16 * span;
                maValue.value = toInput(value);
            } else {
                value = parseNumber(maValue.value);
                if (Number.isNaN(value)) { maCurrent.value = ''; maResultValue.textContent = '—'; maResultHint.textContent = 'Введите значение процесса.'; return; }
                mA = 4 + (value - min) / span * 16;
                maCurrent.value = toInput(mA);
            }
            if (![span, mA, value].every(Number.isFinite)) {
                maResultValue.textContent = '—';
                maResultHint.textContent = 'Результат вне числового диапазона.';
                return;
            }
            if (mA <= 3.6 || mA >= 21) {
                maResultValue.textContent = '— (сигнал отказа)';
                if (lastEdited === 'current') maValue.value = '';
                maResultHint.textContent = signalState(mA) + ' Пересчёт в величину процесса заблокирован.';
                return;
            }
            const percent = (mA - 4) / 16 * 100;
            maResultValue.textContent = lastEdited === 'current'
                ? `${formatNumber(mA, 3)} мА → ${formatNumber(value, 3)}`
                : `${formatNumber(value, 3)} → ${formatNumber(mA, 3)} мА`;
            maResultHint.textContent = `${formatNumber(percent, 1)} % диапазона. ${signalState(mA)}`;
        }

        maCurrent.addEventListener('input', () => { lastEdited = 'current'; renderMa(); });
        maValue.addEventListener('input', () => { lastEdited = 'value'; renderMa(); });
        maMin.addEventListener('input', renderMa);
        maMax.addEventListener('input', renderMa);
        renderMa();
    }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initEngineerCalculators,{once:true});else initEngineerCalculators();
})();
