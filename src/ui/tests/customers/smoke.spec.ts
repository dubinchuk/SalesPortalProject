import { generateNewCustomer } from '../../../data/customers/generateCustomer';
import { test } from '../../../fixtures/services.fixtures';

test.describe('[UI] [Customers] Smoke', async function () {
  let customersIdsToDelete: string[] = [];

  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.openSalesPortal();
  });

  test.afterEach(async function ({ customersApiService }) {
    if (customersIdsToDelete.length > 0)
      await customersApiService.deleteCustomers(customersIdsToDelete);
    customersIdsToDelete = [];
  });

  test('Create customer with valid data', async function ({
    homePageService,
    customersPageService,
    addNewCustomerPageService,
  }) {
    await homePageService.openCustomersPage();
    await customersPageService.openAddNewCustomerPage();
    const customer = generateNewCustomer();
    const response = await addNewCustomerPageService.create(customer, customersIdsToDelete);
    customersIdsToDelete.push(response.body.Customer._id);
    await customersPageService.validateCustomerCreatedMessage();
    //TODO: check customer in table
  });
});
