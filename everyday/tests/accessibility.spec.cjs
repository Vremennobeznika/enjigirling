const {test,expect}=require('@playwright/test');

test('Dark and light themes keep primary UI and finance screens readable',async({page})=>{
 await page.goto('/everyday/');
 for(const theme of ['dark','light']){
  if(theme==='light')await page.locator('#themeToggle').click();
  await expect(page.locator('body')).toHaveAttribute('data-theme',theme);
  for(const width of [320,375,768,1366]){
   await page.setViewportSize({width,height:860});
   for(const id of ['overview','planner','money','shopping','home','settings']){
    await page.locator('#mainNav [data-view="'+id+'"]').click();
    const stats=await page.evaluate(()=>{
     const body=document.body,root=getComputedStyle(body);
     const panel=document.querySelector('main .page:not([hidden]) .panel');
     const primary=panel?.querySelector('button.primary')||document.querySelector('main .page:not([hidden]) button.primary');
     const norm=value=>{
      const color=value.trim();
      const rgb=color.startsWith('#')?[parseInt(color.slice(1,3),16),parseInt(color.slice(3,5),16),parseInt(color.slice(5,7),16)]:color.match(/\d+(?:\.\d+)?/g).slice(0,3).map(Number);
      const [r,g,b]=rgb;
      const scale=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};
      return .2126*scale(r)+.7152*scale(g)+.0722*scale(b);
     };
     const contrast=(a,b)=>{const x=norm(a),y=norm(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
     const panelStyle=getComputedStyle(panel);
     const panelContrast=contrast(panelStyle.color,panelStyle.backgroundColor);
     const muted=contrast(root.getPropertyValue('--muted').trim(),panelStyle.backgroundColor);
     const accent=primary?contrast(getComputedStyle(primary).color,getComputedStyle(primary).backgroundColor):21;
     return {panelContrast,mutedContrast:muted,accentContrast:accent,scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth};
    });
    expect(stats.scroll,id+' overflow at '+theme+' '+width).toBeLessThanOrEqual(stats.width+1);
    expect(stats.panelContrast,id+' unreadable main text at '+theme+' '+width).toBeGreaterThanOrEqual(4.5);
    expect(stats.mutedContrast,id+' unreadable labels at '+theme+' '+width).toBeGreaterThanOrEqual(4.5);
    expect(stats.accentContrast,id+' unreadable primary button at '+theme+' '+width).toBeGreaterThanOrEqual(4.5);
   }
  }
 }
});

test('Core controls have accessible names and keyboard-operable navigation',async({page})=>{
 await page.goto('/everyday/');
 await page.keyboard.press('Tab');
 const focused=await page.evaluate(()=>document.activeElement?.getAttribute('href'));
 expect(focused).toBe('#content');
 for(const tab of await page.locator('#mainNav button').all()){
  const name=await tab.textContent();
  expect(name.trim()).not.toBe('');
 }
 for(const view of ['planner','money','shopping','home','settings']){
  await page.locator('#mainNav [data-view="'+view+'"]').click();
  const nameless=await page.locator('main .page:visible button:visible,main .page:visible input:visible,main .page:visible select:visible').evaluateAll(els=>{
   const describe=el=>{
    if(el.type==='hidden'||el.closest('[hidden]'))return true;
    if(el.getAttribute('aria-label')||el.getAttribute('title'))return true;
    if(el.tagName==='BUTTON')return Boolean(el.textContent.trim());
    const label=el.closest('label')||document.querySelector('label[for="'+el.id+'"]');
    return Boolean(label&&label.textContent.trim());
   };
   return els.filter(el=>!describe(el)).map(el=>el.outerHTML.slice(0,180));
  });
  expect(nameless,'Missing accessible names in '+view+': '+nameless.join(' | ')).toEqual([]);
 }
});
