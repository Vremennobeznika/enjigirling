const {test,expect}=require('@playwright/test');
const {definitions}=require('../atlas-tools.js');
test('one catalogue searches all industries and opens calculations without navigating away',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/calculator.html');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Калькуляторы');
 await expect(page.locator('#atlasCategory option')).toHaveCount(35);
 await expect(page.locator('#atlasResults a')).toHaveCount(0);
 await expect(page.locator('#atlasCount')).toContainText('734');
 await page.locator('#atlasQuery').fill('Плотность ткани GSM');
 await page.locator('#atlasResults a').click();
 await expect(page.locator('#atlasToolResult')).toHaveText('500 г/м²');
 await page.locator('#atlasQuery').fill('Время передачи файла');
 await page.locator('#atlasResults a').click();
 await expect(page.locator('#atlasToolSelect')).toHaveValue('transfer');
 await expect(page.locator('#atlasToolResult')).toHaveText('8,388608 с');
 await page.locator('#atlasQuery').fill('неттакогокалькулятора');
 await expect(page.locator('#atlasCount')).toContainText('Ничего не найдено');
 await expect(page.locator('#atlasResults a')).toHaveCount(0);
 expect(errors).toEqual([]);
});
test('all 734 catalogue links match the implemented registry, with bounded DOM',async({page})=>{
 await page.goto('/calculator.html');
 const found=[];
 for(const group of await page.locator('#atlasCategory option').evaluateAll(nodes=>nodes.map(n=>n.value).filter(Boolean))){
  await page.locator('#atlasCategory').selectOption(group);
  found.push(...await page.locator('#atlasResults a').evaluateAll(nodes=>nodes.map(n=>[n.textContent,new URL(n.href).searchParams.get('atlasTool')])));
 }
 expect(found).toHaveLength(734);
 const registry=new Map(definitions.map(d=>[d.topic,d.id]));
 for(const [topic,id] of found)expect(id,topic).toBe(registry.get(topic));
 await page.locator('#atlasCategory').selectOption('');await page.locator('#atlasQuery').fill('а');
 expect(await page.locator('#atlasResults a').count()).toBeLessThanOrEqual(80);
});
test('old atlas industry links lead into the single calculator section',async({page})=>{
 await page.goto('/calculator-atlas.html#g1');
 await expect(page).toHaveURL(/calculator\.html\?industry=g1#calculatorCatalog$/);
 await expect(page.locator('#atlasCategory')).toHaveValue('g1');
 await expect(page.locator('#atlasResults a')).toHaveCount(26);
});
test('catalogue fits 320px, light theme and 200 percent text, and supports keyboard selection',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto('/calculator.html');
 await page.evaluate(()=>{document.documentElement.classList.remove('theme-dark');document.documentElement.classList.add('theme-light');document.documentElement.style.fontSize='200%';});
 await page.locator('#atlasQuery').fill('Расход клея г/м²');
 const link=page.locator('#atlasResults a');await link.focus();await page.keyboard.press('Enter');
 await expect(page.locator('#atlasToolResult')).toHaveText('1,65 кг');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
});
test('catalogue stays light under 4x CPU, opens engines once, and searches offline',async({page})=>{
 const session=await page.context().newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:4});
 const requests=[];page.on('request',r=>requests.push(r.url()));await page.setViewportSize({width:320,height:720});
 await page.goto('/calculator.html');await page.waitForLoadState('networkidle');
 expect(requests.some(u=>/\/(atlas-extended|atlas-tools|engineering-lab-core)\.js$/.test(u))).toBe(false);
 const started=Date.now();await page.locator('#atlasQuery').fill('Плотность ткани GSM');await expect(page.locator('#atlasResults a')).toHaveCount(1);
 const searchMs=Date.now()-started;expect(searchMs).toBeLessThan(1500);
 await page.locator('#atlasResults a').click();await expect(page.locator('#atlasToolResult')).toHaveText('500 г/м²');
 await page.context().setOffline(true);
 try{
  await page.locator('#atlasQuery').fill('Расход клея г/м²');await page.locator('#atlasResults a').click();
  await expect(page.locator('#atlasToolResult')).toHaveText('1,65 кг');
  await page.locator('#atlasInput-area').fill('20');await expect(page.locator('#atlasToolResult')).toHaveText('3,3 кг');
  expect(requests.filter(u=>u.endsWith('/atlas-extended.js'))).toHaveLength(1);
  console.log('Catalogue search under 4x CPU, ms:',searchMs);
 }finally{await page.context().setOffline(false);await session.detach();}
});
test('air permeability uses SI conversion: 60 L/min over 100 cm² is 100 mm/s',async({page})=>{
 await page.goto('/calculator.html?atlasTool=g2-16#labAtlasTools');
 await expect(page.locator('#atlasToolResult')).toHaveText('100 мм/с');
 await page.locator('#atlasInput-area').fill('200');
 await expect(page.locator('#atlasToolResult')).toHaveText('50 мм/с');
 await expect(page.locator('#atlasToolFormula')).toContainText('10 000');
});
test('reviewed scope names, exact bags and applicability errors reach the user',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.goto('/calculator.html?atlasTool=g21-2#labAtlasTools');
 await page.locator('#atlasInput-volume').fill('0.14');await page.locator('#atlasInput-cement').fill('100');await page.locator('#atlasInput-bag').fill('7');
 await expect(page.locator('#atlasToolResult')).toHaveText('2 мешков');
 await page.locator('#atlasQuery').fill('Пропускная способность по Шеннону');
 await page.locator('#atlasResults a').click();
 await expect(page.locator('#labAtlasTools > summary strong')).toHaveText('Пропускная способность по Шеннону');
 await page.locator('#atlasToolChooser').evaluate(n=>n.open=true);await page.locator('#atlasToolSelect').selectOption('g19-12');
 await page.locator('#atlasInput-temp').fill('-45');await page.locator('#atlasInput-rh').fill('1');
 await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','false');
 await expect(page.locator('#atlasToolResult')).toContainText('вне проверенного диапазона');
 await page.locator('#atlasToolSelect').selectOption('g29-4');await page.locator('#atlasInput-x').fill('0;2;0;2');await page.locator('#atlasInput-y').fill('0;2;2;0');
 await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','false');
 await expect(page.locator('#atlasToolResult')).toContainText('Самопересечение');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
});
test('simple polygon validation stays bounded at 200 vertices under 4x CPU',async({page})=>{
 const session=await page.context().newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.goto('/calculator.html?atlasTool=g29-4#labAtlasTools');
 await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','true');
 const n=200,r=10,x=[],y=[];for(let i=0;i<n;i++){x.push(r*Math.cos(2*Math.PI*i/n));y.push(r*Math.sin(2*Math.PI*i/n));}
 await page.locator('#atlasInput-x').fill(x.join(';'));
 const start=Date.now();await page.locator('#atlasInput-y').fill(y.join(';'));
 await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','true');
 const elapsed=Date.now()-start;expect(elapsed).toBeLessThan(1500);
 const expected=n*r*r*Math.sin(2*Math.PI/n)/2;
 const actual=await page.locator('#atlasToolResult').textContent();
 expect(Number(actual.split(' ')[0].replace(',','.'))).toBeCloseTo(expected,5);
 x.push(0);y.push(0);await page.locator('#atlasInput-x').fill(x.join(';'));await page.locator('#atlasInput-y').fill(y.join(';'));
 await expect(page.locator('#atlasToolResult')).toHaveAttribute('data-valid','false');
 await expect(page.locator('#atlasToolResult')).toContainText('200');
 console.log('200-vertex topology and area at 4x CPU, ms:',elapsed);await session.detach();
});
