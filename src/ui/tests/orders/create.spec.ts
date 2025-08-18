import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Orders] Create', async function () {
  test.beforeEach(async function ({ homePageService }) {
    await homePageService.openHomePage();
    await homePageService.openOrdersPage();
  });

  test.afterEach(async function ({ ordersPageService }) {
    await ordersPageService.deleteWithCustomerAndProducts();
  });

  test('Create Order with valid data @smoke', async function ({ ordersPageService }) {
    setMetadata(Severity.BLOCKER);
    await ordersPageService.create();
  });
});
