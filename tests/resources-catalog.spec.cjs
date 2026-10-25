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
  await expect(cards).toHaveCount(55);
  await expect(page.locator('#resourcesGrid')).toHaveAttribute('data-matches',String(catalogSize));
  await expect(page.locator('#resourceShowMore')).toBeVisible();
  await expect(page.locator('#resourcesFilter button')).toHaveCount(13);
  await expect(page.locator('.resource-topic-header')).not.toHaveCount(0);
  await page.locator('#resourcesFilter button[title="Онлайн-измерения"]').click();
  await expect(cards).toHaveCount(13);
  await expect(page.locator('#resourcesGrid')).toContainText('микрометр');
  await page.locator('#resourcesFilter button[title="Журналы"]').click();
  await page.locator('#resourcesFilter button[title="САПР и конструирование"]').click();
  await expect(cards.first()).toBeVisible();
  await expect(page.locator('#resourcesGrid')).toContainText('КОМПАС-3D');
  await expect(page.locator('#resourcesGrid')).not.toContainText('GitVerse');
  await page.locator('#resourcesFilter button[title="Разработка ПО"]').click();
  await expect(page.locator('#resourcesGrid')).toContainText('GitVerse');
  await expect(page.locator('#resourcesGrid')).not.toContainText('КОМПАС-3D');
  await page.locator('#resourcesFilter button[title="Стандарты и метрология"]').click();
  await expect(page.locator('#resourcesGrid .resource-group')).toHaveCount(1);
  await expect(cards).toHaveCount(7);
  await page.locator('#resourceSearch').fill('ISO');
  await expect(cards).toHaveCount(1);
  await page.locator('#resourceReset').click();
  await expect(cards).toHaveCount(55);
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
  await expect(cards).toHaveCount(55);
  await expect(page.locator('#resourcesGrid .resource-group')).toHaveCount(12);
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
  await expect(cards).toHaveCount(55);
  await expect(more).toBeVisible();
  await more.focus();await page.keyboard.press('Enter');
  await expect.poll(()=>cards.count()).toBeGreaterThan(51);
  for(let i=0;i<15 && await more.isVisible();i++)await more.click();
  await expect(more).toBeHidden();
  await expect(cards).toHaveCount(catalogSize);
  await expect(page.locator('#resourcesGrid')).toHaveAttribute('data-rendered',String(catalogSize));
  expect(await cards.evaluateAll(els=>new Set(els.map(el=>el.href)).size)).toBe(catalogSize);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  await page.locator('#resourceReset').click();
  await expect(cards).toHaveCount(55);
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


test('AI library: eight topics, 25 documents, files and mobile layout', async ({page,request}) => {
  const errors=[];page.on('pageerror',err=>errors.push(err.message));
  await page.setViewportSize({width:320,height:720});
  await page.goto('/resources.html#ai-library-catalog');
  await expect(page.locator('#ai-library-catalog')).toHaveCount(1);
  await expect(page.locator('#ai-library-catalog')).toBeInViewport();
  await expect(page.locator('#resourcesFilter button[title="Библиотека программирования для ИИ"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#resourcesGrid .resource-card')).toHaveCount(25);
  await expect(page.locator('#resourcesGrid .resource-topic-header')).toHaveCount(8);
  await expect(page.locator('#resourceShowMore')).toBeHidden();
  await expect(page.locator('#aiLibraryTitle')).toContainText('программирования');
  await expect(page.locator('.resource-ai-library-primary')).toHaveAttribute('download','ai-programming-links-25.txt');
  const urls=await (await request.get('/knowledge/ai-code-library-links.txt')).text();
  expect(urls.trim().split('\n')).toHaveLength(25);
  await page.evaluate(() => {
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copiedAiLinks=value;}}});
  });
  await page.locator('#resourceCopyAiLinks').click();
  await expect(page.locator('#resourceCopyAiStatus')).toContainText('25 ссылок скопированы');
  expect(await page.evaluate(()=>window.__copiedAiLinks)).toBe(urls.trim());
  for (const path of ['/knowledge/ai-code-library.md','/knowledge/ai-code-library-links.txt']) {
    const response=await request.get(path);expect(response.ok(),path).toBeTruthy();
    expect(await response.text()).toContain('https://docs.python.org/ru/3/tutorial/');
  }
  await page.locator('#resourceSearch').fill('Playwright');
  await expect(page.locator('#resourcesGrid .resource-card')).toHaveCount(1);
  await page.locator('#resourceReset').click();
  await expect(page.locator('#resourcesGrid .resource-card')).toHaveCount(55);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  expect(errors).toEqual([]);
});
