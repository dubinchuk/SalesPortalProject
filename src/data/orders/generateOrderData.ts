import { faker } from '@faker-js/faker';

export function generateNumberOfProductsInOrder() {
  return faker.number.int(5);
}
