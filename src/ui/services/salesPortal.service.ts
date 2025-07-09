import { expect, Page } from '@playwright/test';

import { SalesPortalPage } from '../pages/salesPortal.page';

export class SalesPortalPageService {
  constructor(page: Page) {}

  async validateToastMessage(salesPortalPage: SalesPortalPage, expectedMessage: string) {
    const actualMessage = await salesPortalPage.getToastMessage();
    expect.soft(actualMessage).toBe(expectedMessage);
  }

  async validateToastMessageAndClose(salesPortalPage: SalesPortalPage, expectedMessage: string) {
    await this.validateToastMessage(salesPortalPage, expectedMessage);
    await salesPortalPage.closeToastMessage();
  }
}
