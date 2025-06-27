import { expect, Page } from '@playwright/test';

import { generateNewCustomer } from '../../../data/customers/generateCustomer.js';
import { ICustomer, ICustomerResponse } from '../../../data/types/customers.types.js';
import { AddNewCustomerPage } from '../../pages/customers/addNewCustomer.page.js';
import { CustomersListPage } from '../../pages/customers/customers.page.js';
import { apiConfig } from '../../../config/apiConfig.js';
import { validateResponse } from '../../../utils/validation/response.js';
import { STATUS_CODES } from '../../../data/types/api.types.js';
import { validateToastMessage } from '../../../utils/validation/toastMessage.js';
import { TOAST_MESSAGES } from '../../../data/messages/messages.js';
import { logStep } from '../../../utils/report/decorator.js';

export class AddCustomerService {
  private customersPage: CustomersListPage;
  private addNewCustomerPage: AddNewCustomerPage;

  constructor(protected page: Page) {
    this.addNewCustomerPage = new AddNewCustomerPage(page);
    this.customersPage = new CustomersListPage(page);
  }

  async fillCustomerInputs(customer: Partial<ICustomer>) {
    await this.addNewCustomerPage.fillInputs(customer);
  }

  async save() {
    await this.addNewCustomerPage.clickOnSaveButton();
  }

  @logStep('Create customer')
  async create(customer?: ICustomer) {
    const customerData = customer ?? generateNewCustomer();
    await this.fillCustomerInputs(customerData);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints.Customers;
    const response = await this.addNewCustomerPage.interceptResponse<ICustomerResponse>(
      responseUrl,
      this.save.bind(this),
    );
    validateResponse<ICustomerResponse>(response, STATUS_CODES.CREATED, true, null);
    expect(response.body.Customer).toMatchObject({
      ...customerData,
      createdOn: response.body.Customer.createdOn,
      _id: response.body.Customer._id,
    });
    await this.addNewCustomerPage.waitForButtonSpinnerToHide();
    await this.customersPage.waitForOpened();
    await this.customersPage.waitForTableSpinnerToHide();
    return response;
  }

  async validateCustomerExistsToastMessage(customer: ICustomer) {
    await validateToastMessage(
      this.addNewCustomerPage,
      TOAST_MESSAGES.CUSTOMER.EXISTS(customer.email),
    );
  }
}
