import { expect } from '@playwright/test';
import _ from 'lodash';
import moment from 'moment';

import { SignInService } from './signIn.service';
import { ProductsApiClient } from '../api/clients/products.client';
import { generateNewProduct } from '../data/products/generateProduct';
import { createdProductSchema } from '../data/schema/products/product.schema';
import { allProductsSchema } from '../data/schema/products/products.schema';
import {
  ErrorResponseCause,
  IResponse,
  IResponseFields,
  STATUS_CODES,
} from '../data/types/api.types';
import {
  IProduct,
  IProductFromResponse,
  IProductResponse,
  IProductsResponse,
} from '../data/types/product.types';
import { DeleteResponseError, ResponseError } from '../utils/errors/errors';
import {
  validateResponseBody,
  validateResponseStatus,
  validateSchema,
} from '../utils/validation/response';

export class Product {
  private service: ProductsApiClient;
  private settings: IProductFromResponse | undefined;
  private productInputSettings: IProduct | undefined;

  constructor(private signInService: SignInService) {
    this.service = new ProductsApiClient();
  }

  async create(customProductData?: Partial<IProduct>, expectError?: boolean) {
    const productData = customProductData ?? generateNewProduct(customProductData);
    this.setProductInputSettings(productData as IProduct);

    const token = await this.signInService.getToken();
    const response = await this.service.create(productData as IProduct, token, expectError);

    this.validateCreateProductResponseStatus(response);
    this.setSettings(response.body.Product);

    return response;
  }

  async createAndValidate(customProductData?: Partial<IProduct>, expectError?: boolean) {
    const response = await this.create(customProductData, expectError);

    this.validateCreateProductResponseBody(response, this.getProductInputSettings());
    this.validateCreatedProductSchema(response);
  }

  async edit(_id?: string, newProductSettings?: IProduct) {
    const productId = _id ?? this.getSettings()._id;
    const newProduct = newProductSettings ?? generateNewProduct();
    const token = await this.signInService.getToken();
    const response = await this.service.update({ ...newProduct, _id: productId }, token);
    this.validateEditProductResponseStatus(response);
    this.validateEditProductResponseBody(response, newProduct);
    this.setSettings(response.body.Product);
  }

  async delete() {
    if (!this.settings) throw new Error('Failed to delete product: no settings');
    const token = await this.signInService.getToken();
    const response = await this.service.delete(this.getSettings()._id, token);
    this.validateDeleteProductResponseStatus(response);

    return response;
  }

  async deleteProducts(productIds: string[]) {
    const token = await this.signInService.getToken();
    const uniqueIds = [...new Set(productIds)];
    for (const id of uniqueIds) {
      await this.service.delete(id, token);
    }
  }

  async deleteAndValidate() {
    const response = await this.delete();
    if (response) this.validateDeleteProductResponseBody(response);
  }

  async getLatest() {
    const token = await this.signInService.getToken();
    const response = await this.service.getById(this.getSettings()._id, token);
    const productData = _.omit(this.getSettings(), '_id', 'createdOn');
    this.validateGetProductResponseStatus(response);
    this.validateGetProductResponseBody(response, productData);
    this.setSettings(response.body.Product);
    return response;
  }

  async getAll() {
    const token = await this.signInService.getToken();
    const response = await this.service.getAll(token);
    this.validateGetAllProductsResponseStatus(response);
    this.validateGetAllProductsResponseBody(response);
    this.validateAllProductsSchema(response);
  }

  createFromExisting(product: IProductFromResponse | undefined) {
    if (!product) {
      this.setSettings(undefined);
    }
    this.setSettings(product);
  }

  getSettings() {
    if (!this.settings) throw new Error('Failed to get product: no settings');
    return this.settings;
  }

  getProductDataTransformedToDetails() {
    const settings = this.getSettings();
    return {
      name: settings.name,
      amount: String(settings.amount),
      price: String(settings.price),
      createdOn: moment(settings.createdOn).format('LLL'),
      manufacturer: settings.manufacturer,
      notes: settings.notes,
    };
  }

  getProductInputSettings() {
    if (!this.productInputSettings) throw new Error('Failed to get product inputs: no settings');
    return this.productInputSettings;
  }

  validateCreateProductResponseStatus(response: IResponse<IProductResponse>) {
    validateResponseStatus<IProductResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.CREATED,
      ResponseError,
      'Failed to create product',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  validateDeleteProductResponseStatus(response: IResponse<IResponseFields>) {
    validateResponseStatus<IResponseFields, { status: number }>(
      response,
      STATUS_CODES.DELETED,
      DeleteResponseError,
      'Failed to create product',
      { status: response.status },
    );
  }

  validateEditProductResponseStatus(response: IResponse<IProductResponse>) {
    validateResponseStatus<IProductResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.OK,
      ResponseError,
      'Failed to edit product',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  validateGetProductResponseStatus(response: IResponse<IProductResponse>) {
    validateResponseStatus<IProductResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.OK,
      ResponseError,
      'Failed to get product',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  validateGetAllProductsResponseStatus(response: IResponse<IProductsResponse>) {
    validateResponseStatus<IProductsResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.OK,
      ResponseError,
      'Failed to get all products',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  private setSettings(productSettings: IProductFromResponse | undefined) {
    this.settings = productSettings;
  }

  private setProductInputSettings(productInputs: IProduct | undefined) {
    this.productInputSettings = productInputs;
  }

  private validateCreateProductResponseBody(
    response: IResponse<IProductResponse>,
    productData: Partial<IProduct>,
  ) {
    validateResponseBody<IProductResponse, Partial<IProduct>>(
      response,
      true,
      null,
      productData,
      'Product',
    );
  }

  private validateEditProductResponseBody(
    response: IResponse<IProductResponse>,
    productData: Partial<IProduct>,
  ) {
    validateResponseBody<IProductResponse, Partial<IProduct>>(
      response,
      true,
      null,
      productData,
      'Product',
    );
  }

  private validateDeleteProductResponseBody(response: IResponse<IResponseFields>) {
    if (response.status === STATUS_CODES.DELETED) {
      expect(response.body).toBeNull;
    }
  }

  private validateGetProductResponseBody(
    response: IResponse<IProductResponse>,
    productData: Partial<IProduct>,
  ) {
    validateResponseBody<IProductResponse, Partial<IProduct>>(
      response,
      true,
      null,
      productData,
      'Product',
    );
  }

  private validateGetAllProductsResponseBody(
    response: IResponse<IProductsResponse>,
    productData?: Partial<IProduct>,
  ) {
    validateResponseBody<IProductsResponse, Partial<IProduct>>(
      response,
      true,
      null,
      productData,
      'Products',
    );
  }

  private validateCreatedProductSchema(response: IResponse<IProductResponse>) {
    validateSchema<IProductResponse>(response, createdProductSchema);
  }

  private validateAllProductsSchema(response: IResponse<IProductsResponse>) {
    validateSchema<IProductsResponse>(response, allProductsSchema);
  }
}
