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
import { SignInService } from '../../services/signIn.service.js';
import { STATUS_CODES } from '../../data/types/api.types.js';
import { ResponseError } from '../../utils/errors/errors.js';

import { SalesPortalPageService } from './salesPortal.service.js';

export class CustomersPageService {
  protected customersListPage: CustomersListPage;
  protected addNewCustomerPage: AddNewCustomerPage;
  private customer: Customer;
  private salesPortalService: SalesPortalPageService;

  constructor(page: Page, signInService: SignInService) {
    this.customersListPage = new CustomersListPage(page);
    this.addNewCustomerPage = new AddNewCustomerPage(page);
    this.customer = new Customer(signInService);
    this.salesPortalService = new SalesPortalPageService(page);
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

  @logStep('Create customer')
  async create(customCustomerData?: ICustomer) {
    await this.populateCustomer(customCustomerData);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints.Customers;
    const response = await this.addNewCustomerPage.interceptResponse<ICustomerResponse>(
      responseUrl,
      this.save.bind(this),
    );

    if (response.status !== STATUS_CODES.CREATED) {
      throw new ResponseError(`Failed to create customer`, {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      });
    }

    this.customer.createFromExisting(response.body.Customer);
    await this.addNewCustomerPage.waitForButtonSpinnerToHide();
    await this.customersListPage.waitForOpened();
    await this.customersListPage.waitForTableSpinnerToHide();
    await this.validateCustomerCreatedMessage();
    await this.checkCustomerInTable();
  }

  async populateCustomer(customCustomerData?: ICustomer) {
    const data = customCustomerData ?? generateNewCustomer();
    await this.addNewCustomerPage.fillCustomerInputs(data);
    return data;
  }

  async save() {
    await this.addNewCustomerPage.clickOnSaveNewCustomerButton();
  }

  @logStep('Delete customer')
  async delete() {
    await this.customer.delete();
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
}
