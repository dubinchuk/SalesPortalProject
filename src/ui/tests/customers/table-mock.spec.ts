import { mergeTests } from '@playwright/test';
import { Severity } from 'allure-js-commons';

import { apiConfig } from '../../../config/apiConfig';
import { EMPTY_TABLE_MOCK } from '../../../data/customers/mocks';
import { STATUS_CODES } from '../../../data/types/api.types';
import { test as mockTest } from '../../../fixtures/mock.fixtures';
import { test as servicesTest } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

const test = mergeTests(mockTest, servicesTest);

test.describe('[UI] [Customers]', async function () {
  test.beforeEach(async function ({ homePageService }) {
    await homePageService.openHomePage();
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
