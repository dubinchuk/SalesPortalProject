import { Page } from '@playwright/test';

import { ADMIN_PASSWORD, ADMIN_USERNAME, BASE_URL } from '../../config/environment';
import { IUserCredentials } from '../../data/types/user.types.js';
import { HomePage } from '../pages/home.page.js';
import { SignInPage } from '../pages/login.page.js';
import { logStep } from '../../utils/report/logStep.js';

export class SignInService {
  private signInPage: SignInPage;
  private homePage: HomePage;
  constructor(protected page: Page) {
    this.signInPage = new SignInPage(page);
    this.homePage = new HomePage(page);
  }

  @logStep()
  async openSalesPortal() {
    await this.signInPage.openPage(BASE_URL);
  }

  @logStep()
  async login(credentials: IUserCredentials) {
    await this.signInPage.fillCredentialsInputs(credentials);
    await this.signInPage.clickSubmitButton();
    await this.signInPage.waitForSpinnerToHide();
    await this.homePage.waitForOpened();
  }

  @logStep()
  async loginAsAdmin() {
    await this.login({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
  }

  async fillInputs(credentials: IUserCredentials) {
    await this.signInPage.fillCredentialsInputs(credentials);
  }

  async clearCookies() {
    await this.signInPage.deleteCookies();
  }
}
