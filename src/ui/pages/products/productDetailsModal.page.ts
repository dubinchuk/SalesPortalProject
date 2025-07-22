import { ModalPage } from '../modal.page';

export class ProductDetailsModalPage extends ModalPage {
  uniqueElement = '//h5[contains(text(),"Details")]';
  buttonSelectors = {
    primaryAction: '//a[.="Edit Product"]',
    cancelAction: '//button[.="Cancel"]',
    close: '.modal-header .btn-close',
  };
  async clickOnEditProduct() {
    await this.clickOnModalPageButton('primaryAction');
  }

  async clickOnCancelViewDetails() {
    await this.clickOnModalPageButton('cancelAction');
  }

  async clickOnCloseViewDetails() {
    await this.clickOnModalPageButton('close');
  }
}
