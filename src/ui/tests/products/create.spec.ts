import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Create', async function () {
  test.beforeEach(async function ({ signInService }) {
    await signInService.openSalesPortal();
  });

  test.afterEach(async function ({ productsPageService }) {
    await productsPageService.delete();
  });

  test('@smoke Create product with valid data', async function ({
    productsPageService,
    homePageService,
  }) {
    setMetadata(Severity.BLOCKER);
    await homePageService.openProductsPage();
    await productsPageService.openAddNewProductPage();
    await productsPageService.create();
  });
});
