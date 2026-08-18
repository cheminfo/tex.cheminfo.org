import { sitemapXml } from 'react-cheminfo/core';

/**
 * The sitemap, listing every page of the site as an absolute address.
 * @param origin - Where the site is served from, e.g.
 * `https://tex.cheminfo.org`.
 * @param paths - The addresses to list, mount path included, from the routes
 * the build wrote. Only the address of a page is listed, never its name, so
 * the entries carry no prose of their own.
 * @returns The XML document.
 */
export function buildSitemap(origin: string, paths: string[]): string {
  return sitemapXml({
    site: 'tex',
    routes: paths.map((path) => ({ path, title: '', description: '' })),
    origin,
  });
}
