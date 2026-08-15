import { expect, test } from 'vitest';

import type { ShareConfig } from '../shareConfig.ts';
import {
  DEFAULT_SHARE_CONFIG,
  applyShareConfig,
  isHidden,
  parseShareConfig,
  serializeShareUrl,
} from '../shareConfig.ts';

const BASE = 'https://tex.cheminfo.org/';

function roundTrip(config: ShareConfig): ShareConfig {
  return parseShareConfig(applyShareConfig(new URL(BASE), config).search);
}

test('an address with no configuration parses to the defaults', () => {
  expect(parseShareConfig('?tex=x%5E2')).toStrictEqual(DEFAULT_SHARE_CONFIG);
});

test('a bare ?embed and ?embed=1 both switch embed on', () => {
  expect(parseShareConfig('?embed').embed).toBe(true);
  expect(parseShareConfig('?embed=1').embed).toBe(true);
  expect(parseShareConfig('?embed=0').embed).toBe(false);
});

test('hide keys are read in feature order and unknown keys are ignored', () => {
  expect(
    parseShareConfig('?hide=help,nosuchthing,examples').hide,
  ).toStrictEqual(['examples', 'help']);
});

test('zoom is clamped and a malformed value falls back to the default', () => {
  expect(parseShareConfig('?zoom=1').zoom).toBe(1);
  expect(parseShareConfig('?zoom=99').zoom).toBe(3);
  expect(parseShareConfig('?zoom=-4').zoom).toBe(1);
  expect(parseShareConfig('?zoom=banana').zoom).toBe(2);
  expect(parseShareConfig('?zoom=').zoom).toBe(2);
});

test('defaults are deleted from the URL rather than written', () => {
  const url = applyShareConfig(
    new URL(`${BASE}?tex=x&embed=1&hide=help&zoom=3`),
    DEFAULT_SHARE_CONFIG,
  );

  expect(url.toString()).toBe(`${BASE}?tex=x`);
});

test('the page inputs survive a configuration rewrite', () => {
  const url = applyShareConfig(new URL(`${BASE}?tex=x%5E2`), {
    embed: true,
    hide: ['embedCode'],
    zoom: 3,
  });

  expect(serializeShareUrl(url)).toBe(
    `${BASE}?tex=x%5E2&embed=1&hide=embedCode&zoom=3`,
  );
});

test('serializing turns %2C back into a readable comma', () => {
  const url = applyShareConfig(new URL(BASE), {
    embed: false,
    hide: ['examples', 'help'],
    zoom: 2,
  });

  expect(url.toString()).toBe(`${BASE}?hide=examples%2Chelp`);
  expect(serializeShareUrl(url)).toBe(`${BASE}?hide=examples,help`);
});

test('parse then apply then parse is stable', () => {
  const config: ShareConfig = {
    embed: true,
    hide: ['examples', 'serverRender'],
    zoom: 1,
  };

  expect(roundTrip(config)).toStrictEqual(config);
  expect(roundTrip(DEFAULT_SHARE_CONFIG)).toStrictEqual(DEFAULT_SHARE_CONFIG);
});

test('isHidden answers for the features the link switched off', () => {
  const config = parseShareConfig('?hide=examples');

  expect(isHidden(config, 'examples')).toBe(true);
  expect(isHidden(config, 'help')).toBe(false);
});
