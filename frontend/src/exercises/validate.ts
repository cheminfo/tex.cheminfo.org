import type { Exercise } from './exerciseTypes.ts';
import { compileError, rendersTheSame } from './mathml.ts';

export type CheckStatus = 'empty' | 'error' | 'wrong' | 'solved';

export interface CheckResult {
  status: CheckStatus;
  /** What the student reads under the editor. */
  message: string;
}

/**
 * Mark an answer against an exercise, on what it renders to rather than on how
 * it is written.
 * @param answer - The formula the student wrote.
 * @param exercise - The exercise being attempted.
 * @returns The status and the sentence explaining it.
 */
export function checkAnswer(answer: string, exercise: Exercise): CheckResult {
  if (!answer.trim()) {
    return { status: 'empty', message: 'Write your formula in the editor.' };
  }

  const error = compileError(answer);
  if (error) return { status: 'error', message: error };

  const accepted = [exercise.solution, ...(exercise.alternatives ?? [])];
  for (const candidate of accepted) {
    if (rendersTheSame(answer, candidate)) {
      return { status: 'solved', message: 'Solved — this is the formula.' };
    }
  }

  return {
    status: 'wrong',
    message:
      'That is valid LaTeX, but it does not render as the formula above yet — compare the two renders.',
  };
}
