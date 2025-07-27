import { ModalPage } from '../modal.page';

export class ProductDetailsModalPage extends ModalPage {
  uniqueElement = '//h5[contains(text(),"Details")]';
  buttonSelectors = {
    primaryAction: '//a[.="Edit Product"]',
    cancelAction: '//button[.="Cancel"]',
    close: '.modal-header .btn-close',
  };

  private readonly 'Value by property name' = (name: string) =>
    `//h6[contains(.,"${name}")]/following::p[1]`;
  private readonly 'Name value' = `${this['Value by property name']('Name:')}`;
  private readonly 'Amount value' = `${this['Value by property name']('Amount:')}`;
  private readonly 'Price value' = `${this['Value by property name']('Price:')}`;
  private readonly 'Manufacturer value' = `${this['Value by property name']('Manufacturer:')}`;
  private readonly 'Created On value' = `${this['Value by property name']('Created On:')}`;
  private readonly 'Notes value' = `${this['Value by property name']('Notes:')}`;

  getProductDetailsTitleLocator(productName: string) {
    return this.findElement(`//h5[contains(text(),"${productName}'s Details")]`);
  }

  async waitForProductDetailsTitle(productName: string) {
    const locator = this.getProductDetailsTitleLocator(productName);
    await this.waitForElementAndScroll(locator);
  }

  async clickOnEditProduct() {
    await this.clickOnModalPageButton('primaryAction');
  }

  async clickOnCancelViewDetails() {
    await this.clickOnModalPageButton('cancelAction');
  }

  async clickOnCloseViewDetails() {
    await this.clickOnModalPageButton('close');
  }

  async getProductDetails() {
    const [name, amount, price, manufacturer, createdOn, notes] = await Promise.all([
      this.getText(this['Name value']),
      this.getText(this['Amount value']),
      this.getText(this['Price value']),
      this.getText(this['Manufacturer value']),
      this.getText(this['Created On value']),
      this.getText(this['Notes value']),
    ]);

    return { name, amount, price, manufacturer, createdOn, notes };
  }
}
