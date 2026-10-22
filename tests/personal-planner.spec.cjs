const {test,expect}=require('@playwright/test');
test('Full personal planner keeps tablet marks, adds one-off task and finance, and restores from backup',async({page})=>{
 const cloud=[];
 page.on('request',request=>{if(request.url().includes('functions.yandexcloud.net'))cloud.push(request.url())});
 await page.goto('/life/');
 await page.evaluate(()=>localStorage.setItem('week-check-v2',JSON.stringify({'2026-10-22-0':true,'2026-10-22-home-plant-1-18':true})));
 await page.goto('/life/planner/');
 await expect(page.locator('#appTitle')).toHaveText('МОЙ ПЛАН');
 await page.locator('.main-tab[data-page="settings"]').click();
 await page.locator('#taskTitle').fill('Запланированная встреча');
 await page.locator('#taskTime').fill('14:15');
 await page.locator('#taskMode').selectOption('once');
 const date=await page.evaluate(()=>{
  const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')
 });
 await page.locator('#taskDate').fill(date);
 await page.locator('#taskRemind').check();
 await page.locator('#taskForm button[type=submit]').click();
 await page.locator('.main-tab[data-page="finance"]').click();
 await page.locator('#financeKind').selectOption('expense');
 await page.locator('#financeAmount').fill('42.50');
 await page.locator('#financeCategory').fill('Проверка');
 await page.locator('#financeForm button[type=submit]').click();
 await page.reload();
 const cal=await page.evaluate(()=>JSON.parse(localStorage.getItem('week-check-v2')||'{}'));
 expect(cal['2026-10-22-0']).toBe(true);
 expect(cal['2026-10-22-home-plant-1-18']).toBe(true);
 expect(cal.__planner_v3.tasks.some(t=>t.title==='Запланированная встреча'&&t.remind)).toBe(true);
 expect(cal.__planner_v3.ledger.some(t=>t.amount===42.5)).toBe(true);
 await page.goto('/life/');
 await expect(page.getByRole('link',{name:'Открыть →'}).first()).toBeVisible();
 await expect(page.locator('.personal-feature')).toContainText('Гибкий планировщик');
 const promise=page.waitForEvent('download');
 await page.locator('#backup').click();
 const download=await promise;
 const fs=require('node:fs');
 const file=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 expect(file.data.calendar['2026-10-22-0']).toBe(true);
 expect(file.data.calendar.__planner_v3.ledger).toHaveLength(1);
 expect(cloud).toEqual([]);
});
test('Full planner has no horizontal overflow at iPhone width',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/life/planner/');
 const result=await page.evaluate(()=>({content:document.documentElement.scrollWidth,screen:window.innerWidth}));
 expect(result.content).toBeLessThanOrEqual(result.screen+2);
 await page.locator('.main-tab[data-page="settings"]').click();
 await expect(page.locator('#taskTitle')).toBeVisible();
});
