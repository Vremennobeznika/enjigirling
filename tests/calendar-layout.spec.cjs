const {test,expect}=require('@playwright/test');

test('Calendar visual matrix: no zebra/side stripes, same checkbox columns, no clipped sticky header',async({page})=>{
  await page.goto('/calendar/');
  await page.getByRole('button',{name:'Чт',exact:true}).click();
  const header=page.locator('header'),rows=page.locator('#tasks .task');
  await expect(header).toHaveCSS('position','relative');
  const names=await rows.locator('.name').allTextContents();
  expect(names.some(x=>x.includes('Летолек'))).toBeTruthy();
  expect(names.some(x=>x.includes('VitaMeal'))).toBeTruthy();

  for(const width of [1366,650,375,320]){
    await page.setViewportSize({width,height:780});
    await page.evaluate(()=>window.scrollTo(0,0));
    const normal=rows.filter({hasNot:page.locator('.homebadge')}).first();
    const household=page.locator('#tasks .task.house').first();
    const normalInput=normal.locator('input[type=checkbox]'),houseInput=household.locator('input[type=checkbox]');
    const [a,b]=await Promise.all([normalInput.boundingBox(),houseInput.boundingBox()]);
    expect(a).toBeTruthy();expect(b).toBeTruthy();
    expect(Math.abs(a.x-b.x),'aligned checkboxes at '+width).toBeLessThanOrEqual(1);
    expect(a.width).toBe(28);expect(b.width).toBe(28);
    const styles=await page.locator('#tasks .task').evaluateAll(els=>els.map(el=>{
      const css=getComputedStyle(el);
      return {background:css.backgroundColor,borderLeft:css.borderLeftWidth,shadow:css.boxShadow,display:css.display,columns:css.gridTemplateColumns};
    }));
    expect(new Set(styles.map(x=>x.background)).size,'no zebra fills at '+width).toBe(1);
    expect(styles.every(x=>x.shadow==='none'),'no left strips at '+width).toBeTruthy();
    expect(styles.every(x=>x.display==='grid'&&x.columns.trim().split(/\s+/).length===3),'3 columns at '+width).toBeTruthy();
    const h=await header.boundingBox();
    expect(h).toBeTruthy();
    await page.evaluate(()=>window.scrollTo(0,740));
    const scrolled=await header.boundingBox();
    expect(scrolled.y,'header should scroll away, not cut first row').toBeLessThan(0);
    const overflow=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    expect(overflow.scroll,'no horizontal overflow at '+width).toBeLessThanOrEqual(overflow.client+1);
  }
  await page.evaluate(()=>window.scrollTo(0,0));
  const at1830=await rows.evaluateAll(xs=>xs.filter(x=>x.querySelector('.time')?.textContent==='18:30').map(x=>x.querySelector('.name')?.textContent.trim()));
  expect(at1830[0]).toBe('Ужин');
  expect(at1830[1]).toContain('VitaMeal');
  const breakfast=await rows.evaluateAll(xs=>xs.filter(x=>x.querySelector('.time')?.textContent==='07:40').map(x=>x.querySelector('.name')?.textContent.trim()));
  expect(breakfast[0]).toBe('Завтрак');
  const footerBottom=await page.locator('footer').evaluate(el=>el.getBoundingClientRect().bottom+window.scrollY);
  const notesTop=await page.locator('.calendar-notes').evaluate(el=>el.getBoundingClientRect().top+window.scrollY);
  expect(notesTop).toBeGreaterThanOrEqual(footerBottom);
});

test('Calendar function matrix: save, uncheck, navigate and reload without changing item keys',async({page})=>{
  await page.goto('/calendar/');
  await page.getByRole('button',{name:'Чт',exact:true}).click();
  const dayKey=await page.evaluate(()=>{
    const day=new Date(); day.setHours(12,0,0,0);
    day.setDate(day.getDate()-(day.getDay()+6)%7+3);
    return [day.getFullYear(),String(day.getMonth()+1).padStart(2,'0'),String(day.getDate()).padStart(2,'0')].join('-');
  });
  const first=page.locator('#tasks .task').first();
  await expect(first.locator('input')).not.toBeChecked();
  await first.locator('input').check();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('week-check-v2')));
  expect(Object.keys(stored).some(key=>key.startsWith(dayKey+'-'))).toBeTruthy();
  await page.reload();
  await page.getByRole('button',{name:'Чт',exact:true}).click();
  await expect(page.locator('#tasks .task').first().locator('input')).toBeChecked();
  await page.getByRole('button',{name:'Пт',exact:true}).click();
  await page.getByRole('button',{name:'Чт',exact:true}).click();
  await expect(page.locator('#tasks .task').first().locator('input')).toBeChecked();
  await page.locator('#tasks .task').first().locator('input').uncheck();
  await expect(page.locator('#tasks .task').first().locator('input')).not.toBeChecked();
  const storedAfter=await page.evaluate(()=>JSON.parse(localStorage.getItem('week-check-v2')));
  expect(Object.keys(storedAfter).filter(key=>key.startsWith(dayKey+'-'))).toHaveLength(0);
});
