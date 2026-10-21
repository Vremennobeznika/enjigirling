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
 test(filename+' has correctly nested primary calculator headings',async({page})=>{
  await page.goto('http://127.0.0.1:8765/'+filename);
  await expect(page.locator('main h1')).toHaveCount(1);
  const levels=await page.locator('main .calc-heading').evaluateAll(nodes=>nodes.map(n=>Number(n.tagName.slice(1))));
  expect(levels.length).toBeGreaterThan(0);
  expect(levels[0]).toBe(2);
  for(const level of levels)expect(level).toBeGreaterThanOrEqual(2);
 });
}

for(const filename of pages){
 test(filename+' keyboard skip link and navigation references',async({page})=>{
  await page.goto('http://127.0.0.1:8765/'+filename);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await expect(page.locator('.skip-link')).toHaveAttribute('href','#main-content');
  const broken=await page.evaluate(()=>{
   const ids=new Set(Array.from(document.querySelectorAll('[id]'),el=>el.id));
   const failures=[];
   for(const el of document.querySelectorAll('[aria-controls]')){
    if(!ids.has(el.getAttribute('aria-controls')))failures.push('aria-controls: '+el.getAttribute('aria-controls'));
   }
   for(const el of document.querySelectorAll('label[for]')){
    if(!ids.has(el.htmlFor))failures.push('label for: '+el.htmlFor);
   }
   return failures;
  });
  expect(broken,filename+' broken accessibility references').toEqual([]);
 });
}
