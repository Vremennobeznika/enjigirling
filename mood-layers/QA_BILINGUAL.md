# PSHO 1.4.0 — RU/EN regression acceptance

Date: 2026-10-23. Tested in system Chromium with Playwright, not on physical phones.

## Completed checks

| Suite | Result | Scope |
| --- | --- | --- |
| `tests/bilingual_matrix.py` | 75/75 PASS | RU/EN static+dynamic interface, labels, a11y, graphs, stored note integrity, 7 viewports x 2 languages x 4 tabs, rapid switching |
| `tests/language_persistence.py` | 6/6 PASS | Language and entries survive simulated restart, user's raw text preserved, markup neutralized |
| `tests/dynamic_ui_matrix.py` | 101/101 PASS | Rapid clicks, note save, themes, history, narrow screens and 200% browser zoom |
| `tests/fault_injection.py` | 11/11 PASS | Guarded storage failure and UI recovery in mocked browser |
| `tests/sw_node_mock.js` | PASS | Offline asset precache includes i18n.js, old cache deletion, update only on consent |
| JS syntax (`node --check`) | PASS | app.js, i18n.js, pwa-ui.js, sw.js |

## Defects corrected

- Initial English/Russian switch had not translated messages rendered after navigation. The UI now re-renders localized dynamic elements while preserving user-written notes.
- Added header reflow for 280px and 200% browser zoom; eliminated measured horizontal overflow.
- Service-worker test included an obsolete cache assertion; corrected to validate both older PSHO/SLOI caches and the new dictionary.
- Installation text reacts when the UI language changes while an install prompt is pending.

## Compatibility and safety

No migration of `sloi-v1-*`, `SLOI_BACKUP_V1`, URL, manifest id/scope. Language preference is independent (`psho-ui-language`). Old custom user-written labels are never translated. Import/export keep the existing byte representation of user text. The PWA only caches static files. No external network calls were added.

## Release blockers / NOT TESTED

- Real device tests: physical iPhone Safari/WebKit and Android Chrome, especially old OS versions.
- Real installed PWA offline startup, OS storage eviction, updates during sleep, actual user filesystem JSON restore and actual 200% accessibility text sizing.
- Medical or trademark legal clearance beyond non-diagnostic wording.

The passing automated checks do not establish absolute crash-proof reliability. `localStorage` is not app-encrypted; a JSON backup should be stored securely.
