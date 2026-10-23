"""Chaos checks, forced storage failures, rollback protection, expanded reflow.
Run: python tests/fault_matrix.py
Does not replace physical iPhone/Android installation tests.
"""
import json, sys, re
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
raw=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles.css').read_text(encoding='utf-8')
app=(ROOT/'app.js').read_text(encoding='utf-8')
html=raw.replace('<link rel="stylesheet" href="./styles.css">','<style>'+css+'</style>').replace('<script src="./app.js" defer></script>','').replace('</body>','<script>'+app+'</script></body>')
report=[]
def check(name,action):
    try:
        action()
        report.append({'name':name,'status':'PASS'}); print('PASS',name)
    except Exception as exc:
        report.append({'name':name,'status':'FAIL','detail':str(exc)});print('FAIL',name,str(exc))
def expect(condition,msg):
    if not condition:raise AssertionError(msg)

def injected(seed=None,mode='normal'):
    # Deliberately mock storage to test atomicity, schema, and safe degraded mode.
    script="""<script>(function(){
    window.__stored=SEED;
    window.__failMode='MODE';
    Object.defineProperty(window,'localStorage',{configurable:true,value:{
      getItem:function(k){if(window.__failMode==='readFail')throw Error('storage blocked');return Object.prototype.hasOwnProperty.call(window.__stored,k)?window.__stored[k]:null;},
      setItem:function(k,v){if(window.__failMode==='writeFail')throw Error('quota');if(window.__failMode==='primaryFail'&&k==='chroma.progress.v1')throw Error('power loss');window.__stored[k]=String(v);},
      removeItem:function(k){delete window.__stored[k];}
    }});
    })();</script>""".replace('SEED',json.dumps(seed or {},ensure_ascii=False)).replace('MODE',mode)
    return html.replace('<head>','<head>'+script)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':320,'height':568})
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    def load(seed=None,mode='normal'):page.set_content(injected(seed,mode),wait_until='load')
    def step():
        page.locator('[data-action=start]').click()
        page.locator('.swatch').first.click()
        page.locator('.swatch').first.click()
        expect(page.locator('.chosen-chip').count()==2,'expected 2 saved choices')
        return page.evaluate('window.__stored')
    def backup():
        load();saved=step()
        expect('chroma.progress.v1' in saved,'primary not written')
        expect('chroma.progress.backup.v2' in saved or 'chroma.progress.checkpoint.v2' in saved,'no backup')
        saved['chroma.progress.v1']='{damaged'
        load(saved)
        expect(page.locator('.chosen-chip').count()==2,'lost current checkpoint on primary corruption')
    check('STATE-primary-corrupt-falls-back-to-latest-valid-copy',backup)
    def backup_corrupt():
        load();saved=step();saved['chroma.progress.backup.v2']='tampered';saved['chroma.progress.checkpoint.v2']='tampered'
        load(saved)
        expect(page.locator('.chosen-chip').count()==2,'valid primary was not chosen')
    check('STATE-backup-corrupt-preserves-primary',backup_corrupt)
    def both_corrupt():
        load();saved=step();saved.update({'chroma.progress.v1':'bad','chroma.progress.backup.v2':'bad','chroma.progress.checkpoint.v2':'bad'})
        load(saved)
        expect(page.locator('[data-action=start]').count()==1,'corrupt all should return to intro')
        expect(not page.locator('.rank-item').count(),'phantom results after total corruption')
    check('STATE-all-copies-corrupt-fails-closed',both_corrupt)
    def tampering():
        load();saved=step();x=json.loads(saved['chroma.progress.v1']);x['rounds']=[['cloud','rose','fern','orchid','amber','ocean','ink','coral','lime'],['cloud','rose','fern','orchid','amber','ocean','ink','coral','lime']];x['round']=1;x['phase']='results'
        saved['chroma.progress.v1']=json.dumps(x,ensure_ascii=False)
        saved['chroma.progress.backup.v2']='{';load(saved)
        expect(page.locator('.rank-item').count()==0,'tampered fake results trusted');expect(page.locator('.chosen-chip').count()==1,'last valid backup not recovered')
    check('STATE-checksum-rejects-tampered-primary',tampering)
    def interrupted():
        load(mode='primaryFail');saved=step()
        expect('chroma.progress.v1' not in saved,'simulated primary write unexpectedly succeeded')
        load(saved)
        expect(page.locator('.chosen-chip').count()==2,'latest valid backup not recovered after interrupted primary write')
    check('STATE-interrupted-primary-write-keeps-newest-checkpoint',interrupted)
    def no_storage():
        load(mode='writeFail');page.locator('[data-action=start]').click();page.locator('.swatch').first.click()
        expect(page.locator('.chosen-chip').count()==1,'storage quota unexpectedly breaks UI')
        load(mode='readFail');expect(page.locator('[data-action=start]').count()==1,'storage read exception breaks new session')
    check('STATE-storage-unavailable-does-not-break-current-session',no_storage)
    def fault_once():
        load();page.locator('[data-action=start]').click()
        page.evaluate('''() => {
            var el=document.getElementById('stage-content'); var d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
            window.__tripped=false;
            Object.defineProperty(el,'innerHTML',{configurable:true,get:function(){return d.get.call(this)},set:function(v){if(!window.__tripped){window.__tripped=true;throw Error('synthetic render failure')}return d.set.call(this,v)}});
        }''')
        page.locator('.swatch').first.click()
        expect(page.evaluate('window.__tripped'),'fault not injected')
        expect(page.locator('.chosen-chip').count()==1,'failed render did not recover new checkpoint')
        expect(page.locator('.swatch').count()==8,'screen not recovered')
    check('FAULT-render-throws-once-recovers-current-step',fault_once)
    def fault_forever():
        load();page.locator('[data-action=start]').click()
        page.evaluate('''() => {var el=document.getElementById('stage-content');var d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
          Object.defineProperty(el,'innerHTML',{configurable:true,get:function(){return d.get.call(this)},set:function(v){if(v.indexOf('recovery-panel')<0)throw Error('synthetic renderer failure');return d.set.call(this,v)}});
        }''')
        page.locator('.swatch').first.click()
        expect(page.locator('.recovery-panel').count()==1,'recovery should stop looping')
        expect(page.locator('[data-action=retry]').count()==1,'manual retry missing')
    check('FAULT-permanent-render-error-does-not-loop',fault_forever)
    def all_widths():
        for theme in ['dark','light']:
          for vw,vh in [(280,480),(300,490),(320,568),(360,640),(375,667),(390,844),(414,736),(568,320),(667,375),(768,1024),(1280,720)]:
            for zoom in [100,200]:
              page.set_viewport_size({'width':vw,'height':vh});load()
              if theme=='light':page.locator('[data-action=theme]').click()
              if zoom==200:page.add_style_tag(content='html{font-size:200%!important}body{letter-spacing:.03em!important}')
              page.locator('[data-action=start]').click()
              measured=page.evaluate('''() => ({scroll:document.documentElement.scrollWidth,window:window.innerWidth,swatches:[...document.querySelectorAll('.swatch')].map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height})),other:[...document.querySelectorAll('.btn,.icon-button')].map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))})''')
              expect(measured['scroll']<=measured['window']+2,f'overflow at {vw}/{vh} {theme} {zoom}%: {measured}')
              expect(min(x['w'] for x in measured['swatches'])>=70,f'color too narrow at {vw} {zoom}%')
              expect(min(x['h'] for x in measured['swatches'])>=44,f'color too short at {vw} {zoom}%')
    check('LAYOUT-44-combinations-width-orientation-theme-200percent',all_widths)
    def results_under_zoom():
        for w,h in [(280,568),(320,568),(375,667)]:
            page.set_viewport_size({'width':w,'height':h});load();page.add_style_tag(content='html{font-size:200%!important}')
            page.locator('[data-action=start]').click()
            for i in range(9):page.locator('.swatch').first.click()
            page.locator('[data-action=second]').click()
            for i in range(9):page.locator('.swatch').first.click()
            expect(page.locator('.rank-item').count()==18,'missing results')
            expect(page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'results overflow at '+str(w))
    check('LAYOUT-results-280-320-375-at-200percent',results_under_zoom)
    browser.close()
results={'passed':sum(c['status']=='PASS' for c in report),'failed':sum(c['status']=='FAIL' for c in report),'checks':report,'scope':'Chromium mock storage + layout/zoom only. No native renderer/device proof.'}
(ROOT/'tests'/'fault-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print('SUMMARY',results['passed'],results['failed'])
sys.exit(1 if results['failed'] else 0)
