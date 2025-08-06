import { expect, Page } from '@playwright/test';
import moment from 'moment';

import { SalesPortalPageService } from './salesPortal.service';
import { apiConfig } from '../../config/apiConfig';
import { TOAST_MESSAGES } from '../../data/messages/messages';
import { generateNumberOfProductsInOrder } from '../../data/orders/generateOrderData';
import { ICustomerFromResponse } from '../../data/types/customers.types';
import { IOrder, IOrderFromResponse, IOrderResponse } from '../../data/types/order.types';
import { Customer } from '../../services/customer.service';
import { Order } from '../../services/order.service';
import { Product } from '../../services/product.service';
import { logStep } from '../../utils/report/decorator';
import { ensureResponseBody } from '../../utils/validation/response';
import { CreateOrderModalPage } from '../pages/orders/createOrderModal.page';
import { OrderDetailsPage } from '../pages/orders/orderDetails.page';
import { OrdersListPage } from '../pages/orders/orders.page';

export class OrdersPageService {
  private readonly order: Order;
  private readonly customer: Customer;
  private readonly product: Product;
  private readonly ordersListPage: OrdersListPage;
  private readonly createOrderModalPage: CreateOrderModalPage;
  private readonly orderDetailsPage: OrderDetailsPage;
  private readonly salesPortalService: SalesPortalPageService;

  constructor(page: Page, order: Order, customer: Customer, product: Product) {
    this.order = order;
    this.customer = customer;
    this.product = product;
    this.ordersListPage = new OrdersListPage(page);
    this.createOrderModalPage = new CreateOrderModalPage(page);
    this.salesPortalService = new SalesPortalPageService(page);
    this.orderDetailsPage = new OrderDetailsPage(page);
  }

  async createCustomerAndProductsForOrder() {
    const customer = await this.customer.create();
    const productsQuantity = generateNumberOfProductsInOrder();
    let productsNames: string[] = [];
    for (let i = 0; i < productsQuantity; i++) {
      productsNames.push((await this.product.create()).body.Product.name);
    }
    const orderData: IOrder = {
      customer: customer.body.Customer.name,
      products: productsNames,
    };
    return orderData;
  }

  @logStep('Create Order')
  async create(orderData?: IOrder) {
    const order = orderData ?? (await this.createCustomerAndProductsForOrder());
    await this.openCreateOrderModal();
    await this.createOrderModalPage.selectCustomer(order.customer);
    for (let i = 0; i < order.products.length; i++) {
      await this.createOrderModalPage.selectProduct(order.products[i], i);
      if (order.products.length > 0 && i !== order.products.length - 1) {
        await this.createOrderModalPage.clickOnAddProduct();
      }
      if (i === order.products.length - 1)
        this.createOrderModalPage.waitForAddProductBottonToHide();
    }
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints.Orders;
    const response = await this.createOrderModalPage.interceptResponse<IOrderResponse>(
      responseUrl,
      this.save.bind(this),
    );
    ensureResponseBody(response);
    this.order.validateCreateOrderResponseStatus(response);
    this.order.createFromExisting(response.body.Order);
    await this.createOrderModalPage.waitForButtonSpinnerToHide();
    await this.ordersListPage.waitForOpened();
    await this.ordersListPage.waitForTableSpinnerToHide();
    await this.validateOrderCreatedMessage();
    await this.validateOrderInTable();
  }

  @logStep('Delete Order')
  async delete() {
    await this.order.delete();
  }

  @logStep('Delete Order with Customer and Products')
  async deleteWithCustomerAndProducts() {
    await this.order.deleteWithCustomerAndProducts();
  }

  @logStep('Open Create Order Modal')
  async openCreateOrderModal() {
    await this.ordersListPage.clickOnCreateOrderButton();
    await this.createOrderModalPage.waitForOpened();
  }

  @logStep('Open Order details')
  async openOrderDetails(orderNumber?: string) {
    const order = orderNumber ?? this.order.getSettings()._id;
    await this.ordersListPage.clickOnDetails(order);
    await this.orderDetailsPage.waitForOpened();
    await this.orderDetailsPage.waitForOverlaySpinnersToHide();
  }

  @logStep('Confirm Order creation')
  async save() {
    await this.createOrderModalPage.clickOnCreate();
  }

  @logStep('Validate Order in table')
  async validateOrderInTable() {
    const expectedOrder = this.order.getOrderTransformedToDetailsInTable();

    const actualOrder = await this.ordersListPage.getOrderByOrderNumber(expectedOrder.orderNumber);
    expect(actualOrder).toEqual(expectedOrder);
  }

  @logStep('Validate Order Details')
  async validateOrderDetails() {
    const expectedOrder = this.order.getOrderTransformedToDetails();
    const actualOrder = await this.orderDetailsPage.getOrderDetails();
    expect(actualOrder).toEqual(expectedOrder);
  }

  @logStep('Validate Customer Details')
  async validateCustomerDetails() {
    const expectedCustomer = this.customer.getCustomerDataTransformedToDetails();
    const actualCustomer = await this.orderDetailsPage.getCustomerDetails();
    expect(actualCustomer).toEqual(expectedCustomer);
  }

  @logStep('Validate Delivery information')
  async validateDeliveryInformation() {
    const expectedDelivery = this.order.getDeliveryTransformedToDetails();
    await this.orderDetailsPage.clickOnDeliveryTab();
    const actualDelivery = await this.orderDetailsPage.getDeliveryInformation();
    expect(actualDelivery).toEqual(expectedDelivery);
  }

  @logStep('Validate Requested Products')
  async validateRequestedProducts() {
    const productNames = this.order.getSettings().products.map((product) => product.name);
    const expectedProducts = this.order.getProductsTransformedToDetails();
    const actualproducts = await this.getRequestedProducts(productNames);
    expect(actualproducts).toEqual(expectedProducts);
  }

  @logStep('Validate Order created message')
  private async validateOrderCreatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.ordersListPage,
      TOAST_MESSAGES.ORDER.CREATED,
    );
  }

  private async getRequestedProducts(productNames: string[]) {
    const products = [];

    for (const productName of productNames) {
      await this.orderDetailsPage.clickOnAccordionRequestedProducts(productName);
      const product = await this.orderDetailsPage.getRequestedProduct(productName);
      products.push(product);
    }

    return products;
  }
}
