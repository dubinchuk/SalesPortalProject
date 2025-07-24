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

  test('Update product with valid data from products list @smoke', async function ({
    productsPageService,
  }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openEditProduct();
    await productsPageService.update();
  });

  test('Update product with valid data from view details', async function ({
    productsPageService,
  }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openProductDetails();
    await productsPageService.openEditFromDetails();
    await productsPageService.update();
  });
});
