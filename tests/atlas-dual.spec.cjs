const {test,expect}=require('@playwright/test');

for(const [pageName,filterId,expectedP,expectedM] of [
 ['processes.html','processIndustry',12,25],
 ['materials.html','materialIndustry',12,25]
]){
 test(pageName+' — choose food sector, export both catalogs, retain filtering',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pageName);
  await expect(page.locator('#atlasAiPackage')).toHaveCount(0);
  await page.locator('#'+filterId).selectOption('food');
  await expect(page.locator('#'+filterId)).toHaveValue('food');
  await page.locator('.site-ai-link').click();
  await expect(page).toHaveURL(/ai\.html$/);
  await expect(page.locator('#atlasAiMd')).toBeDisabled();
  await page.locator('#atlasAiSector').selectOption('food');
  await expect(page.locator('#atlasAiStatus')).toContainText(expectedP+' процессов');
  await expect(page.locator('#atlasAiStatus')).toContainText(expectedM+' материалов');
  const [md]=await Promise.all([page.waitForEvent('download'),page.locator('#atlasAiMd').click()]);
  expect(md.suggestedFilename()).toBe('enjigirling-atlas-food-both.md');
  await page.locator('#atlasAiScope').selectOption('materials');
  const [json]=await Promise.all([page.waitForEvent('download'),page.locator('#atlasAiJson').click()]);
  expect(json.suggestedFilename()).toBe('enjigirling-atlas-food-materials.json');
  await page.locator('#atlasAiSector').selectOption('all');
  const [all]=await Promise.all([page.waitForEvent('download'),page.locator('#atlasAiJsonl').click()]);
  expect(all.suggestedFilename()).toBe('enjigirling-atlas-all-materials.jsonl');
  expect(errors).toEqual([]);
 });
}

test('AI hub — ZIP includes all sectors without network services',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('ai.html');
 await expect(page.locator('#atlasAiSector')).toBeVisible();
 await expect(page.locator('#atlasAiMd')).toBeDisabled();
 const [archive]=await Promise.all([page.waitForEvent('download'),page.locator('#atlasAiZip').click()]);
 expect(archive.suggestedFilename()).toBe('enjigirling-atlas-16-sectors.zip');
 await expect(page.locator('#atlasAiStatus')).toContainText('37 файлов');
 await page.locator('#atlasAiSector').selectOption('metals');
 await expect(page.locator('#atlasAiStatus')).toContainText('36 процессов');
 await expect(page.locator('#atlasAiStatus')).toContainText('37 материалов');
 expect(errors).toEqual([]);
});

test('Material and process cards preserve deep-link navigation',async({page})=>{
 await page.goto('materials.html#steel-20');
 await expect(page.locator('#steel-20')).toBeVisible();
 await page.goto('processes.html#welding');
 await expect(page.locator('#welding')).toBeVisible();
});
