import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Update', async function () {
  test.beforeEach(async function ({ product, homePageService }) {
    await product.create();
    await homePageService.openHomePage();
    await homePageService.openProductsPage();
  });

  test.afterEach(async function ({ productsPageService }) {
    await productsPageService.delete();
  });

  test('Update Product with valid data from Products List @smoke', async function ({
    productsPageService,
  }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openEditProduct();
    await productsPageService.update();
  });

  test('Update Product with valid data from Details', async function ({ productsPageService }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openProductDetails();
    await productsPageService.openEditFromDetails();
    await productsPageService.update();
  });
});
