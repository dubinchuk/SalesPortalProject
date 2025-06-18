import { API_ERRORS } from '../errors/apiErrors';
import { IResponseFields } from '../types/api.types';
import { ICustomersResponse, ICustomersTableMock } from '../types/customers.types';

export const EMPTY_TABLE_MOCK: Omit<ICustomersResponse, 'sorting'> = {
  Customers: [],
  ErrorMessage: null,
  IsSuccess: true,
};

export const TABLE_MOCK: ICustomersTableMock = {
  Customers: [],
  ErrorMessage: null,
  IsSuccess: true,
  sorting: { sortfield: 'createdOn', sortOrder: 'desc' },
};

export const CUSTOMER_EXISTS_ERROR_MOCK = (email: string): IResponseFields => ({
  ErrorMessage: API_ERRORS.CUSTOMER.EXISTS(email),
  IsSuccess: false,
});
