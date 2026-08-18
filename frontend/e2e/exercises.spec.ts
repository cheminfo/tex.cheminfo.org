import { expect, test } from '@playwright/test';

test('the exercises page opens on the first exercise and says so', async ({
  page,
}) => {
  await page.goto('/exercises');

  await expect(page).toHaveURL(/\/exercises\/x-squared/);
  await expect(page.locator('.target-well svg')).toBeVisible();
  await expect(page.locator('.series-btn.active')).toHaveText(/1/);
});

test('an exercise link opens that exercise', async ({ page }) => {
  await page.goto('/exercises/nernst');

  await expect(page.getByText('The Nernst equation')).toBeVisible();
  await expect(page.locator('.level-tag')).toHaveText('advanced');
});

test('a correct answer written differently is still solved', async ({
  page,
}) => {
  await page.goto('/exercises/x-squared');

  await page.locator('.cm-content').fill('x^{2}');

  await expect(page.locator('.feedback-solved')).toBeVisible();
  await expect(page.locator('.answer-well.is-solved')).toBeVisible();
  await expect(page.locator('.series-btn.active')).toHaveClass(/status-solved/);
});

test('a wrong answer is marked only once checked, and hints come one at a time', async ({
  page,
}) => {
  await page.goto('/exercises/x-squared');

  await page.locator('.cm-content').fill('x_2');
  await expect(page.locator('.feedback')).toHaveCount(0);

  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.locator('.feedback-wrong')).toBeVisible();

  await page.getByRole('button', { name: /^Hint \(0\/2\)$/ }).click();
  await expect(page.locator('.hint-list li')).toHaveCount(1);
});

test('a broken formula reports what MathJax could not read', async ({
  page,
}) => {
  await page.goto('/exercises/x-squared');

  await page.locator('.cm-content').fill('x^');
  await page.getByRole('button', { name: 'Check' }).click();

  await expect(page.locator('.feedback-error')).toContainText(
    'Missing superscript or subscript argument',
  );
});

test('the solution can be revealed', async ({ page }) => {
  await page.goto('/exercises/one-half');

  await page.getByRole('button', { name: 'Show solution' }).click();

  await expect(page.locator('.solution-code')).toHaveText(
    String.raw`\frac{1}{2}`,
  );
});

test('the reference beside the exercises appends to the answer', async ({
  page,
}) => {
  await page.goto('/exercises/x-squared');

  await expect(page.getByRole('button', { name: 'Examples' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reference' })).toHaveClass(
    /active/,
  );
});

test('an embedded exercise carries no header and no series list', async ({
  page,
}) => {
  await page.goto('/exercises/nernst?embed=1&hide=exerciseList');

  await expect(page.locator('.app-header')).toHaveCount(0);
  await expect(page.locator('.series-nav')).toHaveCount(0);
  await expect(page.locator('.target-well svg')).toBeVisible();
});

test('the header moves between the editor and the exercises', async ({
  page,
}) => {
  await page.goto('/');

  // Picked by the words on the bar: the shared header names each entry after
  // its tooltip, so the role name is the sentence rather than the label.
  const nav = page.locator('.app-header-nav');

  await nav.getByText('Exercises', { exact: true }).click();
  await expect(page).toHaveURL(/\/exercises/);

  await nav.getByText('Editor', { exact: true }).click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);
  await expect(page.locator('.latex-editor')).toBeVisible();
});
