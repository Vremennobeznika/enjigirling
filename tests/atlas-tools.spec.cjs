const {test,expect}=require('@playwright/test');
test('atlas search opens the selected working calculator and computes GSM',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/calculator-atlas.html');await page.locator('#atlasQuery').fill('Плотность ткани GSM');
 const link=page.getByRole('link',{name:'Плотность ткани GSM по образцу',exact:true});await expect(link).toHaveCount(1);await link.click();
 await expect(page.locator('#labAtlasTools')).toHaveAttribute('open','');await expect(page.locator('#atlasToolSelect')).toHaveValue('gsm');
 await expect(page.locator('#atlasToolResult')).toHaveText('500 г/м²');
 await page.locator('#atlasInput-mass').fill('2,5');await expect(page.locator('#atlasToolResult')).toHaveText('250 г/м²');
 await page.locator('#atlasInput-width').fill('0');await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','false');
 expect(errors).toEqual([]);
});
test('eight calculators calculate, reject invalid inputs and fit narrow screens',async({page})=>{
 await page.goto('/calculator.html#labAtlasTools');await page.locator('#atlasToolChooser').evaluate(n=>n.open=true);await expect(page.locator('#atlasToolSelect option')).toHaveCount(require('../atlas-tools.js').definitions.length);
 for(const id of ['gsm','fabric-mass','tex','roll-length','transfer','pcm','timber','glue']){
  await page.locator('#atlasToolSelect').selectOption(id);await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','true');
  await expect(page.locator('#atlasToolFormula')).not.toBeEmpty();
  const input=page.locator('#atlasToolFields input').first();await input.fill('-1');await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','false');
 }
 await page.locator('#atlasToolSelect').selectOption('pcm');
 await expect(page.locator('#atlasToolResult')).toHaveText('10 584 000 байт');
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:720});expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);}
});
test('atlas calculator module is lazy and reused',async({page})=>{
 const loaded=[];page.on('request',r=>{if(r.url().endsWith('/atlas-tools.js'))loaded.push(r.url());});
 await page.goto('/calculator.html');expect(loaded).toHaveLength(0);
 await page.locator('#labAtlasTools > summary').click();await page.locator('#atlasToolChooser').evaluate(n=>n.open=true);await expect(page.locator('#atlasToolSelect option')).toHaveCount(require('../atlas-tools.js').definitions.length);
 await page.locator('#labAtlasTools > summary').click();await page.locator('#labAtlasTools > summary').click();expect(loaded).toHaveLength(1);
});
