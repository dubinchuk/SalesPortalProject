import { test } from '../../../fixtures/services.fixtures';

test.describe('[UI] [Customers] Smoke', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.openSalesPortal();
  });

  test.afterEach(async function ({ customersPageService }) {
    await customersPageService.delete();
  });

  test('Create customer with valid data', async function ({
    homePageService,
    customersPageService,
    customer,
  }) {
    await homePageService.openCustomersPage();
    await customersPageService.openAddNewCustomerPage();
    await customersPageService.create();
    await customersPageService.validateCustomerCreatedMessage();
    await customersPageService.checkCustomerInTable(customer.getSettings());
  });
});
