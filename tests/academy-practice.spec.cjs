const { test, expect } = require('@playwright/test');

test('academy lookup, signed decimal answer and restored credit', async ({ page }) => {
  await page.goto('/academy.html#C04');
  const form = page.locator('form[data-id="C04-2"]');
  await expect(form).toBeVisible();
  await form.getByRole('textbox').fill('Infinity');
  await form.getByRole('button').click();
  await expect(form.getByRole('status')).toContainText('конечное число');
  await form.getByRole('textbox').fill('−0,1');
  await form.getByRole('textbox').press('Enter');
  await expect(form.getByRole('status')).toContainText('Верно');
  await page.reload();
  await expect(page.locator('#progress')).toContainText('1 из 98');
  await page.getByRole('searchbox').fill('Modbus');
  await expect(page.locator('.lesson:visible')).toHaveCount(1);
  await expect(page.locator('.lesson:visible > summary')).toContainText('A09');
  await page.getByRole('searchbox').fill('несуществующий урок');
  await expect(page.locator('#matches')).toContainText('нет');
});
