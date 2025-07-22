import { CustomerFormPage } from './customerForm.page';

export class EditCustomerPage extends CustomerFormPage {
  uniqueElement = '#edit-customer-form';
  private readonly 'Edit Customer form' = this.findElement('#edit-customer-form');

  private readonly 'Save Changes button' = this.findElement('#save-customer-changes');
  private readonly 'Delete Customer button' = this.findElement('#delete-customer-btn');
  private readonly 'Back to customers list page button' = this.findElement('.back-link');

  async clickOnSaveButton() {
    await this.click(this['Save Changes button']);
  }

  async clickOnDeleteButton() {
    await this.click(this['Delete Customer button']);
  }

  async clickOnGoBackButton() {
    await this.click(this['Back to customers list page button']);
  }
}
