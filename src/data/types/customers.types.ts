import { IResponseFields } from './api.types';

export enum COUNTRIES {
  USA = 'USA',
  CANADA = 'Canada',
  BELARUS = 'Belarus',
  UKRAINE = 'Ukraine',
  GERMANY = 'Germany',
  FRANCE = 'France',
  GREAT_BRITAIN = 'Great Britain',
  RUSSIA = 'Russia',
}

export enum CUSTOMERS_COLUMN_NAME {
  EMAIL = 'Email',
  NAME = 'Name',
  COUNTRY = 'Country',
  CREATED_ON = 'Created On',
}

export interface ICustomer {
  email: string;
  name: string;
  country: COUNTRIES;
  city: string;
  street: string;
  house: number;
  flat: number;
  phone: string;
  notes?: string;
}

export interface InvalidCustomer extends Partial<Record<keyof ICustomer, number | string>> {}

export interface ICustomerFromResponse extends ICustomer {
  _id: string;
  createdOn: string;
}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
  sorting: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
}

export interface ICustomersTable
  extends Pick<ICustomerFromResponse, 'email' | 'name' | 'country' | 'createdOn'> {}

export interface ICustomersTableMock {
  Customers: ICustomerFromResponse[];
  ErrorMessage: null;
  IsSuccess: true;
  sorting: { sortfield: 'createdOn'; sortOrder: 'asc' | 'desc' };
}
