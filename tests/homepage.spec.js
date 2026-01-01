import { test, expect } from '@playwright/test';

test('Homepage loads and title is correct', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Horizon | A Journey on the East Coast Road/);
});

test('Sanctuary view opens when an attraction card is clicked', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('.attraction-card').first();
  await firstCard.click();

  const container = page.locator('.horizon-container');
  await expect(container).toHaveClass(/sanctuary-is-open/);
  await expect(firstCard).toHaveClass(/is-active-sanctuary/);
});

test('Sanctuary view closes when close button is clicked', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('.attraction-card').first();
  await firstCard.click();

  const closeButton = page.locator('.sanctuary-close-button');
  await closeButton.click();

  const container = page.locator('.horizon-container');
  await expect(container).not.toHaveClass(/sanctuary-is-open/);
});

test('Itinerary works', async ({ page }) => {
  await page.goto('/');

  const firstCard = page.locator('.attraction-card').first();
  await firstCard.click();

  const addToItineraryBtn = page.locator('.sanctuary-actions .add-to-rhythm').first();

  // Handle Add alert
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Added to Itinerary');
    await dialog.accept();
  });
  await addToItineraryBtn.click();

  // Verify state change (class added)
  await expect(addToItineraryBtn).toHaveClass(/added/);

  // Handle Remove alert
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Removed from Itinerary');
    await dialog.accept();
  });
  await addToItineraryBtn.click();

  // Verify state change back (class removed)
  await expect(addToItineraryBtn).not.toHaveClass(/added/);
});
