import { mergeTests } from '@playwright/test';
import { Severity } from 'allure-js-commons';

import { test as servicesTest } from '../../../fixtures/services.fixtures';
import { test as mockTest } from '../../../fixtures/mock.fixtures';
import { apiConfig } from '../../../config/apiConfig';
import { STATUS_CODES } from '../../../data/types/api.types';
import { EMPTY_TABLE_MOCK } from '../../../data/customers/mocks';
import { setMetadata } from '../../../utils/report/testMetadata';

const test = mergeTests(mockTest, servicesTest);

test.describe('[UI] [Customers] Smoke', async function () {
  test.beforeEach(async function ({ signInPageService }) {
    await signInPageService.openSalesPortal();
  });

  test('Check empty customers table', async function ({
    homePageService,
    customersPageService,
    mock,
  }) {
    setMetadata(Severity.MINOR);
    const baseUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.Customers}`;
    const getCustomersUrl = new RegExp(`^${baseUrl}(\\?.*)?$`);
    await mock.modifyReponse(getCustomersUrl, EMPTY_TABLE_MOCK, STATUS_CODES.OK);
    await homePageService.openCustomersPage();
    await customersPageService.validateEmptyTable();
  });
});
