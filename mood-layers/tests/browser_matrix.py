"""Chromium DOM/layout/emulated viewport smoke and fault injection. Not actual iOS/Android tests."""
from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text(encoding='utf-8')
CSS=(ROOT/'style.css').read_text(encoding='utf-8')
JS=(ROOT/'app.js').read_text(encoding='utf-8')
HTML=HTML.replace('<link rel="stylesheet" href="./style.css">','<style>'+CSS+'</style>')
HTML=HTML.replace('<script defer src="./app.js"></script>','')
BASE="""<script>
(function(){
 var entries=window.__seedEntries||{};
 var backing=Object.assign({},entries);
 window.__testStore=backing;
 Object.defineProperty(window,'localStorage',{configurable:true,value:{
 getItem:function(k){return Object.prototype.hasOwnProperty.call(backing,k)?backing[k]:null;},
 setItem:function(k,v){if(window.__forceStorageFailure)throw Error('QuotaExceeded');backing[k]=String(v);},
 removeItem:function(k){delete backing[k];},
 clear:function(){for(var k in backing)delete backing[k];},
 get length(){return Object.keys(backing).length;}
 }});
})();
</script>"""
HTML=HTML.replace('</head>',BASE+'</head>')
HTML=HTML.replace('</body>','<script>'+JS+'</script></body>')
checks={}
def run(label,fn):
 try:
  detail=fn()
  if detail is False:raise AssertionError('condition returned false')
  checks[label]={'status':'PASS'}
  print('PASS',label)
 except Exception as ex:
  checks[label]={'status':'FAIL','detail':str(ex)[:260]}
  print('FAIL',label,str(ex)[:230])
def fit(page):
 return page.evaluate('({x: document.documentElement.scrollWidth, body: document.body.scrollWidth, window: innerWidth})')
def nooverflow(page):
 d=fit(page)
 assert d['x']<=d['window']+2 and d['body']<=d['window']+2,d
 return True
def load(browser,width=375,height=812,seed=None):
 page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
 page.on('pageerror',lambda err: print('JS_ERROR:',str(err)[:150]))
 doc=HTML.replace('var entries=window.__seedEntries||{};','var entries='+json.dumps(seed or {})+';')
 page.set_content(doc,wait_until='load',timeout=30000)
 return page
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-background-networking'])
 page=load(browser,320,700)
 run('initial mood choices',lambda: page.locator('.mood').count()==7)
 run('empty history safe',lambda: (page.locator('[data-tab=history]').click(),page.locator('.empty').count()>0)[1])
 run('navigation: insights',lambda: (page.locator('[data-tab=insights]').click(),page.locator('#chart').count()==1)[1])
 run('navigation: settings',lambda: (page.locator('[data-tab=settings]').click(),page.locator('#export-json').is_visible())[1])
 run('navigation: today',lambda: (page.locator('[data-tab=today]').click(),page.locator('#save-entry').is_visible())[1])
 run('default date assigned',lambda: bool(page.locator('#occurred').input_value()))
 run('select mood 2',lambda: (page.locator('[data-mood="2"]').click(),page.locator('[data-mood="2"]').get_attribute('aria-checked')=='true')[1])
 run('custom words input',lambda: (page.locator('#new-tag').fill('как будто меня выключили'),page.locator('#add-tag').click(),page.locator('.tag').filter(has_text='как будто меня выключили').count()==1)[2])
 run('custom tag auto-selected',lambda: page.locator('#tags-container .tag').filter(has_text='как будто меня выключили').get_attribute('aria-pressed')=='true')
 page.locator('#note').fill('Снова устала и тревожно. Был разговор с терапевтом.');page.locator('#therapy').check()
 run('note dictionary off initially',lambda: page.locator('#analysis-result').inner_text()=='')
 run('note dictionary opt-in',lambda: (page.locator('#analyze-note').check(), 'усталость' in page.locator('#analysis-result').inner_text())[1])
 run('save first entry',lambda: (page.locator('#save-entry').click(),page.locator('#toast').inner_text()=='Запись сохранена')[1])
 first=page.evaluate('window.__testStore')
 run('checksum persisted',lambda: any('"hash"' in v for v in first.values()))
 run('history after save',lambda: (page.locator('[data-tab=history]').click(),page.locator('.entry').count()==1)[1])
 run('user note XSS-safe text',lambda: ('Снова устала' in page.locator('.entry').inner_text()))
 run('edit existing record',lambda: (page.locator('[data-edit]').click(),page.locator('#save-entry').inner_text().startswith('Обновить'))[1])
 run('edit loads prior mood',lambda: page.locator('[data-mood="2"]').get_attribute('aria-checked')=='true')
 page.locator('#note').fill('Отредактированная заметка');
 run('editing does not duplicate',lambda: (page.locator('#save-entry').click(),page.locator('[data-tab=history]').click(),page.locator('.entry').count()==1 and 'Отредактированная заметка' in page.locator('.entry').inner_text())[2])
 second=page.evaluate('window.__testStore')
 run('both checkpoints now exist',lambda: 'sloi-v1-a' in second and 'sloi-v1-b' in second)
 page2=load(browser,320,700,second)
 page2.locator('[data-tab=history]').click()
 run('restart restores record',lambda: page2.locator('.entry').count()==1)
 run('restart preserves edited note',lambda: 'Отредактированная' in page2.locator('.entry').inner_text())
 keys=list(second)
 broken=second.copy(); newest=max(keys,key=lambda k:json.loads(json.loads(second[k])['body'])['rev']);broken[newest]='broken'
 fallback=load(browser,320,700,broken);fallback.locator('[data-tab=history]').click()
 run('corrupt newest checkpoint safe fallback',lambda: fallback.locator('.entry').count()<=1 and fallback.locator('#status').count()==1)
 allbroken=load(browser,320,700,{'sloi-v1-a':'!','sloi-v1-b':'broken'})
 run('both corrupt: no fatal crash',lambda:allbroken.locator('.mood').count()==7)
 run('both corrupt: visible recovery message',lambda:allbroken.locator('#status').is_visible())
 run('both corrupt: no invented entries',lambda: (allbroken.locator('[data-tab=history]').click(),allbroken.locator('.entry').count()==0)[1])
 page2.locator('[data-tab=today]').click()
 page2.evaluate('window.__forceStorageFailure=true')
 run('storage quota failure warns',lambda: (page2.locator('#save-entry').click(),page2.locator('#status').is_visible())[1])
 run('storage quota no false success',lambda: 'НЕ сохранены' in page2.locator('#status').inner_text())
 page2.evaluate('window.__forceStorageFailure=false')
 run('theme toggles',lambda: (page2.locator('#theme-btn').click(),page2.evaluate('document.documentElement.dataset.theme')=='light')[1])
 run('theme persists to backup',lambda: any(json.loads(json.loads(v)['body'])['theme']=='light' for v in page2.evaluate('window.__testStore').values()))
 run('CSV formula sanitizer present',lambda: "if(/^[\\s\\uFEFF]*[=+@-]/.test(s))" in JS)
 # Long labels and notes should remain text, not markup.
 xss=load(browser,320,700)
 xss.locator('#new-tag').fill('<img src=x onerror=alert(1)>')
 xss.locator('#add-tag').click()
 run('XSS: markup not interpreted',lambda: xss.locator('#tags-container img').count()==0)
 run('XSS: exact user value displayed',lambda: xss.locator('#tags-container').inner_text().find('<img src=x onerror=alert(1)>')>=0)
 xss.locator('[data-tab=settings]').click()
 xss.locator('#settings-new-tag').fill('проверка категории')
 run('custom tags in settings',lambda: (xss.locator('#settings-add-tag').click(),xss.locator('#settings-tags').get_by_text('проверка категории',exact=False).count()==1)[1])
 xss.close();allbroken.close();fallback.close();page2.close()
 ss=ROOT/'screenshots';ss.mkdir(exist_ok=True)
 for width,height in [(280,640),(320,568),(360,740),(375,667),(390,844),(430,932),(568,320),(667,375),(768,1024),(1024,768)]:
  sample=load(browser,width,height,second)
  for theme in ('dark','light'):
   if theme=='light':sample.locator('#theme-btn').click()
   for tab in ('today','history','insights','settings'):
    sample.locator('[data-tab='+tab+']').click()
    run('layout '+str(width)+'x'+str(height)+' '+theme+' '+tab,lambda pp=sample:nooverflow(pp))
    if width==320 and height==568 and tab=='today':sample.screenshot(path=str(ss/f'screen-320-{theme}.png'),full_page=True)
    if width==360 and tab=='insights':sample.screenshot(path=str(ss/f'screen-360-{theme}-insights.png'),full_page=True)
    if width==390 and tab=='history':sample.screenshot(path=str(ss/f'screen-390-{theme}-history.png'),full_page=True)
  sample.close()
 zoom=load(browser,640,568,second)
 zoom.evaluate('document.body.style.zoom="2"')
 run('200% zoom at effective 320px layout',lambda:nooverflow(zoom))
 zoom.close()
 page.locator('[data-tab=history]').click()
 page.once('dialog',lambda d:d.accept())
 run('delete with explicit confirmation',lambda: (page.locator('[data-delete]').click(),page.locator('.entry').count()==0)[1])
 page.close();browser.close()
passed=sum(x['status']=='PASS' for x in checks.values());failed=len(checks)-passed
results={'engine':'system Chromium; inline about:blank; mocked localStorage','passed':passed,'failed':failed,'checks':checks,'limitations':['Not Safari/WebKit','Not real Android System WebView','Offline service worker cannot be fully exercised via about:blank']}
(ROOT/'tests/RESULTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print('SUMMARY',passed,'PASS',failed,'FAIL')
sys.exit(1 if failed else 0)
