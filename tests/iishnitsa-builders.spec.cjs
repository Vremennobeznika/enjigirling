const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
for(const width of [320,390,1280])for(const theme of ['light','dark']){
 test('toolkit workflows '+width+' '+theme,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(t=>localStorage.setItem('theme',t),theme);
  await page.goto('iishnitsa.html');
  const prompt=page.locator('#promptBuilder'),qa=page.locator('#qaBuilder');
  await prompt.locator('[name=task]').fill('Проверить расчёт');
  await prompt.locator('[name=context]').fill('Тестовые данные');
  await prompt.locator('[type=submit]').click();
  await expect(page.locator('#promptResult')).toHaveValue(/Проверить расчёт/);
  await expect(page.locator('#promptResult')).toHaveValue(/Тестовые данные/);
  const pd=page.waitForEvent('download');await page.locator('#promptDownload').click();const p=await pd;
  expect(p.suggestedFilename()).toBe('prompt.md');expect(await fs.readFile(await p.path(),'utf8')).toContain('Проверить расчёт');
  await prompt.locator('[type=reset]').click();await expect(page.locator('#promptResult')).toHaveValue('');
  await page.locator('#qaTask').fill('Проверка экспорта');
  await page.locator('#qaCustom').fill('=1+1');
  await qa.locator('[type=submit]').click();
  await expect(page.locator('#qaRows tr')).toHaveCount(5);
  await expect(page.locator('#qaResult')).toHaveValue(/Не подтверждено/);
  const first=page.locator('#qaRows tr').first();
  await first.locator('select').last().selectOption('Не пройдено');
  await expect(page.locator('#qaResult')).toHaveValue(/NO-GO/);
  const cd=page.waitForEvent('download');await page.locator('#qaCsv').click();const c=await cd;
  expect(c.suggestedFilename()).toBe('qa-matrix.csv');expect(await fs.readFile(await c.path(),'utf8')).toContain("'=1+1");
  const md=page.waitForEvent('download');await page.locator('#qaMd').click();const m=await md;
  expect(await fs.readFile(await m.path(),'utf8')).toContain('NO-GO');
  await first.getByRole('button',{name:/Удалить/}).click();
  await expect(page.locator('#qaRows tr')).toHaveCount(4);
  await page.locator('#qaAdd').click();
  await expect(page.locator('#qaRows tr')).toHaveCount(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 });
}
