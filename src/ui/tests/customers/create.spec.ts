import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Create', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.openSalesPortal();
  });

  test.afterEach(async function ({ customersPageService }) {
    await customersPageService.delete();
  });

  test('@smoke Create customer with valid data', async function ({
    homePageService,
    customersPageService,
    customer,
  }) {
    setMetadata(Severity.BLOCKER);

    await homePageService.openCustomersPage();
    await customersPageService.openAddNewCustomerPage();
    await customersPageService.create();
    await customersPageService.validateCustomerCreatedMessage();
    await customersPageService.checkCustomerInTable(customer.getSettings());
  });
});
