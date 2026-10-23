"""CHROMA: browser-based matrix. Chromium emulation, never a physical-device certification."""
from pathlib import Path
import json
import sys
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"screenshots"
OUT.mkdir(exist_ok=True)
HTML=(ROOT/"index.html").read_text(encoding="utf-8")
results=[]
def check(name, passed, reason=""):
    results.append({"id":name,"status":"PASS" if passed else "FAIL","detail":reason})
    print(("PASS " if passed else "FAIL ")+name+" "+reason)
def must(ok,msg):
    if not ok: raise AssertionError(msg)
def run_case(browser,label,width,height):
    page=browser.new_page(viewport={"width":width,"height":height},is_mobile=width<800,has_touch=width<800,device_scale_factor=2 if width<800 else 1)
    problems=[]
    page.on("pageerror",lambda error:problems.append(str(error)))
    try:
        page.set_content(HTML,wait_until="load")
        must(page.locator("[data-action=start]").count()==1,"intro missing")
        page.locator("[data-action=start]").click()
        must(page.locator(".swatch").count()==9,"not nine choices")
        bounds=page.evaluate("""() => ({
            viewport:innerWidth,scroll:document.documentElement.scrollWidth,
            cards:[...document.querySelectorAll('.swatch')].map(el=>el.getBoundingClientRect().height)
        })""")
        must(bounds["scroll"]<=bounds["viewport"]+2,"horizontal overflow")
        must(min(bounds["cards"])>=44,"tap targets <44px")
        crossing=page.evaluate("""() => {const a=[...document.querySelectorAll('.swatch')].map(x=>x.getBoundingClientRect());for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){if(Math.min(a[i].right,a[j].right)>Math.max(a[i].left,a[j].left)+1&&Math.min(a[i].bottom,a[j].bottom)>Math.max(a[i].top,a[j].top)+1)return [i,j];}return null;}""")
        must(not crossing,"overlapping cards: "+str(crossing))
        must(not problems,"JS errors: "+str(problems))
        check("UI-"+label,True)
        if width==320 and height==568:
            page.screenshot(path=str(OUT/"screen-320-dark.png"),full_page=True)
            page.locator("[data-action=theme]").click()
            must(page.locator("html").get_attribute("data-theme")=="light","light theme failed")
            page.screenshot(path=str(OUT/"screen-320-light.png"),full_page=True)
        if width==360 and height==640:
            page.screenshot(path=str(OUT/"screen-360-dark.png"),full_page=True)
        if width==375 and height==667:
            for i in range(9): page.locator(".swatch").first.click()
            must(page.locator("[data-action=second]").count()==1,"missing second round")
            page.locator("[data-action=second]").click()
            for i in range(9): page.locator(".swatch").first.click()
            must(page.locator(".rank-item").count()==18,"missing result rows")
            must(page.locator("#progress").get_attribute("aria-valuenow")=="18","wrong progress")
            page.screenshot(path=str(OUT/"screen-375-results.png"),full_page=True)
            check("FLOW-18-unique-picks",True)
        if width==390 and height==844:
            page.locator(".swatch").first.click()
            must(page.locator(".swatch").count()==8,"selection did not advance")
            must(page.locator(".swatch").first.evaluate("e=>document.activeElement===e"),"focus lost after click")
            page.locator("[data-action=undo]").click()
            must(page.locator(".swatch").count()==9,"undo failed")
            page.locator("[data-action=privacy]").click()
            must(page.locator("[role=dialog]").is_visible(),"dialog missing")
            page.keyboard.press("Escape")
            must(not page.locator("[role=dialog]").is_visible(),"dialog did not close")
            check("FLOW-undo-focus-modal",True)
        page.close()
    except Exception as e:
        check("UI-"+label,False,str(e))
        page.close()

with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True)
    for label,w,h in [
        ("280-568",280,568),("320-568",320,568),("320-570",320,570),
        ("360-640",360,640),("375-667",375,667),("375-812",375,812),
        ("390-844",390,844),("412-915",412,915),("414-736",414,736),
        ("568-320-landscape",568,320),("768-1024-tablet",768,1024),
        ("1280-800",1280,800)]:
        run_case(browser,label,w,h)
    browser.close()
report={"passed":sum(x["status"]=="PASS" for x in results),"failed":sum(x["status"]=="FAIL" for x in results),"checks":results,
        "limitations":["Chromium only: no physical iPhone, Android device, Safari/WebKit, full accessibility or offline installation testing."]}
(ROOT/"tests"/"ci-results.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps({"passed":report["passed"],"failed":report["failed"]}))
sys.exit(1 if report["failed"] else 0)
