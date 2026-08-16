import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ALL_EXERCISES } from '../src/exercises/exerciseSeries.ts';
import { TUTORIAL_STEPS } from '../src/tutorial/tutorialSteps.ts';

// The backend lists these in the sitemap. It cannot read them from the source —
// the frontend is another workspace, outside its rootDir — so the build that
// knows them writes them next to the page the backend already reads.
const routes = [
  '/',
  '/tutorial',
  ...TUTORIAL_STEPS.map((_step, index) => `/tutorial/${index + 1}`),
  '/exercises',
  ...ALL_EXERCISES.map((exercise) => `/exercises/${exercise.id}`),
];

writeFileSync(
  join(import.meta.dirname, '../dist/routes.json'),
  `${JSON.stringify(routes, null, 2)}\n`,
);

// eslint-disable-next-line no-console -- a build step says what it wrote
console.log(`wrote ${routes.length} routes to dist/routes.json`);
