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
