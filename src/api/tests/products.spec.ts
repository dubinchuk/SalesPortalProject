import { test, expect } from '../../fixtures/services.fixtures';

test.describe('[API] Products', async function () {
  test('Create product', async function ({ product }) {
    await product.create();
    await product.delete();
  });

  test('Fail to create product', async function ({ product }) {
    try {
      await product.create({ name: '' });
    } catch (err) {
      expect((err as Error).message).toBe(
        'Failed to create product - Status code: 400, IsSuccess: false, ErrorMessage: Incorrect request body',
      );
    }
  });
});
