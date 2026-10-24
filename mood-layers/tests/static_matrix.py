#!/usr/bin/env python3
"""Offline file and source assertions — not runtime/device acceptance."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1]
app=(R/'app.js').read_text();html=(R/'index.html').read_text();css=(R/'style.css').read_text();sw=(R/'sw.js').read_text();android=(R/'android/app/src/main/AndroidManifest.xml').read_text();native=(R/'android/app/src/main/java/app/layers/mood/MainActivity.java').read_text()
checks={
'html language and viewport':'lang="ru"' in html and 'viewport-fit=cover' in html,
'core tabs present':all(f'id="{p}"' in html for p in ['today','history','goals','insights','settings']),
'goals scripts and backup':all(k in app for k in ['PSHO_GOALS.mount','PSHO_GOALS.merge','x.goals===undefined']) and 'goals.js' in html,
'accessible labels':all(f'id="{p}"' in html for p in ['mood-grid','anxiety','sleep','note','occurred']),
'custom emotion limit':'data.tags.length>=100' in app,
'no remote data transfer':not re.search(r'\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(',app),
'backup integrity':all(x in app for x in ['simpleHash','unpack','BASE+\'a\'','BASE+\'b\'']),
'authoritative snapshot readback verification':"safeGet(BASE+'head')!==written" in app,
'local storage failure visible':'Данные НЕ сохранены' in app,
'export and import':all(x in app for x in ['exportJson','exportCsv','importFile','SLOI_BACKUP_V1']),
'CSV formula protection':"if(/^[\\s\\uFEFF]*[=+@-]/.test(s))" in app,
'no dangerous innerHTML':not re.search(r'\.innerHTML\s*=',app),
'explicit no treatment conclusions':'не доказывают причину' in html,
'offline cache with same origin':"u.origin!==self.location.origin" in sw and 'STATIC.indexOf' in sw,
'no android permissions':'uses-permission' not in android,
'android backup off':'allowBackup="false"' in android,
'no android cleartext':'usesCleartextTraffic="false"' in android,
'blocked external navigation':'shouldOverrideUrlLoading' in native and 'startsWith(BASE)' in native,
'bounded native renderer recover':'failureCount<=2' in native,
'native file type constrained':'filename.matches' in native,
'light and dark themes':'html[data-theme=light]' in css,
'280px minimum supported':'min-width:280px' in css,
'graphic screen and export no libraries':'<script defer src="./app.js"' in html and 'cdnjs' not in html,
}
for name,ok in checks.items():print(('PASS' if ok else 'FAIL'),name)
results={'passed':sum(checks.values()),'failed':sum(not x for x in checks.values()),'checks':checks}
(R/'tests/static-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
sys.exit(0 if all(checks.values()) else 1)
