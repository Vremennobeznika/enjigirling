const {test,expect}=require('@playwright/test');
test.describe('Инженерный календарь — проверка поведения',()=>{
 test('смена года: программист и високосный 2024',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/calendar.html');
  await expect(page.locator('#calendarGrid')).toHaveAttribute('data-ready','true');
  await page.locator('#searchInput').fill('День программиста');
  await expect(page.locator('.holiday-card')).toHaveCount(1);
  await page.locator('#yearFilter').selectOption('2024');
  await expect(page.locator('.holiday-card time')).toHaveAttribute('datetime','2024-09-12');
  await page.locator('#yearFilter').selectOption('2026');
  await expect(page.locator('.holiday-card time')).toHaveAttribute('datetime','2026-09-13');
  expect(errors).toEqual([]);
 });
 test('месяц, профессия, сброс фильтров и переход к карточке',async({page})=>{
  await page.goto('/calendar.html');
  await expect(page.locator('.holiday-card')).toHaveCount(58);
  await page.locator('.month-btn').filter({hasText:'Июль'}).click();
  await expect(page.locator('.month-btn').filter({hasText:'Июль'})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.holiday-card')).not.toHaveCount(58);
  await page.locator('#professionFilter').selectOption('architect-engineer');
  await expect(page.locator('.holiday-card')).toHaveCount(1);
  await expect(page.locator('.holiday-card .prof-chip').first()).toHaveAttribute('href',/index\.html#profession=/);
  await page.locator('#resetFilters').click();
  await expect(page.locator('.holiday-card')).toHaveCount(58);
  await expect(page.locator('.month-btn').filter({hasText:'Июль'})).toHaveAttribute('aria-pressed','false');
 });
 test('на ширинах 320 и 375 нет горизонтальной прокрутки, фильтры доступны',async({page})=>{
  for(const width of [320,375,768]){
   await page.setViewportSize({width,height:812});
   await page.goto('/calendar.html');
   await expect(page.locator('#yearFilter')).toBeVisible();
   await expect(page.locator('#searchInput')).toBeVisible();
   await expect(page.locator('#professionFilter')).toBeVisible();
   const dimensions=await page.evaluate(()=>({visible:document.documentElement.clientWidth,actual:document.documentElement.scrollWidth}));
   expect(dimensions.actual,JSON.stringify({width,...dimensions})).toBeLessThanOrEqual(dimensions.visible+2);
  }
 });
 test('редакционные даты видны, не выданы за официальный праздник',async({page})=>{
  await page.goto('/calendar.html');
  await page.locator('#searchInput').fill('День робототехники');
  await expect(page.locator('.holiday-card')).toHaveCount(1);
  await expect(page.locator('.holiday-card .holiday-status')).toContainText('требуется проверка');
 });
 test('год 2024 не выдаёт введённый в 2025 праздник за действовавший ранее',async({page})=>{
  await page.goto('/calendar.html');
  await page.locator('#yearFilter').selectOption('2024');
  await page.locator('#searchInput').fill('День сварщика');
  await expect(page.locator('.holiday-card')).toHaveCount(0);
  await page.locator('#yearFilter').selectOption('2026');
  await expect(page.locator('.holiday-card time')).toHaveAttribute('datetime','2026-05-29');
 });
});
