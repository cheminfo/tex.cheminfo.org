import type { RouteMeta } from './routes.ts';

const SITE_NAME = 'tex.cheminfo.org';

export interface PageMeta {
  /** What the tab, the search result and the shared card are titled. */
  title: string;
  /** The line under the title in a search result and a shared card. */
  description: string;
  /**
   * The address this page is indexed under, so the query strings the tool
   * writes — a formula, a share configuration — do not read as new pages.
   */
  canonicalPath: string;
}

/**
 * Give the served page the title, the description and the canonical address of
 * the route it is answering, and the card a link to it unfurls into. A crawler
 * that does not run scripts sees the right page rather than the editor's.
 * @param html - The built page.
 * @param options.url - The address asked for, query string included.
 * @param options.origin - Where the site is served from, e.g.
 * `https://tex.cheminfo.org`. Written into every absolute address.
 * @param options.routes - What the build says each address is called, from
 * `readRoutes`. Without it a step and an exercise fall back to the name of the
 * page holding them.
 * @returns The page, with its head rewritten for that route.
 */
export function injectPageMeta(
  html: string,
  options: { url: string; origin: string; routes?: readonly RouteMeta[] },
): string {
  const { url, origin, routes } = options;
  const meta = pageMetaFor(url, routes);
  const title = `${meta.title} — ${SITE_NAME}`;
  const canonical = `${trimTrailingSlash(origin)}${meta.canonicalPath}`;

  const head = [
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttribute(`${trimTrailingSlash(origin)}/og.png`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n');

  return insertBeforeHeadEnd(
    replaceDescription(replaceTitle(html, title), meta.description),
    head,
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
): PageMeta {
  const pathname = trimTrailingSlash(url.split('?', 1)[0] ?? '/') || '/';
  const [, first, second] = pathname.split('/');

  const named = routes.find((route) => route.path === pathname);
  if (named) {
    return {
      title: named.title,
      description: named.description,
      canonicalPath: pathname,
    };
  }

  if (first === 'tutorial') {
    return {
      title: 'LaTeX tutorial — powers, fractions, symbols, chemistry',
      description:
        'A guided tour of LaTeX mathematical notation, one editable step at a time: powers and indices, fractions, Greek letters, operators, matrices and chemical equations.',
      canonicalPath: second ? `/tutorial/${second}` : '/tutorial',
    };
  }

  if (first === 'exercises') {
    return {
      title: 'LaTeX exercises — practise the notation by writing it',
      description:
        'Graded LaTeX exercises with instant rendering: write the formula, see it appear, and have your answer checked against the expected one.',
      canonicalPath: second ? `/exercises/${second}` : '/exercises',
    };
  }

  return {
    title: 'LaTeX to SVG and PNG — render a formula as an image',
    description:
      'Write a LaTeX or mhchem formula and take away its image: live preview, SVG and PNG download, and a permanent link any img tag can point at.',
    canonicalPath: '/',
  };
}

function replaceTitle(html: string, title: string): string {
  const replacement = `<title>${escapeText(title)}</title>`;
  return html.includes('<title>')
    ? html.replace(/<title>[\s\S]*?<\/title>/, replacement)
    : insertBeforeHeadEnd(html, replacement);
}

function replaceDescription(html: string, description: string): string {
  const replacement = `<meta name="description" content="${escapeAttribute(description)}" />`;
  const existing = /<meta[^>]*name="description"[^>]*>/;
  return existing.test(html)
    ? html.replace(existing, replacement)
    : insertBeforeHeadEnd(html, replacement);
}

function insertBeforeHeadEnd(html: string, addition: string): string {
  const head = html.lastIndexOf('</head>');
  if (head === -1) return `${html}\n${addition}\n`;
  return `${html.slice(0, head)}${addition}\n${html.slice(head)}`;
}

function trimTrailingSlash(value: string): string {
  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
}

/** The origin comes from the Host header, so it is never trusted. */
function escapeAttribute(value: string): string {
  return escapeText(value).replaceAll('"', '&quot;');
}

function escapeText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
