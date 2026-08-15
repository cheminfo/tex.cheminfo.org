import { data } from './data.ts';
import { preferences } from './preferences.ts';
import { view } from './view.ts';

/**
 * The whole state of the app, in three buckets: what is on screen, what it is
 * about, and what the student chose. Components read the leaves directly —
 * `state.view.route.value` — and call the actions below; nothing is drilled
 * through props.
 */
export const state = { view, data, preferences };

export {
  closeShare,
  navigate,
  openShare,
  startRouting,
  writeDraft,
  writeTex,
} from './view.ts';
export {
  clearProgress,
  progressOf,
  sanitizeStoredProgress,
  setZoom,
  updateProgress,
} from './preferences.ts';
