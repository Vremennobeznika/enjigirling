"""Persistent language selection must survive simulated reload, must never change stored note bytes."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[1]
html=(R/'index.html').read_text(encoding='utf-8')
css=(R/'style.css').read_text()+(R/'pwa-style.css').read_text()
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>').replace('<link rel="stylesheet" href="./pwa-style.css">','')
for n in ['i18n','app','pwa-ui']:html=html.replace('<script defer src="./'+n+'.js"></script>','')
script=''.join('<script>'+(R/(n+'.js')).read_text()+'</script>' for n in ['i18n','app','pwa-ui'])
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 def load(seed=None,viewport={'width':390,'height':844}):
  p=browser.new_page(viewport=viewport,accept_downloads=True)
  p.set_default_timeout(3000)
  init='''<script>window.__store=SEED;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return Object.prototype.hasOwnProperty.call(window.__store,k)?window.__store[k]:null},setItem(k,v){window.__store[k]=String(v)},removeItem(k){delete window.__store[k]},clear(){window.__store={}}}});</script>'''.replace('SEED',json.dumps(seed or {},ensure_ascii=False).replace('<','\\u003c'))
  p.set_content(html.replace('</body>',init+script+'</body>'),wait_until='domcontentloaded')
  return p
 p=load()
 p.locator('#psho-language').select_option('en')
 p.locator('#note').fill('Untranslated private content: тревога <script>alert(1)</script>')
 p.locator('#save-entry').click()
 seed=p.evaluate('window.__store')
 p.close()
 q=load(seed)
 results.append(('en survives re-open',q.locator('#psho-language').input_value()=='en'))
 results.append(('en history after re-open',q.locator('[data-tab=today]').inner_text()=='Today'))
 q.locator('[data-tab=history]').click()
 results.append(('note unchanged byte-for-byte', 'Untranslated private content: тревога <script>alert(1)</script>' in q.locator('.entry').inner_text()))
 results.append(('markup not executed', q.locator('#history-list script').count()==0))
 q.locator('#psho-language').select_option('ru')
 seed=q.evaluate('window.__store')
 q.close()
 w=load(seed)
 results.append(('ru survives re-open',w.locator('[data-tab=today]').inner_text()=='Сегодня'))
 results.append(('notes remain independent of UI language',w.locator('[data-tab=history]').click() or 'Untranslated private content: тревога' in w.locator('.entry').inner_text()))
 w.close()
 browser.close()
output={'passed':sum(bool(ok) for _,ok in results),'failed':sum(not ok for _,ok in results),'results':dict(results)}
(R/'tests/LANGUAGE_PERSISTENCE_RESULTS.json').write_text(json.dumps(output,ensure_ascii=False,indent=2))
print(output)
sys.exit(1 if output['failed'] else 0)
