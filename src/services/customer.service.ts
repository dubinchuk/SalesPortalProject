import { expect } from '@playwright/test';
import _ from 'lodash';
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
  private customerInputSettings: ICustomer | undefined;

  constructor(private signInService: SignInService) {
    this.service = new CustomerApiClient();
  }

  async create(customCustomerData?: Partial<ICustomer>, expectError?: boolean) {
    const customerData = customCustomerData ?? generateNewCustomer(customCustomerData);
    this.setCustomerInputSettings(customerData as ICustomer);
    const token = await this.signInService.getToken();
    const response = await this.service.create(customerData as ICustomer, token, expectError);

    this.validateCreateCustomerResponseStatus(response);

    this.setSettings(response.body.Customer);
    return response;
  }

  async createAndValidate(customCustomerData?: Partial<ICustomer>, expectError?: boolean) {
    const response = await this.create(customCustomerData, expectError);

    this.validateCreateCustomerResponseBody(response, this.getCustomerInputSettings());
    this.validateCreateCustomerSchema(response);
  }

  async edit(_id?: string, newCustomerSettings?: ICustomer) {
    const customerId = _id ?? this.getSettings()._id;
    const newCustomer = newCustomerSettings ?? generateNewCustomer();
    const token = await this.signInService.getToken();
    const response = await this.service.update({ ...newCustomer, _id: customerId }, token);
    this.validateEditCustomerResponseStatus(response);
    this.validateEditCustomerResponseBody(response, newCustomer);
    this.setSettings(response.body.Customer);
  }

  async delete(customerId?: string) {
    if (!this.settings) throw new Error('Failed to delete customer: no settings');
    const token = await this.signInService.getToken();
    const id = customerId ?? this.getSettings()._id;
    const response = await this.service.delete(id, token);
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
    const customerData = _.omit(this.getSettings(), '_id', 'createdOn');
    this.validateGetCustomerResponseStatus(response);
    this.validateGetCustomerResponseBody(response, customerData);
  }

  async getAll() {
    const token = await this.signInService.getToken();
    const response = await this.service.getAll(token);
    this.validateGetAllCustomersResponseStatus(response);
    this.validateGetAllCustomersResponseBody(response);
    this.validateAllCustomersSchema(response);
  }

  createFromExisting(customer: ICustomerFromResponse | undefined) {
    if (!customer) {
      this.setSettings(undefined);
    }
    this.setSettings(customer);
  }

  getSettings() {
    if (!this.settings) throw new Error('Failed to get customer: no settings');
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
      house: String(settings.house),
      flat: String(settings.flat),
      phone: settings.phone,
      notes: settings.notes,
      createdOn: moment(settings.createdOn).format('YYYY/MM/DD HH:mm:ss'),
    };
  }

  getCustomerInputSettings() {
    if (!this.customerInputSettings) throw new Error('Failed to get customer inputs: no settings');
    return this.customerInputSettings;
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

  private setSettings(customerSettings: ICustomerFromResponse | undefined) {
    this.settings = customerSettings;
  }

  private setCustomerInputSettings(customerInputs: ICustomer | undefined) {
    this.customerInputSettings = customerInputs;
  }

  private validateCreateCustomerResponseBody(
    response: IResponse<ICustomerResponse>,
    customerData: Partial<ICustomer>,
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
    customerData: Partial<ICustomer>,
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
    customerData: Partial<ICustomer>,
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
    customerData?: Partial<ICustomer>[],
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
}
