import { test } from '../../../fixtures/services.fixtures';

test.describe('[UI] [Products]', async function () {
  test.beforeEach(async function ({ signInService }) {
    await signInService.openSalesPortal();
  });

  test.afterEach(async function ({ productsPageService }) {
    await productsPageService.delete();
  });

  test('Create a new product with valid data', async function ({
    productsPageService,
    homePageService,
  }) {
    await homePageService.openProductsPage();
    await productsPageService.openAddNewProductPage();
    await productsPageService.createProduct();
    await productsPageService.checkProductInTable();
  });
});
