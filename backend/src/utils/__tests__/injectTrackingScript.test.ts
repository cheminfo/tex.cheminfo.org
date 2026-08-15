import { expect, test } from 'vitest';

import { injectTrackingScript } from '../injectTrackingScript.ts';

const SNIPPET =
  '<script defer src="https://datami.cheminfo.org/script.js" data-website-id="abc"></script>';
const PAGE =
  '<!doctype html><html><head><title>t</title></head><body></body></html>';

test('inserts the snippet at the end of the head', () => {
  expect(injectTrackingScript(PAGE, SNIPPET)).toBe(
    `<!doctype html><html><head><title>t</title>${SNIPPET}\n</head><body></body></html>`,
  );
});

test('leaves the page untouched when the snippet is unset', () => {
  expect(injectTrackingScript(PAGE)).toBe(PAGE);
});

test('leaves the page untouched when the snippet is blank', () => {
  expect(injectTrackingScript(PAGE, ' '.repeat(3))).toBe(PAGE);
});

test('takes the snippet verbatim, trimming only the surrounding whitespace', () => {
  expect(injectTrackingScript(PAGE, `\n  ${SNIPPET}  \n`)).toContain(SNIPPET);
});

test('never injects the snippet twice', () => {
  const once = injectTrackingScript(PAGE, SNIPPET);
  expect(injectTrackingScript(once, SNIPPET)).toBe(once);
});

test('appends the snippet when the page has no head', () => {
  expect(injectTrackingScript('<p>hello</p>', SNIPPET)).toBe(
    `<p>hello</p>\n${SNIPPET}\n`,
  );
});
