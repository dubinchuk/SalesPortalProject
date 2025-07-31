import { Page } from '@playwright/test';

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../config/environment';
import { IUserCredentials } from '../../data/types/user.types';
import { logStep } from '../../utils/report/decorator';
import { HomePage } from '../pages/home.page';
import { SignInPage } from '../pages/login.page';

export class SignInPageService {
  private signInPage: SignInPage;
  private homePage: HomePage;
  constructor(protected page: Page) {
    this.signInPage = new SignInPage(page);
    this.homePage = new HomePage(page);
  }

  @logStep('Open Sales Portal')
  async openSalesPortal() {
    await this.signInPage.goToBasePage();
    await this.signInPage.waitForOpened();
  }

  @logStep('Login')
  async login(credentials: IUserCredentials) {
    await this.signInPage.fillCredentialsInputs(credentials);
    await this.signInPage.clickSubmitButton();
    await this.signInPage.waitForButtonSpinnerToHide();
    await this.homePage.waitForOpened();
    await this.homePage.waitForHomeSpinnersToHide();
  }

  @logStep('Login as Admin')
  async signInAsAdmin() {
    await this.login({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
  }

  async fillInputs(credentials: IUserCredentials) {
    await this.signInPage.fillCredentialsInputs(credentials);
  }

  @logStep('Clear cookies')
  async clearCookies() {
    await this.signInPage.clearCookies();
  }
}
