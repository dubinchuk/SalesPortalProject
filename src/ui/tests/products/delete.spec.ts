import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Delete', async function () {
  test.beforeEach(async function ({ signInPageService, product, homePageService }) {
    await product.create();
    await signInPageService.openSalesPortal();
    await homePageService.openProductsPage();
  });

  test('Delete product from products list page @smoke', async function ({ productsPageService }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.deleteFromProductsList();
  });

  test('Delete product from edit page', async function ({ productsPageService }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openEditProduct();
    await productsPageService.deleteProductFromEdit();
  });

  test('Delete product from view details', async function ({ productsPageService }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openProductDetails();
    await productsPageService.openEditFromDetails();
    await productsPageService.deleteProductFromEdit();
  });
});
