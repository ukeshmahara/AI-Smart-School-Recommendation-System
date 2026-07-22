import { test, expect, Page } from '@playwright/test';

const TEST_EMAIL = 'playwright.test@example.com';
const TEST_PASSWORD = 'PlaywrightTest@123';
const SCHOOL_NAME = 'Imperial World School';

// Include a timestamp so each test run creates a genuinely unique message -
// students can't delete their own inquiries (only admins can), so previous
// runs' inquiries persist in the database and would otherwise collide.
const INQUIRY_MESSAGE = `Playwright test inquiry ${Date.now()}: what is the admission process for Grade 11 Science?`;

async function login(page: Page) {
    await page.goto('/login');
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
    await page.waitForLoadState('networkidle');
}

async function goToSchoolDetail(page: Page, schoolName: string) {
    await page.goto('/dashboard/schools');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: new RegExp(schoolName) }).click();
    await page.waitForLoadState('networkidle');
}

test.describe.serial('Inquiry flow', () => {
    test('can send an inquiry to a school and see it under My Inquiries with Pending status', async ({ page }) => {
        await login(page);
        await goToSchoolDetail(page, SCHOOL_NAME);

        await page.getByRole('button', { name: 'Contact school' }).click();

        await expect(page.getByRole('heading', { name: `Contact ${SCHOOL_NAME}` })).toBeVisible();

        await page.getByPlaceholder('Ask about admissions, fees, facilities...').fill(INQUIRY_MESSAGE);
        await page.getByRole('button', { name: 'Send inquiry' }).click();

        await expect(page.getByRole('heading', { name: `Contact ${SCHOOL_NAME}` })).toHaveCount(0);

        await page.goto('/dashboard/inquiries');
        await page.waitForLoadState('networkidle');

        await expect(page.getByRole('heading', { name: 'My Inquiries' })).toBeVisible();
        // This exact message (with its unique timestamp) can only ever appear once
        await expect(page.getByText(INQUIRY_MESSAGE)).toBeVisible();
        await expect(page.getByText('Pending').first()).toBeVisible();
    });

    test('the message length counter updates as you type', async ({ page }) => {
        await login(page);
        await goToSchoolDetail(page, SCHOOL_NAME);

        await page.getByRole('button', { name: 'Contact school' }).click();
        await expect(page.getByText('0/500')).toBeVisible();

        await page.getByPlaceholder('Ask about admissions, fees, facilities...').fill('Testing the counter');
        await expect(page.getByText('19/500')).toBeVisible();
    });
});