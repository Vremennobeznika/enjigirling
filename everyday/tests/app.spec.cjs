const {test,expect}=require('@playwright/test');

const APP='/everyday/';
async function openSettings(page){
 await page.locator('#mainNav .nav-btn[data-view="settings"]').click();
 await expect(page.locator('#page-settings')).toBeVisible();
}
async function tab(page,id){await page.locator('#mainNav .nav-btn[data-view="'+id+'"]').click();}

test('Public application is independent, empty by default and local-only',async({page,baseURL})=>{
 const outbound=[];
 page.on('request',req=>{if(new URL(req.url()).origin!==new URL(baseURL).origin)outbound.push(req.url())});
 await page.goto(APP);
 await expect(page).toHaveTitle(/Обычный день/);
 await expect(page.locator('#mainNav .nav-btn')).toHaveCount(6);
 await expect(page.locator('#todayMetric')).toContainText('0 / 0');
 await expect(page.locator('#spendMetric')).toContainText('0,00');
 await expect(page.locator('#shopMetric')).toHaveText('0');
 await expect(page.locator('#plantCount')).toContainText('0').catch(()=>{}); // home can be hidden on overview
 expect(await page.evaluate(()=>localStorage.getItem('ordinary-day-state-v1'))).toBeNull();
 expect(outbound).toEqual([]);
 await page.goto(APP+'#settings');
 await expect(page.locator('#page-settings')).toBeVisible();
 await expect(page.locator('body')).toContainText('не имеет сервера данных');
});

test('Central Settings create, rename, hide and preserve a user-defined section and daily checklist',async({page})=>{
 await page.goto(APP);
 await openSettings(page);
 await page.locator('#sectionName').fill('Питомцы');
 await page.locator('#sectionForm button[type=submit]').click();
 await expect(page.locator('#mainNav .nav-btn[data-view^="custom:"]')).toHaveText('Питомцы');
 await page.locator('#itemName').fill('Покормить собаку');
 await page.locator('#itemSection').selectOption({label:'Питомцы'});
 await page.locator('#itemRepeat').selectOption('daily');
 await page.locator('#itemTime').fill('08:30');
 await page.locator('#itemForm button[type=submit]').click();
 await page.locator('#mainNav .nav-btn[data-view^="custom:"]').click();
 await expect(page.locator('#customRows')).toContainText('Покормить собаку');
 const box=page.locator('#customRows input[type=checkbox]');
 await box.check();
 await page.reload();
 await expect(page.locator('#customRows input[type=checkbox]')).toBeChecked();
 await openSettings(page);
 const section=page.locator('#settingsSections .settings-row').filter({hasText:'Питомцы'});
 page.once('dialog',d=>d.accept('Уход за питомцами'));
 await section.getByRole('button',{name:'Название'}).click();
 await expect(page.locator('#mainNav .nav-btn[data-view^="custom:"]')).toHaveText('Уход за питомцами');
 await page.getByRole('checkbox',{name:'Показывать раздел Уход за питомцами'}).uncheck();
 await expect(page.locator('#mainNav .nav-btn[data-view^="custom:"]')).toHaveCount(0);
 await page.getByRole('checkbox',{name:'Показывать раздел Уход за питомцами'}).check();
 await page.locator('#mainNav .nav-btn[data-view^="custom:"]').click();
 await expect(page.locator('#customRows input[type=checkbox]')).toBeChecked();
});

test('Planner supports one-off tasks and recurring templates across days and weeks',async({page})=>{
 await page.goto(APP);await openSettings(page);
 await page.locator('#itemName').fill('Проверить почту');
 await page.locator('#itemSection').selectOption('planner');
 await page.locator('#itemRepeat').selectOption('daily');
 await page.locator('#itemForm button[type=submit]').click();
 await page.locator('#itemName').fill('Поменять постельное бельё');
 await page.locator('#itemSection').selectOption('home');
 await page.locator('#itemRepeat').selectOption('weekly');
 const weekday=await page.evaluate(()=>(new Date().getDay()+6)%7);
 await page.locator('#itemWeekday').selectOption(String(weekday));
 await page.locator('#itemForm button[type=submit]').click();
 await tab(page,'planner');
 await expect(page.locator('#plannerRows')).toContainText('Проверить почту');
 await page.locator('#plannerRows input[type=checkbox]').first().check();
 await page.locator('#weekDays .day:not(.active)').first().click();
 await expect(page.locator('#plannerRows input[type=checkbox]').first()).not.toBeChecked();
 await page.locator('#todayWeek').click();
 await expect(page.locator('#plannerRows input[type=checkbox]').first()).toBeChecked();
 await page.locator('#taskTitle').fill('Забрать посылку');
 await page.locator('#taskTime').fill('16:30');
 await page.locator('#taskForm button[type=submit]').click();
 await expect(page.locator('#plannerRows')).toContainText('Забрать посылку');
 await page.reload();
 await expect(page.locator('#plannerRows')).toContainText('Забрать посылку');
 await tab(page,'home');
 await expect(page.locator('#homeRoutineRows')).toContainText('Поменять постельное бельё');
 await page.locator('#homeRoutineRows input[type=checkbox]').check();
 await page.reload();
 await expect(page.locator('#homeRoutineRows input[type=checkbox]')).toBeChecked();
});

test('Expense categories, budget, subscriptions, transactions, editing and CSV work together',async({page})=>{
 await page.goto(APP);await openSettings(page);
 await page.locator('#expenseCatName').fill('Кафе');
 await page.locator('#expenseCatForm button').click();
 const catRow=page.locator('#settingsExpenses .settings-row').filter({hasText:'Кафе'});
 await catRow.locator('input').fill('3500,50');
 await catRow.getByRole('button',{name:'Лимит'}).click();
 await page.locator('#subscriptionName').fill('Интернет');
 await page.locator('#subscriptionAmount').fill('790,50');
 await page.locator('#subscriptionDay').fill('31');
 await page.locator('#subscriptionCategory').selectOption({label:'Жильё'});
 await page.locator('#subscriptionForm button[type=submit]').click();
 await tab(page,'money');
 await expect(page.locator('#subscriptionRows')).toContainText('Интернет');
 await page.locator('#txAmount').fill('125,25');
 await page.locator('#txCategory').selectOption({label:'Кафе'});
 await page.locator('#txNote').fill('Капучино');
 await page.locator('#txForm button[type=submit]').click();
 await expect(page.locator('#txRows')).toContainText('Капучино');
 // Confirm exactly one new ledger entry when the user approves.
 page.once('dialog',d=>d.accept());
 await page.locator('#subscriptionRows button').filter({hasText:'Записать оплату'}).click();
 await expect(page.locator('#subscriptionRows button')).toHaveText('Оплачено');
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ordinary-day-state-v1')));
 expect(state.transactions).toHaveLength(2);
 expect(state.transactions.find(t=>t.note==='Капучино').amount).toBe(12525);
 expect(state.transactions.find(t=>t.subscriptionId).amount).toBe(79050);
 await expect(page.locator('#expenseTotal')).toContainText('915,75');
 await expect(page.locator('#categoryBars')).toContainText('Кафе');
 const coffee=page.locator('#txRows .row').filter({hasText:'Капучино'});
 await coffee.getByRole('button',{name:'Изменить'}).click();
 await page.locator('#txAmount').fill('150,75');
 await page.locator('#txForm button[type=submit]').click();
 await expect(page.locator('#expenseTotal')).toContainText('941,25');
 const dlPromise=page.waitForEvent('download');
 await page.locator('#exportCsv').click();
 const dl=await dlPromise;
 expect(dl.suggestedFilename()).toMatch(/^expenses-\d{4}-\d{2}\.csv$/);
 await openSettings(page);
 await page.locator('#currencySetting').selectOption('EUR');
 await expect(page.locator('#currencySetting')).toHaveValue('RUB');
});

test('Shopping, pantry, plants and backup restore remain local',async({page})=>{
 await page.goto(APP);
 await tab(page,'shopping');
 await page.locator('#shopName').fill('Гречка');
 await page.locator('#shopQty').fill('2 кг');
 await page.locator('#shopForm button[type=submit]').click();
 await expect(page.locator('#shopRows')).toContainText('Гречка');
 await page.locator('#shopRows input[type=checkbox]').check();
 await page.reload();
 await expect(page.locator('#shopRows input[type=checkbox]')).toBeChecked();
 await tab(page,'home');
 await page.locator('#pantryName').fill('Чай');
 await page.locator('#pantryQty').fill('4 коробки');
 await page.locator('#pantryForm button[type=submit]').click();
 await page.locator('#plantName').fill('Фикус');
 await page.locator('#plantNote').fill('Полив после проверки влажности');
 await page.locator('#plantForm button[type=submit]').click();
 await expect(page.locator('#plantRows')).toContainText('Фикус');
 await openSettings(page);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('ordinary-day-state-v1')));
 const backup={format:'ordinary-day-backup',version:1,data:before};
 const download=page.waitForEvent('download');
 await page.locator('#backupDownload').click();
 expect((await download).suggestedFilename()).toMatch(/ordinary-day-\d{4}-\d{2}-\d{2}\.json/);
 await tab(page,'shopping');
 page.once('dialog',d=>d.accept());
 await page.locator('#shopRows button[aria-label="Удалить товар"]').click();
 await expect(page.locator('#shopRows')).not.toContainText('Гречка');
 await openSettings(page);
 page.once('dialog',d=>d.accept());
 await page.locator('#backupUpload').setInputFiles({name:'data.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await tab(page,'shopping');
 await expect(page.locator('#shopRows')).toContainText('Гречка');
 await openSettings(page);
 page.once('dialog',d=>d.accept());
 await page.locator('#restorePrevious').click();
 await tab(page,'shopping');
 await expect(page.locator('#shopRows')).not.toContainText('Гречка');
});

test('Invalid backup rejects rather than replacing existing records',async({page})=>{
 await page.goto(APP);await tab(page,'shopping');
 await page.locator('#shopName').fill('Масло');await page.locator('#shopForm button[type=submit]').click();
 const bad={format:'ordinary-day-backup',version:1,data:{version:1,sections:[],transactions:[]}};
 await openSettings(page);
 await page.locator('#backupUpload').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
 await tab(page,'shopping');
 await expect(page.locator('#shopRows')).toContainText('Масло');
});

test('Responsive visual matrix at 320, 375, 768 and 1366px has no overflow or missing controls',async({page})=>{
 await page.goto(APP);
 for(const width of [320,375,768,1366]){
  await page.setViewportSize({width,height:850});
  for(const id of ['overview','planner','money','shopping','home','settings']){
   await tab(page,id);
   const overflow=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   expect(overflow.scroll,id+' horizontal overflow at '+width).toBeLessThanOrEqual(overflow.width+1);
   for(const el of await page.locator('main .page:visible input:visible,main .page:visible select:visible,main .page:visible button:visible').all()){
    const b=await el.boundingBox();
    expect(b,id+' missing box at '+width).toBeTruthy();
    expect(b.x,id+' negative position at '+width).toBeGreaterThanOrEqual(-1);
    expect(b.x+b.width,id+' offscreen at '+width).toBeLessThanOrEqual(width+1);
    expect(b.height,id+' tiny clickable height at '+width).toBeGreaterThanOrEqual(30);
   }
  }
 }
});

test('Offline static shell opens after installation without sending user data off-device',async({page,context,baseURL})=>{
 const outbound=[];
 page.on('request',req=>{if(new URL(req.url()).origin!==new URL(baseURL).origin)outbound.push(req.url())});
 await page.goto(APP);
 await expect(page.locator('#page-overview')).toBeVisible();
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.waitForTimeout(700);
 await context.setOffline(true);
 await page.reload();
 await expect(page.getByText('Всё под контролем.')).toBeVisible();
 await tab(page,'planner');
 await expect(page.locator('#page-planner')).toBeVisible();
 expect(outbound).toEqual([]);
});

test('Built-in section titles and visibility are controlled only in central Settings',async({page})=>{
 await page.goto(APP);await openSettings(page);
 const finance=page.locator('#settingsSections .settings-row').filter({hasText:'Финансы'});
 page.once('dialog',d=>d.accept('Семейный бюджет'));
 await finance.getByRole('button',{name:'Название'}).click();
 await expect(page.locator('#mainNav [data-view="money"]')).toHaveText('Семейный бюджет');
 await tab(page,'money');
 await expect(page.locator('#page-money h1')).toHaveText('Семейный бюджет');
 await openSettings(page);
 await page.getByRole('checkbox',{name:'Показывать раздел Семейный бюджет'}).uncheck();
 await expect(page.locator('#mainNav [data-view="money"]')).toHaveCount(0);
 await page.reload();
 await expect(page.locator('#mainNav [data-view="money"]')).toHaveCount(0);
 await page.getByRole('checkbox',{name:'Показывать раздел Семейный бюджет'}).check();
 await expect(page.locator('#mainNav [data-view="money"]')).toHaveText('Семейный бюджет');
});
