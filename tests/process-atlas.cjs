const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({ headless: true });
 const failures=[];
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:850}});
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.goto('http://127.0.0.1:8765/processes.html');
  await page.locator('#processGrid[data-ready="true"]').waitFor();
  const count=await page.locator('#processGrid article.atlas-card').count();
  if(count!==36)failures.push(width+': expected 36 cards, got '+count);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  if(overflow)failures.push(width+': horizontal overflow');
  await page.locator('#processSearch').fill('сварка');
  const n=await page.locator('#processGrid article.atlas-card').count();
  if(n<2)failures.push(width+': welding search found '+n);
  await page.getByRole('button',{name:'Сбросить фильтры'}).click();
  if(await page.locator('#processGrid article.atlas-card').count()!==36)failures.push(width+': reset failed');
  await page.locator('#processCategory').selectOption('inspection');
  if(await page.locator('#processGrid article.atlas-card').count()!==6)failures.push(width+': inspection filter count mismatch');
  if(errors.length)failures.push(width+': JS error: '+errors.join('; '));
  await page.close();
 }
 for(const id of ['casting','welding','cutting','heat','additive','inspection','mig-mag','tig','ultrasonic','radiographic','dye','hardness','forging','rolling','stamping','injection-molding','extrusion','grinding','surface-finishing','assembly','pasteurization','food-drying','fermentation','food-packaging','spinning','weaving','knitting','textile-finishing','sewing','sawmilling','wood-drying','pcb-assembly','electronic-inspection','chemical-mixing','distillation','industrial-filtration']){
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:8765/processes.html#'+id);
  await page.locator('#processGrid[data-ready="true"]').waitFor();
  if(await page.locator('#'+id).count()!==1) failures.push(id+': anchor missing');
  const links=await page.locator('#'+id+' a[href^="materials.html#"]').count();
  if(!['casting','rolling','surface-finishing','assembly','pasteurization','food-drying','fermentation','food-packaging','spinning','weaving','knitting','textile-finishing','sewing','sawmilling','wood-drying','pcb-assembly','electronic-inspection','chemical-mixing','distillation','industrial-filtration'].includes(id) && links===0) failures.push(id+': no material links');
  await page.close();
 }
 // Regression checks for linked search and corrected process classification.
 {
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto('http://127.0.0.1:8765/processes.html');
  await page.locator('#processGrid[data-ready="true"]').waitFor();
  await page.locator('#processSearch').fill('09г2с');
  if(await page.locator('#processGrid #welding').count()!==1)failures.push('linked material search: 09Г2С');
  await page.locator('.filter-reset').click();
  await page.locator('#processSearch').fill('механик');
  if(await page.locator('#processGrid #welding').count()!==1)failures.push('linked profession search: механик');
  await page.locator('.filter-reset').click();
  await page.locator('#processCategory').selectOption('forming');
  if(await page.locator('#processGrid #grinding').count()!==1)failures.push('grinding should be categorized under material removal');
  await page.locator('.filter-reset').click();
  if(await page.locator('#processGrid .process-step-list').count()!==36)failures.push('steps should be structured in all cards');
  const missingLabels=await page.locator('#processGrid a[href]').evaluateAll(nodes=>nodes.filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')).length);
  if(missingLabels)failures.push(missingLabels+' unlabeled atlas links');
  const missingSourceTitles=await page.evaluate(()=>window.engineeringProcesses.flatMap(p=>(p.sources||[]).filter(s=>!s.title||!s.url)).length);
  if(missingSourceTitles)failures.push(missingSourceTitles+' source records with missing title or URL');
  const misleading=await page.locator('#processGrid a').evaluateAll(nodes=>nodes.filter(a=>/Проверенный источник для|Техническое описание процесса/.test(a.textContent)).length);
  if(misleading)failures.push('misleading placeholder source labels remain');
  await page.close();
 }

 // Sector coverage, sorting, combined filters, deep links, mobile/dark-mode regressions.
 {
  const page=await browser.newPage({viewport:{width:320,height:740}});
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.goto('http://127.0.0.1:8765/processes.html');
  await page.locator('#processGrid[data-ready="true"]').waitFor();
  const sectors={metals:9,polymers:2,food:4,textiles:5,wood:2,electronics:2,chemicals:3,general:9};
  for(const [sector,count] of Object.entries(sectors)){
   await page.locator('#processIndustry').selectOption(sector);
   const actual=await page.locator('#processGrid article.atlas-card').count();
   if(actual!==count)failures.push('sector '+sector+': expected '+count+', got '+actual);
  }
  await page.locator('#processIndustry').selectOption('food');
  await page.locator('#processCategory').selectOption('joining');
  if(await page.locator('#processGrid article.atlas-card').count()!==1)failures.push('combined category + industry filter mismatch');
  await page.locator('#processSearch').fill('no_matches_9999');
  if(await page.locator('#processGrid article.atlas-card').count()!==0)failures.push('empty state mismatch');
  await page.locator('.filter-reset').click();
  if(await page.locator('#processGrid article.atlas-card').count()!==36)failures.push('all filters reset failed');
  await page.locator('#processSort').selectOption('az');
  const names=await page.locator('#processGrid article.atlas-card h2').allTextContents();
  if(names.some((name,i)=>i>0&&names[i-1].localeCompare(name,'ru')>0))failures.push('Cyrillic sorting failed');
  await page.locator('#processIndustry').selectOption('food');
  await page.evaluate(()=>{location.hash='#welding'});
  await page.locator('#welding').waitFor();
  if(await page.locator('#processGrid article.atlas-card').count()!==36)failures.push('deep link did not restore full catalog');
  if(await page.locator('#welding').getAttribute('tabindex')!=='-1')failures.push('deep-linked card is not focusable');
  await page.locator('.theme-toggle').click();
  await page.locator('#processIndustry').selectOption('textiles');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  if(overflow)failures.push('process controls overflow mobile in dark theme');
  if(errors.length)failures.push('new sector UI JS errors '+errors.join('; '));
  await page.close();
 }

 await browser.close();
 if(failures.length){console.error(failures.join('\n'));process.exit(1)}
 console.log('PASS: 36 cards, 8 industries, 3 viewports, deep links, search, sorting, filters, sources and themes');
})().catch(e=>{console.error(e);process.exit(1)});
