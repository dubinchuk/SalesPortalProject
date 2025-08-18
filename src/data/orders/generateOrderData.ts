import { faker } from '@faker-js/faker';

export function generateNumberOfProductsInOrder() {
  return faker.number.int({ min: 1, max: 5 });
}
