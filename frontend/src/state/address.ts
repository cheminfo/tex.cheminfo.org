import { findExercise, firstExercise } from '../exercises/exerciseSeries.ts';

import type { Route } from './router.ts';

/**
 * The route an address really opens: a bare `/exercises`, or one naming an
 * exercise that no longer exists, opens the first exercise, and a tutorial
 * without a step opens the first one.
 * @param route - The route the address asks for.
 * @returns The route that will be rendered.
 */
export function resolveRoute(route: Route): Route {
  if (route.page === 'exercises') {
    const found = findExercise(route.exerciseId) ?? firstExercise();
    return { page: 'exercises', exerciseId: found.exercise.id };
  }
  if (route.page === 'tutorial') {
    return { page: 'tutorial', step: route.step ?? 1 };
  }
  return route;
}
