import { signal } from '@preact/signals-react';

import { resolveRoute } from './address.ts';
import { preferences } from './preferences.ts';
import type { Route } from './router.ts';
import { parseRoute, routePath } from './router.ts';
import type { ShareConfig } from './shareConfig.ts';
import { parseShareConfig } from './shareConfig.ts';
import { pathWithoutBase, withBase } from './site.ts';

/**
 * Everything the page is showing right now. Nothing here survives a reload,
 * because everything worth restoring is either in the address or in the
 * preferences.
 */
export const view = {
  /** The page on screen, read from the address and written back to it. */
  route: signal<Route>(parseRoute(pathname())),
  /** What the link asked to hide, and whether it asked to be framed. */
  config: signal<ShareConfig>(parseShareConfig(search())),
  /** Whether the share dialog is open. */
  sharing: signal(false),
  editor: {
    /** The formula in the editor page. */
    tex: signal(searchParameter('tex')),
  },
  tutorial: {
    /**
     * What the student has typed, per step, so leaving a step and coming back
     * does not throw the edit away.
     */
    drafts: signal<Record<number, string>>({}),
  },
};

/**
 * Open a page. Navigation goes through the History API — never the hash, which
 * is dropped by half the tools that pass our links around — and keeps the query
 * string, so the share configuration a link carries survives moving pages.
 * @param route - Where to go; a page that names a step or an exercise is
 * resolved to its full address first.
 */
export function navigate(route: Route): void {
  const resolved = resolveRoute(route);
  view.route.value = resolved;
  writeAddress(routePath(resolved));
}

/**
 * Write the formula of the editor page, and put it in the address so the link
 * in the bar is always the link to hand out.
 * @param tex - The formula.
 */
export function writeTex(tex: string): void {
  view.editor.tex.value = tex;
  const url = currentUrl();
  if (!url) return;
  if (tex) {
    url.searchParams.set('tex', tex);
  } else {
    url.searchParams.delete('tex');
  }
  globalThis.history?.replaceState(null, '', url.toString());
}

/**
 * Write what the student typed in a tutorial step.
 * @param index - The step, counted from 0.
 * @param tex - What is now in the playground.
 */
export function writeDraft(index: number, tex: string): void {
  view.tutorial.drafts.value = { ...view.tutorial.drafts.value, [index]: tex };
}

/** Open the share dialog. */
export function openShare(): void {
  view.sharing.value = true;
}

/** Close the share dialog. */
export function closeShare(): void {
  view.sharing.value = false;
}

/**
 * Follow the browser's back and forward buttons, and make the address name
 * what it opens. Called once, before anything is rendered.
 */
export function startRouting(): void {
  const resolved = resolveRoute(view.route.peek());
  view.route.value = resolved;
  writeAddress(routePath(resolved), { replace: true });

  // A link carrying a zoom overrides the stored preference: what the author of
  // the link is looking at is what the reader must see.
  const zoom = searchParameter('zoom');
  if (zoom) preferences.zoom.value = view.config.peek().zoom;

  globalThis.addEventListener?.('popstate', () => {
    view.route.value = resolveRoute(parseRoute(pathname()));
  });
}

function writeAddress(path: string, options?: { replace?: boolean }): void {
  const url = currentUrl();
  const mounted = withBase(path);
  if (!url || url.pathname === mounted) return;
  url.pathname = mounted;
  if (options?.replace) {
    globalThis.history?.replaceState(null, '', url.toString());
  } else {
    globalThis.history?.pushState(null, '', url.toString());
  }
}

function currentUrl(): URL | null {
  const href = globalThis.location?.href;
  return href ? new URL(href) : null;
}

function pathname(): string {
  return pathWithoutBase(globalThis.location?.pathname ?? '/');
}

function search(): string {
  return globalThis.location?.search ?? '';
}

function searchParameter(name: string): string {
  return new URLSearchParams(search()).get(name) ?? '';
}
