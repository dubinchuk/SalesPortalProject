import { faker } from '@faker-js/faker';

import { getRandromEnumValue } from '../../utils/enums/getRandomValue.js';
import { type IProduct, MANUFACTURERS } from '../types/product.types.js';

export function generateNewProduct(productData?: Partial<IProduct>) {
  const productToCreate: IProduct = {
    name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
    price: faker.number.int(99999),
    amount: faker.number.int(999),
    notes: `Notes ${faker.string.alpha(244)}`,
    manufacturer: getRandromEnumValue(MANUFACTURERS),
    ...productData,
  };
  return productToCreate;
}
