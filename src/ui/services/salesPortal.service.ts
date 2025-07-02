import { expect, Page } from '@playwright/test';

import { HomePage } from '../pages/home.page';
import { ProductsListPage } from '../pages/products/products.page';

export class SalesPortalPageService {
  private homePage: HomePage;
  private productsPage: ProductsListPage;
  constructor(page: Page) {
    this.homePage = new HomePage(page);
    this.productsPage = new ProductsListPage(page);
  }

  async openProductsPage() {
    await this.homePage.openModule('Products');
    await this.productsPage.waitForOpened();
  }

  async validateNotification(expectedMessage: string) {
    const actualMessage = await this.homePage.getToastMessage();
    expect(actualMessage).toBe(expectedMessage);
  }
}
