const {test,expect}=require('@playwright/test');
const saved=require('../mc-prices.json');
function snapshot(){
 const x=structuredClone(saved),now=new Date().toISOString();x.retrievedAt=now;for(const d of x.documents)d.publishedAt=now;
 x.items=[{...x.items[0],id:'sheet-test',description:'Тестовая сталь',sizes:'10',priceRUBPerTonne:60000},
 {...x.items.find(r=>r.document==='sortovojprokat.xls'),id:'bulk-test',description:'Тестовый сортовой прокат',sizes:'20',priceRUBPerTonne:50000}];
 return x;
}
async function open(page,data){
 await page.route('**/mc-prices.json',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(data)}));
 await page.goto('/calculator.html#labManufacturing');
 await expect(page.locator('#manufacturingProcess option')).toHaveCount(12);
}
test('official snapshot loads lazily, fills price, and enforces bulk threshold',async({page})=>{
 const data=snapshot(),requests=[];page.on('request',r=>requests.push(r.url()));
 await page.route('**/mc-prices.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));
 await page.goto('/calculator.html');expect(requests.some(x=>x.endsWith('/mc-prices.json'))).toBe(false);
 await page.goto('/calculator.html#labManufacturing');
 await expect(page.locator('#mcPriceStatus')).toContainText('2 ставок');
 await page.locator('#mcPriceItem').selectOption('sheet-test');
 await expect(page.locator('#manufacturingPrice')).toHaveValue('60000');
 await expect(page.locator('#manufacturingPrice')).toHaveJSProperty('readOnly',true);
 await expect(page.locator('#mcPriceDetails')).toContainText('с НДС');
 await page.locator('#manufacturingForm button[type=submit]').click();
 await expect(page.locator('#manufacturingResult')).toContainText('Материал: 600 ₽');
 await page.locator('#mcPriceItem').selectOption('bulk-test');
 await page.locator('#manufacturingForm button[type=submit]').click();
 await expect(page.locator('#manufacturingResult')).toContainText('от 5 т');
 await page.locator('#manufacturingQuantity').fill('1000');await page.locator('#manufacturingMass').fill('5');
 await page.locator('#manufacturingForm button[type=submit]').click();
 await expect(page.locator('#manufacturingResult')).toContainText('Материал: 250 000 ₽');
 await page.locator('#mcPriceSearch').fill('несуществующая марка');
 await expect(page.locator('#mcPriceStatus')).toContainText('Найдено 0');
 await expect(page.locator('#manufacturingPrice')).toHaveValue('');
});
test('stale supplier dates block automatic prices without manual file requests',async({page})=>{
 const data=snapshot();data.documents[0].publishedAt=new Date(Date.now()-73*3600000).toISOString();await open(page,data);
 await expect(page.locator('#mcPriceStatus')).toContainText('старше 72 часов');
 await expect(page.locator('#manufacturingPrice')).toHaveValue('');
 await expect(page.locator('#mcPriceItem')).toBeDisabled();
});
test('network failure leaves auto price empty and preserves a separately chosen own rate',async({page})=>{
 await page.route('**/mc-prices.json',route=>route.abort());await page.goto('/calculator.html#labManufacturing');
 await expect(page.locator('#mcPriceStatus')).toContainText('временно недоступен');
 await expect(page.locator('#manufacturingPrice')).toHaveValue('');
 await page.locator('#mcPriceMode').selectOption('manual');await page.locator('#manufacturingPrice').fill('12345');
 await expect(page.locator('#manufacturingPrice')).toHaveValue('12345');
 await expect(page.locator('#mcPriceSource')).toBeHidden();
});
test('supplier descriptions are inert text and long options fit a narrow display',async({page})=>{
 const data=snapshot();data.items[0].description='<img src=x onerror=alert(1)>'+ 'Сталь '.repeat(45);
 await page.setViewportSize({width:320,height:800});await open(page,data);
 await expect(page.locator('#mcPriceStatus')).toContainText('2 ставок');
 await page.locator('#mcPriceItem').selectOption('sheet-test');
 expect(await page.locator('#mcPriceItem img').count()).toBe(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});
