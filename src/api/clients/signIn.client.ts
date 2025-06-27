import { apiConfig } from '../../config/apiConfig';
import { IRequestOptions } from '../../data/types/api.types';
import { ILoginResponse, IUserCredentials } from '../../data/types/user.types';
import { RequestApi } from '../../utils/apiClients/request';
import { logStep } from '../../utils/report/decorator';

export class SignInApiClient {
  constructor(private request = new RequestApi()) {}

  @logStep('Sign in via API')
  async login(credentials: IUserCredentials) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseUrl,
      url: apiConfig.endpoints.Login,
      data: credentials,
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    };

    return await this.request.send<ILoginResponse>(options);
  }
}
