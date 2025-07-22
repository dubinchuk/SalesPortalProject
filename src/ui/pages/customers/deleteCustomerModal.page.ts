import { ModalPage } from '../modal.page';

export class DeleteCustomerModalPage extends ModalPage {
  uniqueElement = '//h5[contains(text(),"Delete Customer")]';
  buttonSelectors = {
    primaryAction: '//button[.="Yes, Delete"]',
    cancelAction: '//button[.="Cancel"]',
    close: '.modal-header .btn-close',
  };
  async clickOnDeleteCustomer() {
    await this.clickOnModalPageButton('primaryAction');
  }

  async clickOnCancelDeletion() {
    await this.clickOnModalPageButton('cancelAction');
  }

  async clickOnCloseDeletion() {
    await this.clickOnModalPageButton('close');
  }
}
