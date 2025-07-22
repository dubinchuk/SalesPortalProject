import { expect, Page } from '@playwright/test';
import _ from 'lodash';

import { AddNewCustomerPage } from '../pages/customers/addNewCustomer.page.js';
import { CustomersListPage } from '../pages/customers/customers.page.js';
import {
  COUNTRIES,
  CUSTOMERS_COLUMN_NAME,
  ICustomer,
  ICustomerResponse,
  ICustomersTable,
} from '../../data/types/customers.types.js';
import { TABLE_MESSAGES } from '../../data/customers/customersList.js';
import { TOAST_MESSAGES } from '../../data/messages/messages.js';
import { logStep } from '../../utils/report/decorator.js';
import { Customer } from '../../services/customer.service.js';
import { apiConfig } from '../../config/apiConfig.js';
import { generateNewCustomer } from '../../data/customers/generateCustomer.js';
import { CustomerDetailsPage } from '../pages/customers/customerDetails.page.js';
import { EditCustomerPage } from '../pages/customers/editCustomer.page.js';
import { DeleteCustomerModalPage } from '../pages/customers/deleteCustomerModal.page.js';
import { IResponse, IResponseFields } from '../../data/types/api.types.js';
import { ensureResponseBody } from '../../utils/validation/response.js';

import { SalesPortalPageService } from './salesPortal.service.js';

export class CustomersPageService {
  protected customersListPage: CustomersListPage;
  protected addNewCustomerPage: AddNewCustomerPage;
  private customer: Customer;
  private salesPortalService: SalesPortalPageService;
  private customerDetailsPage: CustomerDetailsPage;
  private editCustomerPage: EditCustomerPage;
  private deleteCustomerModalPage: DeleteCustomerModalPage;

  constructor(page: Page, customer: Customer) {
    this.customersListPage = new CustomersListPage(page);
    this.addNewCustomerPage = new AddNewCustomerPage(page);
    this.customer = customer;
    this.salesPortalService = new SalesPortalPageService(page);
    this.customerDetailsPage = new CustomerDetailsPage(page);
    this.editCustomerPage = new EditCustomerPage(page);
    this.deleteCustomerModalPage = new DeleteCustomerModalPage(page);
  }

  private columnKeyMap: Record<CUSTOMERS_COLUMN_NAME, keyof ICustomersTable> = {
    [CUSTOMERS_COLUMN_NAME.EMAIL]: 'email',
    [CUSTOMERS_COLUMN_NAME.NAME]: 'name',
    [CUSTOMERS_COLUMN_NAME.COUNTRY]: 'country',
    [CUSTOMERS_COLUMN_NAME.CREATED_ON]: 'createdOn',
  };

  @logStep('Open Add New Customer Page')
  async openAddNewCustomerPage() {
    await this.customersListPage.clickOnAddNewCustomer();
    await this.addNewCustomerPage.waitForOpened();
  }

  @logStep('Open View customer details')
  async openCustomerDetails(email: string) {
    await this.customersListPage.clickOnCustomerDetails(email);
    await this.customerDetailsPage.waitForOpened();
  }

  @logStep('Open Delete customer modal page')
  async openDeleteCustomer(email: string) {
    await this.customersListPage.clickOnDeleteCustomer(email);
    await this.deleteCustomerModalPage.waitForOpened();
  }

  @logStep('Open Edit Customer from Customers list')
  async openEditCustomer(email: string) {
    await this.customersListPage.clickOnEditCustomer(email);
    await this.editCustomerPage.waitForOverlaySpinnerToHide();
    await this.editCustomerPage.waitForOpened();
  }

  @logStep('Create customer')
  async create(customCustomerData?: ICustomer) {
    await this.populateCustomer(customCustomerData);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints.Customers;
    const response = await this.addNewCustomerPage.interceptResponse<ICustomerResponse>(
      responseUrl,
      this.save.bind(this),
    );

    ensureResponseBody(response);
    this.customer.validateCreateCustomerResponseStatus(response);
    this.customer.createFromExisting(response.body.Customer);
    await this.addNewCustomerPage.waitForButtonSpinnerToHide();
    await this.customersListPage.waitForOpened();
    await this.customersListPage.waitForTableSpinnerToHide();
    await this.validateCustomerCreatedMessage();
    await this.checkCustomerInTable();
  }

  async populateCustomer(customCustomerData?: ICustomer, isAddPage: boolean = true) {
    const data = customCustomerData ?? generateNewCustomer();
    const formPage = isAddPage ? this.addNewCustomerPage : this.editCustomerPage;
    await formPage.fillCustomerInputs(data);
    return data;
  }

  async save() {
    await this.addNewCustomerPage.clickOnSaveNewCustomerButton();
  }

  @logStep('Delete customer')
  async delete() {
    await this.customer.delete();
  }

  @logStep('Delete customer from customers list page')
  async deleteFromCustomersList(email: string) {
    await this.openDeleteCustomer(email);
    await this.deleteInModalPage();
  }

  @logStep('Delete customer from edit customer page')
  async deleteCustomerFromEdit() {
    await this.editCustomerPage.clickOnDeleteButton();
    await this.deleteInModalPage();
  }

  @logStep('Delete customer in modal page')
  private async deleteInModalPage() {
    const responseUrl =
      apiConfig.baseUrl +
      apiConfig.endpoints['Get Customer By Id'](this.customer.getSettings()._id);
    const response = await this.deleteCustomerModalPage.interceptResponse<IResponseFields>(
      responseUrl,
      this.confirmDeleteCustomer.bind(this),
    );

    this.customer.validateDeleteCustomerResponseStatus(response as IResponse<ICustomerResponse>);
    await this.deleteCustomerModalPage.waitForButtonSpinnerToHide();
    await this.customersListPage.waitForOpened();
    await this.validateCustomerDeletedMessage();
    await this.checkCustomerNotInTable();
  }

  async validateCustomerExistsToastMessage(customer: ICustomer) {
    await this.salesPortalService.validateToastMessage(
      this.customersListPage,
      TOAST_MESSAGES.CUSTOMER.EXISTS(customer.email),
    );
  }

  private async repeatSortAction(action: () => Promise<void>, clickCount: number = 1) {
    for (let i = 0; i < clickCount; i++) {
      await action();
      await this.customersListPage.waitForTableSpinnerToHide();
    }
  }

  @logStep('Click on column')
  private async clickToSortColumn(column: CUSTOMERS_COLUMN_NAME, direction: 'asc' | 'desc') {
    let clickCount: 1 | 2;
    direction === 'asc' ? (clickCount = 1) : (clickCount = 2);
    await this.repeatSortAction(
      () => this.customersListPage.clickOnColumnHeaderToSort(column),
      clickCount,
    );
  }

  @logStep('Get all customers via UI')
  private async getAllCustomersUI() {
    const data = await this.customersListPage.getCustomersColumns();
    const customers: ICustomersTable[] = [];
    for (let i = 0; i < data[0].length; i++) {
      const countryStr = data[2][i];
      const countryEnum = countryStr as COUNTRIES;
      customers.push({
        email: data[0][i],
        name: data[1][i],
        country: countryEnum,
        createdOn: data[3][i],
      });
    }
    return customers;
  }

  private async sortCustomersArray(column: keyof ICustomersTable, direction: 'asc' | 'desc') {
    const customers = await this.getAllCustomersUI();
    customers.sort((a, b) => {
      const compareString = (valueA: string, valueB: string) =>
        direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);

      const compareDates = (dateA: string, dateB: string) =>
        direction === 'asc'
          ? new Date(dateA).getTime() - new Date(dateB).getTime()
          : new Date(dateB).getTime() - new Date(dateA).getTime();

      if (column === 'createdOn') {
        return compareDates(a.createdOn, b.createdOn);
      }

      const primaryComparison = compareString(a[column], b[column]);
      return primaryComparison !== 0 ? primaryComparison : compareDates(a.createdOn, b.createdOn);
    });
    return customers;
  }

  @logStep('Sort customers and verify')
  async sortCustomersAndVerify(column: CUSTOMERS_COLUMN_NAME, direction: 'asc' | 'desc') {
    const key = this.columnKeyMap[column];
    const expectedData = await this.sortCustomersArray(key, direction);
    await this.clickToSortColumn(column, direction);

    const actualData = await this.getAllCustomersUI();
    expect(actualData).toEqual(expectedData);
  }

  @logStep('Validate customer created message')
  async validateCustomerCreatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.customersListPage,
      TOAST_MESSAGES.CUSTOMER.CREATED,
    );
  }

  @logStep('Validate customer updated message')
  async validateCustomerUpdatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.customersListPage,
      TOAST_MESSAGES.CUSTOMER.UPDATED,
    );
  }

  @logStep('Validate customer deleted message')
  async validateCustomerDeletedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.customersListPage,
      TOAST_MESSAGES.CUSTOMER.DELETED,
    );
  }

  //TODO вынести общий метод в SalesPortalService
  @logStep('Validate empty customers table')
  async validateEmptyTable(message?: string) {
    const actualMessage = await this.customersListPage.getEmptyTableMessage();
    expect(actualMessage).toEqual(message ?? TABLE_MESSAGES.EMPTY_TABLE);
  }

  @logStep('Check customer in table')
  async checkCustomerInTable(customerData?: ICustomer) {
    const expectedCustomer = customerData ?? this.customer.getSettings();
    const actualCustomer = await this.customersListPage.getDataByEmail(expectedCustomer.email);
    expect(actualCustomer).toEqual(_.pick(expectedCustomer, 'email', 'name', 'country'));
  }

  @logStep('Check customer not in table')
  async checkCustomerNotInTable(email?: string) {
    const customerEmail = email ?? this.customer.getSettings().email;
    await this.customersListPage.waitForCustomerToDetached(customerEmail);
  }

  @logStep('Open Edit customer from View Details modal page')
  async openEditCustomerFromDetails() {
    await this.customerDetailsPage.clickOnEditCustomer();
    await this.editCustomerPage.waitForOpened();
  }

  @logStep('Update customer')
  async update(customCustomerData?: ICustomer) {
    const settings = this.customer.getSettings();
    await this.populateCustomer(customCustomerData, false);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints['Get Customer By Id'](settings._id);
    const response = await this.editCustomerPage.interceptResponse<ICustomerResponse>(
      responseUrl,
      this.saveCustomerChanges.bind(this),
    );

    ensureResponseBody(response);
    this.customer.validateEditCustomerResponseStatus(response);
    this.customer.createFromExisting(response.body.Customer);
    await this.editCustomerPage.waitForButtonSpinnerToHide();
    await this.customersListPage.waitForOpened();
    await this.customersListPage.waitForTableSpinnerToHide();
    await this.validateCustomerUpdatedMessage();
    await this.checkCustomerInTable();
  }

  async saveCustomerChanges() {
    await this.editCustomerPage.clickOnSaveButton();
  }

  async confirmDeleteCustomer() {
    await this.deleteCustomerModalPage.clickOnDeleteCustomer();
  }
}
