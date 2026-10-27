const {test,expect}=require('@playwright/test');
test('manufacturing costs load on demand, calculate and preserve the existing calculators',async({page})=>{
 const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 await page.goto('/calculator.html');
 expect(requests.some(x=>x.endsWith('/manufacturing-cost.js'))).toBe(false);
 await page.locator('.calculator-directory > summary').click();
 await page.getByRole('link',{name:'Изготовление и прокат',exact:true}).click();
 await expect(page.locator('#labManufacturing')).toHaveAttribute('open','');
 await expect(page.locator('#manufacturingProcess option')).toHaveCount(12);
 await page.locator('#mcPriceMode').selectOption('manual');
 await page.locator('#manufacturingForm button[type=submit]').click();
 await expect(page.locator('#manufacturingResult')).toContainText('Заполните');
 for(const [id,value] of Object.entries({manufacturingQuantity:'10',manufacturingMass:'2',manufacturingPrice:'60000',manufacturingMinutes:'30',manufacturingMachineRate:'1200',manufacturingLaborMinutes:'10',manufacturingLaborRate:'600',manufacturingSetup:'1000',manufacturingTooling:'2000',manufacturingReject:'20',manufacturingOverhead:'10',manufacturingMarkup:'20'}))await page.locator('#'+id).fill(value);
 await page.locator('#manufacturingForm button[type=submit]').click();
 await expect(page.locator('#manufacturingResult')).toContainText('1 803,12 ₽/шт');
 await expect(page.locator('#manufacturingResult')).toContainText('План заготовок: 13');
 await page.locator('#labManufacturing > summary').click();await page.locator('#labManufacturing > summary').click();
 expect(requests.filter(x=>x.endsWith('/manufacturing-cost.js'))).toHaveLength(1);
 await page.locator('#labPractical > summary').click();await expect(page.locator('#cylOutput')).toContainText('кг');
 expect(errors).toEqual([]);
});
test('metal stock estimate, geometry validation and 320px layout',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto('/calculator.html#labManufacturing');
 await expect(page.locator('#manufacturingProcess option')).toHaveCount(12);
 await page.locator('#labManufacturing details > summary').click();
 await page.locator('#manufacturingStockForm button[type=submit]').click();
 await expect(page.locator('#manufacturingMass')).toHaveValue('7.85');
 await expect(page.locator('#manufacturingStockResult')).toContainText('7,85 кг');
 await page.locator('#stockShape').selectOption('tube');await expect(page.locator('#stockDiameter')).toBeVisible();await expect(page.locator('#stockWidth')).toBeHidden();
 await page.locator('#stockWall').fill('25');await page.locator('#manufacturingStockForm button[type=submit]').click();
 await expect(page.locator('#manufacturingStockResult')).toContainText('меньше половины');
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:700});expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);}
 await expect(page.locator('#labManufacturing')).toContainText('файл загружать не нужно');
});

test('exact reject boundary does not add a charged blank',async({page})=>{
 await page.goto('/calculator.html#labManufacturing');
 await expect(page.locator('#manufacturingProcess option')).toHaveCount(12);
 await page.locator('#mcPriceMode').selectOption('manual');
 await page.locator('#manufacturingQuantity').fill('9');
 await page.locator('#manufacturingPrice').fill('1000');
 await page.locator('#manufacturingReject').fill('90');
 await page.locator('#manufacturingForm button[type=submit]').click();
 await expect(page.locator('#manufacturingResult')).toContainText('План заготовок: 90.');
 await expect(page.locator('#manufacturingResult')).toContainText('Материал: 90 ₽');
});
