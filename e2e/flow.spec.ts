import { test, expect } from '@playwright/test';

test('page loading smoke test', async ({ page }) => {
    // 1. Marketing Page loads
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // 2. Templates page loads (may have no data without Supabase)
    await page.goto('/app/templates');
    await expect(page.locator('body')).toBeVisible();

    // 3. Builder page loads
    await page.goto('/app/builder');
    await expect(page.locator('body')).toBeVisible();
    // Verify builder has a name input
    await expect(page.locator('input[placeholder*="Name"], input[placeholder*="name"]').first()).toBeVisible();

    // 4. Inspector page loads
    await page.goto('/app/inspector');
    await expect(page.locator('body')).toBeVisible();

    // 5. Marketplace page loads
    await page.goto('/marketplace');
    await expect(page.locator('body')).toBeVisible();
});
