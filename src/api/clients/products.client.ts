import { apiConfig } from '../../config/apiConfig';
import { IRequestOptions } from '../../data/types/api.types';
import { IProduct, IProductResponse, IProductsResponse } from '../../data/types/product.types';
import { RequestApi } from '../../utils/apiClients/request';
import { logStep } from '../../utils/report/decorator';

export class ProductsApiClient {
  constructor(private apiClient = new RequestApi()) {}

  @logStep('Create product via API')
  async create(product: IProduct, token: string, expectError: boolean = false) {
    const options: IRequestOptions = {
      method: 'post',
      baseURL: apiConfig.baseUrl,
      url: apiConfig.endpoints.Products,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      data: product,
    };

    return await this.apiClient.send<IProductResponse>(options, expectError);
  }

  @logStep('Get product by id via API')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseUrl,
      url: apiConfig.endpoints['Get Product By Id'](id),
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<IProductResponse>(options);
  }

  @logStep('Get all products via API')
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseUrl,
      url: apiConfig.endpoints.Products,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send<IProductsResponse>(options);
  }

  @logStep('Update product via API')
  async update(data: IProduct & { _id: string }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseUrl,
      url: apiConfig.endpoints.Products,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: data,
    };

    return await this.apiClient.send<IProductResponse>(options);
  }

  @logStep('Delete product via API')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseUrl,
      url: apiConfig.endpoints['Get Product By Id'](id),
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    return await this.apiClient.send(options);
  }
}
