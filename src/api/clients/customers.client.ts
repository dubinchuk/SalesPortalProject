import { apiConfig } from '../../config/apiConfig';
import { ICustomer, ICustomerResponse } from '../../data/types/customers.types';
import { RequestApi } from '../../utils/apiClients/request';
import { logStep } from '../../utils/report/decorator';

export class CustomerApiClient {
  constructor(private request = new RequestApi()) {}

  @logStep('Create customer via API')
  async create(body: ICustomer, token: string) {
    return await this.request.send<ICustomerResponse>({
      url: apiConfig.endpoints.Customers,
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    });
  }

  @logStep('Get customer via API')
  async getById(id: string, token: string) {
    return await this.request.send<ICustomerResponse>({
      url: apiConfig.endpoints['Get Customer By Id'](id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    });
  }

  @logStep('Get all customers via API')
  async getAll(token: string) {
    return await this.request.send<ICustomerResponse>({
      url: apiConfig.endpoints.Customers,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    });
  }

  @logStep('Update customer via API')
  async update(data: ICustomer & { _id: string }, token: string) {
    return await this.request.send<ICustomerResponse>({
      url: apiConfig.endpoints.Customers,
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
      data: data,
    });
  }

  @logStep('Delete customer via API')
  async delete(id: string, token: string) {
    return await this.request.send<ICustomerResponse>({
      url: apiConfig.endpoints.Customers + `/${id}`,
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    });
  }
}
