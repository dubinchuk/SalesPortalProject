import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Create', async function () {
  test.beforeEach(async function ({ homePageService }) {
    await homePageService.openHomePage();
  });

  test.afterEach(async function ({ customersPageService }) {
    await customersPageService.delete();
  });

  test('Create customer with valid data @smoke', async function ({
    homePageService,
    customersPageService,
  }) {
    setMetadata(Severity.BLOCKER);

    await homePageService.openCustomersPage();
    await customersPageService.openAddNewCustomerPage();
    await customersPageService.create();
  });
});
