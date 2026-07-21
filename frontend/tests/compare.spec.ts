import { test, expect, Page } from '@playwright/test';

const TEST_EMAIL = 'playwright.test@example.com';
const TEST_PASSWORD = 'PlaywrightTest@123';
const SCHOOL_A = 'Imperial World School';
const SCHOOL_B = 'Meridian International School';

async function login(page: Page) {
    await page.goto('/login');
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
    await page.waitForLoadState('networkidle');
}

async function goTo(page: Page, path: string) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
}

async function fillNextEmptySlot(page: Page, schoolName: string) {
    await page.getByRole('button', { name: 'Add school' }).first().click();

    await page.locator('input[placeholder="Search schools..."]').fill(schoolName);
    const resultButton = page.getByRole('button', { name: new RegExp(schoolName) }).last();
    await expect(resultButton).toBeVisible();
    await resultButton.click();
}

test.describe.serial('Compare flow', () => {
    test('can pick two schools directly on the Compare page and see a comparison table', async ({ page }) => {
        await login(page);
        await goTo(page, '/dashboard/compare');

        await expect(page.getByRole('heading', { name: 'Compare Schools' })).toBeVisible();

        await fillNextEmptySlot(page, SCHOOL_A);
        // The school now appears twice on the page at once, once in each slot -
        // use .first() rather than a bare assertion, since "visible" needs a single match.
        await expect(page.getByText(SCHOOL_A, { exact: true }).first()).toBeVisible();

        await fillNextEmptySlot(page, SCHOOL_B);
        await expect(page.getByText(SCHOOL_B, { exact: true }).first()).toBeVisible();

        // Once 2+ schools are picked, the comparison table renders - both names
        // appear again here as column headers, which is expected and correct.
        await expect(page.getByRole('columnheader', { name: new RegExp(SCHOOL_A) })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: new RegExp(SCHOOL_B) })).toBeVisible();
        await expect(page.getByText('Annual Fees')).toBeVisible();
    });

    test('shows the empty state prompting to add at least 2 schools when starting fresh', async ({ page }) => {
        await login(page);
        await goTo(page, '/dashboard/compare');

        await expect(page.getByText('Add at least 2 schools to compare')).toBeVisible();
    });
});