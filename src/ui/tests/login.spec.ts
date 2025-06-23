import { test } from '@playwright/test';

import { ADMIN_PASSWORD, ADMIN_USERNAME, BASE_URL } from '../../config/environment';

test.describe('[UI] [Login]', async function () {
  test.beforeEach(async function ({ page }) {
    await page.context().clearCookies();
    await page.goto(BASE_URL);
  });

  test('Login with valid credentials', async function ({ page }) {
    const emailInput = page.getByLabel('Email address');
    const passwordInput = page.getByPlaceholder('Enter password');
    const button = page.getByText('Login', { exact: true });
    await emailInput.fill(ADMIN_USERNAME);
    await passwordInput.fill(ADMIN_PASSWORD);
    await button.click();
    await page.locator('div.spinner-border').waitFor({ state: 'hidden', timeout: 10000 });
  });

  test('Open Customers list page', async function ({ page }) {
    await page.getByLabel('Email address').fill(ADMIN_USERNAME);
    await page.getByPlaceholder('Enter password').fill(ADMIN_PASSWORD);
    await page.getByText('Login', { exact: true }).click();
    await page.locator('div.spinner-border').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('link', { name: 'View Customers' }).click();
    await page.locator('div.spinner-border').waitFor({ state: 'hidden', timeout: 10000 });
  });
});
