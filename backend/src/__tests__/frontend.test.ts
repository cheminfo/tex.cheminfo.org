import { join } from 'node:path';

import { expect, test } from 'vitest';

import { buildApp } from '../app.ts';

const FRONTEND_ROOT = join(import.meta.dirname, 'data/frontend');
const SNIPPET =
  '<script defer src="https://datami.cheminfo.org/script.js" data-website-id="abc"></script>';

async function buildFrontendApp(trackingScript?: string, siteUrl?: string) {
  return buildApp({
    frontendRoot: FRONTEND_ROOT,
    trackingScript,
    siteUrl,
    logger: false,
  });
}

test('every routed address carries the tracking snippet', async () => {
  const app = await buildFrontendApp(SNIPPET);

  for (const url of ['/', '/index.html', '/some/deep/route']) {
    // eslint-disable-next-line no-await-in-loop -- one shared app instance, sequential injects
    const response = await app.inject({ method: 'GET', url });
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.body).toContain(SNIPPET);
  }

  await app.close();
});

test('the page carries no snippet when TRACKING_SCRIPT is unset', async () => {
  const app = await buildFrontendApp();
  const response = await app.inject({ method: 'GET', url: '/' });

  expect(response.statusCode).toBe(200);
  expect(response.body).toContain('<div id="root"></div>');
  expect(response.body).not.toContain('datami.cheminfo.org');

  await app.close();
});

function canonicalOf(html: string): URL {
  const href = /<link rel="canonical" href="(?<href>[^"]+)" \/>/.exec(html)
    ?.groups?.href;
  if (!href) throw new Error('the page carries no canonical address');
  return new URL(href);
}

test('a routed address is titled and canonicalised for its own page', async () => {
  const app = await buildFrontendApp();

  const tutorial = await app.inject({
    method: 'GET',
    url: '/tutorial/3?embed=1',
    headers: { host: 'tex.cheminfo.org' },
  });
  expect(tutorial.body).toContain('<title>LaTeX tutorial');
  const tutorialCanonical = canonicalOf(tutorial.body);
  expect(tutorialCanonical.host).toBe('tex.cheminfo.org');
  expect(tutorialCanonical.pathname).toBe('/tutorial/3');
  expect(tutorialCanonical.search).toBe('');

  const editor = await app.inject({
    method: 'GET',
    url: '/?tex=x%5E2',
    headers: { host: 'tex.cheminfo.org', accept: 'text/html' },
  });
  expect(editor.body).toContain('<title>LaTeX to SVG and PNG');
  expect(canonicalOf(editor.body).pathname).toBe('/');
  expect(canonicalOf(editor.body).search).toBe('');

  await app.close();
});

test('SITE_URL wins over the address the request arrived on', async () => {
  const app = await buildFrontendApp(undefined, 'https://tex.cheminfo.org');
  const response = await app.inject({
    method: 'GET',
    url: '/exercises',
    headers: { host: 'localhost:10422' },
  });

  expect(response.body).toContain(
    '<link rel="canonical" href="https://tex.cheminfo.org/exercises" />',
  );

  await app.close();
});

test('static assets are still served', async () => {
  const app = await buildFrontendApp(SNIPPET);
  const response = await app.inject({ method: 'GET', url: '/assets/app.js' });

  expect(response.statusCode).toBe(200);
  expect(response.body).toBe('export const fixture = true;\n');

  await app.close();
});

test('an unknown /v1/ address is a JSON 404, not the page', async () => {
  const app = await buildFrontendApp(SNIPPET);
  const response = await app.inject({ method: 'GET', url: '/v1/unknown' });

  expect(response.statusCode).toBe(404);
  expect(response.json()).toStrictEqual({ error: 'Not found' });

  await app.close();
});

test('a browser hitting /?tex= gets the page, an <img> gets the redirect', async () => {
  const app = await buildFrontendApp(SNIPPET);

  const browser = await app.inject({
    method: 'GET',
    url: '/?tex=x%5E2',
    headers: { accept: 'text/html' },
  });
  expect(browser.statusCode).toBe(200);
  expect(browser.body).toContain('<div id="root"></div>');

  const image = await app.inject({ method: 'GET', url: '/?tex=x%5E2' });
  expect(image.statusCode).toBe(302);
  expect(image.headers.location).toBe('/v1/?tex=x%5E2');

  await app.close();
});
