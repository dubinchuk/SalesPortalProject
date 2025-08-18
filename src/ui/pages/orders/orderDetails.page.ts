import { SalesPortalPage } from '../salesPortal.page';

export class OrderDetailsPage extends SalesPortalPage {
  uniqueElement = this.page.getByRole('heading', { name: 'Order Details' });

  // Order Details module
  private readonly 'Order number' = this.page.getByText('Order number:').locator('~ span');
  private readonly 'Assigned Manager container' = this.findElement('#assigned-manager-container');
  private readonly 'Assigned Manager' = this['Assigned Manager container'].locator('a,u').first();
  private readonly 'Order Status' = this.findElement(
    '//span[.="Order Status"]/following-sibling::span',
  );
  private readonly 'Total Price' = this.findElement(
    '//span[.="Total Price"]/following-sibling::span',
  );
  private readonly 'Delivery' = this.findElement('//span[.="Delivery"]/following-sibling::span');
  private readonly 'Created On' = this.findElement(
    '//div[@id="order-status-bar-container"]//span[.="Created On"]/following-sibling::span',
  );

  // Customer Details module
  private readonly 'Customer Details by field name' = (field: string) =>
    `//div[@id="customer-section"]//span[.="${field}"]/following-sibling::span`;
  private readonly 'Customer Email' = this.findElement(
    this['Customer Details by field name']('Email'),
  );
  private readonly 'Customer Name' = this.findElement(
    this['Customer Details by field name']('Name'),
  );
  private readonly 'Customer Country' = this.findElement(
    this['Customer Details by field name']('Country'),
  );
  private readonly 'Customer City' = this.findElement(
    this['Customer Details by field name']('City'),
  );
  private readonly 'Customer Street' = this.findElement(
    this['Customer Details by field name']('Street'),
  );
  private readonly 'Customer House' = this.findElement(
    this['Customer Details by field name']('House'),
  );
  private readonly 'Customer Flat' = this.findElement(
    this['Customer Details by field name']('Flat'),
  );
  private readonly 'Customer Phone' = this.findElement(
    this['Customer Details by field name']('Phone'),
  );
  private readonly 'Customer Created On' = this.findElement(
    this['Customer Details by field name']('Created On'),
  );
  private readonly 'Customer Notes' = this.findElement(
    this['Customer Details by field name']('Notes'),
  );

  // Requested Products module
  private readonly 'Requested Product button' = (productName: string) =>
    `//div[@id='products-accordion-section']//button[contains(text(), '${productName}')]`;
  private readonly 'Requested Product details by product name' = (
    productName: string,
    field: string,
  ) =>
    `${this['Requested Product button'](productName)}/parent::*/following-sibling::div//span[.='${field}']/following-sibling::span`;
  private readonly 'Requested Product Name' = (productName: string) =>
    this.findElement(this['Requested Product details by product name'](productName, 'Name'));
  private readonly 'Requested Product Price' = (productName: string) =>
    this.findElement(this['Requested Product details by product name'](productName, 'Price'));
  private readonly 'Requested Product Manufacturer' = (productName: string) =>
    this.findElement(
      this['Requested Product details by product name'](productName, 'Manufacturer'),
    );
  private readonly 'Requested Product Notes' = (productName: string) =>
    this.findElement(this['Requested Product details by product name'](productName, 'Notes'));
  private readonly 'Status receiving products by product name' = (productName: string) =>
    `${this['Requested Product button'](productName)}/following-sibling::span[contains(@class,'received-label')]`;

  // Delivery tab
  private readonly 'Delivery tab' = this.page.getByRole('tab', { name: 'Delivery' });
  private readonly 'Delivery Information selector' = (field: string) =>
    `//div[@id='delivery']//div[contains(@class,'c-details')]/span[.='${field}']/following-sibling::span`;
  private readonly 'Delivery Type' = this.findElement(
    this['Delivery Information selector']('Delivery Type'),
  );
  private readonly 'Delivery Date' = this.findElement(
    this['Delivery Information selector']('Delivery Date'),
  );
  private readonly 'Delivery Country' = this.findElement(
    this['Delivery Information selector']('Country'),
  );
  private readonly 'Delivery City' = this.findElement(
    this['Delivery Information selector']('City'),
  );
  private readonly 'Delivery Street' = this.findElement(
    this['Delivery Information selector']('Street'),
  );
  private readonly 'Delivery House' = this.findElement(
    this['Delivery Information selector']('House'),
  );
  private readonly 'Delivery Flat' = this.findElement(
    this['Delivery Information selector']('Flat'),
  );

  // Order History tab
  private readonly 'Order History tab' = this.page.getByRole('tab', { name: 'Order History' });

  private readonly 'Order History accordion' = this.findElement('#history-body .accordion');
  private readonly 'Order History accordion button' = (index: number) =>
    this['Order History accordion'].nth(index).getByRole('button');
  private readonly 'Order History accordion header cells' = (index: number) =>
    this['Order History accordion'].nth(index).locator('.his-col');

  private readonly 'Order History all rows' = (index: number) =>
    this['Order History accordion'].nth(index).locator('.mb-3 .d-flex.border-bottom');
  private readonly 'Order History rows with data' = (index: number) =>
    this['Order History all rows'](index).filter({ hasNot: this.findElement('.fw-bold') });
  private readonly 'Order History row cells' = (accordionIndex: number, rowIndex: number) =>
    this['Order History rows with data'](accordionIndex).nth(rowIndex).locator('span.his-col');
  private readonly 'Order History accordion expanded' = (index: number) =>
    this['Order History accordion'].nth(index).locator('.accordion-collapse.show');

  async clickOnAccordionRequestedProducts(productName: string) {
    await this.click(this['Requested Product button'](productName));
  }

  async clickOnDeliveryTab() {
    await this.click(this['Delivery tab']);
  }

  async clickOnOrderHistoryTab() {
    await this.click(this['Order History tab']);
  }

  async getOrderDetails() {
    const [id, manager, status, price, delivery, created] = await Promise.all([
      this.getText(this['Order number']),
      this.getText(this['Assigned Manager']),
      this.getText(this['Order Status']),
      this.getText(this['Total Price']),
      this.getText(this['Delivery']),
      this.getText(this['Created On']),
    ]);
    return {
      _id: id,
      assignedManager: manager,
      status,
      total_price: price,
      finalDate: delivery,
      createdOn: created,
    };
  }

  async getCustomerDetails() {
    await this.page.waitForTimeout(2000);
    const [email, name, country, city, street, house, flat, phone, createdOn, notes] =
      await Promise.all([
        this.getText(this['Customer Email']),
        this.getText(this['Customer Name']),
        this.getText(this['Customer Country']),
        this.getText(this['Customer City']),
        this.getText(this['Customer Street']),
        this.getText(this['Customer House']),
        this.getText(this['Customer Flat']),
        this.getText(this['Customer Phone']),
        this.getText(this['Customer Created On']),
        this.getText(this['Customer Notes']),
      ]);
    return { email, name, country, city, street, house, flat, phone, createdOn, notes };
  }

  async getRequestedProduct(productName: string) {
    const [name, price, manufacturer, notes, received] = await Promise.all([
      this.getText(this['Requested Product Name'](productName)),
      this.getText(this['Requested Product Price'](productName)),
      this.getText(this['Requested Product Manufacturer'](productName)),
      this.getText(this['Requested Product Notes'](productName)),
      this.getText(this['Status receiving products by product name'](productName)),
    ]);
    return { name, price, manufacturer, notes, received };
  }

  async getDeliveryInformation() {
    const [type, date, country, city, street, house, flat] = await Promise.all([
      this.getText(this['Delivery Type']),
      this.getText(this['Delivery Date']),
      this.getText(this['Delivery Country']),
      this.getText(this['Delivery City']),
      this.getText(this['Delivery Street']),
      this.getText(this['Delivery House']),
      this.getText(this['Delivery Flat']),
    ]);
    return { condition: type, finalDate: date, country, city, street, house, flat };
  }

  async getOrderHistory() {
    await this.clickOnOrderHistoryTab();

    const accordions = await this.waitForElements(this['Order History accordion']);
    const result = [];
    for (let i = 0; i < accordions.length; i++) {
      const button = this['Order History accordion button'](i);

      if ((await button.getAttribute('aria-expanded')) !== 'true') {
        await this.click(button);
      }

      await this.waitForElement(this['Order History accordion expanded'](i));

      const headerCells = await this.waitForElements(
        this['Order History accordion header cells'](i),
      );
      const action = await this.getText(headerCells[0]);
      const performer = await this.getText(headerCells[1]);
      const changedOn = await this.getText(headerCells[2]);

      const rowCount = await this['Order History rows with data'](i).count();
      const items = [];

      for (let j = 0; j < rowCount; j++) {
        const rowCells = await this.waitForElements(this['Order History row cells'](i, j));

        items.push({
          reference: await this.getText(rowCells[0]),
          previous: await this.getText(rowCells[1]),
          updated: await this.getText(rowCells[2]),
        });
      }

      result.push({
        header: [{ action, performer, changedOn }],
        items,
      });
    }

    return result;
  }
}
