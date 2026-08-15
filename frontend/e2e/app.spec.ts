import { expect, test } from '@playwright/test';

const SIMPLE_FORMULA = 'x^2';
const COMPLEX_FORMULA = String.raw`\frac{-b \pm \sqrt{b^2-4ac}}{2a}`;
const BASE_URL = 'https://tex.cheminfo.org';

test('page loads with editor and empty placeholders', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.latex-editor')).toBeVisible();
  await expect(page.locator('.placeholder').first()).toBeVisible();
});

test('typing a formula renders the live preview', async ({ page }) => {
  await page.goto('/');

  await page.locator('.cm-content').fill(SIMPLE_FORMULA);

  // MathJax renders SVG into the live preview
  await expect(page.locator('.live-preview svg')).toBeVisible();
});

test('embed code shows HTML img tag', async ({ page }) => {
  await page.goto('/');

  await page.locator('.cm-content').fill(SIMPLE_FORMULA);

  const htmlTextarea = page
    .locator('.code-row')
    .first()
    .locator('.code-output');
  await expect(htmlTextarea).toHaveValue(
    new RegExp(String.raw`<img src="${BASE_URL}/v1/\?tex=`),
  );
});

test('embed code shows Markdown image syntax', async ({ page }) => {
  await page.goto('/');

  await page.locator('.cm-content').fill(SIMPLE_FORMULA);

  const mdTextarea = page.locator('.code-row').nth(1).locator('.code-output');
  await expect(mdTextarea).toHaveValue(
    new RegExp(String.raw`!\[formula\]\(${BASE_URL}/v1/\?tex=`),
  );
});

test('URL updates with ?tex= param when formula is typed', async ({ page }) => {
  await page.goto('/');

  await page.locator('.cm-content').fill(SIMPLE_FORMULA);

  await expect(page).toHaveURL(
    new RegExp(`tex=${encodeURIComponent(SIMPLE_FORMULA)}`),
  );
});

test('?tex= URL param pre-fills the editor on load', async ({ page }) => {
  await page.goto(`/?tex=${encodeURIComponent(SIMPLE_FORMULA)}`);

  await expect(page.locator('.cm-content')).toHaveText(SIMPLE_FORMULA);
  await expect(page.locator('.live-preview svg')).toBeVisible();
});

test('server render shows an image after debounce', async ({ page }) => {
  await page.goto('/');

  await page.locator('.cm-content').fill(SIMPLE_FORMULA);

  // Backend debounce is 800 ms — wait for the img to appear
  const serverImg = page.locator('.server-preview img');
  await expect(serverImg).toBeVisible({ timeout: 5000 });
  await expect(serverImg).toHaveAttribute('src', /\/v1\/\?tex=/);
});

test('server render works for a complex formula', async ({ page }) => {
  await page.goto(`/?tex=${encodeURIComponent(COMPLEX_FORMULA)}`);

  const serverImg = page.locator('.server-preview img');
  await expect(serverImg).toBeVisible({ timeout: 5000 });
});

test('copy SVG and copy PNG buttons are present and enabled', async ({
  page,
}) => {
  await page.goto(`/?tex=${encodeURIComponent(SIMPLE_FORMULA)}`);

  const copySvgBtn = page.getByTitle('Copy SVG to clipboard');
  const copyPng150Btn = page.getByTitle('Copy PNG at 150 dpi');
  const copyPng300Btn = page.getByTitle('Copy PNG at 300 dpi');

  await expect(copySvgBtn).toBeEnabled();
  await expect(copyPng150Btn).toBeEnabled();
  await expect(copyPng300Btn).toBeEnabled();
});

test('copy buttons are disabled when editor is empty', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTitle('Copy SVG to clipboard')).toBeDisabled();
  await expect(page.getByTitle('Copy PNG at 150 dpi')).toBeDisabled();
});
