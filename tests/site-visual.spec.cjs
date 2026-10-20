const {test,expect}=require('@playwright/test');
const pages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]){
 for(const pageName of pages){
  test(pageName+' at '+viewport.width+'px',async({page})=>{
   await page.setViewportSize(viewport);
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/'+pageName,{waitUntil:'domcontentloaded'});
   await expect(page.locator('nav.eng-tabs a')).toHaveCount(9);
   await expect(page.locator('main')).toBeVisible();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   expect(overflow,'horizontal document overflow').toBeFalsy();
   if(viewport.width<=860){
    const toggle=page.locator('.site-nav-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('nav.eng-tabs a')).toHaveCount(9);
    await expect(page.locator('nav.eng-tabs')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded','false');
   }
   expect(errors,'uncaught browser exceptions').toEqual([]);
  });
 }
}

test('engineer detail links use monochrome colors',async({page})=>{
 await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
 await page.locator('#professionsGrid .eng-card').first().click();
 const links=page.locator('#modalContent a');
 await expect(links.first()).toBeVisible();
 const colors=await links.evaluateAll(nodes=>nodes.map(a=>getComputedStyle(a).color));
 const expected=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim());
 const resolved=await page.evaluate(()=>{const el=document.createElement('span');el.style.color='var(--text-primary)';document.body.appendChild(el);const c=getComputedStyle(el).color;el.remove();return c;});
 for(const color of colors)expect(color).toBe(resolved);
});
