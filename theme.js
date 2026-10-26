// Сохраняем явный выбор темы; по умолчанию используем тёмную.
(function () {
  const key = 'theme';
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (value) => { try { localStorage.setItem(key, value); } catch {} };
  const saved = read();
  const initialDark = saved === 'light' ? false : true;
  function apply(dark) {
    document.documentElement.classList.toggle('theme-dark', dark);
    document.documentElement.classList.toggle('theme-light', !dark);
    document.body.classList.toggle('theme-dark', dark);
    document.body.classList.toggle('theme-light', !dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.textContent = dark ? '☀' : '☾';
      button.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
      button.setAttribute('title', dark ? 'Светлая тема' : 'Тёмная тема');
      button.setAttribute('aria-pressed', String(dark));
    });
  }
  apply(initialDark);
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.classList.contains('theme-dark'));
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('theme-dark');
      apply(dark); save(dark ? 'dark' : 'light');
    }));
  });
})();
