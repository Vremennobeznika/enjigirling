const {test,expect}=require('@playwright/test');
for(const file of ['materials.html','processes.html','ai.html']){
 test(file+' — mobile layout and AI package controls',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(file);
  const panel=page.locator('#atlasAiPackage');
  if(file!=='ai.html'){await expect(panel).toHaveCount(0);await page.goto('/ai.html');}
  await expect(panel).toBeVisible();
  await expect(panel.locator('#atlasAiSector')).toBeVisible();
  await expect(panel.locator('#atlasAiScope')).toBeVisible();
  const width=await page.evaluate(()=>({
   viewport:document.documentElement.clientWidth,
   body:document.body.scrollWidth,
   doc:document.documentElement.scrollWidth
  }));
  expect(width.doc).toBeLessThanOrEqual(width.viewport+2);
  expect(width.body).toBeLessThanOrEqual(width.viewport+2);
  await panel.locator('#atlasAiSector').selectOption('water');
  await expect(panel.locator('#atlasAiStatus')).toContainText('Водоподготовка');
  expect(errors).toEqual([]);
 });
}
