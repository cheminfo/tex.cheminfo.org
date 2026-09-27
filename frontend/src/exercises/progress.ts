import type { ExerciseProgress, ProgressRecords } from 'react-cheminfo/core';
import { emptyProgress, mergeExerciseProgress } from 'react-cheminfo/core';

/** The record an exercise nobody has opened starts from. */
export const EMPTY_PROGRESS: ExerciseProgress = emptyProgress();

/**
 * Rebuild a progress map from whatever was stored, dropping anything that is
 * not shaped like progress. A field added later lands on its default.
 * @param stored - The parsed contents of the storage entry.
 * @returns The progress map to start from.
 */
export function mergeProgress(stored: unknown): ProgressRecords {
  if (typeof stored !== 'object' || stored === null) return {};
  const merged: ProgressRecords = {};
  for (const [id, value] of Object.entries(stored as Record<string, unknown>)) {
    if (typeof value !== 'object' || value === null) continue;
    merged[id] = mergeExerciseProgress(value);
  }
  return merged;
}
