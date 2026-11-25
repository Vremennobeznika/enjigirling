const {test,expect}=require('@playwright/test');
const routes=['index','calendar','resources','dictionary','map','calculator','compare','processes','materials','robotics','coding','ai','iishnitsa','ai-training','measurement-lab','calculator-atlas'];
for(const width of [320,390,768,1024,1280,1920]) for(const theme of ['light','dark']){
 test('shared layout '+width+' '+theme,async({page})=>{
  test.setTimeout(180000);
  await page.setViewportSize({width,height:900});
  await page.addInitScript(t=>localStorage.setItem('theme',t),theme);
  let reference;
  for(const route of routes){
   await page.goto(route+'.html',{waitUntil:'domcontentloaded'});
   await expect(page.locator('html')).toHaveClass(new RegExp('theme-'+theme));
   const geometry=await page.evaluate(()=>{
    const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
    const top=document.querySelector('.site-topbar'),nav=document.querySelector('.site-nav-wrap');
    return {top:rect(top),nav:rect(nav),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
   });
   expect(geometry.overflow,route+' overflow').toBeLessThanOrEqual(1);
   expect(geometry.top.height,route+' topbar').toBeCloseTo(68,0);
   if(!reference)reference=geometry;
   for(const part of ['top','nav'])for(const key of ['x','y','width','height']) expect(Math.abs(geometry[part][key]-reference[part][key]),route+' '+part+' '+key).toBeLessThanOrEqual(2);
  }
 });
}
