import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { RouteMeta } from 'react-cheminfo/core';

import { pageMetaFor } from './pageMeta.ts';

export type { RouteMeta } from 'react-cheminfo/core';

/** The pages that exist whatever the build wrote. */
const ALWAYS = ['/', '/tutorial', '/exercises'];

/**
 * Every address the frontend routes itself, each with the title and the
 * description it is indexed under: the editor, the tutorial and each of its
 * steps, the exercises and each one of them. The frontend build writes them
 * next to the page, because it is the only side that knows how many steps and
 * exercises there are and what each one is about.
 * @param root - Where the built frontend is.
 * @returns The routes, the home page first, or the three pages that always
 * exist when no build has written them.
 */
export function readRoutes(root: string): RouteMeta[] {
  try {
    const parsed: unknown = JSON.parse(
      readFileSync(join(root, 'routes.json'), 'utf8'),
    );
    if (Array.isArray(parsed) && parsed.every(isRouteMeta)) return parsed;
  } catch {
    // No build, or a file we did not write: the pages below always exist.
  }
  return ALWAYS.map((path) => {
    const meta = pageMetaFor(path);
    return { path, title: meta.title, description: meta.description };
  });
}

function isRouteMeta(value: unknown): value is RouteMeta {
  if (typeof value !== 'object' || value === null) return false;
  const route = value as Record<string, unknown>;
  return (
    typeof route.path === 'string' &&
    route.path.startsWith('/') &&
    typeof route.title === 'string' &&
    typeof route.description === 'string'
  );
}
