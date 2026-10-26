const {test,expect}=require('@playwright/test');
const pages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const name of pages){
 test('desktop 1440px, theme and keyboard landmarks: '+name,async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/'+name);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('nav.eng-tabs a')).toHaveCount(12);
  const skip=page.locator('.skip-link');
  await expect(skip).toHaveCount(1);
  await skip.focus();
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href','#main-content');
  await expect(page.locator('#main-content')).toHaveCount(1);
  const toggle=page.locator('.theme-toggle:visible').first();
  await expect(toggle).toBeVisible();
  const before=await page.locator('html').evaluate(node=>node.classList.contains('theme-dark'));
  await toggle.click();
  const after=await page.locator('html').evaluate(node=>node.classList.contains('theme-dark'));
  expect(after).not.toBe(before);
  await page.reload();
  expect(await page.locator('html').evaluate(node=>node.classList.contains('theme-dark'))).toBe(after);
  const sizes=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  expect(sizes.scroll,name+' horizontal overflow').toBeLessThanOrEqual(sizes.width+2);
  expect(errors,name+' JavaScript runtime errors').toEqual([]);
 });
}
