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
      for(const field of await form.locator('input:not([type=hidden]),select,button').all()){
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



test('Compact iPhone selectors fit and do not overlap even with the keyboard visible',async({page})=>{
 await page.goto('/life/');
 for(const width of [320,360,375,390,402,414,430,568,660,768]){
  await page.setViewportSize({width,height:844});
  const r=await page.evaluate(()=>{
   const box=selector=>{
    const b=document.querySelector(selector).getBoundingClientRect();
    return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height};
   };
   return {
    form:box('#taskForm'),date:box('.date-parts[data-date-parts=taskDate]'),
    time:box('.time-parts'),viewDate:box('.date-parts[data-date-parts=taskViewDate]'),
    dateChildren:['taskDateDay','taskDateMonth','taskDateYear'].map(id=>box('#'+id)),
    timeChildren:['taskTimeHour','taskTimeMinute'].map(id=>box('#'+id)),
    viewChildren:['taskViewDateDay','taskViewDateMonth','taskViewDateYear'].map(id=>box('#'+id)),
    buttons:[...document.querySelectorAll('.task-date-actions button')].map(x=>{
      const b=x.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,height:b.height};
    }),
    documentWidth:document.documentElement.scrollWidth,viewport:window.innerWidth
   };
  });
  expect(r.documentWidth,'page overflow '+width).toBeLessThanOrEqual(width+2);
  for(const [outer,inner,label] of [
    [r.date,r.dateChildren,'date'],[r.time,r.timeChildren,'time'],[r.viewDate,r.viewChildren,'view']
  ]){
   for(let i=0;i<inner.length;i++){
    const el=inner[i];
    expect(el.left,label+' left '+width).toBeGreaterThanOrEqual(outer.left-1);
    expect(el.right,label+' right '+width).toBeLessThanOrEqual(outer.right+1);
    expect(el.height,label+' tap height '+width).toBeGreaterThanOrEqual(44);
    if(i>0)expect(el.left,label+' previous field '+width).toBeGreaterThanOrEqual(inner[i-1].right);
   }
  }
  if(width<=660)expect(r.date.bottom,'date overlaps time '+width).toBeLessThanOrEqual(r.time.top);
  for(let i=0;i<r.buttons.length;i++){
   const btn=r.buttons[i];
   expect(btn.height,'button height '+width).toBeGreaterThanOrEqual(44);
   expect(btn.right,'button right '+width).toBeLessThanOrEqual(width+1);
   for(let j=0;j<i;j++){
    const prev=r.buttons[j];
    const overlapW=Math.max(0,Math.min(prev.right,btn.right)-Math.max(prev.left,btn.left));
    const overlapH=Math.max(0,Math.min(prev.bottom,btn.bottom)-Math.max(prev.top,btn.top));
    expect(overlapW*overlapH,'overlapping navigation '+width).toBe(0);
   }
  }
 }
});
