import { apiConfig } from '../../config/apiConfig';
import { ICustomer, ICustomerResponse } from '../../data/types/customers.types';
import { RequestApi } from '../../utils/apiClients/request';

class CustomerApiClient {
  constructor(private request = new RequestApi()) {}

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
}

export default new CustomerApiClient();
