import { SalesPortalPage } from './salesPortal.page.js';

export class HomePage extends SalesPortalPage {
  uniqueElement = '//strong[.="Admin"]';

  readonly 'Orders button' = this.findElement('#orders-from-home');
  readonly 'Products button' = this.findElement('#products-from-home');
  readonly 'Customers button' = this.findElement('#customers-from-home');

  async clickOnViewDetailsButton(moduleName: 'Products' | 'Customers' | 'Orders') {
    await this.click(this[`${moduleName} button`]);
  }
}
