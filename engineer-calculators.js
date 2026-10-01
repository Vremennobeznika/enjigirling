document.addEventListener('DOMContentLoaded', () => {
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

    /* ===== Калькулятор 1: зарплата по профессии и региону ===== */
    const profSelect = document.getElementById('salaryProfession');
    const regionSelect = document.getElementById('salaryRegion');
    const salaryValue = document.getElementById('salaryResultValue');
    const salaryHint = document.getElementById('salaryResultHint');

    if (profSelect && regionSelect && salaryValue && salaryHint) {
        const profs = Array.isArray(window.professionsData) ? window.professionsData : (typeof professionsData !== 'undefined' && Array.isArray(professionsData) ? professionsData : []);
        profs.forEach(p => {
            const o = document.createElement('option');
            o.value = p.id;
            o.textContent = p.title;
            profSelect.appendChild(o);
        });

        REGION_OPTIONS.forEach(r => {
            const o = document.createElement('option');
            o.value = r.id;
            o.textContent = r.name;
            regionSelect.appendChild(o);
        });

        function renderSalary() {
            const p = profs.find(x => x.id === profSelect.value);
            if (!p || !p.salary) {
                salaryValue.textContent = '—';
                salaryHint.textContent = '';
                return;
            }
            const region = regionSelect.value;
            const regionValue = p.salary.regions && p.salary.regions[region] ? p.salary.regions[region] : '';
            const parts = [p.salary.start ? `старт ${p.salary.start}` : '', p.salary.median ? `медиана ${p.salary.median}` : ''].filter(Boolean).join(' · ');
            salaryValue.textContent = regionValue || p.salary.median || '—';
            salaryHint.textContent = `${p.title} · ${REGION_OPTIONS.find(r => r.id === region).name}. ${parts}`;
        }

        profSelect.addEventListener('change', renderSalary);
        regionSelect.addEventListener('change', renderSalary);
        if (profs.length) renderSalary();
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
            const raw = parseFloat(String(convInput.value).replace(',', '.'));
            if (Number.isNaN(raw)) {
                convValue.textContent = '—';
                convHint.textContent = 'Введите число.';
                return;
            }
            let result;
            if (cat.convert) {
                result = cat.convert(raw, from.id, to.id);
            } else {
                result = raw * from.factor / to.factor;
            }
            const formatted = Number.isFinite(result)
                ? new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 6 }).format(result)
                : '—';
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
            let decimal;
            try {
                decimal = parseInt(text, base);
            } catch (e) {
                decimal = NaN;
            }
            if (Number.isNaN(decimal) || decimal < 0) {
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
});