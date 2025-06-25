import { expect } from '@playwright/test';
import _ from 'lodash';

import { generateNewCustomer } from '../../data/customers/generateCustomer';
import { STATUS_CODES } from '../../data/types/api.types';
import { ICustomer } from '../../data/types/customers.types';
import { validateResponse } from '../../utils/validation/response';
import customersApiClient from '../clients/customers.client';

import signInApi from './signIn.api';

export class CustomersApiService {
  constructor(private customersClient = customersApiClient) {}

  async create(customerData?: Partial<ICustomer>) {
    const response = await this.customersClient.create(
      generateNewCustomer(customerData),
      await signInApi.getToken(),
    );
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    expect(_.omit(response.body.Customer, ['_id', 'createdOn'])).toEqual({ ...customerData });
    return response;
  }

  async delete(id: string) {
    const response = await this.customersClient.delete(id, await signInApi.getToken());
    validateResponse(response, STATUS_CODES.DELETED);
  }

  async deleteCustomers(customersIdsToDelete: string[]) {
    for (const id of customersIdsToDelete) {
      try {
        await this.delete(id);
      } catch (error) {
        throw new Error(`Failed to delete customer with id ${id}: ${error}`);
      }
    }
  }
}

export default new CustomersApiService();
