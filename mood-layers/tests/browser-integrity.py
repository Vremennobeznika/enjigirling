"""Real Chromium profile/storage/Service Worker QA; no localStorage mock. No physical-device claims."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
import threading,tempfile,json,time,shutil,statistics,argparse,os
R=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--legacy',type=Path);parser.add_argument('--axe',type=Path);parser.add_argument('--output',type=Path,default=Path(tempfile.mkdtemp(prefix='psho-browser-evidence-')));args=parser.parse_args();E=args.output;E.mkdir(parents=True,exist_ok=True)
root=R
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(root),**k)
 def log_message(self,*a):pass
 def do_GET(self):
  self.directory=str(root)
  if 'If-Modified-Since' in self.headers:del self.headers['If-Modified-Since']
  super().do_GET()
 def end_headers(self):self.send_header('Cache-Control','no-store');super().end_headers()
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();url='http://127.0.0.1:'+str(server.server_port)+'/'
results=[];metrics={};violations=[]
def check(name,fn):
 try:
  fn();results.append({'name':name,'status':'PASS'});print('PASS',name,flush=True)
 except Exception as e:
  results.append({'name':name,'status':'FAIL','error':str(e)[:1000]});print('FAIL',name,str(e)[:300],flush=True)
def require(flag,msg):
 if not flag:raise AssertionError(msg)
def data(p):return p.evaluate("JSON.parse(JSON.parse(localStorage.getItem('sloi-v1-head')).body)")
def tab(p,name):p.locator('[data-tab='+name+']').click()
def seed(p,d):
 p.evaluate('''d=>{let body=JSON.stringify(d),h=2166136261;for(let i=0;i<body.length;i++){h^=body.charCodeAt(i);h=Math.imul(h,16777619);}let packed=JSON.stringify({body,hash:(h>>>0).toString(16)});localStorage.setItem('sloi-v1-head',packed);return packed.length;}''',d)
with sync_playwright() as pw:
 profile=E/'chromium-profile';opts={'executable_path':shutil.which('chromium') or None,'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage'],'viewport':{'width':390,'height':844},'locale':'ru-RU','accept_downloads':True,'reduced_motion':'reduce'}
 c=pw.chromium.launch_persistent_context(str(profile),**opts);p=c.pages[0];p.set_default_timeout(6000);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 root=args.legacy if args.legacy else R;p.goto(url);p.wait_for_selector('.mood',state='attached');p.evaluate('navigator.serviceWorker.ready');p.reload();p.wait_for_selector('.mood',state='attached')
 def old_save():
  p.locator('#note').fill('Real persistent diary 🦉');p.locator('#save-entry').click();require(data(p)['entries'][0]['note']=='Real persistent diary 🦉','save absent')
 check('real localStorage diary save',old_save)
 if args.legacy:
  def update():
   global root
   root=R;p.evaluate('navigator.serviceWorker.getRegistration().then(r=>r.update())');p.evaluate('navigator.serviceWorker.getRegistration().then(r=>new Promise(resolve=>{if(r.waiting)return resolve(true);let count=0,poll=setInterval(()=>{if(r.waiting||count++>200){clearInterval(poll);resolve(!!r.waiting);}},100);}))')
   p.wait_for_function('!document.getElementById("pwa-update").hidden');p.locator('#pwa-update').click();p.wait_for_function('!!window.PSHO_WELLNESS',timeout=20000)
   require(data(p)['entries'][0]['note']=='Real persistent diary 🦉','update lost diary');require('1.6.' in p.locator('#version').text_content(),'old version served')
  check('real PWA 1.5-to-1.6 update retains data',update)
 root=R
 def populate():
  d=data(p);template=d['entries'][0];d['entries']=[]
  for i in range(4000):
   e=dict(template);e['id']='m-load-'+str(i);e['note']='Synthetic note '+str(i);e['tags']=['тревожно' if i%2 else 'спокойно'];e['review']={'thought':'Initial thought','beforeEmotion':'тревога','beforeIntensity':8,'distortions':['mind-reading'],'balanced':'Alternative thought','afterEmotion':'спокойнее','afterIntensity':4,'updatedAt':'2026-11-14T10:00:00.000Z'};d['entries'].append(e)
  d['assessments']=[{'id':'q-load-'+str(i).zfill(5),'kind':'gad' if i%2 else 'phq','date':'2026-11-14T10:00:00.000Z','periodDays':14,'answers':[1]*(7 if i%2 else 9),'total':7 if i%2 else 9} for i in range(1000)]
  p.evaluate("localStorage.removeItem('sloi-v1-a');localStorage.removeItem('sloi-v1-b')");seed(p,d);t=time.monotonic();p.reload();p.wait_for_function("document.querySelectorAll('.mood').length===7");metrics['large_profile_reload_ms']=round((time.monotonic()-t)*1000,1)
  require(len(data(p)['entries'])==4000 and len(data(p)['assessments'])==1000,'upper bound store invalid');tab(p,'history');require(p.locator('.entry').count()==250,'history limit broken');require(p.locator('.wellness-reflection').count()==250,'reflections missing');tab(p,'questionnaires');require(p.locator('.wellness-result').count()==50,'result list not bounded')
  session=c.new_cdp_session(p);session.send('Emulation.setCPUThrottlingRate',{'rate':4});samples=p.evaluate('''()=>{let x=[];for(let i=0;i<6;i++){let t=performance.now();PSHO_WELLNESS.render();x.push(performance.now()-t);}return x;}''');session.send('Emulation.setCPUThrottlingRate',{'rate':1});metrics['wellness_render_4x_cpu_median_ms']=round(statistics.median(samples[1:]),1);metrics['head_bytes']=p.evaluate("localStorage.getItem('sloi-v1-head').length*2");metrics['heap']=session.send('Runtime.getHeapUsage');require(metrics['wellness_render_4x_cpu_median_ms']<1500,'4x CPU render over 1.5s')
 check('real storage: 4000 reflections / 1000 screenings / bounded DOM / 4x CPU',populate)
 def limit():
  tab(p,'questionnaires');p.locator('.wellness-test-card').first.locator('button').click()
  for i in range(7):p.locator('[name=screening-'+str(i)+'][value="0"]').check()
  p.locator('#screening-form button[type=submit]').click();require(len(data(p)['assessments'])==1000,'screening limit exceeded');require(p.locator('#wellness-test-form').is_visible(),'limit discarded form');p.locator('#wellness-test-form button[type=button]').click()
 check('1000-result boundary keeps unanswered save form',limit)
 def quota():
  d=data(p);d['entries']=d['entries'][:2];d['assessments']=d['assessments'][:2];p.evaluate("localStorage.removeItem('sloi-v1-a');localStorage.removeItem('sloi-v1-b')");seed(p,d);p.reload();p.wait_for_selector('.mood',state='attached');tab(p,'today');p.locator('#note').fill('must survive quota failure '+'x'*2900)
  filled=p.evaluate('''()=>{let chunk='x'.repeat(2048),i=0;try{for(;i<10000;i++)localStorage.setItem('qa-fill-'+i,chunk);}catch(e){return {i,name:e.name};}throw Error('quota never reached');}''');require(filled['name']=='QuotaExceededError','not a real quota failure');before=data(p);p.locator('#save-entry').click();require(data(p)==before,'failed save changed committed data');require(p.locator('#note').input_value()=='must survive quota failure '+'x'*2900,'failed save lost user input')
  p.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('qa-fill-')).forEach(k=>localStorage.removeItem(k))");p.locator('#save-entry').click();require(len(data(p)['entries'])==3,'save did not recover after freeing quota')
 check('real quota exceeded: no lost data and retry recovers',quota)
 def tabs_conflict():
  q=c.new_page();q.goto(url);q.wait_for_selector('.mood',state='attached');tab(q,'history');q.locator('[data-review]').first.click();q.locator('#reflection-balanced').fill('stale edit must not win')
  tab(p,'history');target_id=p.locator('[data-edit]').first.get_attribute('data-edit');p.locator('[data-edit]').first.click();p.locator('#note').fill('newer edit in other tab');p.locator('#save-entry').click();q.wait_for_function("document.querySelector('.entry').textContent.includes('newer edit in other tab')")
  q.locator('#reflection-form button[type=submit]').click();require(p.locator('#note').input_value()=='','wrong current form state');require(next(e for e in data(q)['entries'] if e['id']==target_id)['note']=='newer edit in other tab','stale review overwrote diary');require(q.locator('#wellness-review').is_visible(),'conflict discarded reflection');q.close()
 check('two real tabs reject stale reflection after storage event',tabs_conflict)
 def offline():
  c.set_offline(True);p.reload();p.wait_for_selector('.mood',state='attached');require(len(data(p)['entries'])==3,'offline reload lost diary');tab(p,'questionnaires');require(p.locator('.wellness-result').count()==2,'offline missing script/data')
 check('real service worker: offline reload contains new features and records',offline)
 before=data(p);c.close();c=pw.chromium.launch_persistent_context(str(profile),**opts);c.set_offline(True);p=c.pages[0];p.set_default_timeout(6000)
 def restart():
  p.goto(url);p.wait_for_selector('.mood',state='attached');after=data(p);metrics['restart_before']={'rev':before['rev'],'entries':len(before['entries']),'tests':len(before['assessments'])};metrics['restart_after']={'rev':after['rev'],'entries':len(after['entries']),'tests':len(after['assessments'])};require(after==before,'persistent browser restart changed data: '+str(metrics['restart_before'])+' -> '+str(metrics['restart_after']))
 check('cold browser restart offline retains real persisted data',restart)
 c.set_offline(False)
 if args.axe:
  axe=args.axe.read_text()
  def a11y():
   for language in ('ru','en'):
    p.locator('#psho-language').select_option(language)
    for theme in ('dark','light'):
     if p.evaluate('document.documentElement.dataset.theme')!=theme:p.locator('#theme-btn').click()
     for name in ('today','history','questionnaires','goals','insights','settings'):
      tab(p,name);p.evaluate(axe);report=p.evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})")
      if report['violations']:violations.append({'language':language,'theme':theme,'tab':name,'violations':report['violations']})
   (E/'accessibility.json').write_text(json.dumps(violations,ensure_ascii=False,indent=2));require(not violations,str([(v['tab'],[(x['id'],len(x['nodes'])) for x in v['violations']]) for v in violations])[:800])
  check('axe WCAG A/AA: six tabs, both themes and languages',a11y)
 def corruption():
  p.evaluate("localStorage.setItem('sloi-v1-head','{corrupt');");p.reload();p.wait_for_selector('#status');require(p.locator('#status').is_visible(),'corruption hidden');require(p.evaluate("localStorage.getItem('sloi-v1-head')")=='{corrupt','silently replaced corrupted HEAD');require(p.locator('#status').inner_text().strip(),'missing recovery notice')
 check('corrupted real HEAD is reported and never silently overwritten',corruption)
 check('no uncaught runtime errors',lambda:require(not errors,str(errors)))
 c.close()
server.shutdown()
report={'checks':results,'metrics':metrics,'passed':sum(x['status']=='PASS' for x in results),'failed':sum(x['status']=='FAIL' for x in results),'limitations':['Chromium on Linux; not a physical phone','Large archive uses short synthetic notes/reflections; maximum-length text has a separate quota limit','4x CPU throttling is not a specific low-end device']};(E/'summary.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2));raise SystemExit(1 if report['failed'] else 0)
