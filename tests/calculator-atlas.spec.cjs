const {test,expect}=require('@playwright/test');
test('734 planned calculators are searchable by industry, not misrepresented as live tools',async({page})=>{
 const errors=[];page.on('pageerror',x=>errors.push(x.message));
 await page.goto('/calculator-atlas.html');
 await expect(page.locator('#atlasTitle')).toContainText('Атлас инженерных калькуляторов');
 await expect(page.locator('.atlas-group')).toHaveCount(34);
 await expect(page.locator('#atlasCount')).toContainText('734');
 expect(await page.locator('#atlasResults li').count()).toBe(0); // Lazy list population.
 await page.locator('.atlas-group').first().locator('summary').click();
 await expect(page.locator('.atlas-group').first().locator('li').first()).toBeVisible();
 await page.locator('#atlasQuery').fill('нит');
 await expect(page.locator('#atlasCount')).toContainText('Найдено');
 await expect(page.locator('#atlasResults li').first()).toBeVisible();
 await page.locator('#atlasQuery').fill('неттакогокалькулятора');
 await expect(page.locator('.atlas-group')).toHaveCount(0);
 await expect(page.locator('#atlasCount')).toContainText('Найдено 0');
 await page.locator('#atlasQuery').fill('');
 await expect(page.locator('.atlas-group')).toHaveCount(34);
 await page.locator('#atlasCategory').selectOption('g7');
 await expect(page.locator('.atlas-group')).toHaveCount(1);
 await expect(page.locator('#atlasCount')).toContainText('1 группах');
 await expect(page.locator('a[download="enjigirling-calculator-atlas.csv"]')).toHaveAttribute('href','calculator-atlas.csv');
 expect(errors).toEqual([]);
});
test('atlas links to actual calculators and keeps 320px width',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator-atlas.html#g1');
 await expect(page.locator('#atlasCategory')).toHaveValue('g1');
 await expect(page.locator('.atlas-group')).toHaveCount(1);
 await expect(page.locator('#atlasCount')).toContainText('26');
 await expect(page.locator('.atlas-links a')).toHaveCount(11);
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBeTruthy();
 await page.locator('#atlasQuery').fill('усад');
 await expect(page.locator('#atlasResults li').first()).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBeTruthy();
});
test('atlas local resource and csv responses are accessible',async({request})=>{
 for(const file of ['calculator-atlas.html','calculator-atlas.css','calculator-atlas.js','calculator-atlas-data.js','calculator-atlas.csv']){
  const response=await request.get('/'+file);
  expect(response.ok(),file).toBeTruthy();
 }
 const response=await request.get('/calculator-atlas.csv');
 const body=await response.text();
 expect(body.startsWith('\uFEFF')).toBeTruthy();
 expect(body.trimEnd().split('\n').length).toBe(735);
});