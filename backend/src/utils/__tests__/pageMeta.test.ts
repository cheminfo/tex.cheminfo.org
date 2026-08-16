import { expect, test } from 'vitest';

import { injectPageMeta, pageMetaFor } from '../pageMeta.ts';

const PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta name="description" content="built-in" />
    <title>built-in</title>
  </head>
  <body><div id="root"></div></body>
</html>
`;

test('the editor is what an unknown address is indexed as', () => {
  expect(pageMetaFor('/nothing/here').canonicalPath).toBe('/');
  expect(pageMetaFor('/?tex=x%5E2').canonicalPath).toBe('/');
  expect(pageMetaFor('/').title).toBe(
    'LaTeX to SVG and PNG — render a formula as an image',
  );
});

test('a page keeps its own address, a query string never makes a new one', () => {
  expect(pageMetaFor('/tutorial').canonicalPath).toBe('/tutorial');
  expect(pageMetaFor('/tutorial/4').canonicalPath).toBe('/tutorial/4');
  expect(pageMetaFor('/tutorial/4?embed=1').canonicalPath).toBe('/tutorial/4');
  expect(pageMetaFor('/exercises/').canonicalPath).toBe('/exercises');
  expect(pageMetaFor('/exercises/powers-square?zoom=2').canonicalPath).toBe(
    '/exercises/powers-square',
  );
});

test('each page has its own title and description', () => {
  expect(pageMetaFor('/tutorial/2').title).toBe(
    'LaTeX tutorial — powers, fractions, symbols, chemistry',
  );
  expect(pageMetaFor('/exercises').title).toBe(
    'LaTeX exercises — practise the notation by writing it',
  );
  expect(pageMetaFor('/exercises').description).toContain('Graded LaTeX');
});

test('the built-in title and description are replaced, not doubled', () => {
  const html = injectPageMeta(PAGE, {
    url: '/tutorial',
    origin: 'https://tex.cheminfo.org',
  });

  expect(html).toContain(
    '<title>LaTeX tutorial — powers, fractions, symbols, chemistry — tex.cheminfo.org</title>',
  );
  expect(html).not.toContain('built-in');
  expect(html.match(/<title>/g)).toHaveLength(1);
  expect(html.match(/name="description"/g)).toHaveLength(1);
});

test('the page carries a canonical address and a social card', () => {
  const html = injectPageMeta(PAGE, {
    url: '/exercises/powers-square?embed=1',
    origin: 'https://tex.cheminfo.org/',
  });

  expect(html).toContain(
    '<link rel="canonical" href="https://tex.cheminfo.org/exercises/powers-square" />',
  );
  expect(html).toContain(
    '<meta property="og:url" content="https://tex.cheminfo.org/exercises/powers-square" />',
  );
  expect(html).toContain(
    '<meta property="og:image" content="https://tex.cheminfo.org/og.png" />',
  );
  expect(html).toContain(
    '<meta name="twitter:card" content="summary_large_image" />',
  );
  expect(html.indexOf('rel="canonical"')).toBeLessThan(html.indexOf('</head>'));
});

test('a hostile Host header cannot write markup into the page', () => {
  const html = injectPageMeta(PAGE, {
    url: '/',
    origin: 'https://evil"><script>alert(1)</script>',
  });

  expect(html).not.toContain('<script>alert(1)</script>');
  expect(html).toContain('&quot;&gt;&lt;script&gt;');
});

test('a page without a head still gets its metadata', () => {
  const html = injectPageMeta('<p>bare</p>', {
    url: '/',
    origin: 'https://tex.cheminfo.org',
  });

  expect(html).toContain('<title>');
  expect(html).toContain('rel="canonical"');
});
