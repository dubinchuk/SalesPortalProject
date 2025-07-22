import { SalesPortalPage } from '../salesPortal.page';

export class CustomerDetailsPage extends SalesPortalPage {
  uniqueElement = '//h3[.="Customer Details"]';
  private readonly 'Edit Customer pencil button' = '#edit-customer-pencil';

  async clickOnEditCustomer() {
    await this.click(this['Edit Customer pencil button']);
  }
}
