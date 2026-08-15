import { useSignals } from '@preact/signals-react/runtime';
import { useState } from 'react';

import { PageLayout } from '../components/PageLayout.tsx';
import {
  clearProgress,
  navigate,
  state,
  updateProgress,
} from '../state/index.ts';
import type { FeatureKey } from '../state/shareConfig.ts';
import { isHidden } from '../state/shareConfig.ts';

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
  const [confirmingClear, setConfirmingClear] = useState(false);

  const exercise = state.data.exercises.current.value;
  const progress = state.data.exercises.currentProgress.value;
  const solvedCount = state.data.exercises.solvedCount.value;
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
            <span className="section-note">
              {solvedCount} of {ALL_EXERCISES.length} solved
            </span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${(solvedCount / ALL_EXERCISES.length) * 100}%`,
                }}
              />
            </div>
            {confirmingClear ? (
              <span className="confirm-row">
                Clear every answer?
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    clearProgress();
                    setConfirmingClear(false);
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setConfirmingClear(false)}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="btn"
                onClick={() => setConfirmingClear(true)}
              >
                Clear all
              </button>
            )}
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
