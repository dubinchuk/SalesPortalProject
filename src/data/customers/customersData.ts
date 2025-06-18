import { COUNTRIES, ICustomer, InvalidCustomer } from '../types/customers.types';

export const validCustomerDataForSnapshots: ICustomer = {
  email: 'aqa-js@gmail.com',
  name: 'Best customer',
  country: COUNTRIES.RUSSIA,
  city: 'Moscow',
  street: 'Lenina',
  house: 1,
  flat: 5,
  phone: '+79999999999',
  notes: 'Test notes',
};

export const invalidCustomerDataForSnapshots: InvalidCustomer = {
  email: '1@1.11',
  name: 'Customer45',
  city: 'Arzamas-16',
  street: 'New street!',
  house: 1000,
  flat: 10000,
  phone: 112,
  notes: '<>',
};
