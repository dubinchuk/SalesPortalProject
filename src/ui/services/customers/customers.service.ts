import { expect, Page } from '@playwright/test';
import _ from 'lodash';

import { AddNewCustomerPage } from '../../pages/customers/addNewCustomer.page.js';
import { CustomersListPage } from '../../pages/customers/customers.page.js';
import {
  COUNTRIES,
  CUSTOMERS_COLUMN_NAME,
  ICustomer,
  ICustomersTable,
} from '../../../data/types/customers.types.js';
import { TABLE_MESSAGES } from '../../../data/customers/customersList.js';
import { TOAST_MESSAGES } from '../../../data/messages/messages.js';
import { validateToastMessage } from '../../../utils/validation/toastMessage.js';
import { logStep } from '../../../utils/report/decorator.js';

export class CustomersListService {
  private customersPage: CustomersListPage;
  private addNewCustomerPage: AddNewCustomerPage;
  constructor(protected page: Page) {
    this.customersPage = new CustomersListPage(page);
    this.addNewCustomerPage = new AddNewCustomerPage(page);
  }

  private columnKeyMap: Record<CUSTOMERS_COLUMN_NAME, keyof ICustomersTable> = {
    [CUSTOMERS_COLUMN_NAME.EMAIL]: 'email',
    [CUSTOMERS_COLUMN_NAME.NAME]: 'name',
    [CUSTOMERS_COLUMN_NAME.COUNTRY]: 'country',
    [CUSTOMERS_COLUMN_NAME.CREATED_ON]: 'createdOn',
  };

  @logStep('Open Add New Customer Page')
  async openAddNewCustomerPage() {
    await this.customersPage.clickOnAddNewCustomer();
    await this.addNewCustomerPage.waitForOpened();
  }

  private async repeatSortAction(action: () => Promise<void>, clickCount: number = 1) {
    for (let i = 0; i < clickCount; i++) {
      await action();
      await this.customersPage.waitForTableSpinnerToHide();
    }
  }

  @logStep('Click on column')
  private async clickToSortColumn(column: CUSTOMERS_COLUMN_NAME, direction: 'asc' | 'desc') {
    let clickCount: 1 | 2;
    direction === 'asc' ? (clickCount = 1) : (clickCount = 2);
    await this.repeatSortAction(
      () => this.customersPage.clickOnColumnHeaderToSort(column),
      clickCount,
    );
  }

  @logStep('Get all customers via UI')
  private async getAllCustomersUI() {
    const data = await this.customersPage.getCustomersColumns();
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

  @logStep('Validate toast message and close')
  async validateToastMessageAndClose(expectedMessage: string) {
    await validateToastMessage(this.customersPage, expectedMessage);
    await this.customersPage.closeToastMessage();
  }

  @logStep('Validate custommer created message')
  async validateCustomerCreatedMessage() {
    await this.validateToastMessageAndClose(TOAST_MESSAGES.CUSTOMER.CREATED);
  }

  @logStep('Validate empty table')
  async validateEmptyTable(message?: string) {
    const actualMessage = await this.customersPage.getEmptyTableMessage();
    expect(actualMessage).toEqual(message ?? TABLE_MESSAGES.EMPTY_TABLE);
  }

  @logStep('Check customer in table')
  async checkCustomerInTable(expectedCustomer: ICustomer) {
    const actualCustomer = await this.customersPage.getDataByEmail(expectedCustomer.email);
    expect(actualCustomer).toEqual(_.pick(expectedCustomer, 'email', 'name', 'country'));
  }
}
