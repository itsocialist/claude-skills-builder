import { test, expect } from '@playwright/test';

test.skip('complete user flow', async ({ page }) => {
    // 1. Start at Marketing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/GetClaudeSkills/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // 2. Navigate to Templates page
    await page.goto('/app/templates');
    await expect(page.getByText('Skill Templates')).toBeVisible();

    // 3. Click "Use Template" for Property Listing Generator
    await page.getByRole('link', { name: 'Use Template' }).first().click();

    // Wait for navigation to builder with template param
    await expect(page).toHaveURL(/\/app\/builder\?template=property-listing/);

    // 4. Verify Builder Pre-filled
    await expect(page.locator('input[placeholder="Name your skill..."]')).toHaveValue('Property Listing Generator');
    await expect(page.locator('textarea[placeholder="Describe what this skill does..."]')).not.toBeEmpty();

    // 5. Generate Skill
    // Setup download listener
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Generate Skill');
    const download = await downloadPromise;

    // 6. Verify Download - filename should be slugified
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toBe('property-listing-generator.zip');
});
