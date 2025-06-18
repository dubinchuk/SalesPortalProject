import { expect, test } from '@playwright/test';
import _ from 'lodash';

import signInApiService from '../services/signIn.api';
import { generateNewCustomer } from '../../data/customers/generateCustomer';
import customerApiClient from '../clients/customers.client';
import { STATUS_CODES } from '../../data/types/api.types';

test.describe('[API] [Customers]', async function () {
  test('Create customer with valid data', async function () {
    await signInApiService.loginAsAdmin();
    const customerData = generateNewCustomer();
    const response = await customerApiClient.create(
      customerData,
      await signInApiService.getToken(),
    );
    expect(response.status).toBe(STATUS_CODES.CREATED);
    expect(response.body.IsSuccess).toBe(true);
    expect(response.body.ErrorMessage).toBe(null);
    expect(_.omit(response.body.Customer, ['_id', 'createdOn'])).toMatchObject({ ...customerData });
  });
});
