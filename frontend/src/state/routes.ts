/**
 * Every address this site answers, each with the name and the sentence it is
 * indexed under.
 *
 * One table, read by two things: the build, which writes it next to the page as
 * `routes.json` for the server to title what it hands out, and lists it in
 * `sitemap.xml`; and the running app, which rewrites the head after a move
 * inside it. A step and an exercise each get their own entry — they are
 * separate addresses, and a crawler that finds sixty of them under one title
 * indexes one.
 *
 * It is read under Node as well as in the page, so nothing here touches the
 * document.
 */

import type { RouteMeta } from 'react-cheminfo/core';

import { EXERCISE_SERIES } from '../exercises/exerciseSeries.ts';
import type { Exercise } from '../exercises/exerciseTypes.ts';
import { TUTORIAL_STEPS } from '../tutorial/tutorialSteps.ts';

import {
  EDITOR_TITLE,
  EXERCISES_TITLE,
  TUTORIAL_TITLE,
  exerciseTitle,
  tutorialStepTitle,
} from './pageTitles.ts';

// What a search result has room for under the title, and what it takes to fill
// it: a shorter description leaves the snippet half empty, a longer one is cut
// off mid-sentence.
const DESCRIPTION_MIN = 110;
const DESCRIPTION_MAX = 160;

// A proper noun keeps its capital wherever it stands in a sentence.
const PROPER_NOUN = /^(?:Greek|Latin|LaTeX|MathJax)\b/;

/**
 * The pages, the home page first. The three fixed ones are also described by
 * the backend's `pageMeta.ts`, for a server running with no build beside it —
 * change one and change the other.
 */
export const PAGE_ROUTES: readonly RouteMeta[] = [
  {
    path: '/',
    title: EDITOR_TITLE,
    description:
      'Write a LaTeX or mhchem formula and take away its image: live preview, SVG and PNG download, and a permanent link any img tag can point at.',
  },
  {
    path: '/tutorial',
    title: TUTORIAL_TITLE,
    description:
      'A guided tour of LaTeX notation, one editable step at a time: powers and indices, fractions, Greek letters, operators, matrices and chemical equations.',
  },
  ...TUTORIAL_STEPS.map((step, index) =>
    described(
      `/tutorial/${index + 1}`,
      tutorialStepTitle(step),
      plain(step.description),
      ` Step ${index + 1} of ${TUTORIAL_STEPS.length} of the LaTeX tutorial, editable as you read it.`,
    ),
  ),
  {
    path: '/exercises',
    title: EXERCISES_TITLE,
    description:
      'Graded LaTeX exercises with instant rendering: write the formula, see it appear, and have your answer checked against the expected one.',
  },
  ...EXERCISE_SERIES.flatMap((series) => {
    const placing = ` ${article(series.level)} ${series.level} exercise on ${lowerFirst(series.title)}, checked as you type.`;
    return series.exercises.map((exercise) =>
      described(
        `/exercises/${exercise.id}`,
        exerciseTitle(exercise),
        asked(exercise, placing.length),
        placing,
      ),
    );
  }),
];

/**
 * One address, described in what a search result has room for: what the page
 * itself says, then the line placing it in the site.
 * @param path - The address.
 * @param title - What the page is called.
 * @param prose - What it says, in plain text.
 * @param placing - The sentence naming the series or the step number.
 * @returns The route.
 */
function described(
  path: string,
  title: string,
  prose: string,
  placing: string,
): RouteMeta {
  return {
    path,
    title,
    description: `${opening(prose, DESCRIPTION_MAX - placing.length)}${placing}`,
  };
}

/**
 * What an exercise page says. A prompt is one short sentence, and on its own it
 * fills barely half of what a search result shows, so the first hint — the
 * command the exercise is about, and the word a student searches for — joins it
 * whenever the two still fit.
 * @param exercise - The exercise.
 * @param placed - What the sentence placing it in the series takes.
 * @returns The prompt, alone or followed by the hint.
 */
function asked(exercise: Exercise, placed: number): string {
  const prompt = plain(exercise.prompt);
  const hint = plain(exercise.hints[0] ?? '');
  const helped = hint === '' ? prompt : `${prompt} ${hint}`;
  const wanted = prompt.length < DESCRIPTION_MIN - placed;
  return wanted && helped.length <= DESCRIPTION_MAX - placed ? helped : prompt;
}

/**
 * The prose of a step or an exercise as a search result shows it: the glossary
 * markers resolved to the word they wrap, the code ticks dropped, and the
 * whitespace collapsed.
 * @param text - The authored description or prompt.
 * @returns The same sentence, in plain text.
 */
function plain(text: string): string {
  return text
    .replaceAll(/\[\[(?<term>[^\]]+)\]\]/g, '$<term>')
    .replaceAll('`', '')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * What a page opens with, kept to whole sentences so a search result does not
 * end mid-clause.
 * @param text - The prose to open with.
 * @param limit - How much room there is for it.
 * @returns The first sentences that fit, or a cut first one.
 */
function opening(text: string, limit: number): string {
  if (text.length <= limit) return text;

  // A terminator ends a sentence only when a space follows it: the prose is
  // full of `\ce{...}` and `{...}`, whose dots end nothing.
  const terminator = /[.!?](?=\s|$)/g;
  let end = 0;
  for (
    let match = terminator.exec(text);
    match !== null;
    match = terminator.exec(text)
  ) {
    if (match.index >= limit) break;
    end = match.index + 1;
  }
  if (end > limit / 2) return text.slice(0, end);

  const cut = text.slice(0, limit);
  const space = cut.lastIndexOf(' ');
  return `${(space > limit / 2 ? cut.slice(0, space) : cut).replace(/[,;:]$/, '')}…`;
}

/**
 * The article a word takes.
 * @param word - The word that follows it.
 * @returns `An` before a vowel, `A` otherwise.
 */
function article(word: string): string {
  return /^[aeiou]/i.test(word) ? 'An' : 'A';
}

/**
 * A title used inside a sentence.
 * @param text - The title, capitalised as it is displayed.
 * @returns The same words, opening in lower case unless the first is a proper
 * noun.
 */
function lowerFirst(text: string): string {
  if (PROPER_NOUN.test(text)) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}
