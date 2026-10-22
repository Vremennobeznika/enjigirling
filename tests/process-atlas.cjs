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
  const misleading=await page.locator('#processGrid a').evaluateAll(nodes=>nodes.filter(a=>/Проверенный источник для|Техническое описание процесса/.test(a.textContent)).length);
  if(misleading)failures.push('misleading placeholder source labels remain');
  await page.close();
 }
 await browser.close();
 if(failures.length){console.error(failures.join('\n'));process.exit(1)}
 console.log('PASS: 36 cards, 3 viewports, search, reset, filter, 36 anchors and materials links');
})().catch(e=>{console.error(e);process.exit(1)});
