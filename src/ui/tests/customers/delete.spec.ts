import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Delete', async function () {
  test.beforeEach(async function ({ signInPageService, customer, homePageService }) {
    await customer.create();
    await signInPageService.openSalesPortal();
    await homePageService.openCustomersPage();
  });

  test('Delete customer from customers list page @smoke', async function ({
    customersPageService,
    customer,
  }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.deleteFromCustomersList(customer.getSettings().email);
  });

  test('Delete customer from edit page', async function ({ customersPageService, customer }) {
    setMetadata(Severity.CRITICAL);
    await customersPageService.openEditCustomer(customer.getSettings().email);
    await customersPageService.deleteCustomerFromEdit();
  });
});
