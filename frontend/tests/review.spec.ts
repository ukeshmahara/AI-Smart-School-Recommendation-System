import { test, expect, Page } from '@playwright/test';

const TEST_EMAIL = 'playwright.test@example.com';
const TEST_PASSWORD = 'PlaywrightTest@123';
const SCHOOL_NAME = 'Imperial World School';
const REVIEW_COMMENT = 'Playwright test review: great science labs and supportive teachers.';

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

test.describe.serial('Review flow', () => {
    test('can post a new review and see it appear in the reviews list', async ({ page }) => {
        await login(page);
        await goToSchoolDetail(page, SCHOOL_NAME);

        await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible();

        const existingDeleteButton = page.getByRole('button', { name: 'Delete review' });
        if (await existingDeleteButton.isVisible().catch(() => false)) {
            await existingDeleteButton.click();
            await page.waitForLoadState('networkidle');
        }

        await page.getByRole('button', { name: '5 stars' }).click();
        await page.getByPlaceholder('What was your experience with this school?').fill(REVIEW_COMMENT);
        await page.getByRole('button', { name: 'Post review' }).click();

        await expect(page.getByText(REVIEW_COMMENT)).toBeVisible();
        await expect(page.getByText('(you)')).toBeVisible();
    });

    test('can edit an existing review and the change persists', async ({ page }) => {
        await login(page);
        await goToSchoolDetail(page, SCHOOL_NAME);

        await expect(page.getByText(REVIEW_COMMENT)).toBeVisible();
        await page.getByRole('button', { name: 'Edit review' }).click();

        await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible();
        const updatedComment = REVIEW_COMMENT + ' (edited)';

        await page.getByPlaceholder('What was your experience with this school?').fill(updatedComment);
        await page.getByRole('button', { name: 'Update review' }).click();

        await expect(page.getByText(updatedComment)).toBeVisible();

        // Update REVIEW_COMMENT's tracked value isn't possible on a const, so the
        // final delete test searches for this exact edited text instead.
    });

    test('can delete a review and it disappears, without affecting other students\' reviews', async ({ page }) => {
        await login(page);
        await goToSchoolDetail(page, SCHOOL_NAME);

        const editedComment = REVIEW_COMMENT + ' (edited)';
        await expect(page.getByText(editedComment)).toBeVisible();

        const deleteButton = page.getByRole('button', { name: 'Delete review' });
        await deleteButton.click();
        await page.waitForLoadState('networkidle');

        // Our own review's specific text should be gone now...
        await expect(page.getByText(editedComment)).toHaveCount(0);

        // ...but this school has other students' genuine reviews too - the page
        // should NOT show the global "no reviews yet" empty state, since reviews
        // still exist, just not ours anymore.
        await expect(page.getByText('No reviews yet. Be the first to share your experience.')).toHaveCount(0);
    });
});