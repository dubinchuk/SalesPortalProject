import moment from 'moment';

import { ProductsApiClient } from '../api/clients/products.client';
import {
  IProduct,
  IProductFromResponse,
  IProductResponse,
  IProductsResponse,
} from '../data/types/product.types';
import { generateNewProduct } from '../data/products/generateProduct';
import {
  ErrorResponseCause,
  IResponse,
  IResponseFields,
  STATUS_CODES,
} from '../data/types/api.types';
import { DeleteResponseError, ResponseError } from '../utils/errors/errors';
import {
  validateResponseBody,
  validateResponseStatus,
  validateSchema,
} from '../utils/validation/response';
import { createdProductSchema } from '../data/schema/products/product.schema';
import { allProductsSchema } from '../data/schema/products/products.schema';

import { SignInService } from './signIn.service';

export class Product {
  private service: ProductsApiClient;
  private settings: IProductFromResponse | undefined;

  constructor(private signInService: SignInService) {
    this.service = new ProductsApiClient();
  }

  //TODO: добавить возможность работы с несколькими продуктами
  async create(customProductData?: Partial<IProduct>, expectError?: boolean) {
    const productData = generateNewProduct(customProductData);
    const token = await this.signInService.getToken();
    const response = await this.service.create(productData, token, expectError);

    this.validateCreateProductResponseStatus(response);
    this.setSettings(response.body.Product);

    return { response, productData };
  }

  async createAndValidate(customProductData?: Partial<IProduct>, expectError?: boolean) {
    const { response, productData } = await this.create(customProductData, expectError);

    this.validateCreateProductResponseBody(response, productData);
    this.validateCreatedProductSchema(response);
  }

  createFromExisting(product: IProductFromResponse) {
    this.setSettings(product);
  }

  private setSettings(productSettings: IProductFromResponse) {
    this.settings = productSettings;
  }

  getSettings() {
    if (!this.settings) throw new Error('Product failed: no settings');
    return this.settings;
  }

  getProductDataTransformedToDetails() {
    return {
      name: this.getSettings().name,
      amount: String(this.getSettings().amount),
      price: String(this.getSettings().price),
      createdOn: moment(this.getSettings().createdOn).format('LLL'),
      manufacturer: this.getSettings().manufacturer,
      notes: this.getSettings().notes,
    };
  }

  async delete() {
    if (!this.settings) return;
    const token = await this.signInService.getToken();
    const response = await this.service.delete(this.getSettings()._id, token);
    this.validateDeleteProductResponseStatus(response);

    return response;
  }

  async deleteAndValidate() {
    const response = await this.delete();
    if (response) this.validateDeleteProductResponseBody(response);
  }

  async getLatest() {
    const token = await this.signInService.getToken();
    const response = await this.service.getById(this.getSettings()._id, token);
    this.validateGetProductResponseStatus(response);
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

  async edit(newProductSettings: IProduct & { _id: string }) {
    const token = await this.signInService.getToken();
    const response = await this.service.update(newProductSettings, token);
    this.validateEditProductResponseStatus(response);
    this.validateEditProductResponseBody(response);
    this.setSettings(response.body.Product);
  }

  validateCreateProductResponseBody(
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

  validateDeleteProductResponseBody(response: IResponse<IResponseFields>) {
    validateResponseBody(response, true, null);
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

  validateEditProductResponseBody(
    response: IResponse<IProductResponse>,
    productData?: Partial<IProduct>,
  ) {
    validateResponseBody<IProductResponse, Partial<IProduct>>(
      response,
      true,
      null,
      productData,
      'Product',
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

  validateGetProductResponseBody(
    response: IResponse<IProductResponse>,
    productData?: Partial<IProduct>,
  ) {
    validateResponseBody<IProductResponse, Partial<IProduct>>(
      response,
      true,
      null,
      productData,
      'Product',
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

  validateGetAllProductsResponseBody(
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

  validateCreatedProductSchema(response: IResponse<IProductResponse>) {
    validateSchema<IProductResponse>(response, createdProductSchema);
  }

  validateAllProductsSchema(response: IResponse<IProductsResponse>) {
    validateSchema<IProductsResponse>(response, allProductsSchema);
  }
}
