import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Delete Modal', async function () {
  test.beforeEach(async function ({ product, homePageService, productsPageService }) {
    await product.create();
    await homePageService.openHomePage();
    await homePageService.openProductsPage();
    await productsPageService.openDeleteProduct();
  });

  test.afterEach(async function ({ product }) {
    await product.delete();
  });

  test('Close Modal on Close cross button click', async function ({ productsPageService }) {
    setMetadata(Severity.NORMAL);
    await productsPageService.closeDeleteModal();
  });

  test('Close Modal on Cancel button click', async function ({ productsPageService }) {
    setMetadata(Severity.NORMAL);
    await productsPageService.cancelDeleteModal();
  });

  test('Delete with Modal exit', async function ({ productsPageService, product }) {
    setMetadata(Severity.NORMAL);
    await productsPageService.deleteWithModalExit();
  });
});
