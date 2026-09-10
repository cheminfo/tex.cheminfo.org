import { buildShareUrl, isHidden, parseShareConfig } from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import type { ShareConfig } from '../shareConfig.ts';
import { DEFAULT_SHARE_CONFIG, SHARE_VOCABULARY } from '../shareConfig.ts';

const BASE = 'https://tex.cheminfo.org/';

const parse = (search: string) => parseShareConfig(search, SHARE_VOCABULARY);
const share = (href: string, config: ShareConfig) =>
  buildShareUrl({
    base: href,
    search: new URL(href).search,
    config,
    vocabulary: SHARE_VOCABULARY,
  });
const roundTrip = (config: ShareConfig) =>
  parse(new URL(share(BASE, config)).search);

test('an address with no configuration parses to the defaults', () => {
  expect(parse('?tex=x%5E2')).toStrictEqual(DEFAULT_SHARE_CONFIG);
});

test('a bare ?embed and ?embed=1 both switch embed on', () => {
  expect(parse('?embed').embed).toBe(true);
  expect(parse('?embed=1').embed).toBe(true);
  expect(parse('?embed=0').embed).toBe(false);
});

test('hide keys are read in feature order and unknown keys are ignored', () => {
  expect(parse('?hide=help,nosuchthing,examples').hidden).toStrictEqual([
    'examples',
    'help',
  ]);
});

test('zoom is clamped and a malformed value falls back to the default', () => {
  expect(parse('?zoom=1').params.zoom).toBe(1);
  expect(parse('?zoom=99').params.zoom).toBe(3);
  expect(parse('?zoom=-4').params.zoom).toBe(1);
  expect(parse('?zoom=banana').params.zoom).toBe(2);
  expect(parse('?zoom=').params.zoom).toBe(2);
});

test('defaults are deleted from the URL rather than written', () => {
  expect(
    share(`${BASE}?tex=x&embed=1&hide=help&zoom=3`, DEFAULT_SHARE_CONFIG),
  ).toBe(`${BASE}?tex=x`);
});

test('the page inputs survive a configuration rewrite', () => {
  expect(
    share(`${BASE}?tex=x%5E2`, {
      embed: true,
      hidden: ['embedCode'],
      params: { zoom: 3 },
    }),
  ).toBe(`${BASE}?tex=x%5E2&embed=1&hide=embedCode&zoom=3`);
});

test('the commas of a hide list are left legible', () => {
  // A teacher reads these links out loud and pastes them into course pages;
  // `hide=examples%2Chelp` parses identically and is needlessly cryptic.
  expect(
    share(BASE, {
      embed: false,
      hidden: ['examples', 'help'],
      params: { zoom: 2 },
    }),
  ).toBe(`${BASE}?hide=examples,help`);
});

test('parse then apply then parse is stable', () => {
  const config: ShareConfig = {
    embed: true,
    hidden: ['examples', 'serverRender'],
    params: { zoom: 1 },
  };

  expect(roundTrip(config)).toStrictEqual(config);
  expect(roundTrip(DEFAULT_SHARE_CONFIG)).toStrictEqual(DEFAULT_SHARE_CONFIG);
});

test('isHidden answers for the features the link switched off', () => {
  const config = parse('?hide=examples');

  expect(isHidden(config, 'examples')).toBe(true);
  expect(isHidden(config, 'help')).toBe(false);
});
