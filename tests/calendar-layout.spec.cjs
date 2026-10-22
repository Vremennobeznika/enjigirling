const {test,expect}=require('@playwright/test');

test('Calendar sticky header is opaque and same-time tasks are stable',async({page})=>{
  await page.goto('/calendar/');
  await page.getByRole('button',{name:'Чт',exact:true}).click();
  const header=page.locator('header');
  await expect(header).toHaveCSS('background-color','rgb(9, 9, 9)');
  for(const width of [1366,650,375,320]){
    await page.setViewportSize({width,height:780});
    await page.evaluate(()=>window.scrollTo(0,750));
    const top=await header.boundingBox();
    expect(top).toBeTruthy();
    expect(top.y).toBeGreaterThanOrEqual(-1);
    expect(top.y).toBeLessThanOrEqual(1);
    const overflow=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    expect(overflow.scroll,'horizontal overflow at '+width).toBeLessThanOrEqual(overflow.client+1);
  }
  const tasks=await page.locator('#tasks .task').evaluateAll(rows=>rows.map(row=>({
    time:row.querySelector('.time')?.textContent.trim(),
    label:row.querySelector('.name')?.textContent.trim(),
    home:row.classList.contains('house')
  })));
  const dinnerAt1830=tasks.filter(row=>row.time==='18:30');
  expect(dinnerAt1830.map(row=>row.label)).toEqual(expect.arrayContaining(['Ужин']));
  const dinner=dinnerAt1830.findIndex(row=>row.label==='Ужин');
  const supplement=dinnerAt1830.findIndex(row=>row.label?.startsWith('VitaMeal'));
  expect(dinner).toBeGreaterThanOrEqual(0);
  expect(supplement).toBeGreaterThan(dinner);
  const breakfastAt0740=tasks.filter(row=>row.time==='07:40');
  expect(breakfastAt0740[0].label).toBe('Завтрак');
  const footerBottom=await page.locator('footer').evaluate(el=>el.getBoundingClientRect().bottom+window.scrollY);
  const notesTop=await page.locator('.calendar-notes').evaluate(el=>el.getBoundingClientRect().top+window.scrollY);
  expect(notesTop).toBeGreaterThanOrEqual(footerBottom);
});
