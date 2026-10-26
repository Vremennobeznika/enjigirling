const {test,expect}=require('@playwright/test');
test('alphabetical default and added professions work on a narrow slow device',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 await expect(page.locator('#professionSort')).toHaveValue('az');
 const titles=await page.locator('#professionsGrid .eng-title').allTextContents();
 expect(titles).toHaveLength(54);
 expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b,'ru')));
 await page.locator('#professionSort').selectOption('za');
 expect(await page.locator('#professionsGrid .eng-title').allTextContents()).toEqual([...titles].reverse());
 for(const [query,title,category] of [['схемотехник','Инженер-схемотехник','Связь и электроника'],['тополог','Инженер-тополог','Связь и электроника'],['метролог','Инженер-метролог','Наука и техническая экспертиза']]){
  await page.locator('#categories button').getByText(category,{exact:true}).click();
  await page.locator('#professionSearch').fill(query);
  const card=page.locator('#professionsGrid .eng-card');
  await expect(card).toHaveCount(1);
  await card.click();
  await expect(page.locator('#modalTitle')).toHaveText(title);
  await expect(page.locator('#modalContent')).toContainText('Что нужно знать');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await page.locator('#professionSearch').fill('');
 }
 expect(errors).toEqual([]);
 await page.goto('/compare.html');
 for(const id of ['circuit-design-engineer','pcb-layout-engineer','metrology-engineer']){
  await page.locator('#professionPicker').selectOption(id);
  await page.locator('#addProfession').click();
 }
 for(const name of ['Инженер-схемотехник','Инженер-тополог','Инженер-метролог'])await expect(page.locator('#comparisonResult')).toContainText(name);
});
