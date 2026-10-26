const {test,expect}=require('@playwright/test');
test('all 54 career dialogs render their own dated primary normative assessment',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 const cards=page.locator('#professionsGrid .eng-card');
 await expect(cards).toHaveCount(54);
 for(let i=0;i<54;i++){
  const card=cards.nth(i);
  const name=await card.locator('h3').textContent();
  await card.click();
  await expect(page.locator('#modalTitle')).toHaveText(name);
  const content=page.locator('#modalContent');
  await expect(content).toContainText('Разбор профессии:');
  await expect(content).toContainText('Статус нормативной проверки:');
  await expect(content).toContainText('ст. 195.3 ТК РФ');
  await expect(content).toContainText(/Профессиональные стандарты и документы|Нужны конкретные трудовые обязанности/);
  expect(await content.locator('a[href*="mintrud.gov.ru/docs/mintrud/orders"]').count()).toBeGreaterThanOrEqual(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','true');
 }
 expect(errors).toEqual([]);
});
test('2027 standards are not misrepresented as effective in October 2026',async({page})=>{
 await page.goto('/index.html');
 for(const [name,fragment] of [['Инженер-биомедик','Инженер-биомеханик'],['Инженер-эколог','охраны окружающей среды']]){
  await page.locator('#professionsGrid .eng-card').filter({hasText:name}).first().click();
  await expect(page.locator('#modalContent')).toContainText(fragment);
  await expect(page.locator('#modalContent')).toContainText('Ещё не действует');
  await expect(page.locator('#modalContent')).toContainText('2027-03-01');
  await page.keyboard.press('Escape');
 }
});
test('construction requirements are conditional and obsolete standards no longer shown',async({page})=>{
 await page.goto('/index.html');
 await page.locator('#professionsGrid .eng-card').filter({hasText:'Инженер-строитель (ПГС)'}).first().click();
 await expect(page.locator('#modalContent')).toContainText('ст. 55.5-1 ГрК РФ');
 await expect(page.locator('#modalContent')).toContainText('231н');
 await expect(page.locator('#modalContent')).not.toContainText('747н');
 await page.keyboard.press('Escape');
 await page.locator('#professionsGrid .eng-card').filter({hasText:'Инженер-проектировщик (ПГС)'}).first().click();
 await expect(page.locator('#modalContent')).toContainText('228н');
 await expect(page.locator('#modalContent')).not.toContainText('257н');
});
