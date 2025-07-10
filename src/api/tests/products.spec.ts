import { CUSTOM_API_ERRORS } from '../../data/errors/apiErrors';
import { test, expect } from '../../fixtures/services.fixtures';

test.describe('[API] Products', async function () {
  test.describe('Create', () => {
    test.afterEach(async function ({ product }) {
      await product.delete();
    });

    test('Create product', async function ({ product }) {
      await product.createAndValidate();
    });

    test('Fail to create product', async function ({ product }) {
      try {
        await product.createAndValidate({ name: '' }, true);
      } catch (err) {
        expect((err as Error).message).toBe(CUSTOM_API_ERRORS.PRODUCT.CREATE_FAILED);
      }
    });
  });

  test.describe('Delete', async function () {
    test.beforeEach(async function ({ product }) {
      await product.createAndValidate();
    });

    test('Delete product', async function ({ product }) {
      await product.deleteAndValidate();
    });
  });
});
