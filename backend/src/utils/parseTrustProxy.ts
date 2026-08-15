/**
 * Parse the TRUST_PROXY environment variable into the value Fastify expects.
 * Accepts an address, a CIDR range, a comma-separated list of either, a hop
 * count, or `true`. Anything unset, blank or `false` disables proxy trust.
 * @param value - Raw environment value.
 * @returns The `trustProxy` option for the Fastify constructor.
 */
export function parseTrustProxy(
  value: string | undefined,
): boolean | number | string {
  const text = value?.trim();
  if (!text || text === 'false') return false;
  if (text === 'true') return true;
  if (/^\d+$/.test(text)) return Number(text);
  return text;
}
