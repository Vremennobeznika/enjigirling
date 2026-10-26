const {test,expect}=require('@playwright/test');
const sections=[['index.html','professions'],['calendar.html','calendar'],['resources.html','resources'],['dictionary.html','dictionary'],['map.html','learning'],['calculator.html','calculators'],['compare.html','compare'],['processes.html','processes'],['materials.html','materials']];
test('coding files and AI data exports stay separated on weak screens',async({page,request})=>{
 for(const width of [320,390,768,1366]){
  await page.setViewportSize({width,height:800});
  for(const target of ['/resources.html','/coding.html','/ai.html']){
   await page.goto(target);
   const difference=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(difference,target+' at '+width).toBeLessThanOrEqual(2);
  }
  await expect(page.locator('a[href="downloads/ai-llm-guide.pdf"]')).toHaveCount(0);
  await page.goto('/resources.html');
  await expect(page.locator('#ai-library')).toHaveCount(0);
  await expect(page.locator('[href*="ai-llm-guide.pdf"]')).toHaveCount(0);
 }
 await page.goto('/coding.html');
 await expect(page.locator('#codingCatalog .coding-card')).toHaveCount(25);
 await expect(page.locator('a[href="downloads/ai-llm-guide.pdf"]')).toBeVisible();
 await page.goto('/ai.html');
 await expect(page.locator('#atlasAiPackage')).toBeVisible();
 await expect(page.locator('#pack-ai-code-library')).toHaveCount(0);
 const links=await request.get('/knowledge/ai-code-library-links.txt');
 expect(links.ok()).toBeTruthy();
 expect((await links.text()).trim().split('\n')).toHaveLength(25);
});
test('all nine sections use one AI center without inline download panels',async({page})=>{
 for(const [name] of sections){
  await page.goto('/'+name);
  await expect(page.locator('nav.eng-tabs a[href="ai.html"]')).toHaveCount(1);
  await expect(page.locator('nav.eng-tabs a[href="coding.html"]')).toHaveCount(1);
  await expect(page.locator('.site-ai-link')).toHaveCount(0);
  await expect(page.locator('.ai-transfer-bar,#atlasAiPackage')).toHaveCount(0);
  await expect(page.locator('a[download][href*="knowledge/"]')).toHaveCount(0);
 }
});
test('dedicated AI upload hub lists all nine sections at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/ai.html?section=calendar');
 await expect(page.locator('.ai-hub-card')).toHaveCount(9);
 await expect(page.locator('#pack-ai-code-library')).toHaveCount(0);
 await expect(page.locator('#pack-calendar')).toBeVisible();
 await expect(page.locator('a[href="knowledge/ai-context.md"]')).toHaveCount(1);
 await expect(page.locator('#atlasAiPackage')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
 await page.locator('#aiCopyPrompt').click();
 await expect(page.locator('#aiCopyStatus')).toContainText(/Скопировано|Выделите/);
});
test('AI Markdown and JSON are complete, valid and published',async({request})=>{
 const response=await request.get('/knowledge/sections/index.json');
 expect(response.ok()).toBeTruthy();
 const index=await response.json();
 expect(index.sections.map(x=>x.id)).toEqual(['professions','calendar','resources','ai-code-library','dictionary','learning','calculators','compare','processes','materials']);
 expect(index.sections.find(x=>x.id==='ai-code-library').records).toBe(25);
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
test('AI programming library is a standalone export, not the full community catalog', async ({request})=>{
  const md=await request.get('/knowledge/sections/ai-code-library.md');
  const json=await request.get('/knowledge/sections/ai-code-library.json');
  expect(md.ok()).toBeTruthy();expect(json.ok()).toBeTruthy();
  const pack=await json.json(),text=await md.text();
  expect(pack.recordsCount).toBe(25);
  expect(pack.records.every(x=>x.type==='Библиотека программирования для ИИ')).toBeTruthy();
  expect(pack.records.map(x=>x.link)).toHaveLength(25);
  expect(text).toContain('https://docs.python.org/ru/3/tutorial/');
  expect(text).not.toContain('CADmaster');
});
