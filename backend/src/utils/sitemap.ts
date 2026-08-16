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
