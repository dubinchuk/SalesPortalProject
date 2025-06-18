import { test } from '../../../fixtures/services.fixtures';

test.describe('[UI] [Customers] Smoke', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.openSalesPortal();
  });

  test.afterEach(async function ({ page }) {
    //TODO: delete customer
  });

  test('Create customer with valid data', async function ({
    homePageService,
    customersPageService,
    addNewCustomerPageService,
  }) {
    await homePageService.openCustomersPage();
    await customersPageService.openAddNewCustomerPage();
    await addNewCustomerPageService.create();
    await customersPageService.validateCustomerCreatedMessage();
    //TODO: check customer in table
  });
});
