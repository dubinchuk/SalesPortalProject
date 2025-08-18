import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Customers] Delete Modal', async function () {
  test.beforeEach(async function ({ customer, homePageService, customersPageService }) {
    await customer.create();
    await homePageService.openHomePage();
    await homePageService.openCustomersPage();
    await customersPageService.openDeleteCustomer();
  });

  test.afterEach(async function ({ customer }, testInfo) {
    if (testInfo.title !== 'Delete with Modal exit') {
      await customer.delete();
    }
  });

  test('Close Modal on Close cross button click', async function ({ customersPageService }) {
    setMetadata(Severity.NORMAL);
    await customersPageService.closeDeleteModal();
  });

  test('Close Modal on Cancel button click', async function ({ customersPageService }) {
    setMetadata(Severity.NORMAL);
    await customersPageService.cancelDeleteModal();
  });

  test('Delete with Modal exit', async function ({ customersPageService }) {
    setMetadata(Severity.NORMAL);
    await customersPageService.deleteWithModalExit();
  });
});
