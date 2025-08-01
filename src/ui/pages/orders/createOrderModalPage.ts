import { ModalPage } from '../modal.page';

export class CreateOrderModalPage extends ModalPage {
  uniqueElement = '#add-order-modal-body';
  buttonSelectors = {
    primaryAction: '#create-order-btn',
    cancelAction: '#cancel-order-modal-btn',
    close: '.modal-header .btn-close',
  };

  private readonly 'Customer dropdown' = this.findElement('#inputCustomerOrder');
  private readonly 'Product dropdown' = this.findElement('#products-section .form-select');
  private readonly 'Add Product button' = this.findElement('#add-product-btn');
  private readonly 'Total Price value' = this.findElement('#total-price-order-modal');
  private readonly 'Delete Product button' = this.findElement('[title="Delete"]');

  async clickOnCreate() {
    await this.clickOnModalPageButton('primaryAction');
  }

  async clickOnCancelCreateOrder() {
    await this.clickOnModalPageButton('cancelAction');
  }

  async clickOnCloseCreateOrder() {
    await this.clickOnModalPageButton('close');
  }

  async clickOnAddProduct() {
    await this.click(this['Add Product button']);
  }

  async clickOnDeleteProduct() {
    await this.click(this['Delete Product button']);
  }

  async getTotalPrice() {
    await this.getText(this['Total Price value']);
  }

  async selectCustomer(customerName: string) {
    await this.selectDropdownValue(this['Customer dropdown'], customerName);
  }

  async selectProduct(productName: string, position: number) {
    await this.selectDropdownValue(await this.selectDropdown(position), productName);
  }

  async selectDropdown(position: number) {
    return this['Product dropdown'].nth(position);
  }
}
