import { expect, test } from '@playwright/test';

test.describe('DSOMM smoke flows', () => {
  test('loads the circular heatmap landing page', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#chart')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download team progress' })).toBeVisible();
  });

  test('loads the matrix page', async ({ page }) => {
    await page.goto('/matrix');

    await expect(page.locator('app-top-header h1', { hasText: 'Matrix' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'RESET' })).toBeVisible();
    await expect(page.getByText('Dimension Filter')).toBeVisible();
  });

  test('loads a usage markdown page', async ({ page }) => {
    await page.goto('/usage/USAGE');

    await expect(page.locator('app-top-header h1', { hasText: 'Usage' })).toBeVisible();
    await expect(page.getByText('DSOMM - DevSecOps Maturity Model')).toBeVisible();
  });
});
