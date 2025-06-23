import { test } from '@playwright/test';

import signInApiService from '../services/signIn.api';
import { generateNewCustomer } from '../../data/customers/generateCustomer';
import customersApiService from '../services/customers.service';

test.describe('[API] [Customers]', async function () {
  let customersIdsToDelete: string[] = [];

  test.afterEach(async function () {
    await customersApiService.deleteCustomers(customersIdsToDelete);
    customersIdsToDelete = [];
  });

  test('Create customer with valid data', async function () {
    await signInApiService.loginAsAdmin();
    const customer = generateNewCustomer();
    const response = await customersApiService.create(customer);
    customersIdsToDelete.push(response.body.Customer._id);
  });
});
