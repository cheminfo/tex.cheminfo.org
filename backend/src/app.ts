import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';

import healthRoutes from './routes/health.ts';
import renderRoutes from './routes/render.ts';
import type { FastifyTyped } from './types.ts';
import { injectTrackingScript } from './utils/injectTrackingScript.ts';
import { injectPageMeta } from './utils/pageMeta.ts';

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
  const index = injectTrackingScript(
    readFileSync(join(root, 'index.html'), 'utf8'),
    options.trackingScript,
  );

  const sendIndex = (request: FastifyRequest, reply: FastifyReply) =>
    reply.type('text/html; charset=utf-8').send(
      injectPageMeta(index, {
        url: request.url,
        origin: options.siteUrl ?? `${request.protocol}://${request.host}`,
      }),
    );

  void fastify.register(fastifyStatic, { root, index: false });

  fastify.get('/index.html', { schema: { hide: true } }, sendIndex);

  fastify.setNotFoundHandler((request, reply) => {
    if (request.method !== 'GET' || request.url.startsWith('/v1/')) {
      return reply.code(404).send({ error: 'Not found' });
    }
    return sendIndex(request, reply);
  });
}
