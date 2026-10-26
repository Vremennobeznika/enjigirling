const {test,expect}=require('@playwright/test');

test('independent robotics lab: controls, computations, keyboard, small screens',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const external=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8765/'))external.push(r.url());});
  await page.goto('/robotics.html');
  await expect(page.locator('h1')).toContainText('Робототехника');
  await expect(page.locator('nav.eng-tabs a')).toHaveCount(12);
  await expect(page.locator('nav.eng-tabs a.active')).toHaveAttribute('href','robotics.html');
  await expect(page.locator('#roboticsDrawing [data-robotics-box]')).not.toHaveCount(0);
  const first=await page.locator('#roboticsDrawing polygon').first().getAttribute('points');
  await page.locator('#roboticsYaw').evaluate(input=>{input.value='-74';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await expect(page.locator('#roboticsYawValue')).toContainText('-74°');
  const changed=await page.locator('#roboticsDrawing polygon').first().getAttribute('points');
  expect(changed).not.toBe(first);
  await page.getByRole('button',{name:'Питание',exact:true}).click();
  await expect(page.locator('#roboticsPartTitle')).toHaveText('Электропитание');
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
  await page.locator('#roboticsReset').click();
  await expect(page.locator('#roboticsYawValue')).toContainText('22°');
  for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:760});
    const metrics=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:document.documentElement.clientWidth}));
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.view+2);
  }
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
