import { expect, Page } from '@playwright/test';
import _ from 'lodash';
import moment from 'moment';

import { SalesPortalPageService } from './salesPortal.service';
import { apiConfig } from '../../config/apiConfig';
import { TOAST_MESSAGES } from '../../data/messages/messages';
import { generateNumberOfProductsInOrder } from '../../data/orders/generateOrderData';
import { IOrder, IOrderFromResponse, IOrderResponse } from '../../data/types/order.types';
import { Customer } from '../../services/customer.service';
import { Order } from '../../services/order.service';
import { Product } from '../../services/product.service';
import { logStep } from '../../utils/report/decorator';
import { ensureResponseBody } from '../../utils/validation/response';
import { CreateOrderModalPage } from '../pages/orders/createOrderModalPage';
import { OrdersListPage } from '../pages/orders/orders.page';

export class OrdersPageService {
  private readonly order: Order;
  private readonly customer: Customer;
  private readonly product: Product;
  private readonly ordersListPage: OrdersListPage;
  private readonly createOrderModalPage: CreateOrderModalPage;
  private readonly salesPortalService: SalesPortalPageService;

  constructor(page: Page, order: Order, customer: Customer, product: Product) {
    this.order = order;
    this.customer = customer;
    this.product = product;
    this.ordersListPage = new OrdersListPage(page);
    this.createOrderModalPage = new CreateOrderModalPage(page);
    this.salesPortalService = new SalesPortalPageService(page);
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
    await this.openCreateCustomerModal();
    await this.createOrderModalPage.selectCustomer(order.customer);
    for (let i = 0; i < order.products.length; i++) {
      await this.createOrderModalPage.selectProduct(order.products[i], i);
      if (order.products.length > 0 && i !== order.products.length - 1) {
        await this.createOrderModalPage.clickOnAddProduct();
      }
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

  @logStep('Open Create Customer Modal')
  async openCreateCustomerModal() {
    await this.ordersListPage.clickOnCreateOrderButton();
    await this.createOrderModalPage.waitForOpened();
  }

  @logStep('Confirm customer creation')
  async save() {
    await this.createOrderModalPage.clickOnCreate();
  }

  @logStep('Validate product created message')
  private async validateOrderCreatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.ordersListPage,
      TOAST_MESSAGES.ORDER.CREATED,
    );
  }

  @logStep('Validate order in table')
  async validateOrderInTable(orderData?: IOrderFromResponse) {
    const order = orderData ?? this.order.getSettings();
    const cleanOrder = {
      orderNumber: order._id,
      email: order.customer.email,
      price: this.order.calculateTotalPrice(order.products),
      delivery: order.delivery ?? '-',
      status: order.status,
      assignedManager: order.assignedManager ?? '-',
      createdOn: order.createdOn,
    };

    cleanOrder.createdOn = moment(cleanOrder.createdOn).format('YYYY/MM/DD HH:mm:ss');
    const actualOrder = await this.ordersListPage.getOrderByOrderNumber(cleanOrder.orderNumber);
    expect(actualOrder).toEqual(cleanOrder);
  }
}
