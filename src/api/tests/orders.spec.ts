import { Severity } from 'allure-js-commons';

import { test } from '../../fixtures/services.fixtures';
import { setMetadata } from '../../utils/report/testMetadata';

test.describe('[API] [Orders] Create', async function () {
  test.afterEach(async function ({ order }) {
    await order.deleteWithCustomerAndProducts();
  });

  test('Create Order with valid data @smoke', async function ({ order }) {
    setMetadata(Severity.BLOCKER);
    await order.createAndValidate(2);
  });
});

test.describe('[API] [Orders] Delete', async function () {
  test('Delete Order @smoke', async function ({ order }) {
    setMetadata(Severity.CRITICAL);
    await order.delete();
  });
});
