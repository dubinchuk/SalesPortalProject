import { mergeTests } from '@playwright/test';

import { test as servicesTest } from '../../../fixtures/services.fixtures';
import { test as mockTest } from '../../../fixtures/mock.fixtures';
import { generateNewCustomer } from '../../../data/customers/generateCustomer';

const test = mergeTests(mockTest, servicesTest);

test.describe('[UI] [Customers]', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.openSalesPortal();
  });

  test('Should show error when adding existing customer', async function ({
    homePageService,
    customersPageService,
    customersMockService,
  }) {
    const customer = generateNewCustomer();
    await homePageService.openCustomersPage();
    await customersPageService.openAddNewCustomerPage();
    await customersPageService.populateCustomer(customer);
    await customersMockService.getCustomerExistsMockResponse(customer);
    await customersPageService.save();
    await customersPageService.validateCustomerExistsToastMessage(customer);
  });
});
