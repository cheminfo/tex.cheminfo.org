import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { pageDocumentMeta } from 'react-cheminfo/core';

import { PAGE_ROUTES } from '../src/state/routes.ts';

const FORMULA = 'x^2';
const ENCODED_FORMULA = encodeURIComponent(FORMULA);

/**
 * Record every uncaught exception and every console.error the page raises.
 * @param page - The page to listen on.
 * @returns The messages, filled as they arrive.
 */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

/**
 * The title the site gives the address the page ended on, from the route table
 * the app itself reads.
 * @param page - The page, after it settled on its address.
 * @returns The expected document title.
 */
function expectedTitle(page: Page): string {
  const url = new URL(page.url());
  return pageDocumentMeta({
    site: 'tex',
    routes: PAGE_ROUTES,
    url: url.pathname,
    origin: url.origin,
  }).title;
}

test('typing a formula gives its embed snippets and its server image', async ({
  page,
}) => {
  await page.goto('/');

  await page.locator('.cm-content').fill(FORMULA);

  await expect(
    page.getByRole('textbox', { name: 'HTML embed code', exact: true }),
  ).toHaveValue(
    `<img src="https://tex.cheminfo.org/v1/?tex=${ENCODED_FORMULA}"/>`,
  );
  await expect(
    page.getByRole('textbox', { name: 'MD embed code', exact: true }),
  ).toHaveValue(
    `![formula](https://tex.cheminfo.org/v1/?tex=${ENCODED_FORMULA})`,
  );

  const serverImage = page.locator('.server-preview img');
  await expect(serverImage).toHaveAttribute(
    'src',
    `/v1/?tex=${ENCODED_FORMULA}`,
  );

  const response = await page.request.get(`/v1/?tex=${ENCODED_FORMULA}`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('image/svg+xml');
  const body = await response.text();
  expect(body).toMatch(/^<svg/);
});

test('/about renders the About page with its Cite control and the footer', async ({
  page,
}) => {
  const errors = collectErrors(page);
  await page.goto('/about');

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'tex.cheminfo',
  );
  await expect(
    page.getByRole('button', { name: 'Cite', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(page.getByRole('contentinfo')).toHaveCount(1);
  await expect(page).toHaveTitle(expectedTitle(page));
  expect(errors).toStrictEqual([]);
});

for (const embed of ['embed', 'embed=1']) {
  test(`?${embed} drops the header and the footer and keeps the tool`, async ({
    page,
  }) => {
    await page.goto(`/?${embed}`);

    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('banner')).toHaveCount(0);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);

    await page.locator('.cm-content').fill(FORMULA);

    await expect(page.locator('.live-preview svg')).toBeVisible();
    await expect(page.locator('.server-preview img')).toHaveAttribute(
      'src',
      `/v1/?tex=${ENCODED_FORMULA}`,
    );
  });
}

for (const route of PAGE_ROUTES) {
  test(`${route.path} loads with no page error`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(route.path);

    await expect(page.getByRole('main')).toBeVisible();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(expectedTitle(page));
    expect(errors).toStrictEqual([]);
  });
}

test('an unknown path opens the editor', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/no-such-page/at-all');

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('.latex-editor')).toBeVisible();
  await expect(page.getByRole('banner')).toHaveCount(1);
  await page.waitForLoadState('networkidle');
  expect(errors).toStrictEqual([]);
});
