"""SLOI PWA browser checks: Chromium emulation only; no real Safari/device claim."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
h=(R/'index.html').read_text(encoding='utf-8')
for n in ('style.css','pwa-style.css'):
 h=h.replace('<link rel="stylesheet" href="./'+n+'">','<style>'+(R/n).read_text(encoding='utf-8')+'</style>')
scripts=''
for n in ('i18n.js','goals.js','app.js','pwa-ui.js'):
 h=h.replace('<script defer src="./'+n+'"></script>','')
 scripts+='<script>'+(R/n).read_text(encoding='utf-8')+'</script>'
h=h.replace('</body>',scripts+'</body>')
stub="""<script>(function(){var o={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:function(k){return Object.prototype.hasOwnProperty.call(o,k)?o[k]:null;},setItem:function(k,v){o[k]=String(v);},removeItem:function(k){delete o[k];}}});})();</script>"""
h=h.replace('</head>',stub+'</head>')
checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 pg=b.new_page(viewport={'width':320,'height':568})
 pg.set_content(h,wait_until='domcontentloaded')
 assert pg.locator('#pwa-install').is_visible()
 pg.locator('#pwa-install').click()
 assert pg.locator('#pwa-howto').is_visible()
 assert pg.locator('.mood').count()==7
 pg.locator('#note').fill('PWA TEST RECORD 143')
 pg.locator('#save-entry').click()
 assert 'Запись сохранена' in pg.locator('#toast').inner_text()
 pg.locator('[data-tab="history"]').click()
 assert 'PWA TEST RECORD 143' in pg.locator('.entry').inner_text()
 for w,he in [(280,640),(320,568),(375,667),(568,320)]:
  pg.set_viewport_size({'width':w,'height':he})
  for tab in ('today','history','goals','insights','settings'):
   pg.locator('[data-tab="'+tab+'"]').click()
   assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),(w,tab)
   checks.append(w+len(tab))
 pg.locator('[data-tab="goals"]').click()
 pg.locator('[data-goal-preset="draw"]').click()
 assert pg.locator('#goal-kind').input_value()=='weekly'
 pg.locator('#goal-form button[type=submit]').click()
 assert pg.locator('.goal-card').count()==1
 pg.locator('[data-action="done"]').click()
 assert '1 / 2' in pg.locator('.goal-progress-label').inner_text()
 pg.locator('[data-action="done"]').click()
 assert '1 / 2' in pg.locator('.goal-progress-label').inner_text()
 pg.locator('[data-action="clear"]').click()
 assert '0 / 2' in pg.locator('.goal-progress-label').inner_text()
 pg.locator('[data-goal-preset="read"]').click()
 pg.locator('#goal-form button[type=submit]').click()
 assert pg.locator('.goal-card').count()==2
 pg.locator('[data-goal-preset="smoke"]').click()
 pg.locator('#goal-form button[type=submit]').click()
 assert pg.locator('.goal-card').count()==3
 pg.locator('[data-action="lapse"]').click()
 assert '1' in pg.locator('.goal-card').last.locator('.goal-progress-label').inner_text()
 pg.set_viewport_size({'width':280,'height':640})
 assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+2')

 pg.locator('#theme-btn').click()
 assert pg.evaluate('document.documentElement.dataset.theme==="light"')
 assert pg.locator('#export-json').is_visible()
 b.close()
print('PASS SLOI PWA install/save/nav/responsive/theme:',len(checks)+7,'checks')
