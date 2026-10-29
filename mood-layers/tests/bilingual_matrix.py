"""Real Chromium DOM test for PSHO ru/en language behavior; no real phone or Safari asserted."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys
R=Path(__file__).resolve().parents[1]
html=(R/'index.html').read_text(encoding='utf-8')
css=(R/'style.css').read_text(encoding='utf-8')+(R/'pwa-style.css').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>')
html=html.replace('<link rel="stylesheet" href="./pwa-style.css">','')
for name in ('i18n','goals','app','pwa-ui'):
    html=html.replace('<script defer src="./'+name+'.js"></script>','')
mock="""<script>window.__store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{
 getItem:function(k){return Object.prototype.hasOwnProperty.call(window.__store,k)?window.__store[k]:null;},
 setItem:function(k,v){window.__store[k]=String(v);},
 removeItem:function(k){delete window.__store[k];},clear:function(){window.__store={};},
 get length(){return Object.keys(window.__store).length;}
}});</script>"""
script=''.join('<script>'+ (R/(name+'.js')).read_text(encoding='utf-8')+'</script>' for name in ('i18n','goals','app','pwa-ui'))
html=html.replace('</body>',mock+script+'</body>')
results={}
def check(name,fn):
 try:
  value=fn()
  if value is False:raise AssertionError('false')
  results[name]={'status':'PASS'}
 except Exception as e:
  results[name]={'status':'FAIL','error':str(e)[:330]}
  print('FAIL',name,str(e)[:240],flush=True)

def new_page(browser,width=375,height=812):
 p=browser.new_page(viewport={'width':width,'height':height},accept_downloads=True)
 p.set_default_timeout(2500)
 p.set_content(html,wait_until='domcontentloaded',timeout=16000)
 return p
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-background-networking'])
 page=new_page(browser)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 check('system English locale detected', lambda: page.locator('[data-tab="today"]').inner_text()=='Today')
 check('select locale exists', lambda: page.locator('#psho-language option').count()==2)
 page.locator('#psho-language').select_option('en')
 check('English tabs',lambda:page.locator('[data-tab="today"]').inner_text()=='Today' and page.locator('[data-tab="history"]').inner_text()=='History' and page.locator('[data-tab="insights"]').inner_text()=='Charts')
 check('English static page',lambda:'How are you' in page.locator('#today').inner_text() and 'My mood' in page.locator('#today').inner_text())
 check('English custom labels appear',lambda:page.locator('#tags-container').inner_text().find('anxious')>=0)
 check('English dynamic mood',lambda:page.locator('.mood').first.inner_text().find('Very difficult')>=0)
 check('english lang attribute',lambda:page.evaluate('document.documentElement.lang')=='en')
 check('language preference stored separately',lambda:page.evaluate("localStorage.getItem('psho-ui-language')")=='en')
 page.locator('[data-mood="2"]').click()
 page.locator('#note').fill('SAVED_IN_ENGLISH – тревога')
 page.locator('#save-entry').click()
 check('English success toast',lambda:'Entry saved' in page.locator('#toast').inner_text())
 page.locator('[data-tab=history]').click()
 check('English saved history',lambda:page.locator('.entry').count()==1 and 'Difficult' in page.locator('.entry').inner_text())
 check('Personal note unchanged',lambda:'SAVED_IN_ENGLISH – тревога' in page.locator('.entry').inner_text())
 page.locator('#psho-language').select_option('ru')
 check('Russian restored',lambda:page.locator('[data-tab="today"]').inner_text()=='Сегодня' and 'Тяжело' in page.locator('.entry').inner_text())
 check('Same data after language change',lambda:page.locator('.entry').count()==1 and 'SAVED_IN_ENGLISH – тревога' in page.locator('.entry').inner_text())
 page.locator('#psho-language').select_option('en')
 page.locator('[data-tab=today]').click()
 page.locator('#note').fill('UNSAVED FIELD PERSISTENCE')
 page.locator('#psho-language').select_option('ru')
 check('Language switch does not discard unsaved note',lambda:page.locator('#note').input_value()=='UNSAVED FIELD PERSISTENCE')
 page.locator('#psho-language').select_option('en')
 page.locator('[data-tab=settings]').click()
 check('English settings and privacy',lambda:'Data and privacy' in page.locator('#settings').inner_text() and 'Export JSON' in page.locator('#settings').inner_text())
 page.locator('[data-tab=insights]').click()
 check('English chart labels',lambda:'Mood ratings' in page.locator('#insights').inner_text() and 'Mood' in page.locator('#kpis').inner_text())
 check('English accessibility aria',lambda:'Mood rating chart' in page.locator('#chart svg').get_attribute('aria-label'))
 check('No page exceptions',lambda:len(errors)==0)
 for width,height in ((280,568),(320,568),(360,740),(375,667),(390,844),(568,320),(768,1024)):
  p=new_page(browser,width,height)
  for lang in ('en','ru'):
   p.locator('#psho-language').select_option(lang)
   for tab in ('today','history','insights','settings'):
    p.locator('[data-tab="'+tab+'"]').click()
    check('no overflow %s %s %s'%(width,lang,tab),lambda p=p:p.evaluate('document.documentElement.scrollWidth<=innerWidth+2 && document.body.scrollWidth<=innerWidth+2'))
  p.close()
 for i in range(15):
  page.locator('#psho-language').select_option('ru' if i%2 else 'en')
  page.locator('[data-tab='+('today' if i%2 else 'insights')+']').click()
 check('rapid language switching no JS crash',lambda:len(errors)==0)
 # Existing Russian default tags must display in English without modifying the stored record.
 rucontext=browser.new_context(locale='ru-RU',viewport={'width':375,'height':812},accept_downloads=True)
 old=rucontext.new_page()
 old.set_content(html,wait_until='domcontentloaded',timeout=16000)
 check('fresh Russian locale auto-detected',lambda:old.locator('[data-tab=today]').inner_text()=='Сегодня')
 old.locator('[data-tag="0"]').click()
 old.locator('#note').fill('Моя личная заметка')
 old.locator('#save-entry').click()
 before=old.evaluate("localStorage.getItem('sloi-v1-head')")
 old.locator('#psho-language').select_option('en')
 check('legacy standard Russian label appears English',lambda:old.locator('#tags-container [data-tag="0"]').inner_text()=='anxious')
 old.locator('[data-tab=history]').click()
 check('legacy standard tag in history appears English',lambda:'anxious' in old.locator('.entry .chips').inner_text())
 check('legacy data unchanged by translation',lambda:old.evaluate("localStorage.getItem('sloi-v1-head')")==before)
 check('legacy Russian note preserved',lambda:'Моя личная заметка' in old.locator('.entry').inner_text())
 old.close();rucontext.close()
 page.close()
 browser.close()
res={'passed':sum(x['status']=='PASS' for x in results.values()),'failed':sum(x['status']=='FAIL' for x in results.values()),'checks':results,'limitations':['Chromium simulation only','Physical iOS/Android not tested','Local storage mocked to avoid browser network restrictions']}
(R/'tests/BILINGUAL_RESULTS.json').write_text(json.dumps(res,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'passed':res['passed'],'failed':res['failed'],'fails':{k:v for k,v in results.items() if v['status']=='FAIL'}},ensure_ascii=False,indent=2))
sys.exit(1 if res['failed'] else 0)
