import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('complete user flow', async ({ page }) => {
    // 1. Start at Home Page
    await page.goto('/');
    await expect(page).toHaveTitle(/ClaudeSkillsFacet/);
    await expect(page.getByText('Build Claude Skills in Minutes')).toBeVisible();

    // 2. Select a Template
    // Find the card with "Property Listing Generator" then click the "Use Template" link/button inside it
    await page.locator('.p-6').filter({ hasText: 'Property Listing Generator' }).getByRole('link', { name: 'Use Template' }).click();

    await expect(page).toHaveURL(/\/templates\/property-listing/);
    // Verify category badge
    await expect(page.locator('.bg-primary-100').getByText('Real Estate')).toBeVisible();

    // 3. Use Template
    await page.click('text=Use This Template');
    await expect(page).toHaveURL(/\/builder/);

    // 4. Verify Builder Pre-filled
    await expect(page.locator('input[placeholder="e.g., Property Listing Generator"]')).toHaveValue('Property Listing Generator');

    // 5. Generate Skill
    // Setup download listener
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Generate Skill');
    const download = await downloadPromise;

    // 6. Verify Download
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toBe('property-listing-generator.zip');
});
