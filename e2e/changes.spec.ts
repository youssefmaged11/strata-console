import { expect, test } from '@playwright/test';

test('opens the change request workspace', async ({ page }) => {
  await page.goto('/changes');
  await expect(page.getByRole('heading', { name: 'Change requests' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
});

test('switches to the approval queue', async ({ page }) => {
  await page.goto('/changes');
  await page.getByRole('link', { name: /Approvals/ }).click();
  await expect(page.getByRole('heading', { name: 'Approvals' })).toBeVisible();
});
