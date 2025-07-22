import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Update', async function () {
  test.beforeEach(async function ({ signInPageService, product, homePageService }) {
    await product.create();
    await signInPageService.openSalesPortal();
    await homePageService.openProductsPage();
  });

  test.afterEach(async function ({ productsPageService }) {
    await productsPageService.delete();
  });

  test('@smoke Update product with valid data', async function ({ productsPageService, product }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openEditProduct(product.getSettings().name);
    await productsPageService.update();
  });
});
