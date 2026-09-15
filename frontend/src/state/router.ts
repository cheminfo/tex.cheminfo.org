import { createTabRouter } from 'react-cheminfo/core';

export type Page = 'editor' | 'tutorial' | 'exercises' | 'about';

export interface Route {
  page: Page;
  /** The exercise a `/exercises/<id>` link names. @default undefined */
  exerciseId?: string;
  /**
   * The tutorial step a `/tutorial/<n>` link names, counted from 1 because it
   * is read by people.
   * @default undefined
   */
  step?: number;
}

/**
 * The addresses this tool answers. An address it does not know opens the
 * editor, so a link written before a rename still lands somewhere.
 */
const router = createTabRouter<Page>({
  tabs: [
    'editor',
    { id: 'tutorial', takesId: true },
    { id: 'exercises', takesId: true },
    'about',
  ],
  home: 'editor',
});

/**
 * The route a path names.
 * @param pathname - The path, as `window.location.pathname` gives it.
 * @returns The route to render.
 */
export function parseRoute(pathname: string): Route {
  const { tab, id } = router.parse(pathname);
  if (tab === 'exercises') {
    return { page: 'exercises', exerciseId: id ?? undefined };
  }
  if (tab === 'tutorial') return { page: 'tutorial', step: stepNumber(id) };
  return { page: tab };
}

/**
 * The path of a route.
 * @param route - The route to write.
 * @returns The path, always starting with a slash.
 */
export function routePath(route: Route): string {
  if (route.page === 'exercises') {
    return router.format({ tab: 'exercises', id: route.exerciseId });
  }
  if (route.page === 'tutorial') {
    return router.format({
      tab: 'tutorial',
      id: route.step ? String(route.step) : null,
    });
  }
  return router.format({ tab: route.page });
}

/**
 * The step a `/tutorial/<n>` segment names. The router hands ids over as
 * strings; a step is read by people and counted from 1.
 * @param id - The second segment of the address, or null when it carries none.
 * @returns The step number, or undefined when the segment names none.
 */
function stepNumber(id: string | null): number | undefined {
  if (id === null) return undefined;
  const step = Number(id);
  return Number.isInteger(step) && step >= 1 ? step : undefined;
}
