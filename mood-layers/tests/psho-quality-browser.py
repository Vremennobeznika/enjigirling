"""PSHO scripted UX walkthrough, responsive & storage/load regression. No human UX participants or physical-device testing."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time,statistics,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
for name in ('style.css','pwa-style.css'):
 html=html.replace('<link rel="stylesheet" href="./'+name+'">','<style>'+(ROOT/name).read_text(encoding='utf-8')+'</style>')
scripts=''
for name in ('i18n.js','goals.js','app.js','pwa-ui.js'):
 html=html.replace('<script defer src="./'+name+'"></script>','')
 scripts+='<script>'+(ROOT/name).read_text(encoding='utf-8')+'</script>'
html=html.replace('</body>',scripts+'</body>')
def load(page,stored=None):
 stub="""<script>var QA_STORE=__SEED__;window.__qaStore=QA_STORE;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:function(k){return Object.prototype.hasOwnProperty.call(QA_STORE,k)?QA_STORE[k]:null},setItem:function(k,v){QA_STORE[k]=String(v)},removeItem:function(k){delete QA_STORE[k]},clear:function(){Object.keys(QA_STORE).forEach(function(k){delete QA_STORE[k]})}}});</script>"""
 page.set_content(html.replace('</head>',stub.replace('__SEED__',json.dumps(stored or {},ensure_ascii=False))+'</head>'),wait_until='load')
results=[];metrics={}
def check(name,action):
 try:action();results.append({'name':name,'status':'PASS'});print('PASS',name,flush=True)
 except Exception as e:results.append({'name':name,'status':'FAIL','error':str(e)[:400]});print('FAIL',name,str(e)[:150],flush=True)
def require(flag,label):
 if not flag:raise AssertionError(label)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':390,'height':844},timezone_id='Europe/Berlin',accept_downloads=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 load(page)
 check('initial diary UI',lambda:require(page.locator('.mood').count()==7,'mood controls missing'))
 def diary():
  page.locator('#note').fill('QA sample journal entry')
  page.locator('#save-entry').click()
  page.locator('[data-tab=history]').click()
  require(page.locator('.entry').count()==1,'diary save missing')
 check('diary save and history',diary)
 page.locator('[data-tab=goals]').click()
 def create(preset,expected):
  page.locator('[data-goal-preset='+preset+']').click()
  page.locator('#goal-form button[type=submit]').click()
  require(page.locator('.goal-card').count()==expected,'goal absent')
 check('create weekly',lambda:create('draw',1))
 def repeat():
  page.locator('[data-action=done]').click();page.locator('[data-action=done]').click()
  require('1 / 2' in page.locator('.goal-progress-label').inner_text(),'duplicate day')
  page.locator('[data-action=clear]').click()
  require('0 / 2' in page.locator('.goal-progress-label').inner_text(),'clear failed')
 check('repeated taps idempotent + clear',repeat)
 check('create alternate-days',lambda:create('read',2))
 check('create daily avoidance',lambda:create('smoke',3))
 def lapse():
  page.locator('.goal-card').last.locator('[data-action=lapse]').click()
  require('0 / 1' in page.locator('.goal-card').last.locator('.goal-progress-label').inner_text(),'lapse not counted')
 check('explicit avoidance lapse',lapse)
 def persist():
  load(page,page.evaluate('window.__qaStore'));page.locator('[data-tab=goals]').click()
  require(page.locator('.goal-card').count()==3,'reload lost goals')
 check('storage reload',persist)
 def keyboard():
  page.locator('#goal-name').focus()
  require(page.evaluate('document.activeElement.id')=='goal-name','keyboard inaccessible')
 check('keyboard focus on goal form',keyboard)
 for w,h in ((280,640),(320,568),(360,740),(390,844),(430,932),(568,320),(768,1024),(1024,768)):
  page.set_viewport_size({'width':w,'height':h})
  for tab in ('today','history','goals','insights','settings'):
   def inspect(w=w,tab=tab):
    page.locator('[data-tab='+tab+']').click()
    sizes=page.evaluate('({screen:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth})')
    require(max(sizes['scroll'],sizes['body'])<=sizes['screen']+2,str(sizes))
   check('reflow '+str(w)+' '+tab,inspect)
  if w==280:
   page.locator('[data-tab=goals]').click()
   page.screenshot(path=str(ROOT/'tests/psho-280.png'),full_page=True)
   def tap_size():
    r=page.evaluate('''()=>[...document.querySelectorAll('.tabs button')].map(x=>({height:x.getBoundingClientRect().height,font:parseFloat(getComputedStyle(x).fontSize)}))''')
    require(all(v['height']>=44 and v['font']>=12 for v in r),str(r))
   check('280px tap-target minimum and legible tabs',tap_size)
  if w==390:
   page.locator('[data-tab=goals]').click();page.screenshot(path=str(ROOT/'tests/psho-390.png'),full_page=True)
 page.set_viewport_size({'width':640,'height':568});page.locator('[data-tab=goals]').click()
 def zoom():
  page.evaluate('document.body.style.zoom="2"')
  require(page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'zoom overflow')
  page.evaluate('document.body.style.zoom="1"')
 check('200% zoom reflow',zoom)
 check('no uncaught JS exceptions',lambda:require(not errors,str(errors[:3])))
 # Load simulation: verify upper-bound 4000 diary records + 60 goals, no server involved.
 c=b.new_context(viewport={'width':320,'height':568},timezone_id='Europe/Berlin')
 x=c.new_page();load(x);x.locator('#save-entry').click()
 def stress():
  size=x.evaluate('''()=>{
   let data=JSON.parse(JSON.parse(window.__qaStore['sloi-v1-head']).body);
   data.entries=[];for(let i=0;i<4000;i++){
    data.entries.push({id:'m-qa-'+i,date:new Date(Date.now()-(i%28)*86400000).toISOString().slice(0,16),mood:4,anxiety:5,energy:5,stress:5,pain:0,sleep:7,tags:[],note:'Load '+i,therapy:false,medication:false,exercise:false,period:false});
   }
   data.goals=[];for(let i=0;i<60;i++)data.goals.push({id:'g-qa-'+String(i).padStart(5,'0'),name:'Goal '+i,kind:'weekly',target:2,start:'2026-01-01',archived:false,marks:{}});
   data.rev++;
   let body=JSON.stringify(data),hash=2166136261;for(let j=0;j<body.length;j++){hash^=body.charCodeAt(j);hash=Math.imul(hash,16777619);}
   window.__qaStore['sloi-v1-head']=JSON.stringify({body,hash:(hash>>>0).toString(16)});
   return body.length;
  }''')
  t=time.monotonic();load(x,x.evaluate('window.__qaStore'));metrics['reload_ms']=round((time.monotonic()-t)*1000,1)
  x.locator('[data-tab=goals]').click()
  require(x.locator('.goal-card').count()==60,'60 goals not visible')
  cdp=c.new_cdp_session(x);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
  values=x.evaluate('''()=>{let list=[];for(let i=0;i<6;i++){let t=performance.now();PSHO_GOALS.render();list.push(performance.now()-t);}return list;}''')
  metrics['render_4x_cpu_median_ms']=round(statistics.median(values[1:]),1)
  metrics['entries']=4000;metrics['goals']=60;metrics['bytes']=size
  require(metrics['render_4x_cpu_median_ms']<1500,'render over budget')
  x.locator('[data-tab=history]').click()
  require(x.locator('.entry').count()==250,'history changed under load')
 check('load 4000 entries / 60 goals / 4x CPU',stress)
 c.close();b.close()
report={'method':'Chromium scripted walkthrough, inline real HTML/CSS/JS and mock localStorage (no human study and no physical Android)', 'passed':sum(t['status']=='PASS' for t in results),'failed':sum(t['status']=='FAIL' for t in results),'metrics':metrics,'checks':results}
(ROOT/'tests/psho-quality-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('RESULT',report['passed'],'PASS',report['failed'],'FAIL',metrics,flush=True)
sys.exit(1 if report['failed'] else 0)
