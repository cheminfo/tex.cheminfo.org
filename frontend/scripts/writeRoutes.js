import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { EXERCISE_SERIES } from '../src/exercises/exerciseSeries.ts';
import { TUTORIAL_STEPS } from '../src/tutorial/tutorialSteps.ts';

// The backend titles the page it serves from these, and lists them in the
// sitemap. It cannot read them from the source — the frontend is another
// workspace, outside its rootDir — so the build that knows them writes them
// next to the page the backend already reads. A step and an exercise each get
// their own title and their own description here: they are separate addresses,
// and a crawler that finds sixty of them under one title indexes one.
//
// What a search result has room for under the title.
const DESCRIPTION_MAX = 160;

// The three pages below are also described by the backend's `pageMeta.ts`, for
// a server running with no build beside it. Change one and change the other.
const routes = [
  {
    path: '/',
    title: 'LaTeX to SVG and PNG — render a formula as an image',
    description:
      'Write a LaTeX or mhchem formula and take away its image: live preview, SVG and PNG download, and a permanent link any img tag can point at.',
  },
  {
    path: '/tutorial',
    title: 'LaTeX tutorial — powers, fractions, symbols, chemistry',
    description:
      'A guided tour of LaTeX mathematical notation, one editable step at a time: powers and indices, fractions, Greek letters, operators, matrices and chemical equations.',
  },
  ...TUTORIAL_STEPS.map((step, index) =>
    described(
      `/tutorial/${index + 1}`,
      `${step.title} — LaTeX tutorial`,
      plain(step.description),
      ` Step ${index + 1} of ${TUTORIAL_STEPS.length} of the LaTeX tutorial, editable as you read it.`,
    ),
  ),
  {
    path: '/exercises',
    title: 'LaTeX exercises — practise the notation by writing it',
    description:
      'Graded LaTeX exercises with instant rendering: write the formula, see it appear, and have your answer checked against the expected one.',
  },
  ...EXERCISE_SERIES.flatMap((series) =>
    series.exercises.map((exercise) =>
      described(
        `/exercises/${exercise.id}`,
        `${exercise.title} — LaTeX exercise`,
        plain(exercise.prompt),
        ` ${article(series.level)} ${series.level} exercise on ${lowerFirst(series.title)}, checked as you type.`,
      ),
    ),
  ),
];

writeFileSync(
  join(import.meta.dirname, '../dist/routes.json'),
  `${JSON.stringify(routes, null, 2)}\n`,
);

// eslint-disable-next-line no-console -- a build step says what it wrote
console.log(`wrote ${routes.length} routes to dist/routes.json`);

/**
 * One address, described in what a search result has room for: what the page
 * itself says, then the line placing it in the site.
 * @param {string} path - The address.
 * @param {string} title - What the page is called.
 * @param {string} prose - What it says, in plain text.
 * @param {string} placing - The sentence naming the series or the step number.
 * @returns {{path: string, title: string, description: string}} The route.
 */
function described(path, title, prose, placing) {
  return {
    path,
    title,
    description: `${opening(prose, DESCRIPTION_MAX - placing.length)}${placing}`,
  };
}

/**
 * The prose of a step or an exercise as a search result shows it: the glossary
 * markers resolved to the word they wrap, the code ticks dropped, and the
 * whitespace collapsed.
 * @param {string} text - The authored description or prompt.
 * @returns {string} The same sentence, in plain text.
 */
function plain(text) {
  return text
    .replaceAll(/\[\[(?<term>[^\]]+)\]\]/g, '$<term>')
    .replaceAll('`', '')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * What a page opens with, kept to whole sentences so a search result does not
 * end mid-clause.
 * @param {string} text - The prose to open with.
 * @param {number} limit - How much room there is for it.
 * @returns {string} The first sentences that fit, or a cut first one.
 */
function opening(text, limit) {
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
 * @param {string} word - The word that follows it.
 * @returns {string} `An` before a vowel, `A` otherwise.
 */
function article(word) {
  return /^[aeiou]/i.test(word) ? 'An' : 'A';
}

/**
 * A title used inside a sentence.
 * @param {string} text - The title, capitalised as it is displayed.
 * @returns {string} The same words, opening in lower case.
 */
function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
