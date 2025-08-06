import { SalesPortalPage } from '../salesPortal.page';

export class OrderDetailsPage extends SalesPortalPage {
  uniqueElement = '//h2[text()="Order Details"]';

  private readonly 'Order number' =
    '//span[contains(text(),"Order number:")]/following-sibling::span';
  private readonly 'Assigned Manager' = '//u[.="Click to select manager"]';
  private readonly 'Order Status' = '//span[.="Order Status"]/following-sibling::span';
  private readonly 'Total Price' = '//span[.="Total Price"]/following-sibling::span';
  private readonly 'Delivery' = '//span[.="Delivery"]/following-sibling::span';
  private readonly 'Created On' =
    '//div[@id="order-status-bar-container"]//span[.="Created On"]/following-sibling::span';

  private readonly 'Customer Details by field name' = (propertyName: string) =>
    `//div[@id="customer-section"]//span[.="${propertyName}"]/following-sibling::span`;
  private readonly 'Customer Email' = `${this['Customer Details by field name']('Email')}`;
  private readonly 'Customer Name' = `${this['Customer Details by field name']('Name')}`;
  private readonly 'Customer Country' = `${this['Customer Details by field name']('Country')}`;
  private readonly 'Customer City' = `${this['Customer Details by field name']('City')}`;
  private readonly 'Customer Street' = `${this['Customer Details by field name']('Street')}`;
  private readonly 'Customer House' = `${this['Customer Details by field name']('House')}`;
  private readonly 'Customer Flat' = `${this['Customer Details by field name']('Flat')}`;
  private readonly 'Customer Phone' = `${this['Customer Details by field name']('Phone')}`;
  private readonly 'Customer Created On' = `${this['Customer Details by field name']('Created On')}`;
  private readonly 'Customer Notes' = `${this['Customer Details by field name']('Notes')}`;

  private readonly 'Requested Products selector' = (productName: string) =>
    `//div[@id='products-accordion-section']//button[contains(text(), '${productName}')]`;
  private readonly 'Requested Product details by product name' = (
    productName: string,
    propertyName: string,
  ) =>
    `${this['Requested Products selector'](
      productName,
    )}//parent::*/following-sibling::div//span[.='${propertyName}']/following-sibling::span`;
  private readonly 'Requested Product Name' = (productName: string) =>
    this.findElement(`${this['Requested Product details by product name'](productName, 'Name')}`);
  private readonly 'Requested Product Price' = (productName: string) =>
    this.findElement(`${this['Requested Product details by product name'](productName, 'Price')}`);
  private readonly 'Requested Product Manufacturer' = (productName: string) =>
    this.findElement(
      `${this['Requested Product details by product name'](productName, 'Manufacturer')}`,
    );
  private readonly 'Requested Product Notes' = (productName: string) =>
    this.findElement(`${this['Requested Product details by product name'](productName, 'Notes')}`);

  private readonly 'Status receiving products by product name' = (productName: string) =>
    `${this['Requested Products selector'](productName)}/following-sibling::span[contains(@class,'received-label')]`;

  private readonly 'Delivery tab' = '#delivery-tab';
  private readonly 'Delivery Information selector' = (propertyName: string) =>
    `//div[@id='delivery']//div/span[.='${propertyName}']/following-sibling::span`;
  private readonly 'Delivery Type' = `${this['Delivery Information selector']('Delivery Type')}`;
  private readonly 'Delivery Date' = `${this['Delivery Information selector']('Delivery Date')}`;
  private readonly 'Delivery Country' = `${this['Delivery Information selector']('Country')}`;
  private readonly 'Delivery City' = `${this['Delivery Information selector']('City')}`;
  private readonly 'Delivery Street' = `${this['Delivery Information selector']('Street')}`;
  private readonly 'Delivery House' = `${this['Delivery Information selector']('House')}`;
  private readonly 'Delivery Flat' = `${this['Delivery Information selector']('Flat')}`;

  async clickOnAccordionRequestedProducts(productName: string) {
    await this.click(this['Requested Products selector'](productName));
  }

  async clickOnDeliveryTab() {
    await this.click(this['Delivery tab']);
  }

  async getOrderDetails() {
    const [_id, assignedManager, status, total_price, finalDate, createdOn] = await Promise.all([
      this.getText(this['Order number']),
      this.getText(this['Assigned Manager']),
      this.getText(this['Order Status']),
      this.getText(this['Total Price']),
      this.getText(this['Delivery']),
      this.getText(this['Created On']),
    ]);

    return { _id, assignedManager, status, total_price, finalDate, createdOn };
  }

  async getCustomerDetails() {
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
    const [condition, finalDate, country, city, street, house, flat] = await Promise.all([
      this.getText(this['Delivery Type']),
      this.getText(this['Delivery Date']),
      this.getText(this['Delivery Country']),
      this.getText(this['Delivery City']),
      this.getText(this['Delivery Street']),
      this.getText(this['Delivery House']),
      this.getText(this['Delivery Flat']),
    ]);

    return { condition, finalDate, country, city, street, house, flat };
  }
}
