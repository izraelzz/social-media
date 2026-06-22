import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test('fluxo de cadastro', async ({ page }) => {
  const email = `testuser.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  await page.goto(`${BASE}/signup`);

  const emailInput = page.locator('input[type="email"]');

  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEditable();

  await emailInput.click();
  await page.keyboard.type(email);

  await expect(emailInput).toHaveValue(email);
  
  const passwordInputs = page.locator('input[type="password"]');

  await passwordInputs.first().fill(password);
  await passwordInputs.nth(1).fill(password);

  await page
    .getByRole('main')
    .getByRole('button', { name: 'Criar Conta' })
    .click();

  await expect(
    page.getByRole('button', { name: 'Sair' })
  ).toBeVisible({ timeout: 10000 });
});