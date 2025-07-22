import { ModalPage } from '../modal.page';

export class DeleteProductModalPage extends ModalPage {
  uniqueElement = '//h5[contains(text(),"Delete Product")]';
  buttonSelectors = {
    primaryAction: '//button[.="Yes, Delete"]',
    cancelAction: '//button[.="Cancel"]',
    close: '.modal-header .btn-close',
  };
  async clickOnDeleteProduct() {
    await this.clickOnModalPageButton('primaryAction');
  }

  async clickOnCancelDeletion() {
    await this.clickOnModalPageButton('cancelAction');
  }

  async clickOnCloseDeletion() {
    await this.clickOnModalPageButton('close');
  }
}
