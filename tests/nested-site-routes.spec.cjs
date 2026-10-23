const {test,expect}=require('@playwright/test');
// Each published HTML document, beyond the nine primary engineering sections.
// The apps have their own layouts and must not be forced into the engineering navigation shell.
const routes=[
 'ai-training.html','ai.html','articles/utopia-math-analysis.html',
 'calculator-atlas.html','calendar/index.html','chroma/index.html',
 'everyday/index.html','life/index.html','life/planner/index.html',
 'measurement-lab.html','mood-layers/index.html','plants/index.html','shopping/index.html'
];
for(const route of routes){
 for(const width of [320,390,1440]){
  test('nested route serves a usable viewport: '+route+' at '+width+'px',async({page})=>{
   test.setTimeout(45000);
   await page.setViewportSize({width,height:850});
   const exceptions=[],badLocal=[];
   page.on('pageerror',e=>exceptions.push(e.message));
   page.on('response',r=>{
    const url=new URL(r.url());
    if(url.origin==='http://127.0.0.1:8765' && r.status()>=400)
      badLocal.push(r.status()+' '+url.pathname);
   });
   const response=await page.goto('/'+route,{waitUntil:'load'});
   expect(response.status(),route+' HTTP status').toBe(200);
   await expect(page.locator('body')).toBeVisible();
   const doc=await page.evaluate(()=>({
    title:document.title.trim(),
    text:document.body.innerText.trim().length,
    screen:document.documentElement.clientWidth,
    width:document.documentElement.scrollWidth,
    bodyWidth:document.body.scrollWidth
   }));
   expect(doc.title.length,route+' missing title').toBeGreaterThan(3);
   expect(doc.text,route+' appears empty').toBeGreaterThan(20);
   expect(doc.width,route+' horizontal overflow '+JSON.stringify(doc)).toBeLessThanOrEqual(doc.screen+2);
   expect(doc.bodyWidth,route+' body overflow '+JSON.stringify(doc)).toBeLessThanOrEqual(doc.screen+2);
   expect(exceptions,route+' uncaught startup errors').toEqual([]);
   expect(badLocal,route+' missing local fetches').toEqual([]);
  });
 }
}
