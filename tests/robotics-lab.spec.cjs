const {test,expect}=require('@playwright/test');

test('independent robotics lab: controls, computations, keyboard, small screens',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const external=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8765/'))external.push(r.url());});
  await page.goto('/robotics.html');
  await expect(page.locator('h1')).toContainText('Робототехника');
  await expect(page.locator('nav.eng-tabs a')).toHaveCount(12);
  await expect(page.locator('nav.eng-tabs a.active')).toHaveAttribute('href','robotics.html');
  await page.locator('#roboticsForce').fill('200');
  await page.locator('#roboticsLever').fill('0.2');
  await page.getByRole('button',{name:'Рассчитать момент'}).click();
  await expect(page.locator('#roboticsTorqueResult')).toContainText('40 Н·м');
  await page.locator('#roboticsForce').fill('-2');
  await page.getByRole('button',{name:'Рассчитать момент'}).click();
  await expect(page.locator('#roboticsTorqueResult')).toContainText('Проверьте исходные значения');
  await page.locator('#roboticsEnergy').fill('900');
  await page.locator('#roboticsPower').fill('300');
  await page.getByRole('button',{name:'Рассчитать время'}).click();
  await expect(page.locator('#roboticsEnergyResult')).toContainText('3 ч');
  await page.locator('#roboticsPower').fill('0');
  await page.getByRole('button',{name:'Рассчитать время'}).click();
  await expect(page.locator('#roboticsEnergyResult')).toContainText('Укажите');
  for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:760});
    const metrics=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:document.documentElement.clientWidth}));
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.view+2);
  }
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('robotics keeps its content without any model or renderer',async({page})=>{
 const models=[];page.on('request',r=>{if(r.url().includes('robotics-3d'))models.push(r.url());});
 await page.goto('/robotics.html');
 await expect(page.locator('#robotics-model, #roboticsDrawing, #robotics3d, #roboticsEnable3d, #roboticsYaw')).toHaveCount(0);
 for(const id of ['robotics-components','robotics-math','robotics-materials','robotics-sources'])await expect(page.locator('#'+id)).toBeVisible();
 for(const link of await page.locator('.robotics-quick a').all()){
   const href=await link.getAttribute('href');await expect(page.locator(href)).toHaveCount(1);
 }
 expect(models).toEqual([]);
});
