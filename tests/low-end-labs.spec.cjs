const {test,expect}=require('@playwright/test');

test('low-end 4x CPU: isolated coding and robotics, 320px, no large atlas fetch',async({page,browserName})=>{
 if(browserName!=='chromium')test.skip();
 test.setTimeout(45000);
 const issues=[];page.on('pageerror',e=>issues.push(e.message));
 const dev=await page.context().newCDPSession(page);
 await dev.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.emulateMedia({reducedMotion:'reduce'});
 try{
  for(const width of [320,360,390]){
   await page.setViewportSize({width,height:740});
   for(const p of ['/index.html','/coding.html','/robotics.html','/ai.html','/resources.html']){
    await page.goto(p,{waitUntil:'domcontentloaded'});
    await expect(page.locator('nav.eng-tabs a')).toHaveCount(12);
    const widthDelta=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(widthDelta,p+' at '+width+' px').toBeLessThanOrEqual(2);
   }
  }
  await page.goto('/coding.html');
  await expect(page.locator('#codingCatalog .coding-card')).toHaveCount(40);
  await page.locator('#codingSearch').fill('GitVerse');
  await expect(page.locator('#codingCatalog .coding-card')).toHaveCount(1);
  await page.locator('#codingClear').click();
  await expect(page.locator('#codingCatalog .coding-card')).toHaveCount(40);
  await page.goto('/robotics.html');
  await expect(page.locator('#roboticsTorqueForm')).toBeVisible();
  await expect(page.locator('#roboticsDrawing, #robotics3d')).toHaveCount(0);
  const requests=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>new URL(r.name).pathname));
  for(const heavy of ['/resources-data.js','/materials-data.js','/processes-data.js']){
   expect(requests,heavy+' should not load for robotics').not.toContain(heavy);
  }
  expect(issues).toEqual([]);
 }finally{await dev.detach();}
});
