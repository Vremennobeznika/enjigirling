const {test,expect}=require('@playwright/test');
test('initial page avoids remote webfonts and all unused calculator engines',async({page})=>{
 const seen=[];page.on('request',req=>seen.push(req.url()));
 await page.goto('/calculator.html');
 await expect(page.locator('#calcDirectoryTitle')).toBeVisible();
 await page.waitForLoadState('networkidle');
 for(const asset of ['atlas-tools.js','manufacturing-cost.js','engineering-lab-core.js','engineering-lab-ui.js','engineer-calculators.js','calculator-practical-core.js','calculator-practical.js']){
  expect(seen.some(url=>url.endsWith('/'+asset)),asset+' fetched before needed').toBe(false);
 }
 expect(seen.some(url=>/fonts\.(?:googleapis|gstatic)\.com/.test(url)),'external font request').toBe(false);
 await expect(page.locator('details.calc-lab[open]')).toHaveCount(0);
});
test('expanding a practical panel loads only that engine, once',async({page})=>{
 const seen=[];page.on('request',req=>seen.push(req.url()));
 await page.goto('/calculator.html');
 const tool=page.locator('#labPractical');
 await tool.locator('summary').click();
 await expect(page.locator('#threeOutput')).toContainText('кВА');
 await expect(page.locator('#cylOutput')).toContainText('кг');
 const count=asset=>seen.filter(url=>url.endsWith('/'+asset)).length;
 expect(count('calculator-practical-core.js')).toBe(1);
 expect(count('calculator-practical.js')).toBe(1);
 expect(count('engineer-calculators.js')).toBe(0);
 expect(count('engineering-lab-core.js')).toBe(0);
 await tool.locator('summary').click();await tool.locator('summary').click();
 await expect(page.locator('#threeOutput')).toContainText('кВА');
 expect(count('calculator-practical.js')).toBe(1);
});
test('legacy and advanced tools initialize on demand after page load',async({page})=>{
 const seen=[];page.on('request',req=>seen.push(req.url()));
 await page.goto('/calculator.html');
 await page.locator('#calcSignal > summary').click();
 await expect(page.locator('#maResultValue')).toContainText('5');
 expect(seen.filter(url=>url.endsWith('/engineer-calculators.js')).length).toBe(1);
 expect(seen.some(url=>url.endsWith('/engineering-lab-core.js'))).toBe(false);
 await page.locator('#labIEEE > summary').click();
 await expect(page.locator('#ieeeHex')).toHaveText('0x3DCCCCCD');
 expect(seen.filter(url=>url.endsWith('/engineering-lab-core.js')).length).toBe(1);
 await page.locator('#calcUnits > summary').click();
 await page.locator('#convInput').fill('1000');
 await page.locator('#convTo').selectOption('m');
 await expect(page.locator('#convResultValue')).toHaveText('1');
 expect(seen.filter(url=>url.endsWith('/engineer-calculators.js')).length).toBe(1);
});
test('calculator usability at 320px: accessible tool output and no lateral scroll',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html#labPractical');
 await expect(page.locator('#threeOutput')).toContainText('кВА');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
 await page.locator('#threeCurrent').fill('0');
 await expect(page.locator('#threeOutput')).toContainText('0 кВт');
 await page.locator('#threeCurrent').fill('10');
 await expect(page.locator('#threeOutput')).toContainText('кВт');
});
