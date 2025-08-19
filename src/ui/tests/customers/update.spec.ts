import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Update', async function () {
  test.beforeEach(async function ({ customer, customersPageService }) {
    await customer.create();
    await customersPageService.openCustomersListPageByUrl();
  });

  test.afterEach(async function ({ customersPageService }) {
    await customersPageService.delete();
  });

  test('Update Customer with valid data from Customers List @smoke', async function ({
    customersPageService,
  }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.openEditCustomer();
    await customersPageService.update();
  });

  test('Update Customer with valid data from Details', async function ({ customersPageService }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.openCustomerDetails();
    await customersPageService.openEditFromDetails();
    await customersPageService.update();
  });
});
