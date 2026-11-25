const {test,expect}=require('@playwright/test');
const pages=['index','calendar','resources','dictionary','map','calculator','compare','processes','materials','robotics','coding','ai','iishnitsa','ai-training','measurement-lab','calculator-atlas'];
for(const width of [390,1280]){
 test('Unified typography at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const name of pages){
   await page.goto(name+'.html');
   const values=await page.locator('main#main-content').evaluate(el=>{
    const sample=tag=>Array.from(el.querySelectorAll(tag)).map(n=>({size:parseFloat(getComputedStyle(n).fontSize),font:getComputedStyle(n).fontFamily}));
    return {root:parseFloat(getComputedStyle(document.documentElement).fontSize),body:parseFloat(getComputedStyle(el).fontSize),h1:sample('h1'),h2:sample('h2'),h3:sample('h3'),p:sample('p')};
   });
   expect(values.body,name).toBe(values.root);
   expect(values.h1.length,name+' main heading').toBeGreaterThan(0);
   for(const [tag,expected] of Object.entries({h1:Math.max(1.625*values.root,Math.min(width*.025,2*values.root)),h2:Math.max(1.25*values.root,Math.min(width*.018,1.5*values.root)),h3:1.125*values.root,p:values.root})){
    for(const v of values[tag]){
     expect(v.size,name+' '+tag).toBeCloseTo(expected,1);
     expect(v.font,name+' '+tag).toMatch(/^Arial/i);
    }
   }
  }
 });
}
