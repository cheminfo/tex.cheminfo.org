import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from 'vite';

import { ALL_EXERCISES } from './src/exercises/exerciseSeries.ts';
import { TUTORIAL_STEPS } from './src/tutorial/tutorialSteps.ts';

const DEFAULT_ORIGIN = 'https://tex.cheminfo.org';

/**
 * Emit `sitemap.xml` from the pages the app really routes, so a step or an
 * exercise added to the content is listed without anybody remembering to.
 * @param origin - Where the site is served from, without a trailing slash.
 * @returns The Vite plugin.
 */
export function sitemap(
  origin: string = process.env.SITE_URL ?? DEFAULT_ORIGIN,
): Plugin {
  return {
    name: 'tex-sitemap',
    apply: 'build',
    writeBundle(options) {
      const directory = options.dir ?? 'dist';
      writeFileSync(
        join(directory, 'sitemap.xml'),
        renderSitemap(trimTrailingSlash(origin)),
      );
    },
  };
}

/**
 * Every address of the tool, most important first.
 * @returns The paths the sitemap lists.
 */
export function sitemapPaths(): string[] {
  const paths = ['/', '/tutorial', '/exercises'];
  for (let step = 1; step <= TUTORIAL_STEPS.length; step++) {
    paths.push(`/tutorial/${step}`);
  }
  for (const exercise of ALL_EXERCISES) {
    paths.push(`/exercises/${exercise.id}`);
  }
  return paths;
}

function renderSitemap(origin: string): string {
  const urls = sitemapPaths()
    .map(
      (path) =>
        `  <url>\n    <loc>${origin}${path}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}
