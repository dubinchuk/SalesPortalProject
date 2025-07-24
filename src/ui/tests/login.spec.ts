import { Severity } from 'allure-js-commons';

import { test } from '../../fixtures/services.fixtures';
import { setMetadata } from '../../utils/report/testMetadata';

test.describe('[UI] [Login]', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.clearCookies();
    await signInPageService.openSalesPortal();
  });

  test('Login with valid credentials @smoke', async function ({ signInService }) {
    setMetadata(Severity.BLOCKER);
    await signInService.signInAsAdminUI();
  });

  test('Open Customers list page', async function ({ signInService, homePageService }) {
    setMetadata(Severity.CRITICAL);
    await signInService.signInAsAdminUI();
    await homePageService.openCustomersPage();
  });
});
