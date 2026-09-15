import { Button } from '@blueprintjs/core';
import { useSignals } from '@preact/signals-react/runtime';
import { useState } from 'react';
import {
  ExerciseActions,
  ExerciseLevelTag,
  HintLadder,
} from 'react-cheminfo/ui';

import { LatexEditor } from '../editor/LatexEditor.tsx';
import { MathJaxRenderer } from '../shared/MathJaxRenderer.tsx';
import { state, updateProgress } from '../state/index.ts';

import { EMPTY_PROGRESS } from './progress.ts';
import { checkAnswer } from './validate.ts';

interface ExerciseCardProps {
  /** Moves to the next exercise; absent on the last one. */
  onNext: (() => void) | undefined;
}

/**
 * One exercise: the formula to reproduce, the editor to reproduce it in, and
 * the help a student can ask for on the way.
 * @param props - The exercise props.
 * @returns The exercise card.
 */
export function ExerciseCard({ onNext }: ExerciseCardProps) {
  useSignals();
  const [checked, setChecked] = useState(false);

  const exercise = state.data.exercises.current.value;
  const series = state.data.exercises.currentSeries.value;
  const progress = state.data.exercises.currentProgress.value;
  const result = state.data.exercises.check.value;
  const solved = result.status === 'solved';

  function handleAnswer(answer: string): void {
    const next = checkAnswer(answer, exercise);
    updateProgress(exercise.id, {
      answer,
      status:
        next.status === 'solved' || progress.status === 'solved'
          ? 'solved'
          : progress.status,
    });
  }

  return (
    <div className="exercise">
      <div className="section">
        <div className="section-head">
          <ExerciseLevelTag level={exercise.level} />
          <span className="section-label step-title">{exercise.title}</span>
          <span className="section-note">{series.title}</span>
          {solved && <span className="solved-tag">✓ solved</span>}
        </div>
        <div className="section-body">
          <p className="exercise-prompt">{exercise.prompt}</p>
          <div className="target-well">
            <span className="well-label">Reproduce this</span>
            <MathJaxRenderer tex={exercise.solution} displayMode />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-label">Your formula</span>
          {exercise.commands && exercise.commands.length > 0 && (
            <div className="chip-row">
              {exercise.commands.map((command) => (
                <button
                  key={command}
                  type="button"
                  className="chip"
                  title={`Insert ${command}`}
                  onClick={() => handleAnswer(progress.answer + command)}
                >
                  {command}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="section-body">
          <LatexEditor
            value={progress.answer}
            onChange={handleAnswer}
            onPasteUrl={handleAnswer}
          />

          <div className={`answer-well ${solved ? 'is-solved' : ''}`}>
            <span className="well-label">Your render</span>
            {progress.answer.trim() ? (
              <MathJaxRenderer tex={progress.answer} displayMode />
            ) : (
              <span className="placeholder">
                Your render will appear here as you type
              </span>
            )}
          </div>

          {(solved || checked) && result.status !== 'empty' && (
            <p className={`feedback feedback-${result.status}`}>
              {result.message}
            </p>
          )}

          <ExerciseActions
            className="button-row"
            onCheck={() => {
              setChecked(true);
              if (!solved) {
                updateProgress(exercise.id, { status: 'attempted' });
              }
            }}
            onRevealHint={() =>
              updateProgress(exercise.id, {
                hintsRevealed: progress.hintsRevealed + 1,
              })
            }
            hintsRevealed={progress.hintsRevealed}
            hintCount={exercise.hints.length}
            onToggleSolution={() =>
              updateProgress(exercise.id, {
                showSolution: !progress.showSolution,
              })
            }
            showSolution={progress.showSolution}
            onReset={() => {
              setChecked(false);
              updateProgress(exercise.id, {
                ...EMPTY_PROGRESS,
                answer: exercise.starter ?? '',
              });
            }}
          >
            {onNext && (
              <Button
                icon="arrow-right"
                text="Next exercise"
                onClick={onNext}
              />
            )}
          </ExerciseActions>

          <div className="hint-block">
            <HintLadder
              hints={exercise.hints}
              revealed={progress.hintsRevealed}
            />
          </div>

          {progress.showSolution && (
            <div className="solution-block">
              <span className="well-label">One way to write it</span>
              <code className="solution-code">{exercise.solution}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
