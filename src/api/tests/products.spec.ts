import { Severity } from 'allure-js-commons';

import { CUSTOM_API_ERRORS } from '../../data/errors/apiErrors';
import { test, expect } from '../../fixtures/services.fixtures';
import { setMetadata } from '../../utils/report/testMetadata';
import { generateNewProduct } from '../../data/products/generateProduct';

test.describe('[API] [Products] Create', async function () {
  test.afterEach(async function ({ product }) {
    await product.delete();
  });

  test('Create product', async function ({ product }) {
    setMetadata(Severity.BLOCKER);
    await product.createAndValidate();
  });

  test('Fail to create product', async function ({ product }) {
    setMetadata(Severity.NORMAL);
    try {
      await product.createAndValidate({ name: '' }, true);
    } catch (err) {
      expect((err as Error).message).toBe(CUSTOM_API_ERRORS.PRODUCT.CREATE_FAILED);
    }
  });
});

test.describe('[API] [Products] Delete', async function () {
  test.beforeEach(async function ({ product }) {
    await product.createAndValidate();
  });

  test('Delete created product', async function ({ product }) {
    setMetadata(Severity.NORMAL);
    await product.deleteAndValidate();
  });
});

test.describe('[API] [Products] Get', async function () {
  test.beforeEach(async function ({ product }) {
    await product.createAndValidate();
  });

  test.afterEach(async function ({ product }) {
    await product.delete();
  });

  test('Get created product', async function ({ product }) {
    setMetadata(Severity.CRITICAL);
    await product.getLatest();
  });
});

test.describe('[API] [Products] Get all', async function () {
  test('Get all products', async function ({ product }) {
    setMetadata(Severity.NORMAL);
    await product.getAll();
  });
});

test.describe('[API] [Products] Edit', async function () {
  test.beforeEach(async function ({ product }) {
    await product.create();
  });

  test.afterEach(async function ({ product }) {
    await product.delete();
  });

  test('Edit created product', async function ({ product }) {
    setMetadata(Severity.CRITICAL);
    const newProduct = generateNewProduct();
    await product.edit({ ...newProduct, _id: product.getSettings()._id });
  });
});
