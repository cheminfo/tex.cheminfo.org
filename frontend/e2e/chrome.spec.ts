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
});

test('an embedded page renders no header', async ({ page }) => {
  await page.goto('/?embed=1&tex=x%5E2');

  await expect(page.locator('.app-header')).toHaveCount(0);
  await expect(page.locator('.live-preview svg')).toBeVisible();
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

test('the share dialog opens on an embed link carrying the formula', async ({
  page,
}) => {
  await page.goto('/?tex=x%5E2');

  await page.getByRole('button', { name: 'Share' }).click();

  const dialog = page.getByTestId('share-dialog');
  await expect(dialog).toBeVisible();

  const link = dialog.locator('.share-code').first();
  await expect(link).toContainText('tex=x%5E2');
  await expect(link).toContainText('embed=1');
  await expect(link).toContainText('hide=embedCode');
});

test('unchecking embed drops the parameter from the shared link', async ({
  page,
}) => {
  await page.goto('/?tex=x%5E2');

  await page.getByRole('button', { name: 'Share' }).click();
  const dialog = page.getByTestId('share-dialog');
  await dialog.getByRole('checkbox').first().uncheck();

  await expect(dialog.locator('.share-code').first()).not.toContainText(
    'embed=1',
  );
});
