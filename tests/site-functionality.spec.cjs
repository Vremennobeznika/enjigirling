const {test,expect}=require('@playwright/test');
const base='http://127.0.0.1:8765/';

test('every profession card opens with provenance and can close with Escape', async ({page})=>{
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.goto(base+'index.html');
  const cards=page.locator('#professionsGrid .eng-card');
  await expect(cards).toHaveCount(51);
  await expect(page.locator('#professionCount')).toHaveText('51 из 51');
  for(let i=0;i<51;i++){
    await cards.nth(i).click();
    await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','false');
    await expect(page.locator('#modalTitle')).not.toBeEmpty();
    await expect(page.locator('#modalContent')).toContainText('Статус нормативной проверки');
    await expect(page.locator('#modalContent')).toContainText('Источники и ограничения данных');
    await page.keyboard.press('Escape');
    await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','true');
  }
  expect(errors).toEqual([]);
});

test('profession search, sort and category filters really change results',async({page})=>{
  await page.goto(base+'index.html');
  await page.locator('#professionSearch').fill('___no_such_profession___');
  await expect(page.locator('#professionsGrid .eng-card')).toHaveCount(0);
  await expect(page.locator('#professionCount')).toHaveText('0 из 51');
  await page.locator('#professionSearch').fill('');
  await page.locator('#professionSort').selectOption('az');
  await expect(page.locator('#professionsGrid .eng-card')).toHaveCount(51);
  await page.locator('#categories .eng-filter-btn').nth(1).click();
  const filtered=await page.locator('#professionsGrid .eng-card').count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(51);
  await page.locator('#categories .eng-filter-btn').first().click();
  await expect(page.locator('#professionsGrid .eng-card')).toHaveCount(51);
});

test('comparison adds and removes professions and shows cautious salary data',async({page})=>{
  await page.goto(base+'compare.html');
  await page.locator('#professionPicker').selectOption('civil-engineer');
  await page.locator('#addProfession').click();
  await page.locator('#professionPicker').selectOption('road-engineer');
  await page.locator('#addProfession').click();
  await expect(page.locator('.comparison-table thead th')).toHaveCount(3);
  await expect(page.locator('#comparisonResult')).toContainText('Числовые данные не подтверждены');
  await page.locator('#selectedProfessions button').first().click();
  await expect(page.locator('#comparisonResult')).toContainText('Добавьте минимум две профессии');
});

test('catalog filters can show empty results and recover',async({page})=>{
  for(const {path,input,grid} of [
    {path:'resources.html',input:'#resourceSearch',grid:'#resourcesGrid .resource-card'},
    {path:'dictionary.html',input:'#searchInput',grid:'#dictionaryGrid .eng-card'},
    {path:'materials.html',input:'#materialSearch',grid:'#materialGrid .atlas-card'},
    {path:'processes.html',input:'#processSearch',grid:'#processGrid .atlas-card'}
  ]){
    await page.goto(base+path);
    expect(await page.locator(grid).count(),path+' default content').toBeGreaterThan(0);
    await page.locator(input).fill('___no_match_98765___');
    await expect(page.locator(grid)).toHaveCount(0);
    await page.locator('.filter-reset').click();
    expect(await page.locator(grid).count(),path+' reset').toBeGreaterThan(0);
  }
});

test('salary reference works without legacy salary objects or invented regional values',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'map.html');
  await expect(page.locator('#salaryProfession option')).toHaveCount(51);
  await expect(page.locator('#salaryRegion')).toHaveCount(0);
  await page.locator('#salaryProfession').selectOption('civil-engineer');
  await expect(page.locator('#salaryResultValue')).toContainText('₽');
  await expect(page.locator('#salaryResultHint')).toContainText('Источник:');
  await page.locator('#salaryProfession').selectOption('road-engineer');
  await expect(page.locator('#salaryResultValue')).toHaveText('Нет подтверждённых данных');
  expect(errors).toEqual([]);
});

test('engineering unit converter validates and computes actual values',async({page})=>{
  await page.goto(base+'calculator.html');
  await page.locator('#calcUnits > summary').click();
  await page.locator('#convInput').fill('1000');
  await page.locator('#convFrom').selectOption('mm');
  await page.locator('#convTo').selectOption('m');
  await expect(page.locator('#convResultValue')).toHaveText('1');
  await page.locator('#convCategory').selectOption('temperature');
  await page.locator('#convFrom').selectOption('c');
  await page.locator('#convTo').selectOption('k');
  await page.locator('#convInput').fill('0');
  await expect(page.locator('#convResultValue')).toHaveText('273,15');
  await page.locator('#convInput').fill('-274');
  await expect(page.locator('#convResultHint')).toContainText('абсолютного нуля');
});

test('holiday calendar search can be reset',async({page})=>{
  await page.goto(base+'calendar.html');
  expect(await page.locator('#calendarGrid article').count()).toBeGreaterThan(0);
  await page.locator('#searchInput').fill('___no_event___');
  await expect(page.locator('#calendarEmpty')).toBeVisible();
  await page.locator('#resetFilters').click();
  await expect(page.locator('#calendarEmpty')).toBeHidden();
});


test('modal isolates the background and traps keyboard focus',async({page})=>{
 await page.goto(base+'index.html');
 const trigger=page.locator('#professionsGrid .eng-card').first();
 await trigger.focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('main')).toHaveAttribute('inert','');
 await expect(page.locator('footer')).toHaveAttribute('inert','');
 await expect(page.locator('#modalClose')).toBeFocused();
 await page.keyboard.press('Shift+Tab');
 const last=page.locator('#modalOverlay a[href], #modalOverlay button:not([disabled])').last();
 await expect(last).toBeFocused();
 await page.keyboard.press('Tab');
 await expect(page.locator('#modalClose')).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(page.locator('main')).not.toHaveAttribute('inert','');
 await expect(page.locator('footer')).not.toHaveAttribute('inert','');
 await expect(trigger).toBeFocused();
});


test('processes link directly to a relevant profession without losing the catalog',async({page})=>{
 await page.goto(base+'processes.html');
 const links=page.locator('#processGrid a[href^="index.html#profession="]');
 expect(await links.count()).toBeGreaterThan(0);
 await links.first().click();
 await expect(page).toHaveURL(/index.html#profession=/);
 await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','false');
 await expect(page.locator('#professionsGrid .eng-card')).toHaveCount(51);
 await page.keyboard.press('Escape');
 await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','true');
});


test('unified search links to professions, materials, processes and dictionary without removing sections',async({page})=>{
 await page.goto(base+'index.html');
 await expect(page.locator('nav.eng-tabs a')).toHaveCount(9);
 const input=page.locator('#globalSearch');
 for(const [query,target] of [['Сталь 20','materials.html#'],['Дуговая сварка','processes.html#'],['Инженер-механик','index.html#profession='],['квалификация','dictionary.html?q=']]){
  await input.fill(query);
  await expect(page.locator('#globalSearchResults a')).not.toHaveCount(0);
  expect((await page.locator('#globalSearchResults a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')))).some(h=>h.startsWith(target)),query+' links to '+target).toBeTruthy();
 }
 await input.fill('zzzzzxq987');
 await expect(page.locator('#globalSearchStatus')).toContainText('Ничего не найдено');
 await expect(page.locator('#professionsGrid .eng-card')).toHaveCount(51);
 await page.goto(base+'dictionary.html?q='+encodeURIComponent('квалификация'));
 await expect(page.locator('#searchInput')).toHaveValue('квалификация');
});


test('material cards connect to existing engineer profiles', async ({page})=>{
 await page.goto(base+'materials.html');
 await expect(page.locator('nav.eng-tabs a')).toHaveCount(9);
 const links=page.locator('#materialGrid a[href^="index.html#profession="]');
 expect(await links.count()).toBeGreaterThan(0);
 await links.first().click();
 await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','false');
 await expect(page.locator('#professionsGrid .eng-card')).toHaveCount(51);
});


test('closing a deep-linked profession clears stale URL fragment',async({page})=>{
  await page.goto(base+'index.html#profession=civil-engineer');
  await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','false');
  await page.keyboard.press('Escape');
  await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','true');
  await expect(page).toHaveURL(/index\.html$/);
});

test('catalog layout placeholders are removed after rendering',async({page})=>{
 for(const [path,grid,card] of [
  ['calendar.html','#calendarGrid','.holiday-card'],
  ['resources.html','#resourcesGrid','.resource-card'],
  ['dictionary.html','#dictionaryGrid','.eng-card']
 ]){
  await page.goto('/'+path);
  await expect(page.locator(grid)).toHaveAttribute('data-ready','true');
  const rendered=await page.locator(grid).locator(card).count();
  expect(rendered,path+' content never rendered').toBeGreaterThan(0);
 }
});


test('five grouped navigation sections retain all nine page destinations on mobile',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/index.html');
 const toggle=page.locator('.site-nav-toggle');
 await toggle.click();
 const nav=page.locator('#site-main-navigation');
 await expect(nav.locator('.nav-cluster')).toHaveCount(5);
 await expect(nav.locator('a.eng-tab')).toHaveCount(9);
 for(const group of await nav.locator('.nav-cluster').all()){
  await expect(group).toBeVisible();
  expect(await group.locator('a.eng-tab').count()).toBeGreaterThan(0);
 }
});

test('profession details link back to catalogued processes and materials',async({page})=>{
 await page.goto('/index.html');
 const professionId=await page.evaluate(()=>window.engineeringProcesses[0].profession);
 await page.goto('/index.html#profession='+encodeURIComponent(professionId));
 await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','false');
 const links=page.locator('#modalContent .technology-links a');
 await expect(links.first()).toBeVisible();
 expect(await links.count()).toBeGreaterThan(1);
 await expect(page.locator('#modalContent a[href^="processes.html#"]').first()).toBeVisible();
 await expect(page.locator('#modalContent a[href^="materials.html#"]').first()).toBeVisible();
});


test('technology search connects processes and materials without losing deep links',async({page})=>{
 await page.goto('/processes.html');
 const search=page.locator('#technologySearch');
 await search.fill('сталь');
 await expect(page.locator('#technologySearchResults a[href^="materials.html#"]').first()).toBeVisible();
 await expect(page.locator('#technologySearchStatus')).toContainText('Найдено:');
 await page.goto('/materials.html');
 await page.locator('#technologySearch').fill('литье');
 await expect(page.locator('#technologySearchResults a[href="processes.html#casting"]')).toBeVisible();
 await page.locator('#technologySearch').press('Escape');
 await expect(page.locator('#technologySearchResults')).toBeHidden();
});

test('five secondary pages pre-render topbar without moving theme control',async({page})=>{
 for(const file of ['calendar.html','resources.html','dictionary.html','map.html','calculator.html']){
  await page.goto('/'+file);
  const header=page.locator('.eng-calendar-root > .site-topbar');
  await expect(header).toHaveCount(1);
  const control=header.locator('.theme-toggle');
  await expect(control).toHaveCount(1);
  const wasDark=await page.locator('html').evaluate(el=>el.classList.contains('theme-dark'));
  await control.click();
  const nowDark=await page.locator('html').evaluate(el=>el.classList.contains('theme-dark'));
  expect(nowDark).not.toBe(wasDark);
 }
});

test('materials and processes catalogues signal readiness after rendering',async({page})=>{
 for(const [path,id] of [['materials.html','#materialGrid'],['processes.html','#processGrid']]){
  await page.goto('/'+path);
  await expect(page.locator(id)).toHaveAttribute('data-ready','true');
  await expect(page.locator(id+' .atlas-card').first()).toBeVisible();
 }
});


test('expanded process references work in reverse from materials without flooding the UI',async({page})=>{
 await page.goto('/materials.html');
 await expect(page.locator('#materialGrid[data-ready="true"]')).toBeVisible();
 const material=page.locator('#09g2s');
 await expect(material.locator('a[href="processes.html#manual-metal-arc"]')).toHaveCount(1);
 const more=material.locator('details.material-related-more');
 if(await more.count()&&await more.locator('a[href="processes.html#manual-metal-arc"]').count()){
  await more.locator('summary').click();
 }
 await expect(material.locator('a[href="processes.html#manual-metal-arc"]')).toBeVisible();
 await page.goto('/index.html#profession=mechanical-engineer');
 await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','false');
 await expect(page.locator('#modalContent a[href^="processes.html#"]').first()).toBeVisible();
 const moreProcesses=page.locator('#modalContent details.related-more');
 await expect(moreProcesses).toHaveCount(1);
 await moreProcesses.locator('summary').click();
 await expect(moreProcesses.locator('a[href^="processes.html#"]').first()).toBeVisible();
});
