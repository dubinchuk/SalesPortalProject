import { apiConfig } from '../../config/apiConfig';
import { ICustomer, ICustomerResponse } from '../../data/types/customers.types';
import { RequestApi } from '../../utils/apiClients/request';
import { logStep } from '../../utils/report/decorator';

class CustomerApiClient {
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

  @logStep('Get customer via API')
  async get(id: string, token: string) {
    return await this.request.send<ICustomerResponse>({
      url: apiConfig.endpoints.Customers + `/${id}`,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    });
  }
}

export default new CustomerApiClient();
