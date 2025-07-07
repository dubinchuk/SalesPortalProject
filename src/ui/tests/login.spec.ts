import { test } from '../../fixtures/services.fixtures';

test.describe('[UI] [Login]', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.clearCookies();
    await signInPageService.openSalesPortal();
  });

  test('Login with valid credentials', async function ({ signInService }) {
    await signInService.signInAsAdminUI();
  });

  test('Open Customers list page', async function ({ signInService, homePageService }) {
    await signInService.signInAsAdminUI();
    await homePageService.openCustomersPage();
  });
});
