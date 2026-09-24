import { expect, test } from '@playwright/test';

test('Examples tab is active by default', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Examples' })).toHaveClass(
    /active/,
  );
  await expect(page.locator('.examples-table')).toBeVisible();
});

test('clicking an example loads its formula into the editor', async ({
  page,
}) => {
  await page.goto('/');

  // Click the first example row
  const firstRow = page.locator('.examples-table tbody tr').first();
  await firstRow.click();

  // Editor should contain a formula and render the live preview
  await expect(page.locator('.cm-content')).not.toBeEmpty();
  await expect(page.locator('.live-preview .mathjax-render svg')).toBeVisible();
});

test('Reference tab shows LaTeX documentation', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Reference' }).click();

  await expect(page.getByRole('button', { name: 'Reference' })).toHaveClass(
    /active/,
  );
  // Reference panel should show some content
  await expect(page.locator('.tab-content')).not.toBeEmpty();
});

test('Commands tab shows searchable command list', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Commands' }).click();

  await expect(page.getByRole('button', { name: 'Commands' })).toHaveClass(
    /active/,
  );
  await expect(page.locator('.tab-content')).not.toBeEmpty();
});

test('Help tab shows help content', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Help' }).click();

  await expect(page.getByRole('button', { name: 'Help' })).toHaveClass(
    /active/,
  );
  await expect(page.locator('.help-panel')).toBeVisible();
});

test('zoom controls change the live preview size', async ({ page }) => {
  await page.goto('/?tex=x%5E2');

  const btn3x = page.getByRole('button', { name: '3×' });
  await btn3x.click();

  await expect(btn3x).toHaveClass(/active/);
});
