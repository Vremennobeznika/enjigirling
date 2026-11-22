'use strict';
const {test,expect}=require('@playwright/test');
const drafts=[
 ['academy-draft.html','E01',26,'2500'],
 ['academy-draft-part2.html','E05',24,'1250'],
 ['academy-draft-part3.html','E10',48,'0,2']
];
for(const [pageName,lesson,count,answer] of drafts){
 test(pageName+' answers, reload, error feedback and mobile overflow',async({page})=>{
  await page.goto('/'+pageName);
  const forms=page.locator('form[data-id]');
  await expect(forms).toHaveCount(count);
  const form=page.locator('form[data-id="'+lesson+'-1"]');
  await form.locator('[name="answer"]').fill('not-a-number');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('.result')).toContainText('Введите конечное число');
  await form.locator('[name="answer"]').fill('999999');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('.result')).toContainText('Неверно');
  await form.locator('[name="answer"]').fill(answer);
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('.result')).toContainText('Верно');
  await expect(page.locator('#count')).toContainText('1 из '+count);
  await page.reload();
  await expect(page.locator('#count')).toContainText('1 из '+count);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  expect(overflow).toBe(false);
 });
}
test('original lessons: persistence, reset, keyboard and no overflow',async({page})=>{
 await page.goto('/engineering-lessons.html');
 await expect(page.locator('form[data-task]')).toHaveCount(6);
 const form=page.locator('form[data-task="ohm"]');
 await form.locator('[name="answer"]').fill('20');
 await form.locator('[name="answer"]').press('Enter');
 await expect(form.locator('[role="status"]')).toContainText('Верно');
 await expect(page.locator('#progressText')).toHaveText('1 из 6');
 await page.reload();
 await expect(page.locator('#progressText')).toHaveText('1 из 6');
 await page.locator('#resetProgress').click();
 await expect(page.locator('#progressText')).toHaveText('0 из 6');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
 expect(overflow).toBe(false);
});
test('two tabs preserve independent original lesson credits',async({context})=>{
 const a=await context.newPage(),b=await context.newPage();
 await a.goto('/engineering-lessons.html');
 await b.goto('/engineering-lessons.html');
 const fa=a.locator('form[data-task="ohm"]'),fb=b.locator('form[data-task="signal"]');
 await fa.locator('[name="answer"]').fill('20');
 await fa.locator('button[type="submit"]').click();
 await fb.locator('[name="answer"]').fill('50');
 await fb.locator('button[type="submit"]').click();
 await a.reload();
 await expect(a.locator('#progressText')).toHaveText('2 из 6');
 await b.close();await a.close();
});
