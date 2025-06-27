import { test } from '@playwright/test';

import { IRequestOptions, IResponse } from '../../data/types/api.types';

export class AllureReporter {
  constructor() {}

  public async logApiCall(options: IRequestOptions, response: IResponse): Promise<void> {
    const method = options.method?.toUpperCase();
    const url = options.url;
    await test.step(`API ${options.method?.toUpperCase()} ${options.url}`, async () => {
      await test.step('Request', async () => {
        if (options.headers) {
          await test.info().attach(`Request Headers for ${method} ${url}`, {
            body: JSON.stringify(options.headers, null, 2),
            contentType: 'application/json',
          });
        }
        if (options.data) {
          await test.info().attach(`Request Body for ${method} ${url}`, {
            body: JSON.stringify(options.data, null, 2),
            contentType: 'application/json',
          });
        }
      });

      await test.step(`Response ${response.status}`, async () => {
        if (response.headers) {
          await test.info().attach(`Response Headers for ${method} ${url}`, {
            body: JSON.stringify(response.headers, null, 2),
            contentType: 'application/json',
          });
        }
        if (response.body) {
          await test.info().attach(`Response Body for ${method} ${url}`, {
            body: JSON.stringify(response.body, null, 2),
            contentType: 'application/json',
          });
        }

        if (response.status >= 400) {
          test.info().status = 'failed';
        }
      });
    });
  }
}
