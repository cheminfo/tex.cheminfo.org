import { effect, signal } from '@preact/signals-react';
import type { ExerciseProgress, ProgressRecords } from 'react-cheminfo/core';
import {
  persistSignalBucket,
  syncPreferencesWithUrl,
} from 'react-cheminfo/core';

import { EMPTY_PROGRESS, mergeProgress } from '../exercises/progress.ts';

import {
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  SHARE_VOCABULARY,
} from './shareConfig.ts';

/**
 * What a student chose and what a student did: the only bucket that survives a
 * reload. Persisted as one entry, so the stored shape mirrors this tree.
 */
export const preferences = persistSignalBucket({
  key: 'tex.cheminfo.org:preferences',
  effect,
  bucket: {
    /** Preview magnification, shared by the editor and the previews. */
    zoom: signal(DEFAULT_ZOOM),
    exercises: {
      /** What has been written, attempted and solved, keyed by exercise. */
      progress: signal<ProgressRecords>({}),
    },
  },
});

/**
 * Set the preview magnification.
 * @param zoom - The wanted magnification; out of range values are clamped.
 */
export function setZoom(zoom: number): void {
  preferences.zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

/**
 * Mirror the preferences in the address, so the bar always holds the link to
 * hand out and the share dialog carries them without being told. A link naming
 * one applies it and it becomes the visitor's own; a value sitting at its
 * default is deleted rather than written, and a key the link omits leaves what
 * is stored alone.
 * @returns A function that stops rewriting the address.
 */
export function startPreferenceSync(): () => void {
  return syncPreferencesWithUrl({
    preferences: {
      zoom: {
        codec: SHARE_VOCABULARY.params.zoom,
        get: () => preferences.zoom.value,
        set: setZoom,
      },
    },
    subscribe: (listener) =>
      effect(() => {
        void preferences.zoom.value;
        listener();
      }),
  });
}

/**
 * The progress of one exercise, whatever is stored for it.
 * @param id - The exercise identifier.
 * @param starter - What the exercise prefills when it has never been opened.
 * @returns The progress to render, never undefined.
 */
export function progressOf(id: string, starter = ''): ExerciseProgress {
  return (
    preferences.exercises.progress.value[id] ?? {
      ...EMPTY_PROGRESS,
      answer: starter,
    }
  );
}

/**
 * Record part of what a student did on one exercise.
 * @param id - The exercise identifier.
 * @param patch - The fields that changed.
 * @param starter - What the exercise prefills, for a first touch.
 */
export function updateProgress(
  id: string,
  patch: Partial<ExerciseProgress>,
  starter = '',
): void {
  const current = progressOf(id, starter);
  preferences.exercises.progress.value = {
    ...preferences.exercises.progress.value,
    [id]: { ...current, ...patch },
  };
}

/** Throw away every answer, hint and solution the student has opened. */
export function clearProgress(): void {
  preferences.exercises.progress.value = {};
}

/**
 * Read back what storage held, dropping anything not shaped like progress —
 * a link shared two versions ago must still open.
 */
export function sanitizeStoredProgress(): void {
  preferences.exercises.progress.value = mergeProgress(
    preferences.exercises.progress.peek(),
  );
}
