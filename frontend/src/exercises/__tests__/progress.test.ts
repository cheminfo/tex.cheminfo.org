import { expect, test } from 'vitest';

import { mergeProgress } from '../progress.ts';

test('a stored entry is read back as it was written', () => {
  expect(
    mergeProgress({
      'x-squared': {
        answer: 'x^2',
        status: 'solved',
        hintsRevealed: 2,
        showSolution: true,
      },
    }),
  ).toStrictEqual({
    'x-squared': {
      answer: 'x^2',
      status: 'solved',
      hintsRevealed: 2,
      showSolution: true,
    },
  });
});

test('a field written by an older version lands on its default', () => {
  expect(mergeProgress({ 'x-squared': { answer: 'x' } })).toStrictEqual({
    'x-squared': {
      answer: 'x',
      status: 'idle',
      hintsRevealed: 0,
      showSolution: false,
    },
  });
});

test('nonsense in storage is dropped rather than trusted', () => {
  expect(
    mergeProgress({
      'x-squared': { answer: 42, status: 'brilliant', hintsRevealed: -3 },
      broken: null,
    }),
  ).toStrictEqual({
    'x-squared': {
      answer: '',
      status: 'idle',
      hintsRevealed: 0,
      showSolution: false,
    },
  });
});

test('an unreadable entry gives an empty map', () => {
  expect(mergeProgress(null)).toStrictEqual({});
  expect(mergeProgress('[]')).toStrictEqual({});
});
