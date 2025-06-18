import { CUSTOMERS_COLUMN_NAME } from '../../../data/types/customers.types';
import { SalesPortalPage } from '../salesPortal.page';

export class CustomersListPage extends SalesPortalPage {
  uniqueElement = '//h2[text()="Customers List "]';

  private readonly 'Add New Customer button' = this.findElement('a.page-title-header');
  private readonly 'Column sort button by name' = (name: CUSTOMERS_COLUMN_NAME) =>
    this.findElement(`//div[.="${name}"]`);
  private readonly 'Table row selector' = (email: string) => `//tr[./td[text()='${email}']]`;
  private readonly 'Name by table row' = (email: string) =>
    this.findElement(`${this['Table row selector'](email)}/td[2]`);
  private readonly 'Country by table row' = (email: string) =>
    this.findElement(`${this['Table row selector'](email)}/td[3]`);
  private readonly 'Edit button by table row' = (email: string) =>
    this.findElement(`${this['Table row selector'](email)}//button[@title="Edit"]`);
  private readonly 'Delete button by table row' = (email: string) =>
    this.findElement(`${this['Table row selector'](email)}//button[@title="Delete"]`);

  private readonly 'Email column data' = '//tr/td[1]';
  private readonly 'Name column data' = '//tr/td[2]';
  private readonly 'Country column data' = '//tr/td[3]';
  private readonly 'Created On column data' = '//tr/td[4]';

  readonly 'Empty table message' = 'td.fs-italic';

  async getDataByEmail(email: string) {
    const [name, country] = await Promise.all([
      this.getText(this['Name by table row'](email)),
      this.getText(this['Country by table row'](email)),
    ]);
    return { email, name, country };
  }

  private async getColumnData(columnName: CUSTOMERS_COLUMN_NAME) {
    const locator = this.page.locator(this[`${columnName} column data`]);
    const elements = await locator.all();
    return Promise.all(elements.map((element) => element.innerText()));
  }

  async getCustomersColumns() {
    const storage: string[][] = [];
    const columns = Object.values(CUSTOMERS_COLUMN_NAME);

    for (const column of columns) {
      storage.push(await this.getColumnData(column));
    }
    return storage;
  }

  async clickOnColumnHeaderToSort(name: CUSTOMERS_COLUMN_NAME) {
    await this.click(this['Column sort button by name'](name));
  }

  async clickOnAddNewCustomer() {
    await this.click(this['Add New Customer button']);
  }

  async clickOnEditCustomer(email: string) {
    await this.click(this['Edit button by table row'](email));
  }

  async clickOnDeleteCustomer(email: string) {
    await this.click(this['Delete button by table row'](email));
  }

  async getEmptyTableMessage() {
    return this.getText(this['Empty table message']);
  }
}
