import { effect } from '@preact/signals-react';

import { findExercise } from '../exercises/exerciseSeries.ts';
import { TUTORIAL_STEPS } from '../tutorial/tutorialSteps.ts';

import type { Route } from './router.ts';
import { routePath } from './router.ts';
import { view } from './view.ts';

const SITE_NAME = 'tex.cheminfo.org';

/**
 * Keep the tab and the canonical address in step with the page on screen. The
 * server already titles the page it hands out; this is what a move inside the
 * app changes, and what a crawler rendering the page reads afterwards.
 * Called once, before anything is rendered.
 */
export function startDocumentMeta(): void {
  effect(() => {
    writeDocumentMeta(view.route.value);
  });
}

/**
 * The title of a page, naming the step or the exercise it is on.
 * @param route - The page on screen.
 * @returns What the tab is called.
 */
export function documentTitle(route: Route): string {
  if (route.page === 'tutorial') {
    const step = route.step ? TUTORIAL_STEPS[route.step - 1] : undefined;
    return step
      ? `${step.title} — LaTeX tutorial — ${SITE_NAME}`
      : `LaTeX tutorial — powers, fractions, symbols, chemistry — ${SITE_NAME}`;
  }

  if (route.page === 'exercises') {
    const found = findExercise(route.exerciseId);
    return found
      ? `${found.exercise.title} — LaTeX exercise — ${SITE_NAME}`
      : `LaTeX exercises — practise the notation by writing it — ${SITE_NAME}`;
  }

  return `LaTeX to SVG and PNG — render a formula as an image — ${SITE_NAME}`;
}

function writeDocumentMeta(route: Route): void {
  if (typeof document === 'undefined') return;
  document.title = documentTitle(route);

  const origin = globalThis.location?.origin;
  if (!origin) return;
  canonicalLink().href = `${origin}${routePath(route)}`;
}

function canonicalLink(): HTMLLinkElement {
  const existing = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (existing) return existing;

  const link = document.createElement('link');
  link.rel = 'canonical';
  document.head.append(link);
  return link;
}
