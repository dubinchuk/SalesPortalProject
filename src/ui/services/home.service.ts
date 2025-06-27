import { Page } from '@playwright/test';

import { HomePage } from '../pages/home.page.js';
import { CustomersListPage } from '../pages/customers/customers.page.js';
import { BASE_URL } from '../../config/environment.js';
import { logStep } from '../../utils/report/decorator.js';

export class HomeService {
  private homePage: HomePage;
  private customersPage: CustomersListPage;
  constructor(protected page: Page) {
    this.homePage = new HomePage(page);
    this.customersPage = new CustomersListPage(page);
  }

  @logStep('Open Customers Page')
  async openCustomersPage() {
    await this.homePage.clickOnViewDetailsButton('Customers');
    await this.homePage.waitForTableSpinnerToHide();
    await this.customersPage.waitForOpened();
  }

  @logStep('Open Home Page')
  async openHomePage() {
    await this.homePage.openPage(BASE_URL);
    await this.homePage.waitForOpened();
  }
}
