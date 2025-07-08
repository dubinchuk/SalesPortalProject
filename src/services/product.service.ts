import moment from 'moment';

import { ProductsApiClient } from '../api/clients/products.client';
import { IProduct, IProductFromResponse, IProductResponse } from '../data/types/product.types';
import { generateNewProduct } from '../data/products/generateProduct';
import { IResponse, STATUS_CODES } from '../data/types/api.types';
import { DeleteResponseError, ResponseError } from '../utils/errors/errors';
import { validateResponse, validateSchema } from '../utils/validation/response';
import { createdProductSchema } from '../data/schema/product.schema';

import { SignInService } from './signIn.service';

export class Product {
  private service: ProductsApiClient;
  private settings: IProductFromResponse | undefined;

  constructor(private signInService: SignInService) {
    this.service = new ProductsApiClient();
  }

  //TODO: добавить возможность работы с несколькими продуктами
  async create(customProductData?: Partial<IProduct>) {
    const productData = generateNewProduct(customProductData);
    const token = await this.signInService.getToken();
    const response = await this.service.create(productData, token);

    if (response.status !== STATUS_CODES.CREATED) {
      throw new ResponseError(`Failed to create product`, {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      });
    }

    this.setSettings(response.body.Product);
    return this.getSettings();
  }

  async createAndValidate(customProductData?: Partial<IProduct>) {
    const productData = generateNewProduct(customProductData);
    const token = await this.signInService.getToken();
    const response = await this.service.create(productData, token);

    if (response.status !== STATUS_CODES.CREATED) {
      throw new ResponseError(`Failed to create product`, {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      });
    }

    this.setSettings(response.body.Product);

    this.validateCreateProductResponse(response, productData);
    this.validateCreatedProductSchema(response);

    return this.getSettings();
  }

  validateCreateProductResponse(response: IResponse<IProductResponse>, productData: IProduct) {
    validateResponse<IProductResponse>(
      response,
      STATUS_CODES.CREATED,
      true,
      null,
      productData,
      'Product',
    );
  }
  validateCreatedProductSchema(response: IResponse<IProductResponse>) {
    validateSchema<IProductResponse>(response, createdProductSchema);
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
    const token = await this.signInService.getToken();
    const response = await this.service.delete(this.getSettings()._id, token);
    if (response.status !== STATUS_CODES.DELETED) {
      throw new DeleteResponseError(`Failed to delete product`, {
        status: response.status,
      });
    }
  }

  async getLatest() {
    const token = await this.signInService.getToken();
    const response = await this.service.getById(this.getSettings()._id, token);
    if (response.status !== STATUS_CODES.OK) {
      throw new ResponseError(`Failed to get product`, {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      });
    }
    this.setSettings(response.body.Product);
    return response;
  }

  async edit(newProductSettings: IProduct & { _id: string }) {
    const token = await this.signInService.getToken();
    const response = await this.service.update(newProductSettings, token);
    if (response.status !== STATUS_CODES.OK) {
      throw new ResponseError(`Failed to update product`, {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      });
    }
    this.setSettings(response.body.Product);
  }
}
