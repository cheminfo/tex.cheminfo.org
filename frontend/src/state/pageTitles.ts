/**
 * What each page is called, in the words a search result shows.
 *
 * They are read only by the route table next to them, so a step is named
 * identically in the sitemap, in the `routes.json` the server titles its pages
 * from, and in the tab after a move inside the app.
 */

import type { Exercise } from '../exercises/exerciseTypes.ts';
import type { TutorialStep } from '../tutorial/tutorialSteps.ts';

/**
 * The room a page name has before the site name is appended to it. A longer
 * one is cut off in the middle of a word in the result.
 */
const TITLE_MAX = 59;

/** The editor, which a bare address opens. */
export const EDITOR_TITLE =
  'LaTeX to SVG and PNG — render a formula as an image';

/** The guided tour, and the page a step-less `/tutorial` opens. */
export const TUTORIAL_TITLE =
  'LaTeX tutorial — powers, fractions, symbols, chemistry';

/** The exercises, and the page a nameless `/exercises` opens. */
export const EXERCISES_TITLE =
  'LaTeX exercises — practise the notation by writing it';

/**
 * What one stop of the guided tour is called.
 * @param step - The step.
 * @returns Its own name, placed in the tutorial.
 */
export function tutorialStepTitle(step: TutorialStep): string {
  return titled(step.title, 'LaTeX tutorial', 'LaTeX step', 'LaTeX');
}

/**
 * What one exercise is called.
 * @param exercise - The exercise.
 * @returns Its own name, placed in the exercises.
 */
export function exerciseTitle(exercise: Exercise): string {
  return titled(exercise.title, 'LaTeX exercise', 'LaTeX');
}

/**
 * A page name followed by what places it in the site, kept short enough that
 * the site name appended after it still fits. A name that crowds out the
 * fullest wording takes the next one down, and one that leaves room for none
 * stands on its own.
 * @param name - What the page is called.
 * @param placings - The wordings that place it, fullest first.
 * @returns The name and the first placing that fits, or the name alone.
 */
function titled(name: string, ...placings: string[]): string {
  for (const placing of placings) {
    const title = `${name} — ${placing}`;
    if (title.length <= TITLE_MAX) return title;
  }
  return name;
}
