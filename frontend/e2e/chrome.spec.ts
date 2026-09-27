import { expect, test } from '@playwright/test';

test('the header carries the mark and the two-colour wordmark', async ({
  page,
}) => {
  await page.goto('/');

  const brand = page.locator('.app-header .brand');
  await expect(brand).toBeVisible();
  await expect(brand.locator('svg')).toBeVisible();
  await expect(brand.locator('.wordmark__lead')).toHaveText('tex');
  await expect(brand.locator('.wordmark__alt')).toHaveText('cheminfo');
});

test('the utilities are About, Cite, Tools and Share, and nothing else', async ({
  page,
}) => {
  await page.goto('/');

  // The four the whole family carries, in this order and on their own: a page
  // of this deployment — the API documentation — belongs among the pages.
  const utilities = page.locator('.app-header-actions > *');
  await expect(utilities).toHaveCount(4);
  await expect(utilities.nth(0)).toHaveAttribute('aria-label', 'About');
  await expect(utilities.nth(1)).toHaveClass('citation-button');
  await expect(utilities.nth(2)).toHaveClass('ecosystem-button');
  await expect(utilities.nth(3)).toHaveAttribute('aria-label', 'Share');

  const pages = page.locator('.app-header-nav > *');
  await expect(pages).toHaveText(['Editor', 'Tutorial', 'Exercises', 'API']);
  await expect(pages.nth(3)).toHaveAttribute('href', '/docs');
});

test('About is the first utility, and it opens the page', async ({ page }) => {
  await page.goto('/');

  const utilities = page.locator('.app-header-actions > *');
  await expect(utilities.first()).toHaveAttribute('href', '/about');

  await utilities.first().click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('.about-page h1 .wordmark__lead')).toHaveText(
    'tex',
  );
  await expect(page.locator('.about-can li')).toHaveCount(6);
  await expect(page.locator('.about-credits .credits-list li')).toHaveCount(5);
  await expect(page.getByRole('link', { name: 'MathJax' })).toBeVisible();
  await expect(page.locator('.about-provided-by')).toContainText('Luc Patiny');
});

test('an embedded page renders no header', async ({ page }) => {
  await page.goto('/?embed=1&tex=x%5E2');

  await expect(page.locator('.app-header')).toHaveCount(0);
  await expect(page.locator('.live-preview .mathjax-render svg')).toBeVisible();
});

test('hide removes the named tab and ignores unknown keys', async ({
  page,
}) => {
  await page.goto('/?hide=examples,nosuchthing');

  await expect(page.getByRole('button', { name: 'Examples' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reference' })).toHaveClass(
    /active/,
  );
});

test('hide=embedCode drops the embed snippets', async ({ page }) => {
  await page.goto('/?tex=x%5E2&hide=embedCode');

  await expect(page.locator('.code-row')).toHaveCount(0);
  await expect(page.locator('.server-preview')).toBeVisible();
});

test('zoom is read from the link and clamped', async ({ page }) => {
  await page.goto('/?tex=x%5E2&zoom=99');

  await expect(page.getByRole('button', { name: '3×' })).toHaveClass(/active/);
});

test('changing the zoom writes it into the address, and its default out', async ({
  page,
}) => {
  await page.goto('/?tex=x%5E2');
  // A preference sitting at its default is never written.
  await expect(page).not.toHaveURL(/zoom=/);

  await page.getByRole('button', { name: '3×' }).click();
  await expect(page).toHaveURL(/[?&]zoom=3(?:&|$)/);
  // The formula the page was opened on keeps its place in the address.
  await expect(page).toHaveURL(/tex=x%5E2/);

  await page.getByRole('button', { name: '2×' }).click();
  await expect(page).not.toHaveURL(/zoom=/);
});

test('the share dialog opens on an embed link carrying the formula', async ({
  page,
}) => {
  await page.goto('/?tex=x%5E2');

  await page.getByRole('button', { name: 'Share' }).click();

  const dialog = page.locator('.share-dialog');
  await expect(dialog).toBeVisible();

  const link = dialog.locator('.code-block').first();
  await expect(link).toContainText('tex=x%5E2');
  await expect(link).toContainText('embed=1');
  await expect(link).toContainText('hide=embedCode');
});

test('unchecking embed drops the parameter from the shared link', async ({
  page,
}) => {
  await page.goto('/?tex=x%5E2');

  await page.getByRole('button', { name: 'Share' }).click();
  const dialog = page.locator('.share-dialog');
  // Blueprint hides the input behind its own indicator, which swallows a click
  // aimed at the box; the label is what a reader presses anyway.
  await dialog.getByText('Embed in another page', { exact: true }).click();
  await expect(dialog.getByRole('checkbox').first()).not.toBeChecked();

  await expect(dialog.locator('.code-block').first()).not.toContainText(
    'embed=1',
  );
});
