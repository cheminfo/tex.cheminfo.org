import { useSignals } from '@preact/signals-react/runtime';

import { navigate, state } from '../state/index.ts';

import { TUTORIAL_LEVELS, TUTORIAL_STEPS } from './tutorialSteps.ts';

/**
 * The tour, as one strip per level: the student sees how far the tutorial goes
 * and can jump anywhere in it.
 * @returns The strips of numbered steps.
 */
export function StepNavigator() {
  useSignals();
  const index = state.data.tutorial.index.value;

  return (
    <div className="series-nav">
      {TUTORIAL_LEVELS.map((group) => (
        <div key={group.level} className={`series-strip level-${group.level}`}>
          <div className="series-head">
            <span className="series-title">{group.label}</span>
            <span className="series-desc">{group.level}</span>
          </div>
          <div className="series-buttons">
            {TUTORIAL_STEPS.map((step, stepIndex) =>
              step.level === group.level ? (
                <button
                  key={step.title}
                  type="button"
                  title={step.title}
                  className={`series-btn ${stepIndex === index ? 'active' : ''}`}
                  onClick={() =>
                    navigate({ page: 'tutorial', step: stepIndex + 1 })
                  }
                >
                  {stepIndex + 1}
                </button>
              ) : null,
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
