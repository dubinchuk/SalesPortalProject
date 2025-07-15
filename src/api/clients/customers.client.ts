import { apiConfig } from '../../config/apiConfig';
import { IRequestOptions } from '../../data/types/api.types';
import { ICustomer, ICustomerResponse, ICustomersResponse } from '../../data/types/customers.types';
import { RequestApi } from '../../utils/apiClients/request';
import { logStep } from '../../utils/report/decorator';

export class CustomerApiClient {
  constructor(private apiClient = new RequestApi()) {}

  @logStep('Create customer via API')
  async create(customer: ICustomer, token: string, expectError: boolean = false) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints.Customers,
      method: 'post',
      data: customer,
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return this.apiClient.send<ICustomerResponse>(options, expectError);
  }

  @logStep('Get customer via API')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints['Get Customer By Id'](id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<ICustomerResponse>(options);
  }

  @logStep('Get all customers via API')
  async getAll(token: string) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints['Get All Customers'],
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<ICustomersResponse>(options);
  }

  @logStep('Update customer via API')
  async update(customer: ICustomer & { _id: string }, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints['Get Customer By Id'](customer._id),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
      data: customer,
    };

    return await this.apiClient.send<ICustomerResponse>(options);
  }

  @logStep('Delete customer via API')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints['Get Customer By Id'](id),
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<ICustomerResponse>(options);
  }
}
