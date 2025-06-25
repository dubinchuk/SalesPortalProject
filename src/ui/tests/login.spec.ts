import { test } from '../../fixtures/services.fixtures';

test.describe('[UI] [Login]', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.clearCookies();
    await signInPageService.openSalesPortal();
  });

  test('Login with valid credentials', async function ({ signInPageService }) {
    await signInPageService.loginAsAdmin();
  });

  test('Open Customers list page', async function ({ signInPageService, homePageService }) {
    await signInPageService.loginAsAdmin();
    await homePageService.openCustomersPage();
  });
});
