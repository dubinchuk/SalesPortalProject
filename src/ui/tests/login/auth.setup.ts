import { test as setup } from '../../../fixtures/services.fixtures';
import signInApiService from '../../../api/services/signIn.api';
import { BASE_URL } from '../../../config/environment';

const authFile = 'src/.auth/user.json';

setup('Should login with valid credentials', async ({ page }) => {
  const token = await signInApiService.loginAsAdmin();
  await page.context().addCookies([
    {
      name: 'Authorization',
      value: token,
      url: BASE_URL,
    },
  ]);

  await page.context().storageState({ path: authFile });
});
