import { test, expect, Page } from '@playwright/test';

const TEST_EMAIL = 'playwright.test@example.com';
const TEST_PASSWORD = 'PlaywrightTest@123';
const TEST_SCHOOL_NAME = 'Imperial World School';

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

async function ensureFavoriteState(page: Page, shouldBeFavorited: boolean) {
    await goTo(page, '/dashboard/schools');

    const card = page.getByRole('link', { name: new RegExp(TEST_SCHOOL_NAME) });
    await expect(card).toBeVisible();

    const removeButton = card.getByRole('button', { name: 'Remove from favorites' });
    const saveButton = card.getByRole('button', { name: 'Save to favorites' });

    const isCurrentlyFavorited = await removeButton.isVisible().catch(() => false);

    if (shouldBeFavorited && !isCurrentlyFavorited) {
        await saveButton.click();
        await expect(removeButton).toBeVisible();
    } else if (!shouldBeFavorited && isCurrentlyFavorited) {
        await removeButton.click();
        await expect(saveButton).toBeVisible();
    }
}

test.describe.serial('Favorite flow', () => {
    test('can favorite a school from the browse page and see it on the Favorites page', async ({ page }) => {
        await login(page);

        await ensureFavoriteState(page, false);

        const card = page.getByRole('link', { name: new RegExp(TEST_SCHOOL_NAME) });
        await card.getByRole('button', { name: 'Save to favorites' }).click();
        await expect(card.getByRole('button', { name: 'Remove from favorites' })).toBeVisible();

        await goTo(page, '/dashboard/favorites');
        await expect(page.getByRole('heading', { name: 'My Favorites' })).toBeVisible();
        await expect(page.getByRole('link', { name: new RegExp(TEST_SCHOOL_NAME) })).toBeVisible();
    });

    test('can remove a favorite from the Favorites page and it disappears', async ({ page }) => {
        await login(page);

        await ensureFavoriteState(page, true);

        await goTo(page, '/dashboard/favorites');
        const favCard = page.getByRole('link', { name: new RegExp(TEST_SCHOOL_NAME) });
        await expect(favCard).toBeVisible();
        await favCard.getByRole('button', { name: 'Remove from favorites' }).click();
        await expect(favCard.getByRole('button', { name: 'Save to favorites' })).toBeVisible();

        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('link', { name: new RegExp(TEST_SCHOOL_NAME) })).toHaveCount(0);
    });
});