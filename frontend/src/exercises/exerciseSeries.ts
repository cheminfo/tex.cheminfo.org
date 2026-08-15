import type { Exercise, ExerciseSeries } from './exerciseTypes.ts';
import { CHEMISTRY } from './series/chemistry.ts';
import { FRACTIONS } from './series/fractions.ts';
import { OPERATORS } from './series/operators.ts';
import { POWERS } from './series/powers.ts';
import { STRUCTURES } from './series/structures.ts';
import { SYMBOLS } from './series/symbols.ts';

export const EXERCISE_SERIES: readonly ExerciseSeries[] = [
  POWERS,
  FRACTIONS,
  SYMBOLS,
  OPERATORS,
  CHEMISTRY,
  STRUCTURES,
];

export const ALL_EXERCISES: readonly Exercise[] = EXERCISE_SERIES.flatMap(
  (series) => series.exercises,
);

/**
 * The exercise a bare `/exercises` link opens.
 * @returns The first exercise of the first series.
 */
export function firstExercise(): {
  series: ExerciseSeries;
  exercise: Exercise;
} {
  const series = EXERCISE_SERIES[0];
  const exercise = series?.exercises[0];
  if (!series || !exercise) throw new Error('no exercise is defined');
  return { series, exercise };
}

/**
 * Locate an exercise by the identifier a link carries.
 * @param id - The exercise identifier, or undefined when the link names none.
 * @returns The exercise and the series holding it, or undefined when the
 * identifier names nothing — a link written before a rename must still open.
 */
export function findExercise(
  id: string | undefined,
): { series: ExerciseSeries; exercise: Exercise } | undefined {
  if (!id) return undefined;
  for (const series of EXERCISE_SERIES) {
    const exercise = series.exercises.find((item) => item.id === id);
    if (exercise) return { series, exercise };
  }
  return undefined;
}
