import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Create', async function () {
  test.beforeEach(async function ({ productsPageService }) {
    await productsPageService.openProductsListPageByUrl();
    await productsPageService.openAddNewProductPage();
  });

  test.afterEach(async function ({ productsPageService }) {
    await productsPageService.delete();
  });

  test('Create product with valid data @smoke', async function ({ productsPageService }) {
    setMetadata(Severity.BLOCKER);
    await productsPageService.create();
  });
});
