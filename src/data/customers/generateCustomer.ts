import { faker } from '@faker-js/faker';

import { ICustomer, COUNTRIES } from '../types/customers.types';
import { getRandromEnumValue } from '../../utils/enums/getRandomValue';

export const generateNewCustomer = (params?: Partial<ICustomer>) => {
  return {
    email: faker.internet.email(),
    name: `Name ${faker.string.alpha(35)}`,
    country: getRandromEnumValue(COUNTRIES),
    city: `City ${faker.string.alpha(15)}`,
    street: `Street ${faker.string.alphanumeric(33)}`,
    house: faker.number.int(999),
    flat: faker.number.int(9999),
    phone: `+${faker.number.int(999999999999)}`,
    notes: `Notes ${faker.string.alpha(244)}`,
    ...params,
  } as ICustomer;
};

export const generateCustomerFromResponse = (customer?: ICustomer) => ({
  ...(customer ?? generateNewCustomer()),
  _id: faker.string.alphanumeric(20),
  createdOn: faker.date.past().toISOString(),
});
