import { apiConfig } from '../../config/apiConfig';
import { IRequestOptions } from '../../data/types/api.types';
import { IOrder, IOrderResponse, IOrdersResponse } from '../../data/types/order.types';
import { RequestApi } from '../../utils/apiClients/request';
import { logStep } from '../../utils/report/decorator';

export class OrderApiClient {
  constructor(private apiClient = new RequestApi()) {}

  @logStep('Create order via API')
  async create(order: IOrder, token: string, expectError: boolean = false) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints.Orders,
      method: 'post',
      data: order,
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return this.apiClient.send<IOrderResponse>(options, expectError);
  }

  @logStep('Get order via API')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints['Get Order By Id'](id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('Get all orders via API')
  async getAll(token: string) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints['Get All Orders'],
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<IOrdersResponse>(options);
  }

  @logStep('Delete order via API')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.endpoints['Get Order By Id'](id),
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<IOrderResponse>(options);
  }
}
