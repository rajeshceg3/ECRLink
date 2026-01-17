import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (Axe)', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('sanctuary modal should not have accessibility issues when open', async ({ page }) => {
    await page.goto('/');

    // Open the first sanctuary card
    await page.locator('.card-content').first().click();
    await expect(page.locator('.horizon-container')).toHaveClass(/sanctuary-is-open/);

    // Wait for animation
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.is-active-sanctuary') // Focus scan on the modal
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
