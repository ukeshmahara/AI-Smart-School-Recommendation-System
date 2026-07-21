import { test, expect, Page } from '@playwright/test';

const STUDENT_EMAIL = 'playwright.test@example.com';
const STUDENT_PASSWORD = 'PlaywrightTest@123';

async function loginAsStudent(page: Page) {
    await page.goto('/login');
    await page.locator('#email').fill(STUDENT_EMAIL);
    await page.locator('#password').fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
    await page.waitForLoadState('networkidle');
}

test.describe('Admin route protection', () => {
    test('a logged-out visitor is redirected to login when visiting an admin route', async ({ page }) => {
        await page.goto('/admin/users');
        await expect(page).toHaveURL('/login');
    });

    test('a non-admin student is redirected away from admin routes, not shown the admin panel', async ({ page }) => {
        await loginAsStudent(page);

        await page.goto('/admin/users');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL('/dashboard');
        await expect(page).not.toHaveURL(/\/admin/);
    });

    test('a non-admin student is also blocked from a different admin sub-route', async ({ page }) => {
        await loginAsStudent(page);

        await page.goto('/admin/schools');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL('/dashboard');
    });
});