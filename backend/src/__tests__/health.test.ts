import { expect, test } from 'vitest';

import { buildApp } from '../app.ts';

test('GET /v1/health returns ok', async () => {
  const app = await buildApp();
  const response = await app.inject({ method: 'GET', url: '/v1/health' });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toStrictEqual({ status: 'ok' });

  await app.close();
});
