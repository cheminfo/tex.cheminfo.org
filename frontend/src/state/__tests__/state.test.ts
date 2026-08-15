import { beforeEach, expect, test } from 'vitest';

import { EMPTY_PROGRESS } from '../../exercises/progress.ts';
import {
  clearProgress,
  navigate,
  progressOf,
  sanitizeStoredProgress,
  setZoom,
  state,
  updateProgress,
  writeDraft,
} from '../index.ts';

beforeEach(() => {
  clearProgress();
  state.view.route.value = { page: 'editor' };
  state.view.tutorial.drafts.value = {};
  setZoom(2);
});

test('navigating to the exercises resolves the exercise it opens', () => {
  navigate({ page: 'exercises' });

  expect(state.view.route.value).toStrictEqual({
    page: 'exercises',
    exerciseId: 'x-squared',
  });
  expect(state.data.exercises.current.value.title).toBe('x squared');
  expect(state.data.exercises.currentSeries.value.id).toBe('powers');
});

test('an exercise that no longer exists opens the first one', () => {
  navigate({ page: 'exercises', exerciseId: 'renamed-last-year' });

  expect(state.view.route.value.exerciseId).toBe('x-squared');
});

test('navigating to the tutorial resolves its first step', () => {
  navigate({ page: 'tutorial' });

  expect(state.view.route.value).toStrictEqual({ page: 'tutorial', step: 1 });
  expect(state.data.tutorial.index.value).toBe(0);
  expect(state.data.tutorial.tex.value).toBe('E = mc^2');
});

test('a step beyond the tour lands on the last one', () => {
  navigate({ page: 'tutorial', step: 900 });

  expect(state.data.tutorial.index.value).toBe(16);
});

test('a draft replaces the step it was written on, and only that one', () => {
  navigate({ page: 'tutorial', step: 2 });
  writeDraft(1, String.raw`\alpha`);

  expect(state.data.tutorial.tex.value).toBe(String.raw`\alpha`);

  navigate({ page: 'tutorial', step: 3 });
  expect(state.data.tutorial.tex.value).not.toBe(String.raw`\alpha`);
});

test('an untouched exercise starts on its starter, not on an empty box', () => {
  navigate({ page: 'exercises', exerciseId: 'nernst' });

  expect(state.data.exercises.currentProgress.value).toStrictEqual({
    ...EMPTY_PROGRESS,
    answer: 'E = ',
  });
  expect(state.data.exercises.check.value.status).toBe('wrong');
});

test('an answer that renders like the solution is marked solved', () => {
  navigate({ page: 'exercises', exerciseId: 'x-squared' });
  updateProgress('x-squared', { answer: 'x^{2}' });

  expect(state.data.exercises.check.value.status).toBe('solved');
});

test('the solved count follows what is recorded', () => {
  expect(state.data.exercises.solvedCount.value).toBe(0);

  updateProgress('x-squared', { status: 'solved' });
  updateProgress('one-half', { status: 'attempted' });

  expect(state.data.exercises.solvedCount.value).toBe(1);
});

test('clearing throws every answer away', () => {
  updateProgress('x-squared', { answer: 'x^2', status: 'solved' });
  clearProgress();

  expect(state.preferences.exercises.progress.value).toStrictEqual({});
  expect(progressOf('x-squared')).toStrictEqual(EMPTY_PROGRESS);
});

test('the zoom is clamped to what the previews can show', () => {
  setZoom(99);
  expect(state.preferences.zoom.value).toBe(3);

  setZoom(-4);
  expect(state.preferences.zoom.value).toBe(1);
});

test('nonsense left in storage is dropped rather than trusted', () => {
  state.preferences.exercises.progress.value = {
    'x-squared': { answer: 42, status: 'brilliant' },
  } as never;

  sanitizeStoredProgress();

  expect(state.preferences.exercises.progress.value).toStrictEqual({
    'x-squared': EMPTY_PROGRESS,
  });
});
