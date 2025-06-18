import { test } from '@playwright/test';

test.describe('[UI] [Login]', async function () {
  test.beforeEach(async function ({ page }) {
    await page.context().clearCookies();
    await page.goto('https://anatoly-karpovich.github.io/aqa-course-project/');
  });

  test('Login with valid credentials', async function ({ page }) {
    const emailInput = page.getByLabel('Email address');
    const passwordInput = page.getByPlaceholder('Enter password');
    const button = page.getByText('Login', { exact: true });
    await emailInput.fill('aqacourse@gmail.com');
    await passwordInput.fill('password');
    await button.click();
    await page.locator('div.spinner-border').waitFor({ state: 'hidden', timeout: 10000 });
  });

  test('Open Customers list page', async function ({ page }) {
    await page.getByLabel('Email address').fill('aqacourse@gmail.com');
    await page.getByPlaceholder('Enter password').fill('password');
    await page.getByText('Login', { exact: true }).click();
    await page.locator('div.spinner-border').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('listitem').filter({ hasText: 'Customers' }).click();
    await page.locator('div.spinner-border').waitFor({ state: 'hidden', timeout: 10000 });
  });
});
