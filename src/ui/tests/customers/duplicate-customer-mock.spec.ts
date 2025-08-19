import { mergeTests } from '@playwright/test';
import { Severity } from 'allure-js-commons';

import { generateNewCustomer } from '../../../data/customers/generateCustomer';
import { test as mockTest } from '../../../fixtures/mock.fixtures';
import { test as servicesTest } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

const test = mergeTests(mockTest, servicesTest);

test.describe('[UI] [Customers]', async function () {
  test.beforeEach(async function ({ customersPageService }) {
    await customersPageService.openAddNewCustomerPageByUrl();
  });

  test('Should show error when adding existing customer', async function ({
    customersPageService,
    customersMockService,
  }) {
    setMetadata(Severity.NORMAL);
    const customer = generateNewCustomer();
    await customersPageService.populateCustomer(customer);
    await customersMockService.getCustomerExistsMockResponse(customer);
    await customersPageService.save();
    await customersPageService.validateCustomerExistsToastMessage(customer);
  });
});
