/**
 * The head of the page this server hands out, and the crawl path in its body.
 *
 * The built page is the template: it says where its head and its crawl path go
 * and carries neither, so both are written rather than found. The title, the
 * description, the canonical address, the social card, the structured data and
 * the `noscript` index all come from `react-cheminfo`; what belongs to this
 * site is which page an address opens, and the prose naming it.
 */

import type { NoscriptRoute, RouteMeta, SiteId } from 'react-cheminfo/core';
import {
  PAGE_BODY_MARKER,
  PAGE_HEAD_MARKER,
  fill,
  noscriptIndex,
  pageHeadTags,
  routeFor,
  structuredDataScript,
  trimTrailingSlash,
} from 'react-cheminfo/core';

import { mountedOrigin, stripBase } from './sitePath.ts';

/** The site of the family this server answers for. */
const SITE: SiteId = 'tex';

/** What the tool does, in the words a search result is read in. */
const WHAT_IT_DOES =
  'Render LaTeX and mhchem formulas as SVG or PNG images, learn the notation with a guided tutorial, and practise it with graded exercises.';

/** The pages the server describes on its own, with no build beside it. */
const EDITOR: RouteMeta = {
  path: '/',
  title: 'LaTeX to SVG and PNG — render a formula as an image',
  description:
    'Write a LaTeX or mhchem formula and take away its image: live preview, SVG and PNG download, and a permanent link any img tag can point at.',
};

const TUTORIAL: RouteMeta = {
  path: '/tutorial',
  title: 'LaTeX tutorial — powers, fractions, symbols, chemistry',
  description:
    'A guided tour of LaTeX notation, one editable step at a time: powers and indices, fractions, Greek letters, operators, matrices and chemical equations.',
};

const EXERCISES: RouteMeta = {
  path: '/exercises',
  title: 'LaTeX exercises — practise the notation by writing it',
  description:
    'Graded LaTeX exercises with instant rendering: write the formula, see it appear, and have your answer checked against the expected one.',
};

/**
 * The pages the crawl path lists. It is a menu, not the route table: a step of
 * the tutorial and an exercise are reached from the page holding them, and the
 * rendering API is a page a reader with no JavaScript can still use.
 */
const NOSCRIPT_ROUTES: readonly NoscriptRoute[] = [
  {
    ...EDITOR,
    short: 'Editor',
    note: 'write a formula and take away its image',
  },
  {
    ...TUTORIAL,
    short: 'Tutorial',
    note: 'the notation, one step at a time',
  },
  {
    ...EXERCISES,
    short: 'Exercises',
    note: 'practise by writing it',
  },
  {
    path: '/docs',
    title: 'API documentation',
    description: WHAT_IT_DOES,
  },
];

/**
 * Give the served page the title, the description and the canonical address of
 * the route it is answering, the card a link to it unfurls into, and the block
 * describing the tool. A crawler that does not run scripts sees the right page
 * rather than the editor's.
 * @param html - The built page, carrying `<!--cheminfo:head-->`.
 * @param options.url - The address asked for, query string included.
 * @param options.origin - Where the site is served from, e.g.
 * `https://tex.cheminfo.org`. Written into every absolute address.
 * @param options.routes - What the build says each address is called, from
 * `readRoutes`. Without it a step and an exercise fall back to the name of the
 * page holding them.
 * @param options.basePath - The path the tool is mounted at, `/` by default.
 * A proxy normally strips it before the request arrives, so it is written back
 * into every absolute address the head carries.
 * @returns The page, with its head written for that route.
 */
export function injectPageMeta(
  html: string,
  options: {
    url: string;
    origin: string;
    routes?: readonly RouteMeta[];
    basePath?: string;
  },
): string {
  const { url, origin, routes, basePath = '/' } = options;
  const meta = pageMetaFor(stripBase(basePath, url), routes);

  // The route is resolved here rather than by the shared table lookup, because
  // a step and an exercise the build did not name are still their own address.
  const served = {
    site: SITE,
    routes: [meta],
    origin: mountedOrigin(origin, basePath),
  };

  const head = [
    pageHeadTags({ ...served, url: meta.path }),
    structuredDataScript({
      ...served,
      description: WHAT_IT_DOES,
      operatingSystem: 'Any',
    }),
  ].join('\n');

  return fill(html, PAGE_HEAD_MARKER, head);
}

/**
 * Write the crawl path into the page the server hands out. It is the same on
 * every address and names no origin — its links are written against the
 * `<base>` the deployment stamps in — so it is written once, when the page is
 * read, rather than per request.
 * @param html - The built page, carrying `<!--cheminfo:body-->`.
 * @returns The page, with the index a visitor without JavaScript reads.
 */
export function injectCrawlPath(html: string): string {
  return fill(
    html,
    PAGE_BODY_MARKER,
    noscriptIndex({
      site: SITE,
      routes: NOSCRIPT_ROUTES,
      heading: 'tex.cheminfo.org — LaTeX formulas as images',
      intro:
        'Render a LaTeX or mhchem formula as an SVG or PNG image, learn the notation step by step, and practise it with graded exercises. The tool itself needs JavaScript; the rendering API does not.',
      // The build bakes in no mount, so the crawl path is written against the
      // `<base>` the container stamps in at startup rather than the root of a
      // host this deployment may only share.
      hrefs: 'relative',
      ecosystem: { taglines: false },
    }),
  );
}

/**
 * The page an address opens. An address this tool does not know opens the
 * editor, as the frontend router does, and is indexed as the home page rather
 * than under its own name.
 * @param url - The address asked for, query string included.
 * @param routes - What the build says each address is called, from
 * `readRoutes`. A step and an exercise are only named by it: the backend has
 * no way of its own to know what they are about.
 * @returns The title, description and canonical path of that page.
 */
export function pageMetaFor(
  url: string,
  routes: readonly RouteMeta[] = [],
): RouteMeta {
  const pathname = trimTrailingSlash(url.split('?', 1)[0] ?? '/') || '/';
  const named = routeFor(routes, pathname);
  if (named) return { ...named, path: pathname };

  const [, first, second] = pathname.split('/');

  if (first === 'tutorial') {
    return { ...TUTORIAL, path: second ? `/tutorial/${second}` : '/tutorial' };
  }

  if (first === 'exercises') {
    return {
      ...EXERCISES,
      path: second ? `/exercises/${second}` : '/exercises',
    };
  }

  return { ...EDITOR };
}
