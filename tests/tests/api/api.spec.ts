import { test, expect, request } from '@playwright/test';

const BASE = 'http://localhost:8080';

test('POST /auth/signup - success', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `e2e.api.signup.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  const res = await api.post('/auth/signup', {
    data: { email, password },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty('id');
  expect(body.email).toBe(email);

  await api.dispose();
});

test('POST /auth/signup - duplicate email returns 409', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `e2e.api.dup.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  // first signup should succeed
  const first = await api.post('/auth/signup', { data: { email, password } });
  expect(first.status()).toBe(200);

  // second signup with same email should return 409
  const second = await api.post('/auth/signup', { data: { email, password } });
  expect(second.status()).toBe(409);
  const body = await second.json();
  expect(body).toHaveProperty('message');
  expect(body.message).toMatch(/E-mail já está em uso|E-mail já cadastrado/);

  await api.dispose();
});

test('POST /auth/signin - success', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `e2e.api.signin.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  // create the user first
  const signup = await api.post('/auth/signup', { data: { email, password } });
  expect(signup.status()).toBe(200);

  const signin = await api.post('/auth/signin', { data: { email, password } });
  expect(signin.status()).toBe(200);
  const body = await signin.json();
  expect(body.email).toBe(email);
  expect(body).toHaveProperty('id');

  await api.dispose();
});

test('POST /auth/signin - wrong password returns 401', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `e2e.api.signin.wrong.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  // create the user first
  const signup = await api.post('/auth/signup', { data: { email, password } });
  expect(signup.status()).toBe(200);

  const signin = await api.post('/auth/signin', { data: { email, password: 'WrongPassword@123' } });
  expect(signin.status()).toBe(401);
  const body = await signin.json();
  expect(body).toHaveProperty('message');
  expect(body.message).toBe('Credenciais inválidas');

  await api.dispose();
});
