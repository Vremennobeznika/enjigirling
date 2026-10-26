const {test,expect}=require('@playwright/test');
test('resources directory: categories, alphabetical sort, search, reset and list mode',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1280,height:800});
  await page.goto('/resources.html');
  const searchRect=await page.locator('#resourceSearch').boundingBox();
  const sortRect=await page.locator('#resourceSort').boundingBox();
  const viewRect=await page.locator('.resource-view-buttons').boundingBox();
  expect(sortRect.y).toBeGreaterThan(searchRect.y+searchRect.height-2);
  expect(Math.abs(sortRect.x-searchRect.x)).toBeLessThan(6);
  expect(viewRect.x).toBeLessThan(searchRect.x+480);
  const activeColors=await page.locator('#resourceGridView').evaluate(el=>{const c=getComputedStyle(el);return{fg:c.color,bg:c.backgroundColor}});
  expect(activeColors.fg).not.toBe(activeColors.bg);
  const cards=page.locator('#resourcesGrid .resource-card');
  const catalogSize=await page.evaluate(()=>resources.length);
  await expect(page.locator('#resourcesGrid')).toHaveAttribute('data-ready','true');
  await expect(cards).toHaveCount(47);
  await expect(page.locator('#resourcesGrid')).toHaveAttribute('data-matches',String(catalogSize));
  await expect(page.locator('#resourceShowMore')).toBeVisible();
  await expect(page.locator('#resourcesFilter button')).toHaveCount(11);
  await expect(page.locator('.resource-topic-header')).not.toHaveCount(0);
  await page.locator('#resourcesFilter button[title="Онлайн-измерения"]').click();
  await expect(cards).toHaveCount(13);
  await expect(page.locator('#resourcesGrid')).toContainText('микрометр');
  await page.locator('#resourcesFilter button[title="Журналы"]').click();
  await page.locator('#resourcesFilter button[title="САПР и конструирование"]').click();
  await expect(cards.first()).toBeVisible();
  await expect(page.locator('#resourcesGrid')).toContainText('КОМПАС-3D');
  await expect(page.locator('#resourcesGrid')).not.toContainText('GitVerse');
  await expect(page.locator('#resourcesFilter button[title="Разработка ПО"]')).toHaveCount(0);
  await expect(page.locator('#resourcesGrid')).not.toContainText('GitVerse');
  await page.locator('#resourcesFilter button[title="Стандарты и метрология"]').click();
  await expect(page.locator('#resourcesGrid .resource-group')).toHaveCount(1);
  await expect(cards).toHaveCount(7);
  await page.locator('#resourceSearch').fill('ISO');
  await expect(cards).toHaveCount(1);
  await page.locator('#resourceReset').click();
  await expect(cards).toHaveCount(47);
  await expect(page.locator('#resourceShowMore')).toBeVisible();
  await page.locator('#resourceSort').selectOption('za');
  const names=await page.locator('#resourcesGrid .resource-group').first().locator('.resource-card .eng-title').allTextContents();
  expect(names[0].localeCompare(names[names.length-1],'ru')).toBeGreaterThanOrEqual(0);
  await page.locator('#resourceListView').click();
  await expect(page.locator('#resourcesGrid')).toHaveClass(/resource-list-view/);
  await page.setViewportSize({width:390,height:844});
  const dimension=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:document.documentElement.clientWidth}));
  expect(dimension.w).toBeLessThanOrEqual(dimension.v+2);
  expect(errors).toEqual([]);
});

test('resources: full indexed search, progressive loading, keyboard and 320px mobile',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:320,height:700});
  await page.goto('/resources.html');
  const cards=page.locator('#resourcesGrid .resource-card');
  const catalogSize=await page.evaluate(()=>resources.length);
  const more=page.locator('#resourceShowMore');
  await expect(cards).toHaveCount(47);
  await expect(page.locator('#resourcesGrid .resource-group')).toHaveCount(11);
  await expect(page.locator('#resourcesGrid .resource-group[aria-label="Дружественные каналы"] .resource-card')).toHaveCount(11);
  await expect(page.locator('#resourcesGrid')).toHaveAttribute('data-matches',String(catalogSize));
  expect(await page.locator('#resourcesGrid *').count()).toBeLessThan(900);
  await page.locator('#resourceSearch').fill('KELIBRON');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('KELIBRON');
  await expect(more).toBeHidden();
  await page.locator('#resourceSearch').fill('черной');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('чёрной');
  await page.locator('#resourceSearch').press('Escape');
  await expect(cards).toHaveCount(47);
  await expect(more).toBeVisible();
  await more.focus();await page.keyboard.press('Enter');
  await expect.poll(()=>cards.count()).toBeGreaterThan(47);
  for(let i=0;i<15 && await more.isVisible();i++)await more.click();
  await expect(more).toBeHidden();
  await expect(cards).toHaveCount(catalogSize);
  await expect(page.locator('#resourcesGrid')).toHaveAttribute('data-rendered',String(catalogSize));
  expect(await cards.evaluateAll(els=>new Set(els.map(el=>el.href)).size)).toBe(catalogSize);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  await page.locator('#resourceReset').click();
  await expect(cards).toHaveCount(47);
  for (const width of [320,375,390,768]) {
    await page.setViewportSize({width,height:700});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow,'horizontal overflow at '+width+' px').toBeLessThanOrEqual(2);
  }
  expect(errors).toEqual([]);
});

test('resources offer a readable fallback without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  try {
    const page=await context.newPage();
    await page.goto('/resources.html');
    await expect(page.locator('main noscript .eng-empty')).toContainText('Markdown');
    await expect(page.locator('a[href="knowledge/sections/resources.md"]').first()).toBeVisible();
  } finally { await context.close(); }
});



test('coding library: 25 sources, eight groups, downloads, mobile filtering',async({page,request})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:320,height:720});
 await page.goto('/coding.html');
 await expect(page.locator('#codingCatalog')).toHaveAttribute('data-ready','true');
 await expect(page.locator('#codingCatalog .coding-card')).toHaveCount(40);
 await expect(page.locator('#codingCatalog')).toContainText('GitVerse');
 await expect(page.locator('.coding-topic')).toHaveCount(8);
 await expect(page.locator('#codingSearch')).toBeVisible();
 await expect(page.locator('a[href="downloads/ai-llm-guide.pdf"]')).toBeVisible();
 await expect(page.locator('a[href="downloads/ai-qa-engineering.pdf"]')).toBeVisible();
 const pdf=await request.get('/downloads/ai-llm-guide.pdf');
 expect(pdf.ok()).toBeTruthy();
 expect((await pdf.body()).subarray(0,5).toString()).toBe('%PDF-');
 await page.locator('#codingSearch').fill('Playwright');
 await expect(page.locator('#codingCatalog .coding-card')).toHaveCount(1);
 await page.locator('#codingClear').click();
 await expect(page.locator('#codingCatalog .coding-card')).toHaveCount(40);
 const src=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>x.name));
 expect(src.some(x=>x.endsWith('/resources-data.js'))).toBe(false);
 for(const width of [320,360,390,768]){
  await page.setViewportSize({width,height:800});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
 }
 expect(errors).toEqual([]);
});
