import { expect, Page } from '@playwright/test';
import _ from 'lodash';

import { ICustomer, ICustomerFromResponse } from '../data/types/customers.types';
import { CustomerApiClient } from '../api/clients/customers.client';
import { generateNewCustomer } from '../data/customers/generateCustomer';
import { STATUS_CODES } from '../data/types/api.types';
import { DeleteResponseError, ResponseError } from '../utils/errors/errors';
import { validateResponse } from '../utils/validation/response';

import { SignInService } from './signIn.service';

export class Customer {
  private signInService: SignInService;
  private service: CustomerApiClient;
  private settings: ICustomerFromResponse | undefined;

  constructor(private page: Page) {
    this.signInService = new SignInService(this.page);
    this.service = new CustomerApiClient();
  }

  //TODO: добавить возможность работы с несколькими кастомерами
  async create(customCustomerData?: Partial<ICustomer>) {
    const customerData = generateNewCustomer(customCustomerData);
    const token = await this.signInService.getToken();
    const response = await this.service.create(customerData, token);
    this.setSettings(response.body.Customer);
    // if (response.status !== STATUS_CODES.CREATED) {
    //   throw new ResponseError('Failed to create customer', {
    //     status: response.status,
    //     IsSuccess: response.body.IsSuccess,
    //     ErrorMessage: response.body.ErrorMessage,
    //   });
    // }
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    expect(_.omit(response.body.Customer, ['_id', 'createdOn'])).toEqual({ ...customerData });
    return this.getSettings();
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
    const token = await this.signInService.getToken();
    const response = await this.service.delete(this.getSettings()._id, token);
    if (response.status !== STATUS_CODES.DELETED) {
      throw new DeleteResponseError('Failed to delete customer', {
        status: response.status,
      });
    }
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
}
