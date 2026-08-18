import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { pageMetaFor } from '../pageMeta.ts';
import { readRoutes } from '../routes.ts';
import { buildSitemap } from '../sitemap.ts';

function rootHolding(routes: unknown): string {
  const root = mkdtempSync(join(tmpdir(), 'tex-sitemap-'));
  writeFileSync(join(root, 'routes.json'), JSON.stringify(routes));
  return root;
}

const BUILT = [
  { path: '/', title: 'Editor', description: 'Write a formula.' },
  { path: '/tutorial', title: 'Tutorial', description: 'The notation.' },
  {
    path: '/tutorial/1',
    title: 'A formula is text — LaTeX tutorial',
    description: 'Everything you type is math.',
  },
  { path: '/exercises', title: 'Exercises', description: 'Practise it.' },
];

test('the addresses come from the build that knows them', () => {
  expect(readRoutes(rootHolding(BUILT))).toStrictEqual(BUILT);
});

test('without a build, the pages that always exist are still listed', () => {
  expect(
    readRoutes('/nowhere-at-all').map((route) => route.path),
  ).toStrictEqual(['/', '/tutorial', '/exercises']);
});

test('a routes file we did not write is ignored rather than trusted', () => {
  const fallback = ['/', '/tutorial', '/exercises'];

  expect(
    readRoutes(rootHolding({ not: 'an array' })).map((route) => route.path),
  ).toStrictEqual(fallback);
  expect(readRoutes(rootHolding([1, 2, 3])).map((r) => r.path)).toStrictEqual(
    fallback,
  );
  expect(
    readRoutes(rootHolding(['/', '/tutorial'])).map((r) => r.path),
  ).toStrictEqual(fallback);
  expect(
    readRoutes(rootHolding([{ path: '/tutorial/1', title: 'No description' }])),
  ).toHaveLength(3);
});

test('every address always listed is one the site describes as itself', () => {
  for (const route of readRoutes('/nowhere-at-all')) {
    const meta = pageMetaFor(route.path);
    expect(meta.path).toBe(route.path);
    expect(route.title).toBe(meta.title);
    expect(route.description).toBe(meta.description);
  }
});

test('the document is written as absolute addresses', () => {
  const xml = buildSitemap('https://tex.cheminfo.org', [
    '/',
    '/tutorial/1',
    '/exercises/powers-square',
  ]);

  expect(xml).toContain('<loc>https://tex.cheminfo.org/</loc>');
  expect(xml).toContain('<loc>https://tex.cheminfo.org/tutorial/1</loc>');
  expect(xml).toContain(
    '<loc>https://tex.cheminfo.org/exercises/powers-square</loc>',
  );
  expect(xml.match(/<loc>/g)).toHaveLength(3);
});

test('a trailing slash on the origin does not double up', () => {
  expect(buildSitemap('https://tex.cheminfo.org/', ['/exercises'])).toContain(
    '<loc>https://tex.cheminfo.org/exercises</loc>',
  );
});
