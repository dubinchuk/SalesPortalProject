import { ICustomer } from '../../../data/types/customers.types';
import { logStep } from '../../../utils/report/decorator';
import { SalesPortalPage } from '../salesPortal.page';

export abstract class CustomerFormPage extends SalesPortalPage {
  private readonly 'Name input' = this.findElement('#inputName');
  private readonly 'Email input' = this.findElement('#inputEmail');
  private readonly 'Country dropdown' = this.findElement('select#inputCountry');
  private readonly 'City input' = this.findElement('#inputCity');
  private readonly 'Street input' = this.findElement('#inputStreet');
  private readonly 'House input' = this.findElement('#inputHouse');
  private readonly 'Flat input' = this.findElement('#inputFlat');
  private readonly 'Phone input' = this.findElement('#inputPhone');
  private readonly 'Notes textarea' = this.findElement('#textareaNotes');

  @logStep('Fill customer inputs')
  async fillCustomerInputs(customer: Partial<ICustomer>) {
    customer.name && (await this.setValue(this['Name input'], customer.name));
    customer.email && (await this.setValue(this['Email input'], customer.email));
    customer.country &&
      (await this.selectDropdownValue(this['Country dropdown'], customer.country));
    customer.city && (await this.setValue(this['City input'], customer.city));
    customer.street && (await this.setValue(this['Street input'], customer.street));
    customer.house && (await this.setValue(this['House input'], customer.house));
    customer.flat && (await this.setValue(this['Flat input'], customer.flat));
    customer.phone && (await this.setValue(this['Phone input'], customer.phone));
    customer.notes && (await this.setValue(this['Notes textarea'], customer.notes));
  }
}
