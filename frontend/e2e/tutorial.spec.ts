import { expect, test } from '@playwright/test';

test('the tutorial opens on its first step and says so in the address', async ({
  page,
}) => {
  await page.goto('/tutorial');

  await expect(page).toHaveURL(/\/tutorial\/1$/);
  await expect(page.locator('.step-description')).toBeVisible();
  await expect(page.locator('.answer-well svg')).toBeVisible();
});

test('a step link opens that step', async ({ page }) => {
  await page.goto('/tutorial/7');

  await expect(
    page.getByText('Big operators carry their limits'),
  ).toBeVisible();
  await expect(page.locator('.cm-content')).toContainText(String.raw`\sum`);
});

test('next and previous walk the tour', async ({ page }) => {
  await page.goto('/tutorial/2');

  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page).toHaveURL(/\/tutorial\/3$/);

  await page.getByRole('button', { name: '← Previous' }).click();
  await expect(page).toHaveURL(/\/tutorial\/2$/);
});

test('the step is editable and the render follows', async ({ page }) => {
  await page.goto('/tutorial/1');

  const putBack = page.getByRole('button', { name: 'Put the step back' });
  await expect(putBack).toBeDisabled();

  await page.locator('.cm-content').fill(String.raw`\alpha^2`);
  await expect(page.locator('.answer-well svg')).toBeVisible();
  await expect(putBack).toBeEnabled();

  await putBack.click();
  await expect(page.locator('.cm-content')).toContainText('E = mc^2');
});

test('a glossary term carries its definition', async ({ page }) => {
  await page.goto('/tutorial/1');

  const term = page.locator('.glossary-term').first();
  await expect(term).toBeVisible();
  await term.hover();
  await expect(page.locator('.glossary-card').first()).toBeVisible();
});

test('an embedded step carries no header and no step list', async ({
  page,
}) => {
  await page.goto('/tutorial/5?embed=1&hide=tutorialSteps');

  await expect(page.locator('.app-header')).toHaveCount(0);
  await expect(page.locator('.series-nav')).toHaveCount(0);
  await expect(page.locator('.step-description')).toBeVisible();
});
