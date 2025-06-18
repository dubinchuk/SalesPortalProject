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
    return response.body.Customer;
  }
}
