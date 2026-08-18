import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import { robotsTxt } from 'react-cheminfo/core';

import healthRoutes from './routes/health.ts';
import renderRoutes from './routes/render.ts';
import type { FastifyTyped } from './types.ts';
import { injectTrackingScript } from './utils/injectTrackingScript.ts';
import { injectCrawlPath, injectPageMeta } from './utils/pageMeta.ts';
import { readRoutes } from './utils/routes.ts';
import { basePathOf, joinBase, mountedOrigin } from './utils/sitePath.ts';
import { buildSitemap } from './utils/sitemap.ts';

export interface BuildAppOptions {
  /**
   * The reverse proxies whose `X-Forwarded-For` is believed.
   * @default false
   */
  trustProxy?: boolean | number | string;
  /**
   * Analytics snippet injected at the end of the served page's `<head>`.
   * @default undefined
   */
  trackingScript?: string;
  /**
   * Directory holding the built frontend. When absent, no page is served.
   * @default undefined
   */
  frontendRoot?: string;
  /**
   * Where the site is served from, e.g. `https://tex.cheminfo.org`, written
   * into the canonical and social addresses of every page. Unset derives it
   * from the request, which is only right when `trustProxy` names the proxy.
   * @default undefined
   */
  siteUrl?: string;
  /**
   * Whether Fastify logs requests.
   * @default true
   */
  logger?: boolean;
}

/**
 * Build and configure the Fastify application.
 * @param options - Deployment-dependent settings, all optional so tests can
 * build a bare API instance.
 * @returns Configured Fastify instance.
 */
export async function buildApp(options: BuildAppOptions = {}) {
  const {
    trustProxy = false,
    trackingScript,
    frontendRoot,
    siteUrl,
    logger = true,
  } = options;

  const fastify = Fastify({
    logger,
    trustProxy,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'tex.cheminfo.org',
        description: 'Render LaTeX formulas as SVG or PNG images.',
        version: '1.0.0',
      },
    },
  });
  await fastify.register(swaggerUi, { routePrefix: '/docs' });

  await fastify.register(cors, { origin: '*' });
  await fastify.register(healthRoutes);
  await fastify.register(renderRoutes);

  if (frontendRoot) {
    registerFrontend(fastify, frontendRoot, { trackingScript, siteUrl });
  }

  return fastify;
}

function registerFrontend(
  fastify: FastifyTyped,
  root: string,
  options: { trackingScript?: string; siteUrl?: string },
): void {
  // The built page is a template: the crawl path is the same on every address,
  // so it is written once here, and the head is written per request below.
  const index = injectCrawlPath(
    injectTrackingScript(
      readFileSync(join(root, 'index.html'), 'utf8'),
      options.trackingScript,
    ),
  );

  const routes = readRoutes(root);

  // `SITE_URL` carries the origin and the mount path together. A proxy that
  // puts the tool under a path strips it before the request arrives, so the
  // path is written back into every absolute address the pages hand out.
  const site = options.siteUrl ? new URL(options.siteUrl) : null;
  const basePath = site ? basePathOf(site.href) : '/';
  const originOf = (request: FastifyRequest) =>
    site?.origin ?? `${request.protocol}://${request.host}`;

  const sendIndex = (request: FastifyRequest, reply: FastifyReply) =>
    reply.type('text/html; charset=utf-8').send(
      injectPageMeta(index, {
        url: request.url,
        origin: originOf(request),
        routes,
        basePath,
      }),
    );

  void fastify.register(fastifyStatic, { root, index: false });

  fastify.get('/index.html', { schema: { hide: true } }, sendIndex);

  const paths = routes.map((route) => joinBase(basePath, route.path));
  fastify.get('/sitemap.xml', { schema: { hide: true } }, (request, reply) =>
    reply
      .type('application/xml; charset=utf-8')
      .send(buildSitemap(originOf(request), paths)),
  );

  // Written here rather than kept in `public/` because what it points at moves
  // with the mount path. A crawler only reads it from the root of a host, so a
  // tool mounted under a path is covered by whatever answers that root.
  //
  // `robotsTxt` allows the root of the host it is read from; a tool mounted
  // under a path allows that mount instead, and the endpoints it keeps out of
  // the index sit under it too.
  fastify.get('/robots.txt', { schema: { hide: true } }, (request, reply) =>
    reply.type('text/plain; charset=utf-8').send(
      robotsTxt(
        {
          site: 'tex',
          routes,
          origin: mountedOrigin(originOf(request), basePath),
        },
        ['/v1/', '/docs'],
      ),
    ),
  );

  fastify.setNotFoundHandler((request, reply) => {
    if (request.method !== 'GET' || request.url.startsWith('/v1/')) {
      return reply.code(404).send({ error: 'Not found' });
    }
    return sendIndex(request, reply);
  });
}
