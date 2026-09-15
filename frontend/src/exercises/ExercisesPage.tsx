import { useSignals } from '@preact/signals-react/runtime';
import { isHidden } from 'react-cheminfo/core';
import { ExerciseProgressHeader } from 'react-cheminfo/ui';

import { PageLayout } from '../components/PageLayout.tsx';
import {
  clearProgress,
  navigate,
  state,
  updateProgress,
} from '../state/index.ts';
import type { FeatureKey } from '../state/shareConfig.ts';

import { ExerciseCard } from './ExerciseCard.tsx';
import { SeriesNav } from './SeriesNav.tsx';
import { ALL_EXERCISES } from './exerciseSeries.ts';

/** The reference tabs that help while solving; the gallery would not. */
const HELP_TABS: readonly FeatureKey[] = ['reference', 'commands', 'help'];

/**
 * The exercises page: the series, the exercise on screen, and the reference
 * beside it.
 * @returns The page.
 */
export function ExercisesPage() {
  useSignals();

  const exercise = state.data.exercises.current.value;
  const progress = state.data.exercises.currentProgress.value;
  const summary = state.data.exercises.summary.value;
  const config = state.view.config.value;

  const index = ALL_EXERCISES.findIndex((item) => item.id === exercise.id);
  const next = ALL_EXERCISES[index + 1];

  return (
    <PageLayout
      tabs={HELP_TABS}
      onSelect={(snippet) =>
        updateProgress(exercise.id, { answer: `${progress.answer}${snippet}` })
      }
    >
      {!isHidden(config, 'exerciseList') && (
        <div className="section">
          <div className="section-head">
            <span className="section-label">Exercises</span>
            <ExerciseProgressHeader
              className="exercise-progress"
              summary={summary}
              onClearAll={clearProgress}
              clearDisabled={summary.solved + summary.attempted === 0}
            />
          </div>
          <div className="section-body">
            <SeriesNav />
          </div>
        </div>
      )}

      <ExerciseCard
        key={exercise.id}
        onNext={
          next
            ? () => navigate({ page: 'exercises', exerciseId: next.id })
            : undefined
        }
      />
    </PageLayout>
  );
}
