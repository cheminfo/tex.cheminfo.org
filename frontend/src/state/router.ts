export type Page = 'editor' | 'tutorial' | 'exercises';

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
 * The route a path names. An address this tool does not know opens the editor,
 * so a link written before a rename still lands somewhere.
 * @param pathname - The path, as `window.location.pathname` gives it.
 * @returns The route to render.
 */
export function parseRoute(pathname: string): Route {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'exercises') {
    return { page: 'exercises', exerciseId: segments[1] };
  }
  if (segments[0] === 'tutorial') {
    const step = Number(segments[1]);
    return {
      page: 'tutorial',
      step: Number.isInteger(step) && step >= 1 ? step : undefined,
    };
  }
  return { page: 'editor' };
}

/**
 * The path of a route.
 * @param route - The route to write.
 * @returns The path, always starting with a slash.
 */
export function routePath(route: Route): string {
  if (route.page === 'exercises') {
    return route.exerciseId ? `/exercises/${route.exerciseId}` : '/exercises';
  }
  if (route.page === 'tutorial') {
    return route.step ? `/tutorial/${route.step}` : '/tutorial';
  }
  return '/';
}
