import { Buffer } from 'node:buffer';

import { Type } from '@sinclair/typebox';
import sharp from 'sharp';

import { renderLatex } from '../renderer.ts';
import type { FastifyTyped } from '../types.ts';

const querySchema = Type.Object({
  tex: Type.Optional(
    Type.String({ description: 'URL-encoded LaTeX formula to render.' }),
  ),
  format: Type.Optional(
    Type.Union([Type.Literal('svg'), Type.Literal('png')], {
      description: 'Output image format.',
      default: 'svg',
    }),
  ),
  backgroundColor: Type.Optional(
    Type.String({
      description: 'Any CSS color string, painted behind the formula.',
      default: 'white',
    }),
  ),
  resolution: Type.Optional(
    Type.String({
      description: 'Rasterization density in DPI, PNG output only.',
      default: '150',
    }),
  ),
});

const imageResponses = {
  // Unsafe because the payload is a binary Buffer for PNG and a string for
  // SVG; the schema only documents it, Fastify skips serialization for
  // non-JSON content types.
  200: Type.Unsafe<unknown>({
    type: 'string',
    format: 'binary',
    description: 'The rendered image.',
  }),
  400: Type.String({ description: 'The LaTeX formula could not be parsed.' }),
};

function injectBackground(svg: string, color: string): string {
  return svg.replace(/<svg(?:\s[^>]*)?>/, (match) => {
    if (match.includes('style="')) {
      return match.replace('style="', `style="background-color: ${color}; `);
    }
    return match.replace('<svg', `<svg style="background-color: ${color};"`);
  });
}

/**
 * Register routes for LaTeX rendering.
 * - GET /    — legacy compat: redirects to /v1/ when tex param is present
 *              and the client is not a browser (e.g. an <img> tag).
 * - GET /v1/ — canonical renderer (SVG or PNG)
 * @param fastify - The Fastify instance to register routes on.
 */
export default async function renderRoutes(fastify: FastifyTyped) {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['render'],
        summary: 'Legacy tex.cheminfo.org entry point',
        description:
          'Redirects `?tex=` requests from non-browser clients to /v1/; browsers get the frontend.',
        querystring: querySchema,
        response: { 302: Type.Null() },
      },
    },
    async (request, reply) => {
      const { tex } = request.query;
      if (!tex) return reply.callNotFound();
      const accept = request.headers.accept ?? '';
      if (accept.includes('text/html')) return reply.callNotFound();
      const { search } = new URL(request.url, 'http://localhost');
      return reply.redirect(`/v1/${search}`, 302);
    },
  );

  fastify.get(
    '/v1/',
    {
      schema: {
        tags: ['render'],
        summary: 'Render a LaTeX formula as an image',
        querystring: querySchema,
        response: imageResponses,
        produces: ['image/svg+xml', 'image/png'],
      },
    },
    async (request, reply) => {
      const {
        tex,
        format = 'svg',
        backgroundColor = 'white',
        resolution = '150',
      } = request.query;

      if (!tex) {
        return reply.redirect('/');
      }

      let result;
      try {
        result = await renderLatex(tex);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return reply
          .status(400)
          .header('Content-Type', 'text/plain')
          .send(`LaTeX error: ${message}`);
      }

      const svgWithBg = injectBackground(result.svg, backgroundColor);

      if (format === 'png') {
        const dpi = Number(resolution) || 150;
        const pngBuffer = await sharp(Buffer.from(svgWithBg), { density: dpi })
          .png()
          .toBuffer();
        return reply
          .header('Content-Type', 'image/png')
          .header('Cache-Control', 'public, max-age=86400')
          .send(pngBuffer);
      }

      return reply
        .header('Content-Type', 'image/svg+xml')
        .header('Cache-Control', 'public, max-age=86400')
        .send(svgWithBg);
    },
  );
}
