const {test,expect}=require('@playwright/test');
const pages=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html'];
for(const mode of ['light','dark']){
 for(const filename of pages){
  test(filename+' accessibility audit '+mode,async({page})=>{
   await page.addInitScript(value=>localStorage.setItem('theme',value),mode);
   await page.goto('http://127.0.0.1:8765/'+filename);
   await expect(page.locator('main')).toHaveCount(1);
   await expect(page.locator('h1')).toHaveCount(1);
   const results=await page.evaluate(()=>{
    const failures=[];
    for(const node of document.querySelectorAll('img:not([alt])'))failures.push('image lacks alt');
    for(const node of document.querySelectorAll('a[href]'))if(!node.textContent.trim()&&!node.getAttribute('aria-label')&&!node.querySelector('img[alt]'))failures.push('unlabeled link');
    for(const node of document.querySelectorAll('button'))if(!node.textContent.trim()&&!node.getAttribute('aria-label'))failures.push('unlabeled button');
    for(const input of document.querySelectorAll('input,select,textarea')){
      if(input.getAttribute('type')==='hidden')continue;
      if(!input.labels?.length&&!input.getAttribute('aria-label')&&!input.getAttribute('aria-labelledby'))failures.push('unlabeled control: '+(input.id||input.tagName));
    }
    return failures;
   });
   expect(results,filename+' basic accessibility').toEqual([]);
  });
 }
}

for(const filename of ['map.html','calculator.html']){
 test(filename+' uses sequential top-level section headings',async({page})=>{
  await page.goto('http://127.0.0.1:8765/'+filename);
  const levels=await page.locator('main h1, main h2, main h3, main h4').evaluateAll(nodes=>nodes.map(n=>Number(n.tagName.slice(1))));
  expect(levels[0]).toBe(1);
  for(let i=1;i<levels.length;i++)expect(levels[i],filename+' heading index '+i).toBeLessThanOrEqual(levels[i-1]+1);
 });
}
