import {
  PLATFORM_WORK,
  aboutProblems,
  resolveAbout,
} from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import { ABOUT } from '../about.ts';

test('the About record says what the house style asks of it', () => {
  expect(aboutProblems(ABOUT)).toStrictEqual([]);
});

test('the About names the site, what it renders, and its two paragraphs', () => {
  expect(ABOUT.siteId).toBe('tex');
  expect(ABOUT.what).toBe(
    'Render a LaTeX or mhchem formula as an SVG or PNG image, from an address any img tag can point at.',
  );
  expect(ABOUT.can).toHaveLength(6);
  expect(ABOUT.can[0]).toBe('Write a formula and watch it render as you type.');
  expect(ABOUT.paragraphs).toHaveLength(2);
});

test('the About credits every borrowed work the site runs on', () => {
  expect(ABOUT.credits).toStrictEqual([
    'mathjax',
    'blueprint',
    'react-cheminfo',
    'react',
    'vite',
  ]);
  expect(
    resolveAbout(ABOUT).credits.map((credit) => credit.license),
  ).toStrictEqual(['Apache-2.0', 'Apache-2.0', 'MIT', 'MIT', 'MIT']);
});

test('the About asks for the platform paper alone', () => {
  expect(ABOUT.cite).toStrictEqual([PLATFORM_WORK]);
  expect(resolveAbout(ABOUT).repository).toBe(
    'https://github.com/cheminfo/tex.cheminfo.org',
  );
});
