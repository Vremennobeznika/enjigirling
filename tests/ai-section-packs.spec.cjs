const {test,expect}=require('@playwright/test');
const sections=[['index.html','professions'],['calendar.html','calendar'],['resources.html','resources'],['dictionary.html','dictionary'],['map.html','learning'],['calculator.html','calculators'],['compare.html','compare'],['processes.html','processes'],['materials.html','materials']];
test('all nine pages expose full AI section downloads',async({page})=>{
 for(const [name,slug] of sections){
  await page.goto('/'+name);
  await expect(page.locator('.ai-transfer-bar')).toHaveCount(1);
  await expect(page.locator('.site-ai-link')).toHaveAttribute('href','ai.html?section='+slug);
  await expect(page.locator('.ai-transfer-bar a[href="knowledge/sections/'+slug+'.md"]')).toHaveCount(1);
  await expect(page.locator('.ai-transfer-bar a[href="knowledge/sections/'+slug+'.json"]')).toHaveCount(1);
 }
});
test('dedicated AI upload hub lists all nine sections at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/ai.html?section=calendar');
 await expect(page.locator('.ai-hub-card')).toHaveCount(9);
 await expect(page.locator('#pack-calendar')).toBeVisible();
 await expect(page.locator('a[href="knowledge/sections/all.md"]')).toHaveCount(1);
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
 await page.locator('#aiCopyPrompt').click();
 await expect(page.locator('#aiCopyStatus')).toContainText(/Скопировано|Выделите/);
});
test('AI Markdown and JSON are complete, valid and published',async({request})=>{
 const response=await request.get('/knowledge/sections/index.json');
 expect(response.ok()).toBeTruthy();
 const index=await response.json();
 expect(index.sections.map(x=>x.id)).toEqual(sections.map(x=>x[1]));
 for(const item of index.sections){
  const [md,j]=await Promise.all([request.get('/'+item.markdown),request.get('/'+item.json)]);
  expect(md.ok(),item.id+' markdown').toBeTruthy();
  expect(j.ok(),item.id+' JSON').toBeTruthy();
  const pack=await j.json();
  expect(pack.sectionId).toBe(item.id);
  expect(pack.records.length).toBe(pack.recordsCount);
  expect((await md.text()).length).toBeGreaterThan(500);
 }
 const all=await request.get('/knowledge/sections/all.md');
 expect(all.ok()).toBeTruthy();
 expect(await all.text()).toContain('Календарь инженерных дат');
});