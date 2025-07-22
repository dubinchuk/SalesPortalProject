import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Delete', async function () {
  test.beforeEach(async function ({ signInPageService, product, homePageService }) {
    await product.create();
    await signInPageService.openSalesPortal();
    await homePageService.openProductsPage();
  });

  test('@smoke Delete product from products list page', async function ({
    productsPageService,
    product,
  }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.deleteFromProductsList(product.getSettings().name);
  });

  test('@smoke Delete product from edit page', async function ({ productsPageService, product }) {
    setMetadata(Severity.CRITICAL);
    await productsPageService.openEditProduct(product.getSettings().name);
    await productsPageService.deleteProductFromEdit();
  });
});
