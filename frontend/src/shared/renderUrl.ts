const PRODUCTION_BASE =
  import.meta.env.VITE_PRODUCTION_BASE ?? 'https://tex.cheminfo.org';

/**
 * Build the rendering-API address for a formula.
 * @param tex - The LaTeX formula.
 * @param base - The deployment the image is served from.
 * @default PRODUCTION_BASE
 * @returns The `<img>`-ready URL.
 */
export function buildRenderUrl(
  tex: string,
  base: string = PRODUCTION_BASE,
): string {
  return `${base}/v1/?tex=${encodeURIComponent(tex)}`;
}

/**
 * Build the `<img>` tag that puts the rendered formula in someone else's page.
 * @param tex - The LaTeX formula.
 * @param base - The deployment the image is served from.
 * @default PRODUCTION_BASE
 * @returns The HTML snippet.
 */
export function buildRenderImageTag(
  tex: string,
  base: string = PRODUCTION_BASE,
): string {
  return `<img src="${buildRenderUrl(tex, base)}"/>`;
}
