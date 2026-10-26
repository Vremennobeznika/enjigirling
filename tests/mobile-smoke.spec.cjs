const {test,expect}=require('@playwright/test');
const pages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const width of [320,375,768]){
for(const path of pages){
  test('responsive navigation and no horizontal overflow at '+width+'px: '+path,async({page})=>{
    await page.setViewportSize({width,height:812});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/'+path);
    await expect(page.locator('nav.eng-tabs a')).toHaveCount(12);
    const nav=page.locator('.site-nav-toggle');
    await expect(nav).toBeVisible();
    await nav.click();
    await expect(nav).toHaveAttribute('aria-expanded','true');
    await page.keyboard.press('Escape');
    await expect(nav).toHaveAttribute('aria-expanded','false');
    const overflow=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,
      page:document.documentElement.scrollWidth,
      body:document.body.scrollWidth
    }));
    expect(overflow.page,path+': page overflows '+JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport+2);
    expect(overflow.body,path+': body overflows '+JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport+2);
    expect(errors).toEqual([]);
  });
}
}

for(const path of pages){
 test('no-JavaScript navigation remains accessible on 320px: '+path,async({browser})=>{
  const context=await browser.newContext({viewport:{width:320,height:812},javaScriptEnabled:false});
  const page=await context.newPage();
  try{
   await page.goto('/'+path);
   await expect(page.locator('.site-nav-wrap > nav.eng-tabs a')).toHaveCount(12);
   await expect(page.locator('.site-nav-wrap > nav.eng-tabs a').first()).toBeVisible();
   await expect(page.locator('.site-nav-toggle')).toBeHidden();
  }finally{await context.close();}
 });
}
