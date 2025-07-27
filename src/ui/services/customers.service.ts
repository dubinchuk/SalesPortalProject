import { expect, Page } from '@playwright/test';
import _ from 'lodash';
import moment from 'moment';

import { AddNewCustomerPage } from '../pages/customers/addNewCustomer.page.js';
import { CustomersListPage } from '../pages/customers/customers.page.js';
import {
  COUNTRIES,
  CUSTOMERS_COLUMN_NAME,
  ICustomer,
  ICustomerFromResponse,
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

  @logStep('Open Details Modal')
  async openCustomerDetails(customerEmail?: string) {
    const email = customerEmail ?? this.customer.getSettings().email;
    await this.customersListPage.clickOnCustomerDetails(email);
    await this.customerDetailsPage.waitForOpened();
  }

  @logStep('Open Edit Customer from Customers list')
  async openEditCustomer(customerEmail?: string) {
    const email = customerEmail ?? this.customer.getSettings().email;
    await this.customersListPage.clickOnEditCustomer(email);
    await this.editCustomerPage.waitForOverlaySpinnerToHide();
    await this.editCustomerPage.waitForOpened();
  }

  @logStep('Open Delete Modal')
  async openDeleteCustomer(customerEmail?: string) {
    const email = customerEmail ?? this.customer.getSettings().email;
    await this.customersListPage.clickOnDeleteCustomer(email);
    await this.deleteCustomerModalPage.waitForOpened();
  }

  @logStep('Delete with Modal exit')
  async deleteWithModalExit() {
    await this.confirmDeleteCustomer();
    await this.deleteCustomerModalPage.waitForButtonSpinnerToHide();
    await this.deleteCustomerModalPage.waitForModalToClose();
    await this.customersListPage.waitForOpened();
    this.customer.createFromExisting(undefined);
  }

  @logStep('Close Delete Modal')
  async closeDeleteModal() {
    await this.deleteCustomerModalPage.clickOnCloseDeletion();
    await this.deleteCustomerModalPage.waitForModalToClose();
    await this.customersListPage.waitForOpened();
  }

  @logStep('Cancel Delete Modal')
  async cancelDeleteModal() {
    await this.deleteCustomerModalPage.clickOnCancelDeletion();
    await this.deleteCustomerModalPage.waitForModalToClose();
    await this.customersListPage.waitForOpened();
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
    await this.validateCustomerInTable();
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

  @logStep('Delete Customer')
  async delete() {
    await this.customer.delete();
  }

  @logStep('Delete Customer from Customers List')
  async deleteFromCustomersList(customerEmail?: string) {
    const email = customerEmail ?? this.customer.getSettings().email;
    await this.openDeleteCustomer(email);
    await this.deleteInModalPage();
  }

  @logStep('Delete Customer from Edit')
  async deleteCustomerFromEdit() {
    await this.editCustomerPage.clickOnDeleteButton();
    await this.deleteInModalPage();
  }

  @logStep('Delete Customer in Modal')
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
    await this.deleteCustomerModalPage.waitForModalToClose();
    await this.customersListPage.waitForOpened();
    await this.validateCustomerDeletedMessage();
    await this.checkCustomerNotInTable();
    if (!response.body) {
      const deletedCustomer = undefined;
      this.customer.createFromExisting(deletedCustomer);
    }
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

  @logStep('Validate Customer created message')
  async validateCustomerCreatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.customersListPage,
      TOAST_MESSAGES.CUSTOMER.CREATED,
    );
  }

  @logStep('Validate Customer updated message')
  async validateCustomerUpdatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.customersListPage,
      TOAST_MESSAGES.CUSTOMER.UPDATED,
    );
  }

  @logStep('Validate Customer deleted message')
  async validateCustomerDeletedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.customersListPage,
      TOAST_MESSAGES.CUSTOMER.DELETED,
    );
  }

  //TODO вынести общий метод в SalesPortalService
  @logStep('Validate empty Customers table')
  async validateEmptyTable(message?: string) {
    const actualMessage = await this.customersListPage.getEmptyTableMessage();
    expect(actualMessage).toEqual(message ?? TABLE_MESSAGES.EMPTY_TABLE);
  }

  @logStep('Validate Customer in table')
  async validateCustomerInTable(customerData?: ICustomerFromResponse) {
    const expectedCustomer = customerData ?? this.customer.getSettings();
    expectedCustomer.createdOn = moment(expectedCustomer.createdOn).format('YYYY/MM/DD HH:mm:ss');
    const actualCustomer = await this.customersListPage.getCustomerByEmail(expectedCustomer.email);
    expect(actualCustomer).toEqual(
      _.pick(expectedCustomer, 'email', 'name', 'country', 'createdOn'),
    );
  }

  @logStep('Check Customer not in table')
  async checkCustomerNotInTable(customerEmail?: string) {
    const email = customerEmail ?? this.customer.getSettings().email;
    await this.customersListPage.waitForCustomerToDetached(email);
  }

  @logStep('Validate created Customer by details')
  async validateCustomerByDetails(customerData?: Omit<ICustomerFromResponse, '_id'>) {
    const expectedCustomer = customerData ?? this.customer.getCustomerDataTransformedToDetails();
    if (!expectedCustomer.notes) expectedCustomer.notes = '-';
    await this.openCustomerDetails(expectedCustomer.email);
    const actualCustomer = await this.customerDetailsPage.getCustomerDetails();
    expect(actualCustomer).toEqual(expectedCustomer);
  }

  @logStep('Open Edit Customer from View Details modal page')
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
    await this.validateCustomerInTable();
  }

  async saveCustomerChanges() {
    await this.editCustomerPage.clickOnSaveButton();
  }

  async confirmDeleteCustomer() {
    await this.deleteCustomerModalPage.clickOnDeleteCustomer();
  }

  @logStep('Open Edit from Details')
  async openEditFromDetails() {
    await this.customerDetailsPage.clickOnEditCustomer();
    await this.editCustomerPage.waitForOverlaySpinnerToHide();
    await this.editCustomerPage.waitForOpened();
  }

  @logStep('Go back from Details')
  async goBackFromDetails() {
    await this.customerDetailsPage.clickOnbackToCustomersList();
    await this.customersListPage.waitForTableSpinnerToHide();
    await this.customersListPage.waitForOpened();
  }
  @logStep('Go back from Edit')
  async goBackFromEdit() {
    await this.editCustomerPage.clickOnGoBackButton();
    await this.customersListPage.waitForTableSpinnerToHide();
    await this.customersListPage.waitForOpened();
  }
}
