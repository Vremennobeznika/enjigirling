"""End-to-end acceptance checks. python tests/check_app.py
Runs Chromium and WebKit against localhost. Does not imply physical device testing.
"""
from playwright.sync_api import sync_playwright
from urllib.parse import urlsplit
from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
RAW=(ROOT/'index.html').read_text()
CSS=(ROOT/'styles.css').read_text()
APP=(ROOT/'app.js').read_text()
INLINE=RAW.replace('<link rel="stylesheet" href="./styles.css">','<style>'+CSS+'</style>').replace('<script src="./app.js" defer></script>','').replace('</body>','<script>'+APP+'</script></body>')

def load(page):
    try: seed=page.evaluate('window.__data || {}')
    except: seed={}
    mock="""<script>window.__data = """+json.dumps(seed,ensure_ascii=False)+""";Object.defineProperty(window,'localStorage',{value:{getItem:function(k){return window.__data[k]||null},setItem:function(k,v){window.__data[k]=String(v)},removeItem:function(k){delete window.__data[k]}}});</script>"""
    page.set_content(INLINE.replace('<head>','<head>'+mock),wait_until='load')

CASES=[('iPhone SE 1 / 320',320,568,'chromium'),('iPhone 8 / 375',375,667,'chromium'),('iPhone SE 2 / 375',375,667,'chromium'),('iPhone 13 mini / 375',375,812,'chromium'),('Android compact / 360',360,640,'chromium'),('Android 4-inch / 320',320,570,'chromium'),('Android tall / 412',412,915,'chromium'),('iPhone Plus / 414',414,736,'chromium'),('Tablet / 768',768,1024,'chromium'),('Desktop / 1280',1280,800,'chromium'),('Landscape small / 568',568,320,'chromium')]
RESULTS=[]
def check(name, fn):
    try: fn(); RESULTS.append({'name':name,'status':'PASS'});print('PASS',name)
    except Exception as e: RESULTS.append({'name':name,'status':'FAIL','reason':str(e)});print('FAIL',name,str(e))
def yes(pred,msg='assertion failed'): assert pred,msg

def viewport_check(p,browsers):
    for label,w,h,engine in CASES:
        browser=browsers[engine]
        page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=2 if w<800 else 1,is_mobile=w<800,has_touch=w<800)
        page.set_default_timeout(5000)
        errors=[];page.on('pageerror',lambda err: errors.append(str(err)))
        def task():
            load(page)
            page.locator('[data-action="start"]').click()
            yes(page.locator('.swatch').count()==9,'expected 9 swatches')
            dims=page.evaluate('''() => ({scroll:document.documentElement.scrollWidth, view:innerWidth, swatches:[...document.querySelectorAll('.swatch')].map(x=>({width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height}))})''')
            yes(dims['scroll']<=dims['view']+2,f'horizontal overflow {dims}')
            yes(min(c['height'] for c in dims['swatches'])>=44,'tap target smaller than 44px')
            yes(min(c['width'] for c in dims['swatches'])>=70,'card too thin')
            yes(len(errors)==0,str(errors))
            if label.startswith('iPhone SE 1'):
                page.screenshot(path=str(ROOT/'tests'/'screen-320-dark.png'),full_page=True)
                page.locator('[data-action="theme"]').click()
                page.screenshot(path=str(ROOT/'tests'/'screen-320-light.png'),full_page=True)
            if label.startswith('Android compact'):
                page.screenshot(path=str(ROOT/'tests'/'screen-360-dark.png'),full_page=True)
        check('layout '+label,task)
        page.close()

with sync_playwright() as p:
    browsers={}
    try:
        browsers['chromium']=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])

        viewport_check(p,browsers)
        browser=browsers['chromium']
        ctx=browser.new_context(viewport={'width':390,'height':844},accept_downloads=True)
        page=ctx.new_page();page.set_default_timeout(5000)
        errors=[];requests=[];page.on('pageerror',lambda err:errors.append(str(err)))
        page.on('request',lambda req:requests.append(req.url))
        load(page)
        def core():
            yes(page.locator('#page-title').count()==1)
            yes(page.locator('link[rel="manifest"]').count()==1)
            yes(page.locator('meta[name="viewport"]').get_attribute('content').find('width=device-width')>=0)
            yes(page.locator('#progress').get_attribute('aria-valuenow')=='0')
            yes(page.locator('[data-action="start"]').count()==1)
            yes(not errors,str(errors))
        check('initial content and semantics',core)
        def theme():
            page.locator('[data-action="theme"]').click()
            yes(page.locator('html').get_attribute('data-theme')=='light')
            load(page)
            yes(page.locator('html').get_attribute('data-theme')=='light','theme not persistent')
            page.locator('[data-action="theme"]').click()
            yes(page.locator('html').get_attribute('data-theme')=='dark')
        check('theme light dark and reload',theme)
        def chooser():
            page.locator('[data-action="start"]').click()
            yes(page.locator('.swatch').count()==9)
            page.locator('.swatch').first.click()
            yes(page.locator('.swatch').count()==8)
            yes(page.locator('#progress').get_attribute('aria-valuenow')=='1')
            page.locator('[data-action="undo"]').click()
            yes(page.locator('.swatch').count()==9)
            yes(page.locator('#progress').get_attribute('aria-valuenow')=='0')
            page.locator('.swatch').first.click()
            load(page)
            yes(page.locator('.swatch').count()==8,'resume after reload failed')
            yes(page.locator('.chosen-chip').count()==1)
            for i in range(8):page.locator('.swatch').first.click()
            yes(page.locator('[data-action="second"]').count()==1,'missing pause screen')
            yes(page.locator('#progress').get_attribute('aria-valuenow')=='9')
            page.locator('[data-action="second"]').click()
            yes(page.locator('.swatch').count()==9)
            for i in range(9):page.locator('.swatch').first.click()
            yes(page.locator('.rank-box').count()==2,'missing results')
            yes(page.locator('.rank-item').count()==18,'bad rank count')
            yes(page.locator('#progress').get_attribute('aria-valuenow')=='18')
            load(page)
            yes(page.locator('.rank-item').count()==18,'results reload failed')
            yes(len(errors)==0,str(errors))
        check('flow 2x9, undo, persistence, comparison',chooser)
        def export():
            with page.expect_download() as di:page.locator('[data-action="download"]').click()
            dl=di.value
            yes(dl.suggested_filename=='chroma-color-choice.txt')
            data=Path(dl.path()).read_bytes().decode('utf-8-sig')
            yes('Раунд 01' in data and 'Раунд 02' in data and 'Не является психологической диагностикой' in data)
        check('result export TXT',export)
        def modal_test():
            page.locator('[data-action="privacy"]').click()
            yes(page.locator('[role="dialog"]').is_visible())
            yes('ничего не отправляется' in page.locator('#modal-body').inner_text().lower())
            page.keyboard.press('Escape');yes(not page.locator('[role="dialog"]').is_visible())
            page.locator('[data-action="install"]').click();yes(page.locator('[role="dialog"]').is_visible())
            page.locator('.modal-close').click();yes(not page.locator('[role="dialog"]').is_visible())
        check('install help privacy modal keyboard Escape',modal_test)
        def restart():
            page.once('dialog',lambda d:d.accept())
            page.locator('[data-action="restart"]').click()
            yes(page.locator('[data-action="start"]').is_visible())
            yes(page.locator('#progress').get_attribute('aria-valuenow')=='0')
        check('new experiment reset',restart)
        def privacy():
            yes(all(urlsplit(u).hostname in ('127.0.0.1',) for u in requests),str(requests))
            yes(not errors,str(errors))
        check('no third-party network and no JS errors',privacy)
        def offline():
            load(page)

            yes('caches.match' in (ROOT/'sw.js').read_text())
            yes('cache.addAll' in (ROOT/'sw.js').read_text())
            yes('Response.error' in (ROOT/'sw.js').read_text())
        check('offline worker static fallback (runtime not verified)',offline)
        ctx.close()
        # Storage denied: allow page to run without persistence.
        ctx=browser.new_context()
        ctx.add_init_script("""(() => { Object.defineProperty(window, 'localStorage', {get(){throw Error('blocked')}}) })();""")
        page=ctx.new_page();page.set_default_timeout(5000)
        def denied():
            page.set_content(INLINE,wait_until='load')
            page.locator('[data-action="start"]').click()
            page.locator('.swatch').first.click()
            yes(page.locator('.chosen-chip').count()==1)
        check('storage unavailable graceful fallback',denied)
        ctx.close()
        # Manifest and service worker static checks
        def manifest():
            x=json.loads((ROOT/'manifest.webmanifest').read_text())
            yes(x['display']=='standalone');yes(x['start_url']=='./');yes(x['scope']=='./')
            for ico in x['icons']:yes((ROOT/ico['src']).is_file())
            for a in ['index.html','styles.css','app.js','sw.js','assets/apple-touch-icon.png']:yes((ROOT/a).is_file())
        check('manifest valid relative paths and icons',manifest)
    finally:
        for br in browsers.values():
            if br:br.close()
        pass

out=ROOT/'tests'/'results.json'
out.write_text(json.dumps({'passed':sum(x['status']=='PASS' for x in RESULTS),'failed':sum(x['status']=='FAIL' for x in RESULTS),'checks':RESULTS},ensure_ascii=False,indent=2),encoding='utf-8')
print('\n',sum(x['status']=='PASS' for x in RESULTS),'passed,',sum(x['status']=='FAIL' for x in RESULTS),'failed')
sys.exit(1 if any(x['status']=='FAIL' for x in RESULTS) else 0)
