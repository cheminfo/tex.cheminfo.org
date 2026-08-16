import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every address the frontend routes itself: the editor, the tutorial and each
 * of its steps, the exercises and each one of them. The frontend build writes
 * them next to the page, because it is the only side that knows how many steps
 * and exercises there are.
 * @param root - Where the built frontend is.
 * @returns The paths, the home page first, or the three pages that always exist
 * when no build has written them.
 */
export function sitemapPaths(root: string): string[] {
  try {
    const routes: unknown = JSON.parse(
      readFileSync(join(root, 'routes.json'), 'utf8'),
    );
    if (Array.isArray(routes) && routes.every((r) => typeof r === 'string')) {
      return routes;
    }
  } catch {
    // No build, or a file we did not write: the pages below always exist.
  }
  return ['/', '/tutorial', '/exercises'];
}

/**
 * The sitemap, listing every page of the site as an absolute address.
 * @param origin - Where the site is served from, e.g.
 * `https://tex.cheminfo.org`.
 * @param paths - The addresses to list, from `sitemapPaths`.
 * @returns The XML document.
 */
export function buildSitemap(origin: string, paths: string[]): string {
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  const urls = paths
    .map((path) => `  <url><loc>${escapeText(`${base}${path}`)}</loc></url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** The origin comes from the Host header, so it is never trusted. */
function escapeText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
