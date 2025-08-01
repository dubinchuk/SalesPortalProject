import { Page } from '@playwright/test';

import { logStep } from '../../utils/report/decorator';
import { CustomersListPage } from '../pages/customers/customers.page';
import { HomePage } from '../pages/home.page';
import { OrdersListPage } from '../pages/orders/orders.page';
import { ProductsListPage } from '../pages/products/products.page';

export class HomeService {
  private homePage: HomePage;
  private customersPage: CustomersListPage;
  private productsPage: ProductsListPage;
  private ordersPage: OrdersListPage;
  constructor(protected page: Page) {
    this.homePage = new HomePage(page);
    this.customersPage = new CustomersListPage(page);
    this.productsPage = new ProductsListPage(page);
    this.ordersPage = new OrdersListPage(page);
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

  @logStep('Open Orders Page')
  async openOrdersPage() {
    await this.homePage.openViewDetailsModule('Orders');
    await this.ordersPage.waitForOpened();
  }

  @logStep('Open Home Page')
  async openHomePage() {
    await this.homePage.goToBasePage();
    await this.homePage.waitForOpened();
  }
}
