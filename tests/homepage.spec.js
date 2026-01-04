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

  // Add to Itinerary
  await addToItineraryBtn.click();

  // Verify Toast appears
  const toast = page.locator('.toast');
  await expect(toast).toBeVisible();
  await expect(toast).toHaveText('Added to Itinerary');

  // Verify state change (class added)
  await expect(addToItineraryBtn).toHaveClass(/added/);

  // Wait for toast to disappear (optional, but good for cleanliness)
  // The toast lasts 3 seconds. We can just click again.

  // Remove from Itinerary
  await addToItineraryBtn.click();

  // Verify Toast appears (it might be a new toast or the text updates)
  // Since the previous toast might still be there, we should check text
  // However, toast.js appends a NEW toast div for each call.
  // So we should look for the *last* toast or check that a toast with text exists.
  const toasts = page.locator('.toast');
  await expect(toasts.last()).toHaveText('Removed from Itinerary');
  await expect(toasts.last()).toBeVisible();

  // Verify state change back (class removed)
  await expect(addToItineraryBtn).not.toHaveClass(/added/);
});
