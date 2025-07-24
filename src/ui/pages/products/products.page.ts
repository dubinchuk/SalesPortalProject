import { SalesPortalPage } from '../salesPortal.page';

export class ProductsListPage extends SalesPortalPage {
  uniqueElement = '//h2[text()="Products List "]';

  readonly 'Add new product button': string = "//a[contains(text(),'+ Add Product')]";
  readonly 'Table row selector' = (productName: string) => `//tr[./td[text()="${productName}"]]`;
  readonly 'Name by product name' = (productName: string) =>
    `${this['Table row selector'](productName)}/td[1]`;
  readonly 'Price by product name' = (productName: string) =>
    `${this['Table row selector'](productName)}/td[2]`;
  readonly 'Manufacturer by product name' = (productName: string) =>
    `${this['Table row selector'](productName)}/td[3]`;
  readonly 'Created by product name' = (productName: string) =>
    `${this['Table row selector'](productName)}/td[4]`;
  readonly 'Actions by product name' = (productName: string) =>
    `${this['Table row selector'](productName)}/td[5]`;
  readonly 'Details button by product name' = (productName: string) =>
    `${this['Actions by product name'](productName)}/button[@title="Details"]`;
  readonly 'Edit button by product name' = (productName: string) =>
    `${this['Actions by product name'](productName)}/a[@title="Edit"]`;
  readonly 'Delete button by product name' = (productName: string) =>
    `${this['Actions by product name'](productName)}/button[@title="Delete"]`;

  async clickOnAddNewProductButton() {
    await this.click(this['Add new product button']);
  }

  async clickOnProductDetails(productName: string) {
    await this.click(this['Details button by product name'](productName));
  }

  async clickOnEditProduct(productName: string) {
    await this.click(this['Edit button by product name'](productName));
  }

  async clickOnDeleteProduct(productName: string) {
    await this.click(this['Delete button by product name'](productName));
  }

  async waitForProductToDetached(productName: string) {
    try {
      await this.waitForElementToBeDetached(this['Table row selector'](productName));
    } catch {
      throw new Error(`Deleted product with name ${productName} was found in table`);
    }
  }

  async getProductByName(name: string) {
    const [price, manufacturer, createdOn] = await Promise.all([
      this.getText(this['Price by product name'](name)),
      this.getText(this['Manufacturer by product name'](name)),
      this.getText(this['Created by product name'](name)),
    ]);
    return {
      name,
      price: +price.replace('$', ''),
      manufacturer,
      createdOn,
    };
  }
}
