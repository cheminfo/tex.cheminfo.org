/**
 * The share vocabulary this tool understands, and the only place that knows
 * the parameter names. `embed` and `hide` are shared by every cheminfo tool;
 * `zoom` is this tool's own. Unknown `hide` keys are ignored and a malformed
 * number falls back to its default, so a link written years ago still opens.
 */

export const HIDEABLE_FEATURES = [
  'examples',
  'reference',
  'commands',
  'help',
  'embedCode',
  'serverRender',
  'exerciseList',
  'tutorialSteps',
] as const;

export type FeatureKey = (typeof HIDEABLE_FEATURES)[number];

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const DEFAULT_ZOOM = 2;

/** Every parameter this module owns; the page owns everything else. */
const CONFIG_KEYS = ['embed', 'hide', 'zoom'] as const;

export interface ShareConfig {
  /**
   * Drop the site chrome, so the page can be framed in someone else's site.
   * @default false
   */
  embed: boolean;
  /**
   * Feature keys switched off, in `HIDEABLE_FEATURES` order.
   * @default []
   */
  hide: readonly FeatureKey[];
  /**
   * Preview magnification, clamped to `MIN_ZOOM`…`MAX_ZOOM`.
   * @default 2
   */
  zoom: number;
}

export const DEFAULT_SHARE_CONFIG: ShareConfig = {
  embed: false,
  hide: [],
  zoom: DEFAULT_ZOOM,
};

/**
 * Read a share configuration out of a query string.
 * @param search - The query string, with or without its leading `?`.
 * @returns The configuration the link asks for.
 */
export function parseShareConfig(search: string): ShareConfig {
  const params = new URLSearchParams(search);
  return {
    embed: params.has('embed') && params.get('embed') !== '0',
    hide: parseHide(params.get('hide')),
    zoom: clampZoom(params.get('zoom')),
  };
}

/**
 * Write a share configuration into a URL, replacing whatever it carried.
 * A parameter left at its default is deleted, never written, so an
 * unconfigured link stays a plain link.
 * @param url - The URL to rewrite; it is not mutated.
 * @param config - The configuration to write.
 * @returns The rewritten URL.
 */
export function applyShareConfig(url: URL, config: ShareConfig): URL {
  const next = new URL(url.toString());
  for (const key of CONFIG_KEYS) next.searchParams.delete(key);
  if (config.embed) next.searchParams.set('embed', '1');
  if (config.hide.length > 0) {
    next.searchParams.set('hide', config.hide.join(','));
  }
  if (config.zoom !== DEFAULT_ZOOM) {
    next.searchParams.set('zoom', String(config.zoom));
  }
  return next;
}

/**
 * Serialize a URL for display, turning `%2C` back into `,`.
 * The commas of `hide` parse identically either way, and a teacher has to be
 * able to read the link they are handing out.
 * @param url - The URL to serialize.
 * @returns The readable URL.
 */
export function serializeShareUrl(url: URL): string {
  return url.toString().replaceAll('%2C', ',');
}

/**
 * Whether a feature is switched off by the configuration.
 * @param config - The configuration in force.
 * @param feature - The feature to test.
 * @returns True when the feature must not be rendered.
 */
export function isHidden(config: ShareConfig, feature: FeatureKey): boolean {
  return config.hide.includes(feature);
}

function parseHide(value: string | null): readonly FeatureKey[] {
  if (!value) return [];
  const asked = new Set(value.split(',').map((key) => key.trim()));
  return HIDEABLE_FEATURES.filter((feature) => asked.has(feature));
}

function clampZoom(value: string | null): number {
  const zoom = Number(value);
  if (!Number.isFinite(zoom) || zoom === 0) return DEFAULT_ZOOM;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(zoom)));
}
