const {test,expect}=require('@playwright/test');

test('Personal pages: tasks, pantry and shopping persist after navigation without cloud token',async({page})=>{
  const cloudRequests=[];
  page.on('request',req=>{if(req.url().includes('functions.yandexcloud.net'))cloudRequests.push(req.url())});
  await page.goto('/life/');
  await page.locator('#taskName').fill('Проверить тестовую запись');
  await page.locator('#taskForm button[type=submit]').click();
  await expect(page.locator('#taskList .item')).toHaveCount(1);
  await page.locator('#pantryName').fill('Овсянка');
  await page.locator('#pantryAmount').fill('2 упаковки');
  await page.locator('#pantryForm button[type=submit]').click();
  await expect(page.locator('#pantryCount')).toContainText('1');
  await page.reload();
  await expect(page.locator('#taskList')).toContainText('Проверить тестовую запись');
  await expect(page.locator('#pantryList')).toContainText('Овсянка');
  await page.goto('/shopping/');
  await page.getByRole('button',{name:/Хлеб и выпечка/}).click();
  await page.locator('#itemName').fill('Тестовый хлеб');
  await page.locator('#itemQty').fill('1 шт.');
  await page.locator('#addForm button[type=submit]').click();
  await expect(page.locator('#items .item')).toHaveCount(1);
  await page.locator('#items .item input[type=checkbox]').check();
  await page.reload();
  await expect(page.locator('#counter')).toHaveText('1 из 1');
  await page.goto('/life/');
  await expect(page.locator('#shoppingCount')).toHaveText('0');
  await expect(page.locator('#taskList')).toContainText('Проверить тестовую запись');
  expect(cloudRequests).toEqual([]);
});

test('72 plants: no automatic blank write; group check marks and unmarks calendar',async({page})=>{
  await page.goto('/plants/');
  const initial=await page.evaluate(()=>localStorage.getItem('life-plants-v1'));
  expect(initial,'opening the page must not overwrite new-device cloud state').toBeNull();
  await expect(page.locator('#checked')).toHaveText('0 / 72');
  await page.getByRole('button',{name:'1–18',exact:true}).click();
  await expect(page.locator('#rows .pot')).toHaveCount(18);
  await page.locator('#search').fill('Горшок 3');
  await expect(page.locator('#rows .pot')).toHaveCount(1);
  await page.locator('#search').fill('');
  await page.evaluate(()=>{
    const now=new Date(),day=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
    const plants=Array.from({length:72},(_,i)=>({id:i+1,name:'Горшок '+(i+1),note:'',checked:i<17?day:'',watered:'',attention:false}));
    localStorage.setItem('life-plants-v1',JSON.stringify(plants));
  });
  await page.reload();
  await page.getByRole('button',{name:'1–18',exact:true}).click();
  await page.getByRole('checkbox',{name:'Осмотрено сегодня: Горшок 18'}).check();
  const key=await page.evaluate(()=>{
    const d=new Date(),p=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')+'-home-plant-1-18';
    return {key:p,checked:JSON.parse(localStorage.getItem('week-check-v2')||'{}')[p]};
  });
  expect(key.checked).toBe(true,'all 18 inspected plants must complete the calendar entry');
  await page.getByRole('checkbox',{name:'Осмотрено сегодня: Горшок 18'}).uncheck();
  const after=await page.evaluate(key=>JSON.parse(localStorage.getItem('week-check-v2')||'{}')[key],key.key);
  expect(after,'unchecking must clear the group entry').toBeUndefined();
});

test('Shopping All filter stays selected when adding an uncategorized item',async({page})=>{
  await page.goto('/shopping/');
  await expect(page.locator('#sectionTitle')).toHaveText('Всё');
  await page.locator('#itemName').fill('Тестовое мыло');
  await page.locator('#addForm button[type=submit]').click();
  await expect(page.locator('#sectionTitle')).toHaveText('Всё');
  await expect(page.locator('#items .item')).toHaveCount(1);
  const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('supermarket-shopping-list-v1')||'[]'));
  expect(data[0].cat).toBe('other');
  await expect(page.locator('#counter')).toHaveText('0 из 1');
});

test('Calendar clear day preserves marks of other dates and allows JSON export',async({page})=>{
  await page.goto('/calendar/');
  await page.getByRole('button',{name:'Чт',exact:true}).click();
  await page.locator('#tasks input[type=checkbox]').first().check();
  await page.getByRole('button',{name:'Пт',exact:true}).click();
  await page.locator('#tasks input[type=checkbox]').first().check();
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#export').click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toContain('kalendar-otmetki.json');
  await page.getByRole('button',{name:'Чт',exact:true}).click();
  page.once('dialog',d=>d.accept());
  await page.locator('#clear').click();
  await expect(page.locator('#tasks input[type=checkbox]').first()).not.toBeChecked();
  await page.getByRole('button',{name:'Пт',exact:true}).click();
  await expect(page.locator('#tasks input[type=checkbox]').first()).toBeChecked();
});

test('Dashboard backup import restores data and disables automatic sync',async({page})=>{
  await page.goto('/life/');
  await page.locator('#taskName').fill('Сохранить перед импортом');
  await page.locator('#taskForm button[type=submit]').click();
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#backup').click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^moya-zhizn-.+\.json$/);
  const saved={version:1,data:{
    calendar:{},shopping:[],tasks:[{id:'test-restore',name:'Восстановленная задача',category:'Дела',priority:'high',done:false}],
    pantry:[{id:'test-pantry',name:'Крупа',amount:'2 кг'}],plants:[]
  }};
  page.once('dialog',d=>d.accept());
  await page.locator('#backupFile').setInputFiles({name:'life-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await expect(page.locator('#taskList')).toContainText('Восстановленная задача');
  await expect(page.locator('#pantryList')).toContainText('Крупа');
  const state=await page.evaluate(()=>({
    auto:localStorage.getItem('life-sync-auto-v1'),
    previous:JSON.parse(localStorage.getItem('life-sync-recovery-v1')||'[]')
  }));
  expect(state.auto).toBe('off');
  expect(state.previous[0].data.tasks[0].name).toBe('Сохранить перед импортом');
});

test('Plant rename, note, water record and search survive reload',async({page})=>{
  await page.goto('/plants/');
  await page.getByRole('button',{name:'1–18',exact:true}).click();
  const first=page.locator('#rows .pot').first();
  await first.locator('summary').click();
  await first.getByRole('textbox',{name:'Название горшка 1'}).fill('Фикус тестовый');
  await first.getByRole('textbox',{name:'Особенности и уход'}).fill('Полив по сухости грунта');
  await first.getByRole('button',{name:'Сохранить',exact:true}).click();
  await expect(page.locator('#rows .pot').first()).toContainText('Фикус тестовый');
  await page.locator('#search').fill('Фикус тестовый');
  await expect(page.locator('#rows .pot')).toHaveCount(1);
  await page.reload();
  await page.locator('#search').fill('Фикус тестовый');
  await expect(page.locator('#rows .pot')).toHaveCount(1);
  await expect(page.locator('#rows .pot').first()).toContainText('Фикус тестовый');
});
