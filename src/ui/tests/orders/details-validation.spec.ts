import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Orders] Validate Details', async function () {
  test.beforeEach(async function ({ homePageService, ordersPageService, order }) {
    await order.create();
    await homePageService.openHomePage();
    await homePageService.openOrdersPage();
    await ordersPageService.openOrderDetails();
  });

  test.afterEach(async function ({ ordersPageService }) {
    await ordersPageService.deleteWithCustomerAndProducts();
  });

  test('Validate Order Details', async function ({ ordersPageService }) {
    setMetadata(Severity.NORMAL);
    await ordersPageService.validateOrderDetails();
  });

  test('Validate Customer Details', async function ({ ordersPageService }) {
    setMetadata(Severity.NORMAL);
    await ordersPageService.validateCustomerDetails();
  });

  test('Validate Requested Products', async function ({ ordersPageService }) {
    setMetadata(Severity.NORMAL);
    await ordersPageService.validateRequestedProducts();
  });

  test('Validate Delivery Information', async function ({ ordersPageService }) {
    setMetadata(Severity.NORMAL);
    await ordersPageService.validateDeliveryInformation();
  });
});
