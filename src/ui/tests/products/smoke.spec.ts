import { test } from '../../../fixtures/services.fixtures';

test.describe('[UI] [Products]', async function () {
  test.beforeEach(async function ({ signInService }) {
    await signInService.openSalesPortal();
  });

  test('Create a new product with valid data', async function ({ productsPageService }) {
    await productsPageService.openProductsPage();
    await productsPageService.openAddNewProductPage();
    await productsPageService.populateProduct();
  });

  test.afterEach(async function ({ productsPageService }) {
    await productsPageService.delete();
  });
});
