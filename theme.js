document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.classList.add('theme-dark');
        document.body.classList.add('theme-dark');
        toggle.textContent = '☀';
    }

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('theme-dark');
        document.body.classList.toggle('theme-dark', isDark);
        toggle.textContent = isDark ? '☀' : '☾';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
});