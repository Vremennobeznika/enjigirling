// Переключатель темы. Выбор запоминается в localStorage.
// На кнопке — эмодзи темы, на которую она переключит: 🌙 в светлой теме, ☀️ в тёмной.
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // localStorage может быть недоступен (приватный режим, запрет cookies) — тогда тема просто не запоминается
    const saved = {
        get: () => { try { return localStorage.getItem('theme'); } catch { return null; } },
        set: (value) => { try { localStorage.setItem('theme', value); } catch { /* ничего страшного */ } }
    };

    function applyTheme(isDark) {
        document.documentElement.classList.toggle('theme-dark', isDark);
        document.body.classList.toggle('theme-dark', isDark);
        toggle.textContent = isDark ? '☀️' : '🌙';
    }

    applyTheme(saved.get() === 'dark');

    toggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('theme-dark');
        applyTheme(isDark);
        saved.set(isDark ? 'dark' : 'light');
    });
});
