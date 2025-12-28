import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {

    test('Homepage loads successfully', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/GetClaudeSkills/);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('Marketplace (Public) loads', async ({ page }) => {
        await page.goto('/marketplace');
        // Check for common text that should be there regardless of data state
        await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
    });

    test('Canvas redirects to login when unauthenticated', async ({ page }) => {
        await page.goto('/app/canvas');
        // Should redirect to auth or show login
        await expect(page.url()).toContain('sign-in');
    });

    test('Admin page redirects when unauthenticated', async ({ page }) => {
        await page.goto('/app/admin');
        // Should redirect to home or login (middleware redirects to sign-in or dashboard)
        await expect(page.url()).toContain('sign-in');
    });
});
