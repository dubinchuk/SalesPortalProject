import { Severity } from 'allure-js-commons';

import { test } from '../../../fixtures/services.fixtures';
import { setMetadata } from '../../../utils/report/testMetadata';

test.describe('[UI] [Products] Details Modal', async function () {
  test.beforeEach(async function ({ product, homePageService }) {
    await product.create();
    await homePageService.openHomePage();
    await homePageService.openProductsPage();
  });

  test.afterEach(async function ({ product }) {
    await product.delete();
  });

  test('Validate Product details', async function ({ productsPageService }) {
    setMetadata(Severity.NORMAL);
    await productsPageService.validateProductByDetails();
  });

  test('Close Modal on Close cross button click', async function ({ productsPageService }) {
    setMetadata(Severity.NORMAL);
    await productsPageService.openProductDetails();
    await productsPageService.closeDetailsModal();
  });

  test('Close Modal on Cancel button click', async function ({ productsPageService }) {
    setMetadata(Severity.NORMAL);
    await productsPageService.openProductDetails();
    await productsPageService.cancelDetailsModal();
  });

  test('Open Edit Product', async function ({ productsPageService }) {
    setMetadata(Severity.NORMAL);
    await productsPageService.openProductDetails();
    await productsPageService.openEditFromDetails();
  });
});
