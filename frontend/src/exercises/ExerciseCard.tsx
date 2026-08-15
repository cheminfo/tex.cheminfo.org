import { useSignals } from '@preact/signals-react/runtime';
import { useState } from 'react';

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

  const hints = exercise.hints.slice(0, progress.hintsRevealed);

  return (
    <div className="exercise">
      <div className="section">
        <div className="section-head">
          <span className={`level-tag level-${exercise.level}`}>
            {exercise.level}
          </span>
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

          <div className="button-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setChecked(true);
                if (!solved) {
                  updateProgress(exercise.id, { status: 'attempted' });
                }
              }}
            >
              Check
            </button>
            <button
              type="button"
              className="btn"
              disabled={progress.hintsRevealed >= exercise.hints.length}
              onClick={() =>
                updateProgress(exercise.id, {
                  hintsRevealed: progress.hintsRevealed + 1,
                })
              }
            >
              Hint ({progress.hintsRevealed}/{exercise.hints.length})
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                updateProgress(exercise.id, {
                  showSolution: !progress.showSolution,
                })
              }
            >
              {progress.showSolution ? 'Hide solution' : 'Show solution'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setChecked(false);
                updateProgress(exercise.id, {
                  ...EMPTY_PROGRESS,
                  answer: exercise.starter ?? '',
                });
              }}
            >
              Reset
            </button>
            <span className="spacer" />
            {onNext && (
              <button type="button" className="btn btn-next" onClick={onNext}>
                Next exercise →
              </button>
            )}
          </div>

          {hints.length > 0 && (
            <ol className="hint-list">
              {hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ol>
          )}

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
