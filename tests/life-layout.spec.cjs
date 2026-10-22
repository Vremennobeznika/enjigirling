const {test,expect}=require('@playwright/test');

test('Personal dashboard: disclosure and forms have no marker or overflow',async({page})=>{
  await page.goto('/life/');
  const disclosure=page.locator('#cloudPanel');
  const summary=disclosure.locator('summary');
  await expect(summary).toHaveCount(1);
  await expect(summary).toContainText('Облачная синхронизация');
  // Regression: a list-style:auto summary displayed an accidental "0." marker.
  await expect(summary).toHaveCSS('list-style-type','none');
  for(const width of [1366,860,660,375,320]){
    await page.setViewportSize({width,height:900});
    for(const selector of ['#taskForm','#pantryForm','#cloudPanel']){
      const box=await page.locator(selector).boundingBox();
      expect(box,selector+' at '+width).toBeTruthy();
      expect(box.x,selector+' negative x at '+width).toBeGreaterThanOrEqual(-1);
      expect(box.x+box.width,selector+' right overflow at '+width).toBeLessThanOrEqual(width+1);
    }
    for(const selector of ['#taskForm','#pantryForm']){
      const form=page.locator(selector);
      for(const field of await form.locator('input,select,button').all()){
        const box=await field.boundingBox();
        expect(box.width,selector+' item width at '+width).toBeGreaterThan(35);
        expect(box.height,selector+' item height at '+width).toBeGreaterThanOrEqual(43);
        expect(box.x,selector+' item left at '+width).toBeGreaterThanOrEqual(-1);
        expect(box.x+box.width,selector+' item right at '+width).toBeLessThanOrEqual(width+1);
      }
    }
    await summary.click();
    await expect(disclosure).toHaveAttribute('open','');
    const form=page.locator('#cloudForm');
    for(const el of await form.locator('input,button').all()){
      const box=await el.boundingBox();
      expect(box.x+box.width,'Cloud form overflow at '+width).toBeLessThanOrEqual(width+1);
    }
    await summary.click();
    await expect(disclosure).not.toHaveAttribute('open');
  }
});
