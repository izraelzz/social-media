import { test, expect, request } from '@playwright/test';

const BASE = 'http://localhost:8080';

// Teste de cadastro
test('POST /signup - teste cadastro sucedido', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `testuser.${Date.now()}@example.com`;
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

test('POST /signup - teste email duplicado deve retornar erro 409', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `testuser.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  // Primeiro cadastro
  const first = await api.post('/auth/signup', { data: { email, password } });
  expect(first.status()).toBe(200);

  // Segundo cadastro no mesmo email
  const second = await api.post('/auth/signup', { data: { email, password } });
  expect(second.status()).toBe(409);
  const body = await second.json();
  expect(body).toHaveProperty('message');
  expect(body.message).toBe('E-mail já está em uso');

  await api.dispose();
});

test('POST /signin - teste login sucedido', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `testuser.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  // Cadastro de usuário
  const signup = await api.post('/auth/signup', { data: { email, password } });
  expect(signup.status()).toBe(200);

  // Login
  const signin = await api.post('/auth/signin', { data: { email, password } });
  expect(signin.status()).toBe(200);
  const body = await signin.json();
  expect(body.email).toBe(email);
  expect(body).toHaveProperty('id');

  await api.dispose();
});

test('POST /signin - teste senha incorreta deve retornar 401', async () => {
  const api = await request.newContext({ baseURL: BASE });
  const email = `testuser.${Date.now()}@example.com`;
  const password = 'FakePassword@123';

  // Criar usuário
  const signup = await api.post('/auth/signup', { data: { email, password } });
  expect(signup.status()).toBe(200);

  // Login com senha incorreta
  const signin = await api.post('/auth/signin', { data: { email, password: 'WrongPassword@123' } });
  expect(signin.status()).toBe(401);
  const body = await signin.json();
  expect(body).toHaveProperty('message');
  expect(body.message).toBe('Credenciais inválidas');

  await api.dispose();
});
