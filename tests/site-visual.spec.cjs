const {test,expect}=require('@playwright/test');
const pages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const viewport of [{width:320,height:720},{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]){
 for(const pageName of pages){
  test(pageName+' at '+viewport.width+'px',async({page})=>{
   await page.setViewportSize(viewport);
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/'+pageName,{waitUntil:'domcontentloaded'});
   await expect(page.locator('nav.eng-tabs a')).toHaveCount(9);
   await expect(page.locator('main')).toBeVisible();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   if(overflow){const offenders=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(el=>el.getBoundingClientRect().right>window.innerWidth+2).slice(0,12).map(el=>({tag:el.tagName,cls:el.className?.toString().slice(0,80),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)})));console.log('OVERFLOW DIAG',pageName,viewport.width,JSON.stringify(offenders),await page.evaluate(()=>({doc:document.documentElement.scrollWidth,body:document.body.scrollWidth,inner:innerWidth,wide:[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+3&&getComputedStyle(e).overflowX==='visible').slice(0,12).map(e=>[e.tagName,e.className?.toString().slice(0,55),e.scrollWidth,e.clientWidth])})));}
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
   if([390,1440].includes(viewport.width)) await page.screenshot({path:'visual-review/'+pageName.replace('.html','')+'-'+viewport.width+'.png',fullPage:true,animations:'disabled'});
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

for(const theme of ['light','dark']){
 test('engineer modal links '+theme+' theme and visited state',async({page})=>{
  await page.addInitScript(value=>localStorage.setItem('theme',value),theme);
  await page.goto('http://127.0.0.1:8765/index.html');
  await page.locator('#professionsGrid .eng-card').first().click();
  const links=page.locator('#modalContent a');
  await expect(links.first()).toBeVisible();
  const expected=await page.evaluate(()=>{const span=document.createElement('span');span.style.color='var(--text-primary)';document.body.appendChild(span);const c=getComputedStyle(span).color;span.remove();return c;});
  for(const color of await links.evaluateAll(nodes=>nodes.map(x=>getComputedStyle(x).color)))expect(color).toBe(expected);
  await expect(page.locator('#modalOverlay')).toBeVisible();
 });
}
test('skip link is available to keyboard users',async({page})=>{
 await page.goto('http://127.0.0.1:8765/index.html');
 await page.keyboard.press('Tab');
 await expect(page.locator('.skip-link')).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#main-content$/);
});
