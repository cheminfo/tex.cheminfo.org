import { useSignals } from '@preact/signals-react/runtime';

import { PageLayout } from '../components/PageLayout.tsx';
import { LatexEditor } from '../editor/LatexEditor.tsx';
import { MathJaxRenderer } from '../shared/MathJaxRenderer.tsx';
import { navigate, state, writeDraft } from '../state/index.ts';
import type { FeatureKey } from '../state/shareConfig.ts';
import { isHidden } from '../state/shareConfig.ts';

import { GlossaryText } from './GlossaryText.tsx';
import { StepNavigator } from './StepNavigator.tsx';
import './Tutorial.css';
import { TUTORIAL_STEPS } from './tutorialSteps.ts';

/** The reference tabs that help while following the tour. */
const HELP_TABS: readonly FeatureKey[] = ['reference', 'commands', 'help'];

/**
 * The guided tour: each step is a working formula in a live playground, not a
 * slide — everything on screen can be taken apart.
 * @returns The page.
 */
export function TutorialPage() {
  useSignals();
  const index = state.data.tutorial.index.value;
  const step = state.data.tutorial.current.value;
  const tex = state.data.tutorial.tex.value;
  const config = state.view.config.value;
  if (!step) return null;

  const edited = tex !== step.tex;

  return (
    <PageLayout
      tabs={HELP_TABS}
      onSelect={(snippet) => writeDraft(index, `${tex}${snippet}`)}
    >
      {!isHidden(config, 'tutorialSteps') && (
        <div className="section">
          <div className="section-head">
            <span className="section-label">Tutorial</span>
            <span className="section-note">
              step {index + 1} of {TUTORIAL_STEPS.length} — every step is
              editable, nothing here is a slide
            </span>
          </div>
          <div className="section-body">
            <StepNavigator />
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <span className={`level-tag level-${step.level}`}>{step.level}</span>
          <span className="section-label step-title">
            {index + 1}. {step.title}
          </span>
          <span className="spacer" />
          <button
            type="button"
            className="btn"
            disabled={index === 0}
            onClick={() => open(index - 1)}
          >
            ← Previous
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={index === TUTORIAL_STEPS.length - 1}
            onClick={() => open(index + 1)}
          >
            Next →
          </button>
        </div>
        <div className="section-body">
          <p className="step-description">
            <GlossaryText text={step.description} />
          </p>

          <LatexEditor
            key={index}
            value={tex}
            onChange={(value) => writeDraft(index, value)}
            onPasteUrl={(value) => writeDraft(index, value)}
          />

          <div className="answer-well">
            <span className="well-label">Live render</span>
            <MathJaxRenderer tex={tex} displayMode />
          </div>

          <div className="button-row">
            <button
              type="button"
              className="btn"
              disabled={!edited}
              onClick={() => writeDraft(index, step.tex)}
            >
              Put the step back
            </button>
            <a
              className="btn"
              href={`/?tex=${encodeURIComponent(tex)}`}
              title="Open this formula in the editor, with the embed snippets"
            >
              Open in the editor
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function open(index: number): void {
  navigate({ page: 'tutorial', step: index + 1 });
}
