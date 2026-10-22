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

test('One shopping list: old categories and reminders are shared with flexible planner and backups',async({page})=>{
 await page.goto('/shopping/');
 await page.getByRole('button',{name:/Хлеб и выпечка/}).click();
 await page.locator('#itemName').fill('Хлеб для общего списка');
 await page.locator('#itemQty').fill('2 шт');
 await page.locator('#addForm button[type=submit]').click();
 const one=page.locator('#items .item').first();
 await one.locator('.item-time').fill('17:45');
 await one.locator('.reminder-toggle').click();
 let data=await page.evaluate(()=>JSON.parse(localStorage.getItem('supermarket-shopping-list-v1')));
 expect(data[0]).toMatchObject({name:'Хлеб для общего списка',cat:'bakery',qty:'2 шт',time:'17:45',remind:true});
 await page.goto('/life/planner/');
 await page.locator('.main-tab[data-page="shopping"]').click();
 await expect(page.locator('#shoppingItems')).toContainText('Хлеб для общего списка');
 let row=page.locator('#shoppingItems .shop-row').filter({hasText:'Хлеб для общего списка'});
 await expect(row.locator('input[type=time]')).toHaveValue('17:45');
 await page.locator('#shoppingTitle').fill('Из нового редактора');
 await page.locator('#shoppingQty').fill('3 шт');
 await page.locator('#shoppingTime').fill('13:30');
 await page.locator('#shoppingRemind').check();
 await page.locator('#shoppingForm button[type=submit]').click();
 await page.goto('/shopping/');
 await page.getByRole('button',{name:/Всё/}).first().click();
 await expect(page.locator('#items')).toContainText('Из нового редактора');
 data=await page.evaluate(()=>JSON.parse(localStorage.getItem('supermarket-shopping-list-v1')));
 expect(data).toHaveLength(2);
 expect(data.find(i=>i.name==='Хлеб для общего списка')).toMatchObject({cat:'bakery',remind:true,time:'17:45'});
 expect(data.find(i=>i.name==='Из нового редактора')).toMatchObject({cat:'grocery',remind:true,time:'13:30'});
 await page.goto('/life/planner/');
 await page.locator('.main-tab[data-page="settings"]').click();
 const downloaded=page.waitForEvent('download');
 await page.locator('#calendarExport').click();
 const ics=await downloaded;
 const fs=require('node:fs');
 const text=fs.readFileSync(await ics.path(),'utf8');
 expect(text).toContain('Купить:');
 await page.goto('/life/');
 const backup=page.waitForEvent('download');
 await page.locator('#backup').click();
 const archive=JSON.parse(fs.readFileSync(await (await backup).path(),'utf8'));
 expect(archive.data.shopping).toHaveLength(2);
 expect(archive.data.shopping.find(i=>i.cat==='bakery').remind).toBe(true);
 expect(archive.data.calendar.__planner_v3.shopping).toHaveLength(0); // only original shopping store is authoritative
});
test('Personal planner saved local data does not silently overwrite a newer shopping list',async({page})=>{
 await page.goto('/life/planner/');
 await page.evaluate(()=>{
  localStorage.setItem('supermarket-shopping-list-v1',JSON.stringify([{id:'external',name:'Внешняя новая покупка',qty:'1',cat:'other',done:false,time:'10:00',remind:true}]));
 });
 await page.locator('.main-tab[data-page="finance"]').click();
 await page.locator('#financeAmount').fill('10');
 await page.locator('#financeCategory').fill('Тест');
 await page.locator('#financeForm button[type=submit]').click();
 const items=await page.evaluate(()=>JSON.parse(localStorage.getItem('supermarket-shopping-list-v1')));
 expect(items).toHaveLength(1);
 expect(items[0].id).toBe('external');
 const ledger=await page.evaluate(()=>JSON.parse(localStorage.getItem('week-check-v2'))?.__planner_v3?.ledger||[]);
 expect(ledger).toHaveLength(1);
 expect(ledger[0].amount).toBe(10);
});

test('An untouched new device remains empty so first Yandex pull is not blocked',async({page})=>{
 await page.goto('/life/planner/');
 const persisted=await page.evaluate(()=>({
  calendar:localStorage.getItem('week-check-v2'),
  shopping:localStorage.getItem('supermarket-shopping-list-v1')
 }));
 expect(persisted.calendar).toBeNull();
 expect(persisted.shopping).toBeNull();
});

test('Every personal app subpage has a responsive return to main menu',async({page})=>{
 const routes=[
  ['/life/planner/','.return-home'],
  ['/calendar/','.home-return'],
  ['/shopping/','.home-return'],
  ['/plants/','.home-return']
 ];
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});
  for(const [path,selector] of routes){
   await page.goto(path);
   const back=page.locator(selector);
   await expect(back).toHaveCount(1);
   await expect(back).toHaveText('← Главное меню');
   await expect(back).toBeVisible();
   const geometry=await page.evaluate(sel=>{
    const a=document.querySelector(sel),r=a.getBoundingClientRect();
    return {scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth,
      x:r.x,right:r.right,height:r.height};
   },selector);
   expect(geometry.height, path+' touch target '+width).toBeGreaterThanOrEqual(44);
   expect(geometry.scrollWidth, path+' overflow '+width).toBeLessThanOrEqual(geometry.viewport+2);
   expect(geometry.x, path+' left edge '+width).toBeGreaterThanOrEqual(0);
   expect(geometry.right, path+' right edge '+width).toBeLessThanOrEqual(geometry.viewport+1);
   await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
   const sticky=await back.boundingBox();
   expect(sticky, path+' link visible after scrolling').not.toBeNull();
   expect(sticky.y, path+' sticky top '+width).toBeGreaterThanOrEqual(-2);
   expect(sticky.y, path+' sticky bottom '+width).toBeLessThan(844-44);
   await back.click();
   await expect(page).toHaveURL(/\/life\/?$/);
   await expect(page.locator('h1')).toContainText('Сегодня');
  }
 }
});
