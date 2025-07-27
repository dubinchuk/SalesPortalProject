import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Delete', async function () {
  test.beforeEach(async function ({ signInPageService, customer, homePageService }) {
    await customer.create();
    await signInPageService.openSalesPortal();
    await homePageService.openCustomersPage();
  });

  test('Delete Customer from Customers List @smoke', async function ({ customersPageService }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.deleteFromCustomersList();
  });

  test('Delete Customer from Edit', async function ({ customersPageService }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.openEditCustomer();
    await customersPageService.deleteCustomerFromEdit();
  });

  test('Delete Customer from Details', async function ({ customersPageService }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.openCustomerDetails();
    await customersPageService.openEditFromDetails();
    await customersPageService.deleteCustomerFromEdit();
  });
});
