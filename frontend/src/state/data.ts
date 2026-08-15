import { computed } from '@preact/signals-react';

import {
  ALL_EXERCISES,
  findExercise,
  firstExercise,
} from '../exercises/exerciseSeries.ts';
import { checkAnswer } from '../exercises/validate.ts';
import { TUTORIAL_STEPS } from '../tutorial/tutorialSteps.ts';

import { preferences, progressOf } from './preferences.ts';
import { view } from './view.ts';

const found = computed(
  () => findExercise(view.route.value.exerciseId) ?? firstExercise(),
);

const currentExercise = computed(() => found.value.exercise);

const currentProgress = computed(() =>
  progressOf(currentExercise.value.id, currentExercise.value.starter ?? ''),
);

const stepIndex = computed(() => clampStep(view.route.value.step));

/**
 * What the page is about, derived from the address and from what the student
 * has done. Nothing here is written to, and nothing here is stored.
 */
export const data = {
  exercises: {
    /** The exercise the address names, or the first one. */
    current: currentExercise,
    /** The series it belongs to. */
    currentSeries: computed(() => found.value.series),
    /** What the student has written on it. */
    currentProgress,
    /**
     * The marking of that answer. Kept apart from the answer itself, so
     * revealing a hint does not re-mark anything.
     */
    check: computed(() =>
      checkAnswer(currentProgress.value.answer, currentExercise.value),
    ),
    /** How many exercises have been solved, out of them all. */
    solvedCount: computed(() => {
      const progress = preferences.exercises.progress.value;
      let solved = 0;
      for (const exercise of ALL_EXERCISES) {
        if (progress[exercise.id]?.status === 'solved') solved++;
      }
      return solved;
    }),
  },
  tutorial: {
    /** The step the address names, counted from 0 and clamped to the tour. */
    index: stepIndex,
    /** That step. */
    current: computed(() => TUTORIAL_STEPS[stepIndex.value]),
    /** What is in its playground: the student's edit, or the step itself. */
    tex: computed(
      () =>
        view.tutorial.drafts.value[stepIndex.value] ??
        TUTORIAL_STEPS[stepIndex.value]?.tex ??
        '',
    ),
  },
};

function clampStep(step: number | undefined): number {
  if (!step || !Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.round(step) - 1, 0), TUTORIAL_STEPS.length - 1);
}
