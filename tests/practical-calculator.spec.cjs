const {test,expect}=require('@playwright/test');
test('practical engineering calculators display accurate initial results and validate fields',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/calculator.html#labPractical');
 await expect(page.locator('#labPractical')).toHaveAttribute('open','');
 await expect(page.locator('#threeOutput')).toContainText('кВА');
 await expect(page.locator('#voltageOutput')).toContainText('ΔU');
 await expect(page.locator('#cylOutput')).toContainText('кг');
 await page.locator('#threePF').fill('1.2');
 await expect(page.locator('#threeOutput')).toContainText('диапазон');
 await page.locator('#threePF').fill('0.8');
 await expect(page.locator('#threeOutput')).toContainText('кВт');
 await page.locator('#cylInner').fill('50');
 await expect(page.locator('#cylOutput')).toContainText('меньше наружного');
 await page.locator('#cylInner').fill('0');
 await expect(page.locator('#cylOutput')).toContainText('кг');
 await page.locator('#voltageSystem').selectOption('dc');
 await expect(page.locator('#voltagePF')).toBeDisabled();
 expect(errors).toEqual([]);
});
test('practical tools do not overflow 320px viewport',async({page})=>{
 await page.setViewportSize({width:320,height:750});
 await page.goto('/calculator.html#labPractical');
 await expect(page.locator('#threeOutput')).toContainText('кВА');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
});
