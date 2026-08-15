export type ExerciseStatus = 'idle' | 'attempted' | 'solved';

export interface ExerciseProgress {
  /** What the student last had in the editor. */
  answer: string;
  status: ExerciseStatus;
  /** How many hints were revealed, so the count survives a reload. */
  hintsRevealed: number;
  showSolution: boolean;
}

export type ProgressMap = Record<string, ExerciseProgress>;

export const EMPTY_PROGRESS: ExerciseProgress = {
  answer: '',
  status: 'idle',
  hintsRevealed: 0,
  showSolution: false,
};

/**
 * Rebuild a progress map from whatever was stored, dropping anything that is
 * not shaped like progress. A field added later lands on its default.
 * @param stored - The parsed contents of the storage entry.
 * @returns The progress map to start from.
 */
export function mergeProgress(stored: unknown): ProgressMap {
  if (typeof stored !== 'object' || stored === null) return {};
  const merged: ProgressMap = {};
  for (const [id, value] of Object.entries(stored as Record<string, unknown>)) {
    if (typeof value !== 'object' || value === null) continue;
    const entry = value as Partial<ExerciseProgress>;
    merged[id] = {
      answer: typeof entry.answer === 'string' ? entry.answer : '',
      status: isStatus(entry.status) ? entry.status : 'idle',
      hintsRevealed:
        typeof entry.hintsRevealed === 'number' && entry.hintsRevealed > 0
          ? Math.floor(entry.hintsRevealed)
          : 0,
      showSolution: entry.showSolution === true,
    };
  }
  return merged;
}

const STATUSES: ReadonlySet<ExerciseStatus> = new Set([
  'idle',
  'attempted',
  'solved',
]);

function isStatus(value: unknown): value is ExerciseStatus {
  return STATUSES.has(value as ExerciseStatus);
}
