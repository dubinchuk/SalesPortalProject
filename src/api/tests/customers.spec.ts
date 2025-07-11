import { Severity } from 'allure-js-commons';

import { test } from '../../fixtures/services.fixtures';
import { setMetadata } from '../../utils/report/testMetadata';

test.describe('[API] [Customers]', async function () {
  test.afterEach(async function ({ customer }) {
    await customer.delete();
  });

  test('Create customer with valid data', async function ({ signInService, customer }) {
    setMetadata(Severity.BLOCKER);
    await signInService.signInAsAdminAPI();
    await customer.createAndValidate();
  });
});
