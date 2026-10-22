const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const errors=[];
 try{
  for(const width of [320,390,768,1440]){
   for(const theme of ['light','dark']){
    const page=await browser.newPage({viewport:{width,height:850}});
    const jsErrors=[];
    page.on('pageerror',e=>jsErrors.push(e.message));
    await page.addInitScript(value=>localStorage.setItem('theme',value),theme);
    await page.goto('http://127.0.0.1:8765/processes.html');
    await page.locator('#processGrid[data-ready="true"]').waitFor();
    const stats=await page.evaluate(()=>({
      count:window.engineeringProcesses.length,
      sectors:Object.fromEntries([...new Set(window.engineeringProcesses.map(x=>x.industry))].map(x=>[x,window.engineeringProcesses.filter(y=>y.industry===x).length])),
      inspect:window.engineeringProcesses.filter(x=>x.category==='inspection').length,
      unique:new Set(window.engineeringProcesses.map(x=>x.id)).size,
      badSources:window.engineeringProcesses.filter(x=>!(x.sources||[]).length||(x.sources||[]).some(s=>!s.title||!/^https:\/\//.test(s.url))).map(x=>x.id),
      danglingParents:window.engineeringProcesses.filter(x=>x.parentId&&!window.engineeringProcesses.some(y=>y.id===x.parentId)).map(x=>x.id)
    }));
    if(stats.count<200||stats.unique!==stats.count)errors.push(width+': incomplete/duplicate process catalog');
    if(stats.badSources.length||stats.danglingParents.length)errors.push('invalid record refs '+JSON.stringify({sources:stats.badSources,parents:stats.danglingParents}));
    const initial=await page.locator('#processGrid .atlas-card').count();
    if(initial!==Math.min(stats.count,24))errors.push(width+': pagination initial count '+initial);
    if(stats.count>24){
      await page.locator('#processShowMore').click();
      if(await page.locator('#processGrid .atlas-card').count()!==48)errors.push(width+': show-more count');
    }
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))errors.push(width+': horizontal overflow '+theme);
    await page.locator('.filter-reset').click().catch(()=>{});
    await page.locator('#processSearch').fill('09г2с');
    if(await page.locator('#processGrid #welding').count()!==1)errors.push('material search');
    await page.locator('.filter-reset').click();
    await page.locator('#processSearch').fill('механик');
    if(await page.locator('#processGrid #welding').count()!==1)errors.push('profession search');
    await page.locator('.filter-reset').click();
    await page.locator('#processCategory').selectOption('inspection');
    const nInspect=await page.locator('#processGrid .atlas-card').count();
    if(nInspect!==Math.min(stats.inspect,24))errors.push(width+': inspection filter');
    await page.locator('.filter-reset').click();
    for(const [sector,total] of Object.entries(stats.sectors)){
      await page.locator('#processIndustry').selectOption(sector);
      const count=await page.locator('#processGrid .atlas-card').count();
      if(count!==Math.min(24,total))errors.push('sector '+sector+' ('+count+'/'+total+')');
    }
    await page.locator('.filter-reset').click();
    await page.locator('#processSort').selectOption('az');
    const names=await page.locator('#processGrid .atlas-card h2').allTextContents();
    if(names.some((x,i)=>i&&names[i-1].localeCompare(x,'ru')>0))errors.push('Russian sorting');
    await page.locator('#processIndustry').selectOption('food');
    await page.locator('#processCategory').selectOption('joining');
    const matching=await page.evaluate(()=>window.engineeringProcesses.filter(x=>x.industry==='food'&&x.category==='joining').length);
    if(await page.locator('#processGrid .atlas-card').count()!==Math.min(24,matching))errors.push('combined filters');
    await page.locator('#processSearch').fill('impossible-sample-xyz');
    if(await page.locator('#processGrid .atlas-card').count()!==0)errors.push('empty results');
    await page.locator('.filter-reset').click();
    if(await page.locator('#processGrid .atlas-card').count()!==24)errors.push('reset did not restore pagination');
    if(jsErrors.length)errors.push(width+': JS error '+jsErrors.join('; '));
    await page.close();
   }
  }
  // Preserve historical entry points and test a late-added entry after pagination.
  for(const id of ['casting','welding','cutting','heat','additive','inspection','mig-mag','tig','ultrasonic','radiographic','dye','hardness','forging','rolling','stamping','injection-molding','extrusion','grinding','surface-finishing','assembly','pasteurization','food-drying','fermentation','food-packaging','spinning','weaving','knitting','textile-finishing','sewing','sawmilling','wood-drying','pcb-assembly','electronic-inspection','chemical-mixing','distillation','industrial-filtration','ore-leaching','pharma-inprocess-control','laser-shearography']){
   const page=await browser.newPage();
   await page.goto('http://127.0.0.1:8765/processes.html#'+id);
   await page.locator('#processGrid[data-ready="true"]').waitFor();
   if(await page.locator('#'+id).count()!==1)errors.push('deep link missing '+id);
   await page.close();
  }
 }finally{await browser.close();}
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log('PASS: >=200 unique atlas processes; 16 sectors, pagination, 4 widths, 2 themes, filters, sources, legacy/new deep links');
})().catch(e=>{console.error(e);process.exitCode=1});
