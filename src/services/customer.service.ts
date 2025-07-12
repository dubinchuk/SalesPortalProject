import { ICustomer, ICustomerFromResponse, ICustomerResponse } from '../data/types/customers.types';
import { CustomerApiClient } from '../api/clients/customers.client';
import { generateNewCustomer } from '../data/customers/generateCustomer';
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
import { createdCustomerSchema } from '../data/schema/customers/customer.schema';

import { SignInService } from './signIn.service';

export class Customer {
  private service: CustomerApiClient;
  private settings: ICustomerFromResponse | undefined;

  constructor(private signInService: SignInService) {
    this.service = new CustomerApiClient();
  }

  //TODO: добавить возможность работы с несколькими кастомерами
  async create(customCustomerData?: Partial<ICustomer>, expectError?: boolean) {
    const customerData = generateNewCustomer(customCustomerData);
    const token = await this.signInService.getToken();
    const response = await this.service.create(customerData, token, expectError);

    this.validateCreateCustomerResponseStatus(response);

    this.setSettings(response.body.Customer);
    return { response, customerData };
  }

  async createAndValidate(customCustomerData?: Partial<ICustomer>, expectError?: boolean) {
    const { response, customerData } = await this.create(customCustomerData, expectError);

    this.validateCreateCustomerResponseBody(response, customerData);
    this.validateCreateCustomerSchema(response);
  }

  createFromExisting(customer: ICustomerFromResponse) {
    this.setSettings(customer);
  }

  private setSettings(customerSettings: ICustomerFromResponse) {
    this.settings = customerSettings;
  }

  getSettings() {
    if (!this.settings) throw new Error('Customer failed: no settings');
    return this.settings;
  }

  getCustomerDataTransformedToDetails() {
    const settings = this.getSettings();
    return {
      email: settings.email,
      name: settings.name,
      country: settings.country,
      city: settings.city,
      street: settings.street,
      house: settings.house,
      flat: settings.flat,
      phone: settings.phone,
      notes: settings.notes,
    };
  }

  async delete() {
    if (!this.settings) return;
    const token = await this.signInService.getToken();
    const response = await this.service.delete(this.getSettings()._id, token);
    this.validateDeleteCustomerResponseStatus(response);

    return response;
  }

  async deleteAndValidate() {
    const response = await this.delete();
    if (response) this.validateDeleteCustomerResponseBody(response);
  }

  async getLatest() {
    const token = await this.signInService.getToken();
    const response = await this.service.getById(this.getSettings()._id, token);
    if (response.status !== STATUS_CODES.OK) {
      throw new ResponseError('Failed to create customer', {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      });
    }
  }

  async edit(newCustomerSettings: ICustomer & { _id: string }) {
    const token = await this.signInService.getToken();
    const response = await this.service.update(newCustomerSettings, token);
    if (response.status !== STATUS_CODES.OK) {
      throw new ResponseError('Failed to create customer', {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      });
    }
    this.setSettings(response.body.Customer);
  }

  validateCreateCustomerResponseBody(
    response: IResponse<ICustomerResponse>,
    customerData?: Partial<ICustomer>,
  ) {
    validateResponseBody<ICustomerResponse, Partial<ICustomer>>(
      response,
      true,
      null,
      customerData,
      'Customer',
    );
  }

  validateCreateCustomerResponseStatus(response: IResponse<ICustomerResponse>) {
    validateResponseStatus<ICustomerResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.CREATED,
      ResponseError,
      'Failed to create customer',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  validateDeleteCustomerResponseBody(response: IResponse<IResponseFields>) {
    validateResponseBody<IResponseFields, ICustomer>(response, true, null);
  }

  validateDeleteCustomerResponseStatus(response: IResponse<IResponseFields>) {
    validateResponseStatus<IResponseFields, { status: number }>(
      response,
      STATUS_CODES.DELETED,
      DeleteResponseError,
      'Failed to delete customer',
      { status: response.status },
    );
  }

  validateCreateCustomerSchema(response: IResponse<ICustomerResponse>) {
    validateSchema<ICustomerResponse>(response, createdCustomerSchema);
  }
}
