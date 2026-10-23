"""High-assurance regression suite. Scope: JS logic, Chromium emulator, static policy; not a clinical validation."""
from pathlib import Path
import json, re, random, hashlib, sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="./styles.css">','<style>'+(ROOT/'styles.css').read_text(encoding='utf-8')+'</style>').replace('<script src="./app.js" defer></script>','').replace('</body>','<script>'+(ROOT/'app.js').read_text(encoding='utf-8')+'</script></body>')
checks=[]
def check(name, fn):
    try:fn();checks.append({'id':name,'status':'PASS'});print('PASS',name)
    except Exception as ex:checks.append({'id':name,'status':'FAIL','detail':str(ex)});print('FAIL',name,ex)
def require(cond,msg):
    if not cond:raise AssertionError(msg)
def mock_html(seed):
    script='<script>window.__data='+json.dumps(seed,ensure_ascii=False)+'; Object.defineProperty(window,"localStorage",{value:{getItem:function(k){return window.__data[k]||null},setItem:function(k,v){window.__data[k]=String(v)},removeItem:function(k){delete window.__data[k]}}});</script>'
    return HTML.replace('<head>','<head>'+script)
def luminance(v):
    vs=[int(v[i:i+2],16)/255 for i in (1,3,5)]
    ls=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in vs]
    return .2126*ls[0]+.7152*ls[1]+.0722*ls[2]

def contrast(a,b):
    u,v=luminance(a),luminance(b)
    return (max(u,v)+.05)/(min(u,v)+.05)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':320,'height':568},accept_downloads=True)
    errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
    def load(seed=None):page.set_content(mock_html(seed or {}),wait_until='load')
    check('SAFETY-no-mental-health-diagnostic-claims',lambda:require(all(not re.search(x,(ROOT/'app.js').read_text(encoding='utf-8'),re.I) for x in [r'у вас депресси',r'у вас тревож',r'психотип',r'достоверн.*диагноз',r'распознае[тм] психич']), 'clinical claim exists'))
    def wcag():
        lines=re.findall(r"id:'[^']+', name:'[^']+', hex:'([^']+)', ink:'([^']+)'",(ROOT/'app.js').read_text(encoding='utf-8'))
        require(len(lines)==9,'not nine swatches')
        for color,ink in lines:require(contrast(color,ink)>=4.5,f'low contrast: {color} and {ink}')
    check('A11Y-nine-color-labels-minimum-contrast-4.5',wcag)
    def no_network():
        html=(ROOT/'index.html').read_text();js=(ROOT/'app.js').read_text()
        require(not re.search(r'fetch\(|XMLHttpRequest|sendBeacon|<iframe|<script\s+src="https?://',html+js,re.I),'possible network channel')
        require('localStorage' in js and 'window.CHROMA_NATIVE' in js,'missing privacy or native export')
    check('PRIVACY-no-runtime-external-request-code',no_network)
    def malformed():
        bad=['{','false','null','[]',json.dumps({'phase':'results','round':1,'rounds':[[],[]]}),json.dumps({'phase':'pause','round':0,'rounds':[[],[]]}),json.dumps({'phase':'choose','round':1,'rounds':[[],[]]}),json.dumps({'phase':'results','round':0,'rounds':[[],[]]}),json.dumps({'phase':'intro','round':0,'rounds':[['cloud'],[]]}),json.dumps({'phase':'choose','round':0,'rounds':[['cloud','cloud'],[]]}),json.dumps({'phase':'choose','round':0,'rounds':[['<script>'],[]]}),'A'*4000]
        for i,s in enumerate(bad):
            load({'chroma.progress.v1':s})
            require(page.locator('[data-action=start]').count()==1,f'corrupt state not discarded #{i}')
            require(page.locator('[data-color]').count()==0,f'corrupt state created choose #{i}')
        require(not errors,'JS errors on corrupt localStorage '+str(errors))
    check('STATE-12-malformed-states-recover',malformed)
    def resume():
        ids=['cloud','rose','fern','orchid','amber','ocean','ink','coral','lime']
        for n in range(9):
            saved=json.dumps({'phase':'choose','round':0,'rounds':[ids[:n],[]]})
            load({'chroma.progress.v1':saved})
            require(page.locator('.chosen-chip').count()==n,'incorrect loaded selections')
            require(page.locator('.swatch').count()==9-n,'incorrect remaining selections')
        load({'chroma.progress.v1':json.dumps({'phase':'pause','round':0,'rounds':[ids,[]]})})
        require(page.locator('[data-action=second]').count()==1,'pause resume broken')
        load({'chroma.progress.v1':json.dumps({'phase':'choose','round':1,'rounds':[ids,ids[:6]]})})
        require(page.locator('.swatch').count()==3,'second round resume broken')
        load({'chroma.progress.v1':json.dumps({'phase':'results','round':1,'rounds':[ids,ids]})})
        require(page.locator('.rank-item').count()==18,'results resume broken')
    check('STATE-12-valid-checkpoints-recover',resume)
    def randomized():
        rng=random.Random(20261023)
        for run in range(5):
            load();page.locator('[data-action=start]').click()
            for rnd in range(2):
                used=[]
                for pos in range(9):
                    remaining=page.locator('.swatch').count()
                    require(remaining==9-pos,'choice count mismatch')
                    buttons=page.locator('.swatch')
                    index=rng.randrange(remaining)
                    ident=buttons.nth(index).get_attribute('data-color')
                    require(ident not in used,'duplicate choice')
                    buttons.nth(index).click();used.append(ident)
                    require(page.locator('#progress').get_attribute('aria-valuenow')==str(rnd*9+pos+1),'progress mismatch')
                if rnd==0:
                    require(page.locator('[data-action=second]').count()==1,'pause absent')
                    page.locator('[data-action=second]').click()
            require(page.locator('.rank-item').count()==18,'results incomplete')
            require(page.locator('.rank-color').count()==18,'wrong colored ranks')
            require('не оценка личности' in page.locator('#stage-content').inner_text(),'safety disclaimer missing')
            with page.expect_download() as di:page.locator('[data-action=download]').click()
            exported=Path(di.value.path()).read_bytes().decode('utf-8-sig')
            require(exported.count('Раунд 0')==2 and exported.count('(')>=18,'missing order in TXT')
    check('FLOW-5-randomized-18-choice-completions',randomized)
    def theme_storage():
        load();page.locator('[data-action=theme]').click()
        require(page.locator('html').get_attribute('data-theme')=='light','light failed')
        require(page.evaluate("window.__data['chroma.theme.v1']")=='light','theme not saved')
        seed=page.evaluate('window.__data')
        load(seed);require(page.locator('html').get_attribute('data-theme')=='light','theme restore failed')
    check('THEME-dark-light-persistence',theme_storage)
    def focus():
        load();page.locator('[data-action=start]').click()
        page.locator('.swatch').first.focus()
        page.keyboard.press('Enter')
        require(page.locator('.swatch').count()==8,'keyboard selection failed')
        require(page.locator('.swatch').first.evaluate('e=>document.activeElement===e'),'focus lost after selection')
        page.locator('[data-action=undo]').click()
        require(page.locator('.swatch').count()==9,'undo not restored')
        page.locator('[data-action=privacy]').click()
        require(page.locator('[role=dialog]').is_visible(),'privacy dialog not open')
        require(page.locator('.modal-close').evaluate('e=>e===document.activeElement'),'modal does not focus close')
        page.keyboard.press('Escape');require(not page.locator('[role=dialog]').is_visible(),'Esc did not close')
    check('A11Y-keyboard-focus-undo-modal',focus)
    def cancelled_reset():
        load();page.locator('[data-action=start]').click();page.locator('.swatch').first.click()
        page.once('dialog',lambda d:d.dismiss())
        page.locator('[data-action=restart]').click()
        require(page.locator('.chosen-chip').count()==1,'cancelled reset lost state')
    check('STATE-cancelled-reset-preserves-progress',cancelled_reset)
    def responsive():
        for w,h in [(280,568),(320,568),(360,640),(375,667),(414,736),(568,320),(768,1024)]:
            page.set_viewport_size({'width':w,'height':h});load();page.locator('[data-action=start]').click()
            data=page.evaluate('''() => ({v:innerWidth,s:document.documentElement.scrollWidth,h:[...document.querySelectorAll('.swatch')].map(x=>x.getBoundingClientRect().height)})''')
            require(data['s']<=data['v']+2,'horizontal scroll at '+str(w))
            require(min(data['h'])>=44,'small card at '+str(w))
            overlaps=page.evaluate('''() => {let a=[...document.querySelectorAll('.swatch')].map(x=>x.getBoundingClientRect());for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(Math.min(a[i].right,a[j].right)>Math.max(a[i].left,a[j].left)+1 && Math.min(a[i].bottom,a[j].bottom)>Math.max(a[i].top,a[j].top)+1)return [i,j];return null;}''')
            require(not overlaps,'overlapping swatches at '+str(w)+': '+str(overlaps))
        page.set_viewport_size({'width':320,'height':568})
    check('LAYOUT-7-critical-viewports-and-44px',responsive)
    browser.close()
report={'date':'2026-10-23','passed':sum(x['status']=='PASS' for x in checks),'failed':sum(x['status']=='FAIL' for x in checks),'checks':checks,'scope':'Chromium logic and static checks only; not a medical test validation, native Android integration test or real Safari/Android hardware test'}
(ROOT/'tests'/'high-assurance-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print('SUMMARY',report['passed'],'passed;',report['failed'],'failed')
sys.exit(1 if report['failed'] else 0)
