const {test,expect}=require('@playwright/test');
test('home page loads atlas catalogs only after global search',async({page})=>{
  const catalogs=['materials-data.js','processes-data.js','dictionary-data.js'];
  const requests=[];
  page.on('request',request=>requests.push(new URL(request.url()).pathname.split('/').pop()));
  await page.goto('/index.html');
  await expect(page.locator('#professionCount')).not.toBeEmpty();
  expect(catalogs.filter(x=>requests.includes(x))).toEqual([]);
  const input=page.locator('#globalSearch');
  await input.fill('сталь');
  await expect(page.locator('#globalSearchResults a[href^="materials.html"]')).not.toHaveCount(0);
  for(const file of catalogs)expect(requests.filter(x=>x===file),file+' loads once').toHaveLength(1);
  await input.fill('сварка');
  await expect(page.locator('#globalSearchResults a')).not.toHaveCount(0);
  await input.fill('xyzzq-nothing-here');
  await expect(page.locator('#globalSearchStatus')).toContainText('Ничего не найдено');
});
test('global search retries a failed dataset request',async({page})=>{
  let failOnce=true;
  await page.route('**/materials-data.js',async route=>{
    if(failOnce){failOnce=false;await route.abort();return;}
    await route.continue();
  });
  await page.goto('/index.html');
  await page.locator('#globalSearch').fill('сталь');
  await expect(page.locator('#globalSearchStatus')).toContainText('Не удалось загрузить');
  await page.locator('#globalSearch').fill('стали');
  await expect(page.locator('#globalSearchResults a[href^="materials.html"]')).not.toHaveCount(0);
});
