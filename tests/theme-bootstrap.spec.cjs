const {test,expect}=require('@playwright/test');
const paths=['index.html','calendar.html','resources.html','dictionary.html','map.html','calculator.html','compare.html','processes.html','materials.html','ai.html','ai-training.html','calculator-atlas.html','measurement-lab.html','coding.html','robotics.html'];
for(const mode of ['dark','light']){
 test('15 routes start in '+mode+' without incorrect background',async({page})=>{
  await page.addInitScript(value=>{try{localStorage.setItem('theme',value)}catch(e){}},mode);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of paths){
   await page.goto('/'+path,{waitUntil:'domcontentloaded'});
   const info=await page.evaluate(()=>({
     dark:document.documentElement.classList.contains('theme-dark'),
     light:document.documentElement.classList.contains('theme-light'),
     bg:getComputedStyle(document.documentElement).backgroundColor,
     bodyBg:getComputedStyle(document.body).backgroundColor,
     scheme:getComputedStyle(document.documentElement).colorScheme,
     persisted:localStorage.getItem('theme')
   }));
   expect(info.dark,path).toBe(mode==='dark');
   expect(info.light,path).toBe(mode==='light');
   expect(info.bg,path).toBe(mode==='dark'?'rgb(16, 16, 16)':'rgb(255, 255, 255)');
   expect(info.bodyBg,path).toBe(mode==='dark'?'rgb(16, 16, 16)':'rgb(255, 255, 255)');
   expect(info.scheme,path).toBe(mode);
   expect(info.persisted,path).toBe(mode);
  }
  expect(errors).toEqual([]);
 });
}
test('dark background appears before delayed CSS response',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('theme','dark'));
 await page.route('**/style-core.min.css',async route=>{
  await new Promise(resolve=>setTimeout(resolve,700));
  await route.continue();
 });
 await page.goto('/index.html',{waitUntil:'commit'});
 await expect.poll(async()=>page.evaluate(()=>{
  const html=document.documentElement;
  return Boolean(html&&html.classList.contains('theme-dark')&&getComputedStyle(html).backgroundColor==='rgb(16, 16, 16)');
 }),{timeout:1600}).toBe(true);
});
test('user theme toggle persists after navigation',async({page})=>{
 await page.goto('/index.html');
 const toggle=page.locator('#themeToggle');
 await expect(toggle).toBeVisible();
 await toggle.click();
 const selected=await page.evaluate(()=>localStorage.getItem('theme'));
 await page.locator('nav.eng-tabs a[href="coding.html"]').click();
 await expect(page).toHaveURL(/coding\.html$/);
 expect(await page.evaluate(()=>localStorage.getItem('theme'))).toBe(selected);
 const result=await page.evaluate(()=>({
  dark:document.documentElement.classList.contains('theme-dark'),
  light:document.documentElement.classList.contains('theme-light')
 }));
 expect(result.dark).toBe(selected==='dark');
 expect(result.light).toBe(selected==='light');
});
