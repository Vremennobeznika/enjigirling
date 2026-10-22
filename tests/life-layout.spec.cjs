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


test('iPhone date and time controls never overlap or overflow their own fields',async({page})=>{
 await page.goto('/life/');
 for(const width of [320,360,375,390,402,414,430,568,660,768]){
  await page.setViewportSize({width,height:844});
  const r=await page.evaluate(()=>{
   const box=selector=>{
    const b=document.querySelector(selector).getBoundingClientRect();
    return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height};
   };
   return {
    form:box('#taskForm'),
    labels:[...document.querySelectorAll('#taskForm label.task-field')].map(e=>{
      const a=e.getBoundingClientRect(),b=e.querySelector('input').getBoundingClientRect();
      return {label:{left:a.left,right:a.right,top:a.top,bottom:a.bottom},input:{left:b.left,right:b.right,top:b.top,bottom:b.bottom}};
    }),
    date:box('#taskDate'),time:box('#taskTime'),
    viewDate:box('#taskViewDate'),viewDateLabel:box('.task-view-date-label'),
    navButtons:[...document.querySelectorAll('.task-date-actions button')].map(x=>{
      const b=x.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,height:b.height};
    }),
    documentWidth:document.documentElement.scrollWidth,viewport:window.innerWidth
   };
  });
  expect(r.labels).toHaveLength(2);
  expect(r.documentWidth,'document horizontal overflow '+width).toBeLessThanOrEqual(r.viewport+2);
  expect(r.date.right,'date right '+width).toBeLessThanOrEqual(r.labels[0].label.right+1);
  expect(r.time.right,'time right '+width).toBeLessThanOrEqual(r.labels[1].label.right+1);
  expect(r.date.left,'date left '+width).toBeGreaterThanOrEqual(r.labels[0].label.left-1);
  expect(r.time.left,'time left '+width).toBeGreaterThanOrEqual(r.labels[1].label.left-1);
  expect(r.viewDate.right,'view date right '+width).toBeLessThanOrEqual(r.viewDateLabel.right+1);
  if(width<=660){
   expect(r.date.bottom,'date overlaps time '+width).toBeLessThan(r.time.top+1);
   expect(r.labels[0].label.bottom,'labels overlap '+width).toBeLessThan(r.labels[1].label.top+1);
  }else{
   expect(r.date.right,'date overlaps time '+width).toBeLessThan(r.time.left+1);
  }
  for(const button of r.navButtons){
   expect(button.height,'button touch height '+width).toBeGreaterThanOrEqual(44);
   expect(button.left,'button left '+width).toBeGreaterThanOrEqual(0);
   expect(button.right,'button right '+width).toBeLessThanOrEqual(width+1);
  }
  for(let i=0;i<r.navButtons.length;i++)for(let j=i+1;j<r.navButtons.length;j++){
   const a=r.navButtons[i],b=r.navButtons[j];
   const overlapWidth=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
   const overlapHeight=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
   expect(overlapWidth*overlapHeight,'date-nav buttons overlap '+width).toBeLessThan(1);
  }
 }
});
