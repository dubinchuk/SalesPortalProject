import { SalesPortalPage } from '../salesPortal.page';

export class CustomerDetailsPage extends SalesPortalPage {
  uniqueElement = '//h3[.="Customer Details"]';
  private readonly 'Edit Customer pencil button' = this.findElement('#edit-customer-pencil');
  private readonly 'Back to Customers list' = this.findElement('.back-link');
  private readonly 'Email value' = this.findElement('#customer-email');
  private readonly 'Name value' = this.findElement('#customer-name');
  private readonly 'Country value' = this.findElement('#customer-country');
  private readonly 'City value' = this.findElement('#customer-city');
  private readonly 'Street value' = this.findElement('#customer-street');
  private readonly 'House value' = this.findElement('#customer-house');
  private readonly 'Flat value' = this.findElement('#customer-flat');
  private readonly 'Phone value' = this.findElement('#customer-phone');
  private readonly 'Registration date value' = this.findElement('#customer-created-on');
  private readonly 'Notes value' = this.findElement('#customer-notes');

  async clickOnEditCustomer() {
    await this.click(this['Edit Customer pencil button']);
  }

  async clickOnbackToCustomersList() {
    await this.click(this['Back to Customers list']);
  }

  async getCustomerDetails() {
    const [email, name, country, city, street, house, flat, phone, createdOn, notes] =
      await Promise.all([
        this.getText(this['Email value']),
        this.getText(this['Name value']),
        this.getText(this['Country value']),
        this.getText(this['City value']),
        this.getText(this['Street value']),
        this.getText(this['House value']),
        this.getText(this['Flat value']),
        this.getText(this['Phone value']),
        this.getText(this['Registration date value']),
        this.getText(this['Notes value']),
      ]);

    return { email, name, country, city, street, house, flat, phone, createdOn, notes };
  }
}
