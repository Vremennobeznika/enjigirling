(() => {
  'use strict';
  const lessons = [...document.querySelectorAll('.lesson')];
  const groups = [...document.querySelectorAll('.group')];
  const forms = [...document.querySelectorAll('form[data-id]')];
  const search = document.getElementById('search');
  const matches = document.getElementById('matches');
  const progress = document.getElementById('progress');
  const prefix = 'enjigirling:academy:practice:';
  const sessionCredit = new Set();
  function showProgress() {
    let count = 0;
    for (const form of forms) {
      const id = form.dataset.id;
      let solved = sessionCredit.has(id);
      try { solved ||= localStorage.getItem(prefix + id) === '1'; } catch {}
      if (solved) count++;
    }
    progress.textContent = 'Зачтено в задачах по направлениям: ' + count + ' из ' + forms.length;
  }
  function filter() {
    const query = search.value.trim().toLocaleLowerCase('ru');
    let count = 0;
    for (const lesson of lessons) {
      lesson.hidden = !lesson.querySelector('summary').textContent.toLocaleLowerCase('ru').includes(query);
      if (!lesson.hidden) count++;
    }
    for (const group of groups) group.hidden = !group.querySelector('.lesson:not([hidden])');
    matches.textContent = query ? (count ? 'Найдено тем: ' + count : 'Тем с таким названием или номером нет.') : '';
  }
  function followAnchor() {
    const id = location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    if (target.hidden || target.closest('[hidden]')) {
      search.value = '';
      filter();
    }
    const lesson = target.closest('.lesson');
    if (lesson) lesson.open = true;
    target.scrollIntoView();
  }
  for (const form of forms) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const raw = form.elements.answer.value.trim().replace(/−/g, '-').replace(',', '.');
      const value = Number(raw);
      const answer = Number(form.dataset.answer);
      const result = form.querySelector('[role="status"]');
      result.className = 'result error';
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw) || !Number.isFinite(value)) {
        result.textContent = 'Введите конечное число. Дробную часть можно отделить запятой.';
        return;
      }
      if (Math.abs(value - answer) > Math.max(1e-8, Math.abs(answer) * 1e-9)) {
        result.textContent = 'Проверьте знак, единицы и ход расчёта. Ниже можно открыть разбор.';
        return;
      }
      const id = form.dataset.id;
      result.className = 'result ok';
      try {
        localStorage.setItem(prefix + id, '1');
        sessionCredit.delete(id);
        result.textContent = 'Верно. Ответ сохранён.';
      } catch {
        sessionCredit.add(id);
        result.textContent = 'Верно. Ответ зачтён в этой вкладке, сохранить его в браузере не удалось.';
      }
      showProgress();
    });
  }
  search.addEventListener('input', filter);
  window.addEventListener('hashchange', followAnchor);
  window.addEventListener('storage', event => {
    if (event.key === null || event.key.startsWith(prefix)) showProgress();
  });
  document.getElementById('filters').hidden = false;
  progress.hidden = false;
  showProgress();
  followAnchor();
})();
