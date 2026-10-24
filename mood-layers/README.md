# PSHO — Mood Journal / Дневник настроения

Self-contained, privacy-focused PWA for **iPhone, Android and desktop**. Русская и английская локализации, переключатель **Русский / English** в шапке приложения.

Open: https://vremennobeznika.github.io/enjigirling/mood-layers/

## Installation

- **iPhone:** Safari → Share → Add to Home Screen.
- **Android:** Chrome → menu → Install app / Add to Home screen.
- **Desktop:** Chrome or Edge → Install app.

Install once while online; offline shell is then cached by the service worker where the browser supports it. True offline behavior depends on each browser/device, not established by our Chromium emulation.

## Languages / Языки

- The selected UI language is kept in `psho-ui-language` (localStorage), **separate from diary data**.
- System language can be used on first launch (English for English browser, otherwise Russian), or choose manually.
- The app includes translations for static labels, dynamic mood names, history, charts, notes hints, warnings, confirmation dialogs and PWA installation guidance.
- **Users' own words and earlier entries are NEVER automatically translated.** Existing saved Russian custom labels remain as entered even while the English UI is selected. English defaults apply to *new* data stores created in English.
- Legacy storage keys `sloi-v1-*`, backup format `SLOI_BACKUP_V1`, PWA scope and URL remain **unchanged**, to avoid loss of existing diary data.

## Features

Mood ratings (1–7), anxiety/energy/tension/pain (0–10), tags, sleep, notes, optional word hints, therapy/medication/activity/period checkmarks, graph with missing-day gaps, editing, CSV/JSON export, JSON import and light/dark theme. No diagnosis or automated treatment recommendations.

## Privacy and data safety

No account or cloud sync. Notes are stored locally in browser storage, **not separately encrypted by the app**. Another device will not automatically receive your data. Clearing website data/uninstalling a PWA can erase your notes; export and verify a JSON backup regularly. Imported data is not modified when switching the UI language. Exports contain user-provided content as originally entered.

## QA

`python3 tests/bilingual_matrix.py` — 80 checks; `python3 tests/language_persistence.py` — 6; `python3 tests/dynamic_ui_matrix.py` — 101; `python3 tests/fault_injection.py` — 11. Node scripts `node --check` for app/i18n/pwa-ui/sw. Local browser tests use mocked localStorage and Chromium: no claim is made about physical iPhones/Androids. See `QA_BILINGUAL.md` and `tests/*RESULTS.json`.
## Лёгкая совместимость (1.4.2)
Исправлены устаревшие CSS-конструкции и зависимость перевода от Node.isConnected. Нет внешних пакетов или серверных функций. Браузеры без Grid используют простой flex-макет. Экспорт JSON обязателен для долгосрочного хранения. PWA с автономным запуском доступно начиная с iOS 11.3 и в поддерживаемых браузерах Android; для более старых устройств возможна только обычная веб-страница при наличии связи. Испытания на физическом старом WebKit/Android требуются отдельно.

Версия 1.4.3: словарь переводов уплотнён без изменения строк, исходный суммарный вес 12 статических файлов уменьшен до **109 135 байт** (−50 байт относительно 1.4.1). Повторно проверены язык, сохранение, динамика, отказы, симуляция отсутствия CSS Grid и модуль service worker.

PSHO 1.4.4: заменены четыре вызова NodeList.forEach для старых Chrome/WebKit. Размер 12 статических файлов 109 089 байт (на 96 байт меньше версии 1.4.1). Формат данных не менялся.

## Version 1.5.0: goal tracking

Local goals: weekly frequency, every N days from a fixed start date, or daily habit avoidance. Each goal holds at most one mark per day (idempotent on repeated tapping); unknown days are never treated as failures. An avoidance percentage uses only marked days. Renaming, archiving, restoring and confirmed deletion are supported. Goals use the existing journal backups (SLOI_BACKUP_V1); legacy archives without a goals property remain valid. As before, export JSON before reinstalling or switching Android builds.

Android packaging now includes all bilingual/PWA source scripts plus the goal tracker, and the WebView includes a document picker for JSON import. The APKs from Actions are unverified on physical devices until tested there.
