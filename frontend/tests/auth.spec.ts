import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
    test('shows a validation error when submitting empty fields', async ({ page }) => {
        await page.goto('/login');

        await page.getByRole('button', { name: 'Login' }).click();

        // react-hook-form + zod should block submission and show an error
        await expect(page.locator('text=/required|invalid|email/i').first()).toBeVisible();
    });

    test('shows an error toast for wrong credentials', async ({ page }) => {
        await page.goto('/login');

        await page.locator('#email').fill('doesnotexist@example.com');
        await page.locator('#password').fill('WrongPassword123');
        await page.getByRole('button', { name: 'Login' }).click();

        // your app shows errors via react-toastify
        await expect(page.locator('text=/invalid email or password/i')).toBeVisible();
    });

    test('logs in successfully and redirects a student to the dashboard', async ({ page }) => {
        await page.goto('/login');

        await page.locator('#email').fill('playwright.test@example.com');
        await page.locator('#password').fill('PlaywrightTest@123');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL('/dashboard');
    });

    test('logged-in user visiting /login gets redirected away, not shown the form again', async ({ page }) => {
        // Each Playwright test gets a fresh, isolated browser context with no shared
        // cookies - so this test must log in itself first, it cannot rely on any
        // other test having already done so.
        await page.goto('/login');
        await page.locator('#email').fill('playwright.test@example.com');
        await page.locator('#password').fill('PlaywrightTest@123');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('/dashboard');

        // Now that we're genuinely logged in, try visiting /login again
        await page.goto('/login');
        await expect(page).not.toHaveURL('/login');
    });
});