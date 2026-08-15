import { expect, test } from 'vitest';

import { parseRoute, routePath } from '../router.ts';

test('the root path opens the editor', () => {
  expect(parseRoute('/')).toStrictEqual({ page: 'editor' });
});

test('an address this tool does not know opens the editor', () => {
  expect(parseRoute('/whatever/it/was')).toStrictEqual({ page: 'editor' });
});

test('the exercises path opens the exercises, naming none', () => {
  expect(parseRoute('/exercises')).toStrictEqual({
    page: 'exercises',
    exerciseId: undefined,
  });
});

test('an exercise path carries its identifier', () => {
  expect(parseRoute('/exercises/nernst')).toStrictEqual({
    page: 'exercises',
    exerciseId: 'nernst',
  });
  expect(parseRoute('/exercises/nernst/')).toStrictEqual({
    page: 'exercises',
    exerciseId: 'nernst',
  });
});

test('the tutorial path opens the tour, naming no step', () => {
  expect(parseRoute('/tutorial')).toStrictEqual({
    page: 'tutorial',
    step: undefined,
  });
});

test('a tutorial step is read from the path, counted from 1', () => {
  expect(parseRoute('/tutorial/7')).toStrictEqual({
    page: 'tutorial',
    step: 7,
  });
});

test('a step that is not a whole number is ignored', () => {
  expect(parseRoute('/tutorial/last')).toStrictEqual({
    page: 'tutorial',
    step: undefined,
  });
  expect(parseRoute('/tutorial/0')).toStrictEqual({
    page: 'tutorial',
    step: undefined,
  });
});

test('a route writes back the path it was read from', () => {
  expect(routePath({ page: 'editor' })).toBe('/');
  expect(routePath({ page: 'exercises' })).toBe('/exercises');
  expect(routePath({ page: 'exercises', exerciseId: 'nernst' })).toBe(
    '/exercises/nernst',
  );
  expect(routePath({ page: 'tutorial' })).toBe('/tutorial');
  expect(routePath({ page: 'tutorial', step: 7 })).toBe('/tutorial/7');
});
