import { expect } from '@playwright/test';

import { SalesPortalPage } from '../../ui/pages/salesPortal.page';

export async function validateToastMessage(page: SalesPortalPage, expectedMessage: string) {
  const actualMessage = await page.getToastMessage();
  expect(actualMessage).toBe(expectedMessage);
}
