import { APIResponse, request } from '@playwright/test';
import _ from 'lodash';

import { AllureReporter } from '../report/allure.reporter';
import { IRequestOptions, IResponse, IResponseFields } from '../../data/types/api.types';
import { apiConfig } from '../../config/apiConfig';

export class RequestApi {
  private response!: APIResponse;
  constructor(private reporter = new AllureReporter()) {}

  async send<T extends IResponseFields>(
    options: IRequestOptions,
    expectError?: boolean,
  ): Promise<IResponse<T>> {
    try {
      const requestContext = await request.newContext({
        baseURL: options.baseURL ?? apiConfig.baseUrl,
      });
      this.response = await requestContext.fetch(options.url, _.omit(options, ['baseURL', 'url']));
      const responseData = await this.transormReponse();
      await this.reporter.logApiCall(options, responseData, expectError);

      if (this.response.status() >= 500)
        throw new Error('Request failed with status ' + this.response.status());
      return responseData;
    } catch (err) {
      throw err;
    }
  }

  private async transormReponse() {
    const contentType = this.response.headers()['content-type'] || '';

    let body;
    if (contentType.includes('application/json')) {
      body = await this.response.json();
    } else {
      body = await this.response.text();
    }

    return {
      status: this.response.status(),
      body,
      headers: this.response.headers(),
    };
  }
}
