import { expect } from '@playwright/test';
import moment from 'moment';

import { SignInService } from './signIn.service';
import { CustomerApiClient } from '../api/clients/customers.client';
import { generateNewCustomer } from '../data/customers/generateCustomer';
import { createdCustomerSchema } from '../data/schema/customers/customer.schema';
import { allCustomersSchema } from '../data/schema/customers/customers.schema';
import {
  ErrorResponseCause,
  IResponse,
  IResponseFields,
  STATUS_CODES,
} from '../data/types/api.types';
import {
  ICustomer,
  ICustomerFromResponse,
  ICustomerResponse,
  ICustomersResponse,
} from '../data/types/customers.types';
import { DeleteResponseError, ResponseError } from '../utils/errors/errors';
import {
  validateResponseBody,
  validateResponseStatus,
  validateSchema,
} from '../utils/validation/response';

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

  async edit(newCustomerSettings: ICustomer & { _id: string }) {
    const token = await this.signInService.getToken();
    const response = await this.service.update(newCustomerSettings, token);
    this.validateEditCustomerResponseStatus(response);
    this.validateEditCustomerResponseBody(response);
    this.setSettings(response.body.Customer);
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

  getSettings() {
    if (!this.settings) throw new Error('Customer failed: no settings');
    return this.settings;
  }

  async getLatest() {
    const token = await this.signInService.getToken();
    const response = await this.service.getById(this.getSettings()._id, token);
    this.validateGetCustomerResponseStatus(response);
    this.validateGetCustomerResponseBody(response);
  }

  async getAll() {
    const token = await this.signInService.getToken();
    const response = await this.service.getAll(token);
    this.validateGetAllCustomersResponseStatus(response);
    this.validateGetAllCustomersResponseBody(response);
    this.validateAllCustomersSchema(response);
  }

  getCustomerDataTransformedToDetails() {
    const settings = this.getSettings();
    return {
      email: settings.email,
      name: settings.name,
      country: settings.country,
      city: settings.city,
      street: settings.street,
      house: String(settings.house),
      flat: String(settings.flat),
      phone: settings.phone,
      notes: settings.notes,
      createdOn: moment(settings.createdOn).format('YYYY/MM/DD HH:mm:ss'),
    };
  }

  createFromExisting(customer: ICustomerFromResponse | undefined) {
    if (!customer) {
      this.setSettings(undefined);
    }
    this.setSettings(customer);
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

  validateEditCustomerResponseStatus(response: IResponse<ICustomerResponse>) {
    validateResponseStatus<ICustomerResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.OK,
      ResponseError,
      'Failed to edit customer',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
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

  validateGetCustomerResponseStatus(response: IResponse<ICustomerResponse>) {
    validateResponseStatus<ICustomerResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.OK,
      ResponseError,
      'Failed to get customer',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  validateGetAllCustomersResponseStatus(response: IResponse<ICustomersResponse>) {
    validateResponseStatus<ICustomersResponse, ErrorResponseCause>(
      response,
      STATUS_CODES.OK,
      ResponseError,
      'Failed to get all customers',
      {
        status: response.status,
        IsSuccess: response.body.IsSuccess,
        ErrorMessage: response.body.ErrorMessage,
      },
    );
  }

  private validateCreateCustomerResponseBody(
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

  private validateEditCustomerResponseBody(
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

  private validateDeleteCustomerResponseBody(response: IResponse<IResponseFields | null>) {
    if (response.status === STATUS_CODES.DELETED) {
      expect(response.body).toBeNull();
    }
  }

  private validateGetCustomerResponseBody(
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

  private validateGetAllCustomersResponseBody(
    response: IResponse<ICustomersResponse>,
    customerData?: Partial<ICustomer>,
  ) {
    validateResponseBody<ICustomersResponse, Partial<ICustomer>>(
      response,
      true,
      null,
      customerData,
      'Customers',
    );
  }

  private validateCreateCustomerSchema(response: IResponse<ICustomerResponse>) {
    validateSchema<ICustomerResponse>(response, createdCustomerSchema);
  }

  private validateAllCustomersSchema(response: IResponse<ICustomersResponse>) {
    validateSchema<ICustomersResponse>(response, allCustomersSchema);
  }

  private setSettings(customerSettings: ICustomerFromResponse | undefined) {
    this.settings = customerSettings;
  }
}
