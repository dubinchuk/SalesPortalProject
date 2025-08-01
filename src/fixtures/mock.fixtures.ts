import { Page, test as base } from '@playwright/test';

import { CustomersMockService } from '../api/services/customersMock.service';
import { STATUS_CODES } from '../data/types/api.types';

export class Mock {
  constructor(private page: Page) {}

  public async modifyReponse<T>(url: string | RegExp, body: T, status: STATUS_CODES) {
    await this.page.route(url, async (route) => {
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
