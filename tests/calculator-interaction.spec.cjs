const {test,expect}=require('@playwright/test');
for(const width of [320,390,1280])for(const theme of ['light','dark']){
 test('calculator input recovery and filtering '+width+' '+theme,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(t=>localStorage.setItem('theme',t),theme);
  await page.goto('calculator.html?atlasTool=gsm#labAtlasTools');
  const result=page.locator('#atlasToolResult'),mass=page.locator('#atlasInput-mass');
  await expect(result).toHaveAttribute('data-valid','true');
  await mass.fill('0,25');await expect(result).toHaveText('25 г/м²');
  await mass.fill('1e-999');await expect(result).toHaveAttribute('data-valid','false');
  await expect(result).toContainText('слишком мало');
  await mass.fill('0');await expect(result).toHaveText('0 г/м²');
  await page.locator('#atlasToolChooser > summary').click();
  await page.locator('#atlasToolSearch').fill('zzzz_no_matching_calculator');
  await expect(page.locator('#atlasToolSelect')).toBeDisabled();
  await page.locator('#atlasToolForm button[type=submit]').click();
  await expect(result).toHaveText('По запросу ничего не найдено.');
  await page.locator('#atlasToolSearch').fill('');
  await page.locator('#atlasToolSelect').selectOption('gsm');
  await expect(result).toHaveAttribute('data-valid','true');
  await page.locator('#labPractical').evaluate(e=>e.open=true);
  const practical=page.locator('#threeOutput');
  await expect(practical).toHaveAttribute('data-valid','true');
  await page.locator('#threeCurrent').fill('0.000001');
  await expect(practical).toHaveText(/S = [^·]*[Ee]/i);
  await page.locator('#threeCurrent').fill('1e-999');
  await expect(practical).toHaveAttribute('data-valid','false');
  await page.locator('#threeCurrent').fill('10');
  await expect(practical).toHaveAttribute('data-valid','true');
  await page.locator('#voltageSystem').selectOption('dc');
  await expect(page.locator('#voltagePF')).toBeDisabled();
  await page.locator('#voltageSystem').selectOption('three');
  await expect(page.locator('#voltagePF')).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 });
}
