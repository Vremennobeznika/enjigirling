const {test,expect}=require('@playwright/test');
const sections=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const section of sections){
 test('desktop smoke: '+section,async({page})=>{
  const pageErrors=[];
  const failedLocal=[];
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('response',response=>{
   const url=new URL(response.url());
   if(url.origin==='http://127.0.0.1:8765'&&response.status()>=400)failedLocal.push(response.status()+' '+url.pathname);
  });
  await page.goto('/'+section,{waitUntil:'load'});
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('nav.eng-tabs a')).toHaveCount(12);
  const main=page.locator('main');
  await expect(main).toBeVisible();
  const dimensions=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  expect(dimensions.document,section+' overflows horizontally').toBeLessThanOrEqual(dimensions.viewport+2);
  expect(pageErrors,section+' JavaScript errors').toEqual([]);
  expect(failedLocal,section+' missing local resources').toEqual([]);
 });
}
test('shared navigation reaches every section without 404',async({page})=>{
 await page.goto('/index.html');
 const expected=new Set([...sections,'robotics.html','coding.html','ai.html']);
 const links=page.locator('nav.eng-tabs a');
 const urls=await links.evaluateAll(nodes=>nodes.map(a=>(a.getAttribute('href')||'').split('#')[0]));
 expect(new Set(urls)).toEqual(expected);
 for(const section of expected){
  const link=page.locator('nav.eng-tabs a[href="'+section+'"]');
  await link.click();
  await expect(page).toHaveURL(new RegExp('/'+section.replace('.','\\.')+'$'));
  await expect(page.locator('main')).toBeVisible();
 }
});
