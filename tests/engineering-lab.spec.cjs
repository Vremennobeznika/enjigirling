const {test,expect}=require('@playwright/test');
test('IEEE754 is lazy, decodes FP32, FP64, FP16 and allows bit changes',async({page})=>{
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 await page.goto('/calculator.html');
 expect(await page.locator('script[src="engineering-lab-core.js"]').count()).toBe(0);
 expect(await page.locator('script[src="data.js"],script[src="salary-sources.js"]').count()).toBe(0);
 await page.locator('#labIEEE > summary').click();
 await expect(page.locator('#ieeeHex')).toHaveText('0x3DCCCCCD');
 await expect(page.locator('#ieeeError')).toContainText('10^-9');
 await page.locator('#ieeeFormat').selectOption('fp64');
 await expect(page.locator('#ieeeHex')).toHaveText('0x3FB999999999999A');
 await page.locator('#ieeeFormat').selectOption('fp16');
 await page.locator('#ieeeInput').fill('-0');
 await expect(page.locator('#ieeeHex')).toHaveText('0x8000');
 await page.locator('#ieeeMode').selectOption('hex');
 await page.locator('#ieeeInput').fill('3C00');
 await expect(page.locator('#ieeeStored')).toHaveText('1');
 await page.locator('.ieee-bit').first().click();
 await expect(page.locator('#ieeeHex')).toHaveText('0xBC00');
 await page.locator('#ieeeFormat').selectOption('tf32');
 await page.locator('#ieeeMode').selectOption('decimal');
 await page.locator('#ieeeInput').fill('1');
 await expect(page.locator('#ieeeHex')).toHaveText('0x1FC00');
 await page.locator('#ieeeFormat').selectOption('bf16');
 await page.locator('#ieeeMode').selectOption('decimal');
 await page.locator('#ieeeInput').fill('1');
 await expect(page.locator('#ieeeHex')).toHaveText('0x3F80');
 expect(errors).toEqual([]);
});
test('electronics modules run on demand without the salary catalog',async({page})=>{
 await page.goto('/calculator.html');
 await page.locator('#labElectronics > summary').click();
 await expect(page.locator('#ohmOutput')).toContainText('24');
 await expect(page.locator('#dividerOutput')).toContainText('6 В');
 await expect(page.locator('#modbusOutput')).toContainText('Float32 = 1');
 await page.locator('#modbusFirst').fill('0000');
 await page.locator('#modbusSecond').fill('3F80');
 await page.locator('#modbusOrder').selectOption('CDAB');
 await expect(page.locator('#modbusOutput')).toContainText('Float32 = 1');
 await page.locator('#toleranceRows').fill('10;0.1\n-2;0.2');
 await expect(page.locator('#toleranceOutput')).toContainText('Номинал = 8');
 await page.locator('#dividerR1').fill('0');
 await expect(page.locator('#dividerOutput')).toContainText('Сопротивления должны быть положительными');
});
test('new calculators do not break 320px viewports',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html');
 await page.locator('#labIEEE > summary').click();
 await expect(page.locator('#ieeeHex')).toHaveText('0x3DCCCCCD');
 let overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
 expect(overflow).toBeFalsy();
 await page.locator('#labElectronics > summary').click();
 await expect(page.locator('#modbusOutput')).toContainText('Float32 = 1');
 overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
 expect(overflow).toBeFalsy();
});


test('renamed original workbench names and six manufacturing calculators work on demand',async({page})=>{
 await page.goto('/calculator.html');
 await expect(page.locator('#labIEEE > summary')).toContainText('Битоскоп');
 await expect(page.locator('#labElectronics > summary')).toContainText('Электроцех');
 const summary=page.locator('#labProduction > summary');
 await expect(summary).toContainText('Цеховой расчёт');
 expect(await page.locator('script[src="engineering-lab-core.js"]').count()).toBe(0);
 await summary.click();
 await expect(page.locator('#taktOutput')).toContainText('30 с/шт');
 await expect(page.locator('#oeeOutput')).toContainText('80 %');
 await expect(page.locator('#massOutput')).toContainText('7,85 кг');
 await expect(page.locator('#thermalOutput')).toContainText('0,6 мм');
 await expect(page.locator('#cutOutput')).toContainText('62,831');
 await expect(page.locator('#flowOutput')).toContainText('56,548');
 await page.locator('#oeeGood').fill('1100');
 await expect(page.locator('#oeeOutput')).toContainText('Годных изделий не может быть больше');
 await page.locator('#oeeGood').fill('960');
 await expect(page.locator('#oeeOutput')).toContainText('80 %');
 await page.locator('#cutMode').selectOption('speed');
 await page.locator('#cutQuantity').fill('62.83185307179586');
 await expect(page.locator('#cutOutput')).toContainText('1 000 об/мин');
});
test('production workshop remains usable at narrow viewport',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html#labProduction');
 await expect(page.locator('#labProduction')).toHaveAttribute('open','');
 await expect(page.locator('#taktOutput')).toContainText('30 с/шт');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
 await page.locator('#flowDiameter').fill('0');
 await expect(page.locator('#flowOutput')).toContainText('Диаметр');
});


test('sewing studio calculates marker, cloth, thread and SMV efficiency',async({page})=>{
 await page.goto('/calculator.html');
 const groups=page.locator('.calculator-group');
 await expect(groups).toHaveCount(7);
 await page.locator('#labSewing > summary').click();
 await expect(page.locator('#markerOutput')).toContainText('82,666');
 await expect(page.locator('#fabricOutput')).toContainText('159,65 м');
 await expect(page.locator('#threadOutput')).toContainText('632,5 м');
 await expect(page.locator('#lineOutput')).toContainText('62,5 %');
 await page.locator('#markerArea').fill('100000');
 await expect(page.locator('#markerOutput')).toContainText('превышает');
 await page.locator('#markerArea').fill('62000');
 await expect(page.locator('#markerOutput')).toContainText('82,666');
});
test('marine studio calculates voyage, fuel, hull-speed estimate and draft',async({page})=>{
 await page.goto('/calculator.html#labMarine');
 await expect(page.locator('#labMarine')).toHaveAttribute('open','');
 await expect(page.locator('#passageOutput')).toContainText('92,6 км');
 await expect(page.locator('#fuelOutput')).toContainText('120 л');
 await expect(page.locator('#hullOutput')).toContainText('7,675');
 await expect(page.locator('#draftOutput')).toContainText('12 см');
 await page.locator('#draftMass').fill('-246');
 await expect(page.locator('#draftOutput')).toContainText('-12 см');
 await page.locator('#passageKn').fill('0');
 await expect(page.locator('#passageOutput')).toContainText('положительным');
});
test('sewing and marine calculators fit a slow 320px mobile layout',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html');
 await page.locator('#labSewing > summary').click();
 await expect(page.locator('#markerOutput')).toContainText('82,666');
 await page.locator('#labMarine > summary').click();
 await expect(page.locator('#draftOutput')).toContainText('12 см');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBeTruthy();
});


test('measurement lab link and extended industry calculations',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/calculator.html');
 await expect(page.locator('#labCaliper')).toHaveCount(0);
 await expect(page.locator('a[href="measurement-lab.html"]').first()).toBeVisible();
 await page.locator('#labMoreSewing > summary').click();
 await expect(page.locator('#shrinkOutput')).toContainText('3 %');
 await expect(page.locator('#layOutput')).toContainText('51 м');
 await page.locator('#labMoreMarine > summary').click();
 await expect(page.locator('#dispOutput')).toContainText('7 175 т');
 await expect(page.locator('#currentOutput')).toContainText('10,198');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
});


test('all calculator tools sit inside seven consistent visual groups',async({page})=>{
 await page.goto('/calculator.html');
 const groups=page.locator('.calculator-workshop-section');
 await expect(groups).toHaveCount(7);
 const expected=[
 ['group-digital',['labIEEE','calcBases']],
 ['group-electrical',['labElectronics','calcSignal']],
 ['group-production',['labManufacturing','labAtlasTools','labProduction']],
 ['group-sewing',['labSewing','labMoreSewing']],
 ['group-marine',['labMarine','labMoreMarine']],
 ['group-measurements',['calcUnits']]
 ];
 for(const [id,panels] of expected){
  const section=page.locator('#'+id);
  await expect(section).toBeVisible();
  await expect(section.locator('.calculator-workshop-grid > details.calc-lab')).toHaveCount(panels.length);
  expect(await section.locator('.calculator-workshop-grid > details.calc-lab').evaluateAll(els=>els.map(el=>el.id))).toEqual(panels);
 }
 await expect(page.locator('#calcUnits')).not.toHaveAttribute('open','');
 await expect(page.locator('#calcBases')).not.toHaveAttribute('open','');
 await expect(page.locator('#calcSignal')).not.toHaveAttribute('open','');
 await expect(page.locator('.calc-section:not(.calc-legacy .calc-section)')).toHaveCount(0);
});
test('legacy calculators open from their unchanged deep links and compute',async({page})=>{
 await page.goto('/calculator.html#calcUnits');
 await expect(page.locator('#calcUnits')).toHaveAttribute('open','');
 await page.locator('#convInput').fill('1000');
 await expect(page.locator('#convResultValue')).not.toHaveText('—');
 await page.goto('/calculator.html#calcBases');
 await expect(page.locator('#calcBases')).toHaveAttribute('open','');
 await page.locator('#numInput').fill('255');
 await expect(page.locator('#numHex')).toHaveText('FF');
 await page.goto('/calculator.html#calcSignal');
 await expect(page.locator('#calcSignal')).toHaveAttribute('open','');
 await expect(page.locator('#maResultValue')).toContainText('5');
 await expect(page.locator('#signalGuideTitle')).toBeVisible();
});
test('all seven calculator groups have no horizontal overflow on 320px screens',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html');
 for(const id of ['labIEEE','calcBases','labElectronics','calcSignal','labProduction','labPractical','labSewing','labMoreSewing','labMarine','labMoreMarine','calcUnits']){
  const details=page.locator('#'+id);
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open','');
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
  await details.locator('summary').click();
 }
});

// High-risk display regression: a zero-speed vector must never masquerade as 000°.
test('maritime vector cancellation has no fictitious course',async({page})=>{
 await page.goto('/calculator.html#labMoreMarine');
 await expect(page.locator('#currentOutput')).toContainText('10,198');
 await page.locator('#currentShip').fill('10');
 await page.locator('#currentCourse').fill('90');
 await page.locator('#currentKnots').fill('10');
 await page.locator('#currentDir').fill('270');
 await expect(page.locator('#currentOutput')).toContainText('не определяется');
 await page.locator('#currentDir').fill('361');
 await expect(page.locator('#currentOutput')).toContainText('0–360');
 await page.locator('#currentDir').fill('0');
 await expect(page.locator('#currentOutput')).toContainText('уз');
});
test('fuel, loading and NE43 cases are visibly refused rather than showing false readings',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html#labMarine');
 await expect(page.locator('#fuelOutput')).toContainText('120 л');
 await page.locator('#fuelRate').fill('0');
 await expect(page.locator('#fuelOutput')).toContainText('положительным');
 await page.locator('#fuelRate').fill('24');
 await expect(page.locator('#fuelOutput')).toContainText('120 л');
 await page.locator('#draftDensity').fill('0');
 await expect(page.locator('#draftOutput')).toContainText('положительным');
 await page.goto('/calculator.html#calcSignal');
 await page.locator('#maCurrent').fill('3.6');
 await expect(page.locator('#maResultValue')).toContainText('сигнал отказа');
 await expect(page.locator('#maValue')).toHaveValue('');
 await page.locator('#maCurrent').fill('4');
 await expect(page.locator('#maResultValue')).toContainText('4');
 await page.locator('#maCurrent').fill('21');
 await expect(page.locator('#maResultValue')).toContainText('сигнал отказа');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
});

test('legacy converters preserve tiny values and reject oversized integers on weak devices',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html#calcUnits');
 await expect(page.locator('#convInput')).toBeVisible();
 await page.locator('#convFrom').selectOption('mm');
 await page.locator('#convTo').selectOption('m');
 await page.locator('#convInput').fill('0.000001');
 await expect(page.locator('#convResultValue')).toContainText('e-9');
 await page.goto('/calculator.html#calcBases');
 await page.locator('#numInput').evaluate(node=>{
   node.value='9'.repeat(400);
   node.dispatchEvent(new Event('input',{bubbles:true}));
 });
 await expect(page.locator('#numResultHint')).toContainText('не больше 256 цифр');
 await expect(page.locator('#numHex')).toHaveText('—');
 await page.locator('#numInput').fill('255');
 await expect(page.locator('#numHex')).toHaveText('FF');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
});
