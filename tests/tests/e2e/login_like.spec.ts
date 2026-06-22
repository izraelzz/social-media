import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test('fluxo de login e curtida com e sem autenticação', async ({ page }) => {
  const email = `testuser.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  // Fluxo de cadastro
  await page.goto(`${BASE}/signup`);

  const signupEmail = page.locator('input[type="email"]');

  await expect(signupEmail).toBeVisible();
  await expect(signupEmail).toBeEditable();

  await signupEmail.click();
  await page.keyboard.type(email);

  await expect(signupEmail).toHaveValue(email);

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

  // Logout
  await page.getByRole('button', { name: 'Sair' }).click();

  // Curtir sem autenticação
  const firstPost = page.getByRole('listitem').first();

  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe(
      'Você precisa estar autenticado para curtir posts!'
    );
    await dialog.accept();
  });

  await firstPost
    .getByRole('button', { name: /Curtir|Curtido/ })
    .click();

  // Login
  await page.goto(`${BASE}/signin`);

  const signinEmail = page.locator('input[type="email"]');

  await expect(signinEmail).toBeVisible();
  await expect(signinEmail).toBeEditable();

  await signinEmail.click();
  await page.keyboard.type(email);

  await expect(signinEmail).toHaveValue(email);

  await passwordInputs.first().fill(password);

  await page
    .getByRole('main')
    .getByRole('button', { name: 'Entrar' })
    .click();

  await expect(
    page.getByRole('button', { name: 'Sair' })
  ).toBeVisible({ timeout: 10000 });

  // Curtir com autenticação
  const authenticatedPost = page.getByRole('listitem').first();

  await expect(authenticatedPost).toBeVisible();

  await authenticatedPost
    .getByRole('button', { name: /Curtir|Curtido/ })
    .click();

  await expect(
    authenticatedPost.getByRole('button', { name: /Curtido/ })
  ).toBeVisible();
});