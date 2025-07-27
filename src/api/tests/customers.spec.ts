import { Severity } from 'allure-js-commons';

import { test } from '../../fixtures/services.fixtures';
import { setMetadata } from '../../utils/report/testMetadata';
import { generateNewCustomer } from '../../data/customers/generateCustomer';

test.describe('[API] [Customers] Create', async function () {
  test.afterEach(async function ({ customer }) {
    await customer.delete();
  });

  test('Create customer with valid data @smoke', async function ({ customer }) {
    setMetadata(Severity.BLOCKER);
    await customer.createAndValidate();
  });
});

test.describe('[API] [Customers] Delete', async function () {
  test.beforeEach(async function ({ customer }) {
    await customer.createAndValidate();
  });

  test('Delete created customer @smoke', async function ({ customer }) {
    setMetadata(Severity.NORMAL);
    await customer.delete();
  });
});

test.describe('[API] [Customers] Get', async function () {
  test.beforeEach(async function ({ customer }) {
    await customer.createAndValidate();
  });

  test.afterEach(async function ({ customer }) {
    await customer.delete();
  });

  test('Get created customer @smoke', async function ({ customer }) {
    setMetadata(Severity.CRITICAL);
    await customer.getLatest();
  });
});

test.describe('[API] [Customers] Get all', async function () {
  test('Get all customers', async function ({ customer }) {
    setMetadata(Severity.NORMAL);
    await customer.getAll();
  });
});

test.describe('[API] [Customers] Edit', async function () {
  test.beforeEach(async function ({ customer }) {
    await customer.create();
  });

  test.afterEach(async function ({ customer }) {
    await customer.delete();
  });

  test('Edit created customer @smoke', async function ({ customer }) {
    setMetadata(Severity.CRITICAL);
    const newCustomer = generateNewCustomer();
    await customer.edit({ ...newCustomer, _id: customer.getSettings()._id });
  });
});
