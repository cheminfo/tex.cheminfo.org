import { useSignals } from '@preact/signals-react/runtime';

import { navigate, state } from '../state/index.ts';

import { EXERCISE_SERIES } from './exerciseSeries.ts';
import type { ExerciseProgress } from './progress.ts';

/**
 * The series, each as a strip of numbered exercises: what has been solved, what
 * was attempted, and where the student is.
 * @returns The series strips.
 */
export function SeriesNav() {
  useSignals();
  const progress = state.preferences.exercises.progress.value;
  const activeId = state.data.exercises.current.value.id;

  return (
    <div className="series-nav">
      {EXERCISE_SERIES.map((series) => (
        <div key={series.id} className={`series-strip level-${series.level}`}>
          <div className="series-head">
            <span className="series-title">{series.title}</span>
            <span className="series-desc">{series.description}</span>
          </div>
          <div className="series-buttons">
            {series.exercises.map((exercise, index) => {
              const status = progress[exercise.id]?.status ?? 'idle';
              return (
                <button
                  key={exercise.id}
                  type="button"
                  title={exercise.title}
                  className={`series-btn status-${status} ${
                    exercise.id === activeId ? 'active' : ''
                  }`}
                  onClick={() =>
                    navigate({ page: 'exercises', exerciseId: exercise.id })
                  }
                >
                  {index + 1}
                  <StatusDot progress={progress[exercise.id]} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusDot({ progress }: { progress: ExerciseProgress | undefined }) {
  if (progress?.status === 'solved') {
    return (
      <span className="series-dot" aria-label="solved">
        ✓
      </span>
    );
  }
  if (progress?.status === 'attempted') {
    return (
      <span className="series-dot" aria-label="attempted">
        •
      </span>
    );
  }
  return null;
}
