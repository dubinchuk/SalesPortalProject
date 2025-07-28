import { Page } from '@playwright/test';

import { logStep } from '../../utils/report/decorator';
import { CustomersListPage } from '../pages/customers/customers.page';
import { HomePage } from '../pages/home.page';
import { ProductsListPage } from '../pages/products/products.page';

export class HomeService {
  private homePage: HomePage;
  private customersPage: CustomersListPage;
  private productsPage: ProductsListPage;
  constructor(protected page: Page) {
    this.homePage = new HomePage(page);
    this.customersPage = new CustomersListPage(page);
    this.productsPage = new ProductsListPage(page);
  }

  @logStep('Open Customers Page')
  async openCustomersPage() {
    await this.homePage.openViewDetailsModule('Customers');
    await this.homePage.waitForTableSpinnerToHide();
    await this.customersPage.waitForOpened();
  }

  @logStep('Open Products Page')
  async openProductsPage() {
    await this.homePage.openViewDetailsModule('Products');
    await this.homePage.waitForTableSpinnerToHide();
    await this.productsPage.waitForOpened();
  }

  @logStep('Open Home Page')
  async openHomePage() {
    await this.homePage.goToBasePage();
    await this.homePage.waitForOpened();
  }
}
