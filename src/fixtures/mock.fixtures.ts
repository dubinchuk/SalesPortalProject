import { Page, test as base } from '@playwright/test';

import { STATUS_CODES } from '../data/types/api.types';
import { CustomersMockService } from '../api/services/customersMock.service';

export class Mock {
  constructor(private page: Page) {}

  public async modifyReponse<T>(url: string | RegExp, body: T, status: STATUS_CODES) {
    await this.page.route(url, async (route, request) => {
      // Can be filtered, for example by method like below:
      //
      // if(request.method() === 'POST') {
      //     await route.continue()
      //     return
      // }
      await route.fulfill({
        json: body,
        status,
      });
    });
  }
}

interface MockFixture {
  mock: Mock;
  customersMockService: CustomersMockService;
}

export const test = base.extend<MockFixture>({
  mock: async ({ page }, use) => {
    await use(new Mock(page));
  },
  customersMockService: async ({ mock }, use) => {
    await use(new CustomersMockService(mock));
  },
});
