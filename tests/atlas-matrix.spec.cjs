const {test,expect}=require('@playwright/test');
const {definitions}=require('../atlas-tools.js');
test('every implemented atlas model initializes and produces a finite result in the browser',async({page})=>{
 test.setTimeout(180000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/calculator.html#labAtlasTools');
 await expect(page.locator('#atlasToolSelect option')).toHaveCount(definitions.length);
 for(const d of definitions){
  await page.locator('#atlasToolSelect').selectOption(d.id);
  await expect(page.locator('#atlasToolResult'),d.id+' '+d.topic).toHaveAttribute('data-valid','true');
  await expect(page.locator('#atlasToolFormula')).toHaveText(d.formula);
 }
 expect(errors).toEqual([]);
});

test('atlas matrix filters, graphics, manual costly models and stale-result clearing',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.goto('/calculator.html#labAtlasTools');
 await expect(page.locator('#atlasToolSelect option')).toHaveCount(definitions.length);
 await page.locator('#atlasToolGroup').selectOption('g12');
 await expect(page.locator('#atlasToolSelect option')).toHaveCount(22);
 await page.locator('#atlasToolSearch').fill('H7/g6');
 await expect(page.locator('#atlasToolSelect')).toHaveValue('g12-4');
 await expect(page.locator('#atlasToolResult')).toContainText('7 мкм');
 await page.locator('#atlasToolSearch').fill('несуществующийрасчет');
 await expect(page.locator('#atlasToolSelect')).toBeDisabled();
 await expect(page.locator('#atlasToolResult')).toHaveText('По запросу ничего не найдено.');
 await page.locator('#atlasToolSearch').fill('');await page.locator('#atlasToolGroup').selectOption('g24');
 await page.locator('#atlasToolSelect').selectOption('g24-14');
 await expect(page.locator('[data-atlas-plot] svg')).toBeVisible();
 await page.locator('#atlasInput-counts').fill('101;10');
 await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','false');
 await expect(page.locator('[data-atlas-plot]')).toHaveCount(0);
 await page.locator('#atlasToolGroup').selectOption('g5');await page.locator('#atlasToolSelect').selectOption('g5-5');
 await page.locator('#atlasInput-aql').fill('1');
 await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','pending');
 await page.locator('#atlasToolForm button[type=submit]').click();
 await expect(page.locator('#atlasToolResult')).toContainText('132 образцов');
 await page.locator('#atlasToolGroup').selectOption('g33');await page.locator('#atlasToolSelect').selectOption('g33-3');
 await page.locator('#atlasInput-value').fill('-0');await expect(page.locator('#atlasToolResult')).toContainText('0x80000000');
 await page.locator('#atlasToolGroup').selectOption('g28');await page.locator('#atlasToolSelect').selectOption('g28-11');
 await page.locator('#atlasInput-height').fill('0.07');await page.locator('#atlasInput-layer').fill('0.01');
 await expect(page.locator('#atlasToolResult')).toHaveText('7 слоёв');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});

test('atlas tools respond under 4x CPU throttling and calculate offline after loading',async({page})=>{
 const session=await page.context().newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.setViewportSize({width:320,height:740});await page.goto('/calculator.html');
 await page.evaluate(()=>{window.__atlasStart=performance.now();document.getElementById('labAtlasTools').open=true;});
 await expect(page.locator('#atlasToolSelect option')).toHaveCount(definitions.length,{timeout:15000});
 const elapsed=await page.evaluate(()=>performance.now()-window.__atlasStart);
 expect(elapsed).toBeLessThan(3000);
 await page.context().setOffline(true);
 try{
  await page.locator('#atlasToolSearch').fill('Время передачи файла');
  await expect(page.locator('#atlasToolSelect')).toHaveValue('transfer');
  await page.locator('#atlasInput-size').fill('200');
  await expect(page.locator('#atlasToolResult')).toHaveText('16,777216 с');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  console.log('4x CPU atlas opening, milliseconds:',Math.round(elapsed));
 }finally{await page.context().setOffline(false);await session.detach();}
});

test('concordance, separator volume and a stepped energy profile use the named quantity',async({page})=>{
 await page.goto('/calculator.html#labAtlasTools');await expect(page.locator('#atlasToolSelect option')).toHaveCount(definitions.length);
 await page.locator('#atlasToolSelect').selectOption('g24-19');await expect(page.locator('#atlasToolResult')).toContainText('CCC Lin');
 await page.locator('#atlasToolSelect').selectOption('g20-20');await expect(page.locator('#atlasToolResult')).toContainText('м³ полезного объёма');
 await page.locator('#atlasToolSelect').selectOption('g23-2');await expect(page.locator('[data-atlas-plot] svg')).toBeVisible();
 await expect(page.locator('#atlasToolResult')).toHaveText('80 кВт·ч');
});
