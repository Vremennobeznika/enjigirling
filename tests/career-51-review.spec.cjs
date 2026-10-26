const {test,expect}=require('@playwright/test');
test('career cards show title only and all 54 open with cautious internal text',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/index.html');
 const cards=page.locator('#professionsGrid .eng-card');
 await expect(cards).toHaveCount(54);
 for(let i=0;i<54;i++){
  const card=cards.nth(i);
  const label=await card.locator('.eng-title').textContent();
  expect((await card.innerText()).trim(),String(i)).toBe(label.trim());
  expect(await card.getAttribute('aria-labelledby')).toBe('profession-card-title-'+await card.locator('.eng-title').evaluate(n=>n.id.replace('profession-card-title-','')));
  await card.click();
  await expect(page.locator('#modalTitle')).toHaveText(label);
  await expect(page.locator('#modalContent')).toContainText('Профессиональные стандарты и нормативные документы');
  await expect(page.locator('#modalContent')).toContainText('Зарплата');
  await expect(page.locator('#modalContent')).toContainText('Условия и особенности работы');
  await expect(page.locator('#modalContent')).not.toContainText('Пример рабочего дня');
  await expect(page.locator('#modalContent details.profession-extra')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await expect(page.locator('#modalOverlay')).toHaveAttribute('aria-hidden','true');
 }
 expect(errors).toEqual([]);
});
test('comparison links to sources and preserves selected IDs in URL',async({page})=>{
 await page.goto('/compare.html');
 await page.locator('#professionPicker').selectOption('civil-engineer');
 await page.locator('#addProfession').click();
 await page.locator('#professionPicker').selectOption('road-engineer');
 await page.locator('#addProfession').click();
 await expect(page).toHaveURL(/ids=civil-engineer%2Croad-engineer/);
 await expect(page.locator('.comparison-table .education-site')).toHaveCount(0);
 await expect(page.locator('.comparison-table a[href^="https://"]')).toHaveCount(2);
 await expect(page.locator('#comparisonResult')).toContainText('Числовые данные не подтверждены');
 await page.reload();
 await expect(page.locator('#selectedProfessions button')).toHaveCount(2);
 await page.locator('#selectedProfessions button').first().click();
 await expect(page.locator('#selectedProfessions button')).toHaveCount(1);
});
test('education admission guidance reflects 2026 profile-only college exams',async({page})=>{
 await page.goto('/map.html');
 await page.locator('a[href="#education-benefits"]').click();
 const a=page.locator('#education-benefits');
 await expect(a).toContainText('соответствующих профилю');
 await expect(a).toContainText('смене профиля');
 await expect(a.locator('a[href*="minobrnauki.gov.ru"]')).toHaveCount(1);
 await expect(page.locator('#educationResults .education-card')).toHaveCount(12);
});
