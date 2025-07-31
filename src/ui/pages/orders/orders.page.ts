import { SalesPortalPage } from '../salesPortal.page';

export class OrdersListPage extends SalesPortalPage {
  uniqueElement = '//h2[text()="Orders List "]';

  readonly 'Create Order button': string = 'button.page-title-header';
  readonly 'Table row selector' = (OrderNumber: string) => `//tr[./td[text()='${OrderNumber}']]`;
  readonly 'Order number by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[1]`;
  readonly 'Email by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[2]`;
  readonly 'Price by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[3]`;
  readonly 'Delivery by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[4]`;
  readonly 'Status by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[5]`;
  readonly 'Assigned Manager by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[6]`;
  readonly 'Created On by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[7]`;
  readonly 'Actions by Order number' = (OrderNumber: string) =>
    `${this['Table row selector'](OrderNumber)}/td[8]`;
  readonly 'Details button by Order number' = (OrderNumber: string) =>
    `${this['Actions by Order number'](OrderNumber)}/a[@title="Details"]`;

  async clickOnCreateOrderButton() {
    await this.click(this['Create Order button']);
  }

  async clickOnDetails(orderNumber: string) {
    await this.click(this['Details button by Order number'](orderNumber));
  }
}
