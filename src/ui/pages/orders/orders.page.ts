import { SalesPortalPage } from '../salesPortal.page';

export class OrdersListPage extends SalesPortalPage {
  uniqueElement = '//h2[text()="Orders List "]';

  private readonly 'Create Order button': string = 'button.page-title-header';
  private readonly 'Table row selector' = (orderNumber: string) =>
    `//tr[./td[text()='${orderNumber}']]`;
  private readonly 'Email by Order number' = (orderNumber: string) =>
    `${this['Table row selector'](orderNumber)}/td[2]`;
  private readonly 'Price by Order number' = (orderNumber: string) =>
    `${this['Table row selector'](orderNumber)}/td[3]`;
  private readonly 'Delivery by Order number' = (orderNumber: string) =>
    `${this['Table row selector'](orderNumber)}/td[4]`;
  private readonly 'Status by Order number' = (orderNumber: string) =>
    `${this['Table row selector'](orderNumber)}/td[5]`;
  private readonly 'Assigned Manager by Order number' = (orderNumber: string) =>
    `${this['Table row selector'](orderNumber)}/td[6]`;
  private readonly 'Created On by Order number' = (orderNumber: string) =>
    `${this['Table row selector'](orderNumber)}/td[7]`;
  private readonly 'Actions by Order number' = (orderNumber: string) =>
    `${this['Table row selector'](orderNumber)}/td[8]`;
  private readonly 'Details button by Order number' = (orderNumber: string) =>
    `${this['Actions by Order number'](orderNumber)}/a[@title="Details"]`;

  async clickOnCreateOrderButton() {
    await this.click(this['Create Order button']);
  }

  async clickOnDetails(orderNumber: string) {
    await this.click(this['Details button by Order number'](orderNumber));
  }

  async getOrderByOrderNumber(orderNumber: string) {
    const [email, price, delivery, status, assignedManager, createdOn] = await Promise.all([
      this.getText(this['Email by Order number'](orderNumber)),
      this.getText(this['Price by Order number'](orderNumber)),
      this.getText(this['Delivery by Order number'](orderNumber)),
      this.getText(this['Status by Order number'](orderNumber)),
      this.getText(this['Assigned Manager by Order number'](orderNumber)),
      this.getText(this['Created On by Order number'](orderNumber)),
    ]);

    return {
      orderNumber,
      email,
      price: +price.replace('$', ''),
      delivery,
      status,
      assignedManager,
      createdOn,
    };
  }
}
