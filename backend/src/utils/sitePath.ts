import { trimTrailingSlash } from 'react-cheminfo/core';

/**
 * Where the site is served when the deployment says nothing else: a host of
 * its own, at the root of it. A deployment that puts the tool under a path —
 * one of several on a shared host — names that whole address in `SITE_URL`,
 * and every address the server writes follows from it.
 */
export const DEFAULT_SITE_URL = 'https://tex.cheminfo.org/';

/**
 * The path half of a site address, as the base every other address hangs off.
 * @param siteUrl - The absolute address the site is served at.
 * @returns The path, opened and closed by a slash: `/`, or `/tex/`.
 */
export function basePathOf(siteUrl: string): string {
  return normalizeBasePath(new URL(siteUrl).pathname);
}

/**
 * A path, opened and closed by a slash so the two functions below can assume
 * both ends.
 * @param pathname - The path of a site address.
 * @returns The same path as a base.
 */
export function normalizeBasePath(pathname: string): string {
  const opened = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return opened.endsWith('/') ? opened : `${opened}/`;
}

/**
 * Move one of the site's own addresses under the path it is mounted at.
 * @param basePath - The mount path, as `basePathOf` returns it.
 * @param path - An address of the site, from the site's own root.
 * @returns The address the browser sees.
 */
export function joinBase(basePath: string, path: string): string {
  return path === '/' ? basePath : `${basePath.slice(0, -1)}${path}`;
}

/**
 * Read one of the site's own addresses back out of a requested path. A proxy
 * that mounts the tool under a path normally strips it before the request
 * arrives, so this is what makes the server right either way.
 * @param basePath - The mount path, as `basePathOf` returns it.
 * @param pathname - The path that was asked for.
 * @returns The address from the site's own root, `/` for the mount itself.
 */
export function stripBase(basePath: string, pathname: string): string {
  const mount = basePath.slice(0, -1);
  // `/texture` is not a page of a site mounted at `/tex`, so the mount only
  // matches when what follows it is a path of its own.
  if (mount && (pathname === mount || pathname.startsWith(`${mount}/`))) {
    return pathname.slice(mount.length) || '/';
  }
  return pathname || '/';
}

/**
 * Where every absolute address the site writes hangs off: the origin it
 * answers on and the path it is mounted at, in one value.
 * @param origin - Where the site is served from, e.g. `https://example.org`.
 * @param basePath - The mount path, as `basePathOf` returns it.
 * @returns The origin with the mount joined to it, no trailing slash.
 */
export function mountedOrigin(origin: string, basePath: string): string {
  return trimTrailingSlash(
    `${trimTrailingSlash(origin)}${joinBase(basePath, '/')}`,
  );
}
