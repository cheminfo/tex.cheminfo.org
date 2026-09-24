import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { renderToSvg } from '../src/shared/mathjax.ts';

const SIMPLE_FORMULA = 'x^2';
const SIMPLE_QUERY = encodeURIComponent(SIMPLE_FORMULA);

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

function readClipboard(page: Page): Promise<string> {
  return page.evaluate(() => navigator.clipboard.readText());
}

test('the tool text cannot be selected', async ({ page }) => {
  await page.goto('/');

  const label = page.getByText('Live preview', { exact: true });
  await expect(label).toHaveCSS('user-select', 'none');

  await label.dblclick();
  const selected = await page.evaluate(
    () => globalThis.getSelection()?.toString() ?? '',
  );
  expect(selected).toBe('');
});

test('the formula editor stays selectable', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.cm-content')).toHaveCSS('user-select', 'text');
});

test('the live preview copies the formula as SVG', async ({ page }) => {
  await page.goto(`/?tex=${SIMPLE_QUERY}`);

  const preview = page.locator('.live-preview');
  await expect(preview.locator('.mathjax-render svg')).toBeVisible();
  await expect(preview).toHaveCSS('cursor', 'copy');
  await expect(preview).toHaveAttribute('title', 'Copy the formula as SVG');
  // The strip chrome.css keeps for the glyph, which the well's own padding
  // shorthand must not take back.
  await expect(preview).toHaveCSS('padding-right', '22px');

  await preview.click();
  await expect(preview).toHaveAttribute('data-copy', 'copied');

  expect(await readClipboard(page)).toBe(renderToSvg(SIMPLE_FORMULA, true));
});

test('an empty live preview copies nothing', async ({ page }) => {
  await page.goto('/');

  const preview = page.locator('.live-preview');
  await expect(preview).toHaveCSS('cursor', 'auto');
  await expect(preview).not.toHaveAttribute('role', 'button');
  await expect(preview).not.toHaveAttribute('title', /Copy/);
});

test('the server render copies the address of its image', async ({ page }) => {
  await page.goto(`/?tex=${SIMPLE_QUERY}`);

  const preview = page.locator('.server-preview');
  await expect(preview.locator('img')).toBeVisible({ timeout: 5000 });
  await expect(preview).toHaveCSS('cursor', 'copy');
  await expect(preview).toHaveAttribute('title', 'Copy the image link');

  await preview.click();
  await expect(preview).toHaveAttribute('data-copy', 'copied');

  expect(await readClipboard(page)).toBe(
    `https://tex.cheminfo.org/v1/?tex=${SIMPLE_QUERY}`,
  );
});

test('a revealed solution copies its LaTeX', async ({ page }) => {
  await page.goto('/exercises/one-half');

  await page.getByRole('button', { name: 'Reveal solution' }).click();

  const solution = page.locator('.solution-block .click-to-copy');
  await expect(solution).toHaveAttribute(
    'title',
    String.raw`Copy the LaTeX (\frac{1}{2})`,
  );

  await solution.click();
  await expect(solution).toHaveAttribute('data-copy', 'copied');

  expect(await readClipboard(page)).toBe(String.raw`\frac{1}{2}`);
});

test('a glossary example copies its LaTeX without closing the card', async ({
  page,
}) => {
  await page.goto('/tutorial/1');

  // The card opens on focus as well as on hover, and the keyboard reaches the
  // example wherever the card has room to open.
  await page.locator('.glossary-term').first().focus();

  const card = page.locator('.glossary-card').first();
  await expect(card).toHaveCSS('display', 'flex');

  const example = card.locator('.glossary-example .click-to-copy').first();
  // Attached, not visible: the open card is clipped by the section around it,
  // so the keyboard is the path this asserts.
  await expect(example).toBeAttached();
  await expect(example).toHaveAttribute('title', 'Copy the LaTeX (v = d/t)');

  await example.press('Enter');
  await expect(example).toHaveAttribute('data-copy', 'copied');

  expect(await readClipboard(page)).toBe('v = d/t');
  await expect(card).toHaveCSS('display', 'flex');
});
