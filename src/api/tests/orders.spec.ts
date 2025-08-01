import { Severity } from 'allure-js-commons';

import { test } from '../../fixtures/services.fixtures';
import { setMetadata } from '../../utils/report/testMetadata';

test.describe('[API] [Orders] Create', async function () {
  test.afterEach(async function ({ order }) {
    await order.deleteWithCustomerAndProducts();
  });

  test('Create Order with valid data @smoke', async function ({ order }) {
    setMetadata(Severity.BLOCKER);
    await order.createAndValidate();
  });
});

test.describe('[API] [Orders] Delete', async function () {
  let customerId: string;
  let productsIds: string[];

  test.beforeEach(async function ({ order }) {
    await order.create();
    customerId = order.getCustomerSettings()._id;
    productsIds = order.getProductsSettings().map((product) => product._id);
  });

  test.afterEach(async function ({ product, customer }) {
    await customer.delete(customerId);
    await product.deleteProducts(productsIds);
  });

  test('Delete Order @smoke', async function ({ order }) {
    setMetadata(Severity.CRITICAL);
    await order.delete();
  });
});
