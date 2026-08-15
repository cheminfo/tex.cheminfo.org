import { expect, test } from 'vitest';

import { buildApp } from '../app.ts';
import type { FastifyTyped } from '../types.ts';

const FORWARDED = '203.0.113.7';

async function buildIpApp(trustProxy: boolean | number | string) {
  const app = await buildApp({ trustProxy, logger: false });
  (app as FastifyTyped).get('/v1/ip', async (request) => ({ ip: request.ip }));
  return app;
}

test('a trusted proxy X-Forwarded-For becomes request.ip', async () => {
  const app = await buildIpApp('127.0.0.1');
  const response = await app.inject({
    method: 'GET',
    url: '/v1/ip',
    remoteAddress: '127.0.0.1',
    headers: { 'x-forwarded-for': FORWARDED },
  });

  expect(response.json()).toStrictEqual({ ip: FORWARDED });

  await app.close();
});

test('an untrusted peer X-Forwarded-For is ignored', async () => {
  const app = await buildIpApp(false);
  const response = await app.inject({
    method: 'GET',
    url: '/v1/ip',
    remoteAddress: '127.0.0.1',
    headers: { 'x-forwarded-for': FORWARDED },
  });

  expect(response.json()).toStrictEqual({ ip: '127.0.0.1' });

  await app.close();
});
