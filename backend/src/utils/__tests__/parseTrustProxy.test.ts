import { expect, test } from 'vitest';

import { parseTrustProxy } from '../parseTrustProxy.ts';

test('an unset, blank or false value disables proxy trust', () => {
  expect(parseTrustProxy(undefined)).toBe(false);
  expect(parseTrustProxy('  ')).toBe(false);
  expect(parseTrustProxy('false')).toBe(false);
});

test('true believes any peer', () => {
  expect(parseTrustProxy('true')).toBe(true);
});

test('a digit-only value is a hop count', () => {
  expect(parseTrustProxy('2')).toBe(2);
});

test('an address, a CIDR range or a list is passed through trimmed', () => {
  expect(parseTrustProxy(' 192.168.1.5 ')).toBe('192.168.1.5');
  expect(parseTrustProxy('10.0.0.0/8')).toBe('10.0.0.0/8');
  expect(parseTrustProxy('192.168.1.5,172.16.0.0/12')).toBe(
    '192.168.1.5,172.16.0.0/12',
  );
});
