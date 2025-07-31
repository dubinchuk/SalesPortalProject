import { CustomerFormPage } from './customerForm.page';
import { logStep } from '../../../utils/report/decorator';

export class AddNewCustomerPage extends CustomerFormPage {
  readonly uniqueElement = '//h2[.="Add New Customer "]';
  readonly 'Add New Customer form' = this.findElement('#add-new-customer-form');
  private readonly 'Save New Customer button' = this.findElement('#save-new-customer');

  @logStep('Click on Save New Customer button')
  async clickOnSaveNewCustomerButton() {
    await this.click(this['Save New Customer button']);
  }
}
