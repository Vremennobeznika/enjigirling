document.addEventListener('DOMContentLoaded', () => {
    const pathSelect = document.getElementById('calcPath');
    const workSelect = document.getElementById('calcWork');
    const ageSelect = document.getElementById('calcAge');
    const resultValue = document.getElementById('calcResultValue');
    const resultHint = document.getElementById('calcResultHint');

    if (!pathSelect || !workSelect || !ageSelect || !resultValue || !resultHint) return;

    // Примерный срок обучения, не прогноз зарплаты.
    const PATHS={
      college9:{label:'СПО после 9 классов',years:3+10/12},
      college11:{label:'СПО после 11 классов',years:2+10/12},
      college9_uni:{label:'СПО → вуз',years:3+10/12+4},
      unibach:{label:'Бакалавриат',years:4},
      unispec:{label:'Специалитет',years:5.5},
      unimaster:{label:'Бакалавриат + магистратура',years:6}
    };

    function formatYears(years) {
        if (years <= 0) return 'уже сейчас';
        const y = Math.floor(years);
        const months = Math.round((years - y) * 12);
        if (y === 0) return `${months} ${pluralMonths(months)}`;
        if (months === 0) return `${y} ${pluralYears(y)}`;
        return `${y} ${pluralYears(y)} и ${months} ${pluralMonths(months)}`;
    }

    function pluralYears(n) {
        const m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return 'год';
        if ([2,3,4].includes(m10) && ![12,13,14].includes(m100)) return 'года';
        return 'лет';
    }

    function pluralMonths(n) {
        const m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return 'месяц';
        if ([2,3,4].includes(m10) && ![12,13,14].includes(m100)) return 'месяца';
        return 'месяцев';
    }

    function calculate() {
      const path=PATHS[pathSelect.value],completed=Number(ageSelect.value);
      if(!path||!Number.isFinite(completed)||completed<0){resultValue.textContent='—';resultHint.textContent='Проверьте исходные данные.';return;}
      resultValue.textContent=formatYears(Math.max(0,path.years-completed));
      resultHint.textContent='Ориентир до диплома: '+path.label+'. Учитывайте уже пройденные годы, только если они относятся к выбранному маршруту. Длительность зависит от программы.'+(workSelect.value==='during'?' Совмещение работы и учёбы возможно, но срок до первой зарплаты неизвестен.':' Диплом не гарантирует трудоустройство.');
    }

    pathSelect.addEventListener('change', calculate);
    workSelect.addEventListener('change', calculate);
    ageSelect.addEventListener('change', calculate);

    calculate();
});