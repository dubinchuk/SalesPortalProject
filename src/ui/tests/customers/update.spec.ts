import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Update', async function () {
  test.beforeEach(async function ({ signInPageService, customer, homePageService }) {
    await customer.create();
    await signInPageService.openSalesPortal();
    await homePageService.openCustomersPage();
  });

  test.afterEach(async function ({ customersPageService }) {
    await customersPageService.delete();
  });

  test('Update customer with valid data @smoke', async function ({
    customersPageService,
    customer,
  }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.openEditCustomer(customer.getSettings().email);
    await customersPageService.update();
  });
});
