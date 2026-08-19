import { useSignals } from '@preact/signals-react/runtime';
import { TutorialStepStrip } from 'react-cheminfo/ui';

import { navigate, state } from '../state/index.ts';

import { TUTORIAL_LEVEL_LABELS, TUTORIAL_STEPS } from './tutorialSteps.ts';

/**
 * The tour, as one strip per level: the student sees how far the tutorial goes
 * and can jump anywhere in it, and the pager walks it step by step.
 * @returns The strips of numbered steps.
 */
export function StepNavigator() {
  useSignals();

  return (
    <TutorialStepStrip
      className="tutorial-nav"
      steps={TUTORIAL_STEPS}
      activeIndex={state.data.tutorial.index.value}
      onSelect={(index) => navigate({ page: 'tutorial', step: index + 1 })}
      levelLabels={TUTORIAL_LEVEL_LABELS}
    />
  );
}
