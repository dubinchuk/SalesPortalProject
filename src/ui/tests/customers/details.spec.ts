import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Details', async function () {
  test.beforeEach(async function ({ signInService, customer, homePageService }) {
    await customer.create();
    await signInService.openSalesPortal();
    await homePageService.openCustomersPage();
  });

  test.afterEach(async function ({ customer }) {
    await customer.delete();
  });

  test('Validate Customer details', async function ({ customersPageService }) {
    setMetadata(Severity.NORMAL);
    await customersPageService.validateCustomerByDetails();
  });

  test('Open Edit Customer', async function ({ customersPageService }) {
    setMetadata(Severity.NORMAL);
    await customersPageService.openCustomerDetails();
    await customersPageService.openEditFromDetails();
  });

  test('Go back to Customers List', async function ({ customersPageService }) {
    setMetadata(Severity.NORMAL);
    await customersPageService.openCustomerDetails();
    await customersPageService.goBackFromDetails();
  });
});
