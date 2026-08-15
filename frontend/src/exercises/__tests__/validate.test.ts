import { expect, test } from 'vitest';

import {
  ALL_EXERCISES,
  EXERCISE_SERIES,
  findExercise,
  firstExercise,
} from '../exerciseSeries.ts';
import { checkAnswer } from '../validate.ts';

test('every exercise is solved by its own solution', () => {
  for (const exercise of ALL_EXERCISES) {
    expect(checkAnswer(exercise.solution, exercise), exercise.id).toStrictEqual(
      {
        status: 'solved',
        message: 'Solved — this is the formula.',
      },
    );
  }
});

test('every accepted alternative is solved too', () => {
  for (const exercise of ALL_EXERCISES) {
    for (const alternative of exercise.alternatives ?? []) {
      expect(checkAnswer(alternative, exercise).status, exercise.id).toBe(
        'solved',
      );
    }
  }
});

test('every starter is a partial answer, never the answer', () => {
  for (const exercise of ALL_EXERCISES) {
    if (exercise.starter === undefined) continue;
    expect(
      checkAnswer(exercise.starter, exercise).status,
      exercise.id,
    ).not.toBe('solved');
  }
});

test('exercise identifiers are unique', () => {
  const ids = ALL_EXERCISES.map((exercise) => exercise.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test('series identifiers are unique', () => {
  const ids = EXERCISE_SERIES.map((series) => series.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test('every exercise carries at least two hints', () => {
  for (const exercise of ALL_EXERCISES) {
    expect(exercise.hints.length, exercise.id).toBeGreaterThanOrEqual(2);
  }
});

test('the series hold 33 exercises across 6 series', () => {
  expect(EXERCISE_SERIES).toHaveLength(6);
  expect(ALL_EXERCISES).toHaveLength(33);
});

test('an empty answer asks for one instead of failing', () => {
  const { exercise } = firstExercise();
  expect(checkAnswer(' '.repeat(3), exercise)).toStrictEqual({
    status: 'empty',
    message: 'Write your formula in the editor.',
  });
});

test('a broken formula reports what MathJax could not read', () => {
  const { exercise } = firstExercise();
  expect(checkAnswer('x^', exercise)).toStrictEqual({
    status: 'error',
    message: 'Missing superscript or subscript argument',
  });
});

test('a valid but different formula is marked wrong, not broken', () => {
  const { exercise } = firstExercise();
  expect(checkAnswer('x_2', exercise).status).toBe('wrong');
});

test('an exercise is found by the identifier a link carries', () => {
  expect(findExercise('nernst')?.series.id).toBe('chemistry');
  expect(findExercise('nernst')?.exercise.title).toBe('The Nernst equation');
});

test('an identifier naming nothing is not a crash', () => {
  expect(findExercise('renamed-last-year')).toBe(undefined);
  expect(findExercise(undefined)).toBe(undefined);
});

test('a bare exercises link opens the first exercise', () => {
  expect(firstExercise().exercise.id).toBe('x-squared');
  expect(firstExercise().series.id).toBe('powers');
});
