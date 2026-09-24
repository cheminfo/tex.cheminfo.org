import { expect, test } from 'vitest';

import { buildRenderImageTag, buildRenderUrl } from '../renderUrl.ts';

test('the rendering address escapes the formula', () => {
  expect(buildRenderUrl('x^2')).toBe('https://tex.cheminfo.org/v1/?tex=x%5E2');
  expect(buildRenderUrl(String.raw`\frac{1}{2}`)).toBe(
    'https://tex.cheminfo.org/v1/?tex=%5Cfrac%7B1%7D%7B2%7D',
  );
});

test('another deployment serves the same path', () => {
  expect(buildRenderUrl('x^2', 'http://localhost:10422')).toBe(
    'http://localhost:10422/v1/?tex=x%5E2',
  );
});

test('the image tag points at the rendering address', () => {
  expect(buildRenderImageTag('x^2')).toBe(
    '<img src="https://tex.cheminfo.org/v1/?tex=x%5E2"/>',
  );
});
