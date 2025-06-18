import { mergeTests } from '@playwright/test';

import { test as servicesTest } from '../../../fixtures/services.fixtures';
import { test as mockTest } from '../../../fixtures/mock.fixtures';
import {
  generateCustomerFromResponse,
  generateNewCustomer,
} from '../../../data/customers/generateCustomer';

const test = mergeTests(mockTest, servicesTest);

test.describe('[UI] [Customers]', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.openSalesPortal();
  });

  // По условиям задачи нужно создать мок с кастомером, уже существующим в проекте, и завалидировать ошибку.
  // Но, учитывая то, что валидация происходит на бэкенде, нужно подмокивать респонс с ошибкой.
  // Т.е. создание мока с кастомером не имеет практического смысла (но в тесте я это сделал)

  test('Should show error when adding existing customer', async function ({
    homePageService,
    customersPageService,
    addNewCustomerPageService,
    customersMockService,
  }) {
    const customer = generateNewCustomer();
    await customersMockService.addCustomersToTableMock([generateCustomerFromResponse(customer)]);
    await homePageService.openCustomersPage();
    await customersPageService.openAddNewCustomerPage();
    await addNewCustomerPageService.fillCustomerInputs(customer);
    await customersMockService.getCustomerExistsMockResponse(customer);
    await addNewCustomerPageService.save();
    await addNewCustomerPageService.validateCustomerExistsToastMessage(customer);
  });
});
