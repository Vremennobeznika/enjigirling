"""Integrated reflection/screening/companion regression: real Chromium, inline app, mocked localStorage."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,shutil,tempfile
R=Path(__file__).resolve().parents[1]
html=(R/'index.html').read_text()
for n in ('style.css','pwa-style.css'):
 html=html.replace('<link rel="stylesheet" href="./'+n+'">','<style>'+(R/n).read_text()+'</style>')
scripts=''
for n in ('i18n.js','goals.js','wellness.js','app.js','pwa-ui.js'):
 html=html.replace('<script defer src="./'+n+'"></script>','')
 scripts+='<script>'+(R/n).read_text()+'</script>'
html=html.replace('</body>',scripts+'</body>')
stub="""<script>window.QA_STORE=SEED;window.QA_FAIL=false;Object.defineProperty(window,'localStorage',{value:{getItem(k){return Object.prototype.hasOwnProperty.call(QA_STORE,k)?QA_STORE[k]:null},setItem(k,v){if(QA_FAIL)throw Error('full');QA_STORE[k]=String(v)},removeItem(k){delete QA_STORE[k]},clear(){window.QA_STORE={}}}});</script>"""
checks=[]
def require(x,msg):
 if not x:raise AssertionError(msg)
def check(name,fn):
 fn();checks.append(name);print('PASS',name,flush=True)
def load(page,seed=None):
 page.set_content(html.replace('</head>',stub.replace('SEED',json.dumps(seed or {'psho-ui-language':'ru'},ensure_ascii=False).replace('<','\\u003c'))+'</head>'),wait_until='load')
def data(page):return page.evaluate("JSON.parse(JSON.parse(QA_STORE['sloi-v1-head']).body)")
def seed(page):return page.evaluate('QA_STORE')
def tab(page,name):page.locator('[data-tab='+name+']').click()
def pack(page,d):
 page.evaluate('''d=>{let body=JSON.stringify(d),hash=2166136261;for(let i=0;i<body.length;i++){hash^=body.charCodeAt(i);hash=Math.imul(hash,16777619);}QA_STORE['sloi-v1-head']=JSON.stringify({body,hash:(hash>>>0).toString(16)});}''',d)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=shutil.which('chromium') or None,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 p=b.new_page(viewport={'width':390,'height':844},accept_downloads=True)
 p.set_default_timeout(3500);errors=[];p.on('pageerror',lambda e:errors.append(str(e)));load(p)
 def create():
  p.locator('#psho-language').select_option('ru')
  p.locator('#note').fill('Мне не ответили — значит, меня ненавидят <img src=x onerror=alert(1)>')
  p.locator('#tags-container button').filter(has_text='тревожно').click()
  p.locator('#save-entry').click();tab(p,'history')
  require(p.locator('[data-review]').count()==1,'reflection action missing')
 check('save original diary and expose reflection action',create)
 def reflect():
  p.locator('[data-review]').click();p.locator('#reflection-before').fill('8')
  p.locator('[name=pattern][value=mind-reading]').check();p.locator('#reflection-balanced').fill('Не знаю, почему человек не ответил. Возможно, занят.')
  p.locator('#reflection-after-emotion').fill('тревога осталась');p.locator('#reflection-after').fill('6')
  p.locator('#reflection-form button[type=submit]').click()
  d=data(p);require(d['entries'][0]['review']['afterIntensity']==6,'reflection not persisted');require(p.locator('.wellness-reflection').count()==1,'reflection not visible')
  require(p.locator('.entry img').count()==0,'user HTML executed')
 check('reflection saves distortions, balanced thought and before/after safely',reflect)
 def edit():
  p.locator('[data-edit]').click();p.locator('#note').fill('Updated original note');p.locator('#save-entry').click()
  require(data(p)['entries'][0]['review']['afterIntensity']==6,'edit discarded review')
 check('editing diary preserves reflection',edit)
 def mascot():
  tab(p,'today');require('тревожно' in p.locator('.wellness-mascot-state').inner_text(),'wrong dominant emotion');require(p.locator('.owl-alert').count()==1,'expression unchanged')
 check('mascot reflects actual recorded label',mascot)
 def gad():
  tab(p,'questionnaires');p.locator('.wellness-test-card').first.locator('button').click()
  p.locator('#screening-form button[type=submit]').click();require(len(data(p)['assessments'])==0,'unanswered questions became zero')
  for i in range(7):p.locator('[name=screening-'+str(i)+'][value="2"]').check()
  p.locator('#screening-form button[type=submit]').click();a=data(p)['assessments'][0]
  require(a['total']==14 and a['periodDays']==14,'wrong scoring or recall window')
  require('14/21' in p.locator('.wellness-result').inner_text(),'result absent')
 check('GAD-7 requires all answers and scores exact two-week responses',gad)
 def phq():
  p.locator('.wellness-test-card').nth(1).locator('button').click()
  for i in range(9):p.locator('[name=screening-'+str(i)+'][value="'+str(1 if i==8 else 0)+'"]').check()
  require(p.locator('#screening-crisis').is_visible(),'no immediate self-harm support notice')
  p.locator('#screening-form button[type=submit]').click();require(data(p)['assessments'][1]['total']==1,'PHQ score')
  require(p.locator('.wellness-result').first.locator('.wellness-crisis').is_visible(),'support notice not retained')
 check('PHQ-9 preserves item-nine support notice independently of total',phq)
 def second_gad():
  p.locator('.wellness-test-card').first.locator('button').click()
  for i in range(7):p.locator('[name=screening-'+str(i)+'][value="0"]').check()
  p.locator('#screening-form button[type=submit]').click();require('-14' in p.locator('.wellness-result').first.inner_text(),'scale comparison wrong')
  require(p.locator('.wellness-test-card').first.locator('svg circle').count()==2,'score chart missing')
 check('repeat assessments have scale-specific comparison and chart',second_gad)
 def reload():
  before=data(p);load(p,seed(p));require(data(p)==before,'reload changed data');tab(p,'history');require(p.locator('.wellness-reflection').count()==1,'review lost');tab(p,'questionnaires');require(p.locator('.wellness-result').count()==3,'results lost')
 check('reload retains diary, reflection and assessments',reload)
 def language():
  p.locator('.wellness-test-card').first.locator('button').click();p.locator('[name=screening-0][value="1"]').check();before=data(p)
  p.locator('#psho-language').select_option('en');require(p.locator('[name=screening-0][value="1"]').is_checked(),'language reset answers');require('Over the last two weeks' in p.locator('#wellness-test-form').inner_text(),'form not translated');require(data(p)==before,'language mutated data')
  for width in (280,320,390,768):
   p.set_viewport_size({'width':width,'height':844});require(p.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'active test overflow '+str(width))
  p.locator('#wellness-test-form button[type=button]').click();p.locator('#psho-language').select_option('ru')
 check('language switch preserves unfinished answers and active form fits 280px',language)
 def storage_failure():
  p.locator('.wellness-test-card').first.locator('button').click()
  for i in range(7):p.locator('[name=screening-'+str(i)+'][value="1"]').check()
  before=data(p);p.evaluate('QA_FAIL=true');p.locator('#screening-form button[type=submit]').click();require(data(p)==before,'failed save changed committed data');require(p.locator('#wellness-test-form').is_visible(),'failed save hid answers');require(p.locator('[name=screening-0][value="1"]').is_checked(),'failed save lost answers');p.evaluate('QA_FAIL=false');p.locator('#wellness-test-form button[type=button]').click()
 check('storage quota failure retains unsaved questionnaire and old data',storage_failure)
 def backup():
  tab(p,'settings')
  with p.expect_download() as pending:p.locator('#export-json').click()
  f=Path(pending.value.path());wrap=json.loads(f.read_text());require(len(wrap['data']['assessments'])==3,'backup missing assessments');require('review' in wrap['data']['entries'][0],'backup missing reflection')
  p.once('dialog',lambda d:d.accept());p.locator('#import-file').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(wrap,ensure_ascii=False).encode()});require(len(data(p)['assessments'])==3,'import lost tests');require('review' in data(p)['entries'][0],'import lost reflection')
 check('JSON export and restore include full reflection and assessment answers',backup)
 def old_backup():
  old=data(p);old.pop('assessments');old['entries'][0].pop('review');old.pop('goals',None)
  p.once('dialog',lambda d:d.accept());p.locator('#import-file').set_input_files({'name':'legacy.json','mimeType':'application/json','buffer':json.dumps({'format':'SLOI_BACKUP_V1','data':old}).encode()});tab(p,'history');require(p.locator('.entry').count()==1,'old diary lost');tab(p,'questionnaires');require(p.locator('.wellness-result').count()==0,'old archive resurrected results')
 check('pre-goals and pre-wellness backup remains importable',old_backup)
 def conflict():
  tab(p,'history');p.locator('[data-review]').click();p.locator('#reflection-before-emotion').fill('злость');p.locator('#reflection-balanced').fill('another interpretation');p.locator('#reflection-after-emotion').fill('спокойствие');d=data(p);d['entries'][0]['note']='Edited in another tab';d['rev']+=1;pack(p,d)
  p.locator('#reflection-form button[type=submit]').click();require('review' not in data(p)['entries'][0],'stale review overwrote concurrent edit');require(p.locator('#wellness-review').is_visible(),'conflict lost form')
 check('concurrent diary edit blocks stale reflection without losing form',conflict)
 def review_language():
  p.locator('#psho-language').select_option('en');require(p.locator('#reflection-after-emotion').input_value()=='спокойствие','translated user words');require('A more balanced thought' in p.locator('#wellness-review').inner_text(),'review labels not translated')
  for width in (280,390,768):
   p.set_viewport_size({'width':width,'height':844});require(p.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'active reflection overflow')
 check('unfinished reflection translates labels, preserves text and fits small screens',review_language)
 check('no uncaught JavaScript exceptions',lambda:require(not errors,str(errors)))
 b.close()
print(str(len(checks))+' wellness browser checks passed')
