import { chromium, type FullConfig } from '@playwright/test';

import signInApiService from '../api/services/signIn.api';

import { BASE_URL } from './environment';

const authFile = 'src/.auth/user.json';

async function globalSetup(config: FullConfig) {
  try {
    const token = await signInApiService.loginAsAdmin();
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.context().addCookies([
      {
        name: 'Authorization',
        value: token,
        url: BASE_URL,
      },
    ]);

    await page.context().storageState({ path: authFile });
  } catch (error) {
    throw new Error(`Failed to login via globalSetup: error ${error}`);
  }
}

export default globalSetup;
