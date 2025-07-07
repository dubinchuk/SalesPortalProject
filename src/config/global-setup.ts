import { chromium, type FullConfig } from '@playwright/test';

import { SignInService } from '../services/signIn.service';

import { BASE_URL } from './environment';
const authFile = 'src/.auth/user.json';

async function globalSetup(config: FullConfig) {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const signInService = new SignInService(page);
    const token = await signInService.signInAsAdminForGlobalSetup();

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
