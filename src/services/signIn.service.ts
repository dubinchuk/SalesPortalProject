import { Page } from '@playwright/test';

import { SignInApiClient } from '../api/clients/signIn.client';
import { ADMIN_PASSWORD, ADMIN_USERNAME, BASE_URL, TESTS } from '../config/environment';
import { IUserCredentials } from '../data/types/user.types';
import { SignInPage } from '../ui/pages/login.page';
import { HomePage } from '../ui/pages/home.page';
import { logStep } from '../utils/report/decorator';

export class SignInService {
  static instance: SignInService;
  private homePage: HomePage;
  private signInPage: SignInPage;

  private token: string | null = null;

  constructor(
    page: Page,
    token?: string,
    private service = new SignInApiClient(),
  ) {
    this.signInPage = new SignInPage(page);
    this.homePage = new HomePage(page);

    if (SignInService.instance) {
      return SignInService.instance;
    }
    if (token) this.token = token;
    SignInService.instance = this;
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      TESTS === 'ui' ? await this.getTokenFromBrowser() : await this.getTokenApi();
    }
    return this.transformToken();
  }

  private async getTokenFromBrowser() {
    const token = (await this.homePage.getCookies()).find(
      (cookie) => cookie.name === 'Authorization',
    );
    if (!token) throw new Error('Failed to get token from browser');
    this.token = token.value;
  }

  private async getTokenApi() {
    if (!this.token) {
      await this.signInAsAdminAPI();
    }
  }

  async setToken(token: string) {
    this.token = token;
  }

  @logStep('Sign in via UI')
  async signInUI(credentials: IUserCredentials) {
    await this.signInPage.fillCredentialsInputs(credentials);
    await this.signInPage.clickSubmitButton();
    await this.homePage.waitForOpened();
    await this.getTokenFromBrowser();
  }

  async signInAsAdminUI() {
    await this.signInUI({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
  }

  @logStep('Sign in via API')
  async signInAPI(credentials: IUserCredentials) {
    try {
      const response = await this.service.login(credentials);
      this.token = response.headers.authorization;
    } catch (error) {
      throw new Error(`Failed to sign in via Api. Reason:\n${(error as Error).message}`);
    }
    return await this.getToken();
  }

  async signInAsAdminAPI() {
    return await this.signInAPI({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
  }

  @logStep('Open Sales Portal')
  async openSalesPortal() {
    await this.signInPage.openPage(BASE_URL);
  }

  transformToken() {
    return `Bearer ${this.token}`;
  }

  @logStep('Sign Out')
  async signOut() {
    if (TESTS === 'ui') {
      await this.homePage.clearCookies();
    }
  }
}
