import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { pageMetaFor } from '../pageMeta.ts';
import { buildSitemap, sitemapPaths } from '../sitemap.ts';

function rootHolding(routes: unknown): string {
  const root = mkdtempSync(join(tmpdir(), 'tex-sitemap-'));
  writeFileSync(join(root, 'routes.json'), JSON.stringify(routes));
  return root;
}

test('the addresses come from the build that knows them', () => {
  const root = rootHolding(['/', '/tutorial', '/tutorial/1', '/exercises']);

  expect(sitemapPaths(root)).toStrictEqual([
    '/',
    '/tutorial',
    '/tutorial/1',
    '/exercises',
  ]);
});

test('without a build, the pages that always exist are still listed', () => {
  expect(sitemapPaths('/nowhere-at-all')).toStrictEqual([
    '/',
    '/tutorial',
    '/exercises',
  ]);
});

test('a routes file we did not write is ignored rather than trusted', () => {
  expect(sitemapPaths(rootHolding({ not: 'an array' }))).toStrictEqual([
    '/',
    '/tutorial',
    '/exercises',
  ]);
  expect(sitemapPaths(rootHolding([1, 2, 3]))).toStrictEqual([
    '/',
    '/tutorial',
    '/exercises',
  ]);
});

test('every address always listed is one the site describes as itself', () => {
  for (const path of sitemapPaths('/nowhere-at-all')) {
    expect(pageMetaFor(path).canonicalPath).toBe(path);
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
