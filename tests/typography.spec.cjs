const {test,expect}=require('@playwright/test');
const pages=['index','calendar','resources','dictionary','map','calculator','compare','processes','materials','robotics','coding','ai','iishnitsa','ai-training','measurement-lab','calculator-atlas'];
for(const width of [390,1280]) for(const theme of ['light','dark']) for(const name of pages){
 test(name+' typography '+width+' '+theme,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(t=>localStorage.setItem('theme',t),theme);
  await page.goto(name+'.html',{waitUntil:'domcontentloaded'});
  await expect(page.locator('html')).toHaveClass(new RegExp('theme-'+theme));
  const values=await page.locator('main#main-content').evaluate(el=>{
    const sample=tag=>Array.from(el.querySelectorAll(tag)).map(n=>({size:parseFloat(getComputedStyle(n).fontSize),font:getComputedStyle(n).fontFamily}));
    return {width:innerWidth,root:parseFloat(getComputedStyle(document.documentElement).fontSize),body:parseFloat(getComputedStyle(el).fontSize),h1:sample('h1'),h2:sample('h2'),h3:sample('h3'),p:sample('p'),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
  expect(values.body).toBe(values.root);
  expect(values.h1.length).toBeGreaterThan(0);
  for(const [tag,expected] of Object.entries({h1:Math.max(1.625*values.root,Math.min(values.width*.025,2*values.root)),h2:Math.max(1.25*values.root,Math.min(values.width*.018,1.5*values.root)),h3:1.125*values.root,p:values.root})){
    for(const v of values[tag]){
     expect(v.size,name+' '+tag).toBeCloseTo(expected,1);
     expect(v.font,name+' '+tag).toMatch(/^Arial/i);
    }
  }
  expect(values.overflow,'Horizontal page overflow').toBeLessThanOrEqual(1);
 });
}
