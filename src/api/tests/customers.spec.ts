import { test } from '../../fixtures/services.fixtures';

test.describe('[API] [Customers]', async function () {
  test.afterEach(async function ({ customer }) {
    await customer.delete();
  });

  test('Create customer with valid data', async function ({ signInService, customer }) {
    await signInService.signInAsAdminAPI();
    await customer.create();
  });
});
