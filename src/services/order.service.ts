import _ from 'lodash';

import { Customer } from './customer.service';
import { Product } from './product.service';
import { SignInService } from './signIn.service';
import { OrderApiClient } from '../api/clients/orders.client';
import { PERFORMER_ADMIN } from '../config/environment';
import { generateNumberOfProductsInOrder } from '../data/orders/generateOrderData';
import { ErrorResponseCause, IResponse, STATUS_CODES } from '../data/types/api.types';
import { ICustomerFromResponse } from '../data/types/customers.types';
import {
  IOrderFromResponse,
  IOrderHistoryFromResponse,
  IOrderResponse,
  IProductInOrder,
  ORDER_ACTIONS,
  ORDER_STATUSES,
} from '../data/types/order.types';
import { IProduct, IProductFromResponse } from '../data/types/product.types';
import { ResponseError } from '../utils/errors/errors';
import { omitChangedOnFields } from '../utils/validation/cleanResponse';
import { validateResponseBody, validateResponseStatus } from '../utils/validation/response';

export class Order {
  private service: OrderApiClient;
  private settings: IOrderFromResponse | undefined;
  private customer: Customer;
  private product: Product;
  private productsSettings: IProductFromResponse[] | undefined;
  private customerSettings: ICustomerFromResponse | undefined;

  constructor(
    private signInService: SignInService,
    customer: Customer,
    product: Product,
  ) {
    this.service = new OrderApiClient();
    this.customer = customer;
    this.product = product;
  }

  async create(productQuantity?: number, expectError?: boolean) {
    const quantity = productQuantity ?? generateNumberOfProductsInOrder();
    const token = await this.signInService.getToken();
    const customerData = (await this.customer.create()).body.Customer;
    this.setCustomerSettings(customerData);

    const customerId = customerData._id;
    let productsData: IProductFromResponse[] = [];
    let productIds: string[] = [];

    for (let i = 0; i < quantity; i++) {
      const createdProduct = (await this.product.create()).body;
      productsData.push(createdProduct.Product);
      productIds.push(createdProduct.Product._id);
    }

    this.setProductsSettings(productsData);

    const response = await this.service.create(
      {
        customer: customerId,
        products: productIds,
      },
      token,
      expectError,
    );

    this.setSettings(response.body.Order);
    this.validateCreateOrderResponseStatus(response);

    return response;
  }

  transformProductsToOrder(products: IProductFromResponse[]): IProductInOrder[] {
    return products.map((product) => _.omit({ ...product, received: false }, 'createdOn'));
  }

  calculateTotalPrice(products: IProduct[]) {
    return products.reduce((acc, product) => acc + product.price, 0);
  }

  async createAndValidate(productQuantity?: number, expectError?: boolean) {
    const quantity = productQuantity ?? generateNumberOfProductsInOrder();
    const response = await this.create(quantity, expectError);

    const expectedResponseBody: Partial<IOrderFromResponse> = {
      status: ORDER_STATUSES.DRAFT,
      customer: this.getCustomerSettings(),
      products: this.transformProductsToOrder(this.getProductsSettings()),
      delivery: null,
      total_price: this.calculateTotalPrice(this.getProductsSettings()),
      comments: [],
      assignedManager: null,
      history: [
        {
          status: ORDER_STATUSES.DRAFT,
          customer: this.getCustomerSettings()._id,
          products: this.transformProductsToOrder(this.getProductsSettings()),
          delivery: null,
          total_price: this.calculateTotalPrice(this.getProductsSettings()),
          assignedManager: null,
          action: ORDER_ACTIONS.ORDER_CREATED,
          performer: JSON.parse(PERFORMER_ADMIN),
        },
      ] as IOrderHistoryFromResponse[],
    };

    const cleanResponse = omitChangedOnFields(response);

    this.validateCreateOrderResponseBody(cleanResponse, expectedResponseBody);
  }

  async delete() {
    if (!this.settings) throw new Error('Failed to delete order: no settings');
    const token = await this.signInService.getToken();
    const response = await this.service.delete(this.getSettings()._id, token);

    return response;
  }

  async deleteWithCustomerAndProducts() {
    await this.delete();
    await this.customer.delete();
    const products = this.getSettings().products.map((product) => product._id);
    await this.product.deleteProducts(products);
  }

  getSettings() {
    if (!this.settings) throw new Error('Failed to get order: no settings');
    return this.settings;
  }

  getProductsSettings() {
    if (!this.productsSettings) throw new Error('Failed to get products: no settings');
    return this.productsSettings;
  }

  getCustomerSettings() {
    if (!this.customerSettings) throw new Error('Failed to get customer: no settings');
    return this.customerSettings;
  }

  createFromExisting(order: IOrderFromResponse | undefined) {
    if (!order) {
      this.setSettings(undefined);
    }
    this.setSettings(order);
  }

  validateCreateOrderResponseStatus(response: IResponse<IOrderResponse>) {
    validateResponseStatus<IOrderResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.CREATED,
      ResponseError,
      'Failed to create order',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  private validateCreateOrderResponseBody(
    response: IResponse<IOrderResponse>,
    orderData: Partial<IOrderFromResponse>,
  ) {
    validateResponseBody<IOrderResponse, Partial<IOrderFromResponse>>(
      response,
      true,
      null,
      orderData,
      'Order',
    );
  }

  private setSettings(orderSettings: IOrderFromResponse | undefined) {
    this.settings = orderSettings;
  }

  private setProductsSettings(productsData: IProductFromResponse[]) {
    this.productsSettings = productsData;
  }

  private setCustomerSettings(customerData: ICustomerFromResponse) {
    this.customerSettings = customerData;
  }
}
