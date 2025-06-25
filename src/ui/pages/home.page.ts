import { CONTAINERS } from '../../data/types/home.types.js';

import { SalesPortalPage } from './salesPortal.page.js';

export class HomePage extends SalesPortalPage {
  uniqueElement = '//strong[.="Admin"]';

  private readonly 'Orders button' = this.findElement('#orders-from-home');
  private readonly 'Products button' = this.findElement('#products-from-home');
  private readonly 'Customers button' = this.findElement('#customers-from-home');

  private readonly containers: Record<CONTAINERS, string> = {
    [CONTAINERS.ORDERS_THIS_YEAR]: '#total-orders-container',
    [CONTAINERS.TOTAL_REVENUE]: '#total-revenue-container',
    [CONTAINERS.NEW_CUSTOMERS]: '#total-customers-container',
    [CONTAINERS.AVG_ORDERS_VALUE]: '#avg-orders-value-container',
    [CONTAINERS.CANCELED_ORDERS]: '#canceled-orders-containers',
    [CONTAINERS.CURRENT_MONTH_ORDERS]: '#orders-chart-container',
    [CONTAINERS.TOP_SOLD_PRODUCTS]: '#top-products-chart-container',
    [CONTAINERS.CUSTOMER_GROWTH]: '#customer-growth-chart-container',
    [CONTAINERS.RECENT_ORDERS]: '#recent-orders-container',
    [CONTAINERS.TOP_CUSTOMERS]: '#top-customers-container',
  };

  private readonly getSpinnerByContainerName = (containerName: CONTAINERS) => {
    const containerSelector = this.containers[containerName];
    return this.findElement(`${containerSelector} .spinner-border`);
  };

  async waitForHomeSpinnersToHide() {
    const spinners = (Object.keys(this.containers) as CONTAINERS[]).map((name) =>
      this.getSpinnerByContainerName(name),
    );
    await this.waitForSpinnerToHide(spinners);
  }

  async clickOnViewDetailsButton(moduleName: 'Products' | 'Customers' | 'Orders') {
    await this.click(this[`${moduleName} button`]);
  }
}
