"""Capture actual Chromium renders of RU/EN light/dark UIs (not photographs of devices)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'index.html').read_text(encoding='utf-8')
css=(R/'style.css').read_text()+(R/'pwa-style.css').read_text()
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>').replace('<link rel="stylesheet" href="./pwa-style.css">','')
for n in ('i18n','app','pwa-ui'): html=html.replace('<script defer src="./'+n+'.js"></script>','')
mock="""<script>window.__store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__store[k]??null;},setItem(k,v){window.__store[k]=String(v);},removeItem(k){delete window.__store[k];}}});</script>"""
scripts=''.join('<script>'+(R/(n+'.js')).read_text()+'</script>' for n in ('i18n','app','pwa-ui'))
html=html.replace('</body>',mock+scripts+'</body>')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 p=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 p.set_content(html,wait_until='domcontentloaded')
 d=R/'screenshots';d.mkdir(exist_ok=True)
 for lang in ('ru','en'):
  p.locator('#psho-language').select_option(lang)
  for theme in ('dark','light'):
   if p.evaluate('document.documentElement.dataset.theme')!=theme:p.locator('#theme-btn').click()
   p.locator('[data-tab=today]').click()
   f=d/f'PSHO-390-{lang}-{theme}.png'
   p.screenshot(path=str(f),full_page=True)
   print(f.name, f.stat().st_size)
 b.close()
