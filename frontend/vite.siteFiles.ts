import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { sitemapXml } from 'react-cheminfo/core';
import type { Plugin } from 'vite';

import { PAGE_ROUTES } from './src/state/routes.ts';
import { configuredSiteUrl } from './src/state/sitePath.ts';

/**
 * Write the two files that describe the site to something other than a
 * browser: `sitemap.xml`, and the `routes.json` the server titles the page it
 * hands out from. Both come from the one route table the app itself reads, so
 * a step or an exercise added to the content is listed without anybody
 * remembering to.
 * @param siteUrl - Where the site is served, mount path included. Every
 * address in the sitemap hangs off it, so a deployment under a path lists the
 * addresses it actually answers.
 * @returns The Vite plugin.
 */
export function siteFiles(siteUrl: string = configuredSiteUrl()): Plugin {
  return {
    name: 'tex-site-files',
    apply: 'build',
    writeBundle(options) {
      const directory = options.dir ?? 'dist';
      writeFileSync(
        join(directory, 'sitemap.xml'),
        sitemapXml({ site: 'tex', routes: PAGE_ROUTES, origin: siteUrl }),
      );
      writeFileSync(
        join(directory, 'routes.json'),
        `${JSON.stringify(PAGE_ROUTES, null, 2)}\n`,
      );
    },
  };
}
