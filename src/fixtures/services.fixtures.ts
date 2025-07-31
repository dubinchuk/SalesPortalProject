import { test as base } from '@playwright/test';

import { Customer } from '../services/customer.service';
import { Product } from '../services/product.service';
import { SignInService } from '../services/signIn.service';
import { CustomersPageService } from '../ui/services/customers.service';
import { HomeService } from '../ui/services/home.service';
import { ProductsPageService } from '../ui/services/products.service';
import { SignInPageService } from '../ui/services/signIn.service';
import { checkMetadataIsSet, resetMetadataFlag } from '../utils/report/testMetadata';

interface ISalesPortalServices {
  customersPageService: CustomersPageService;
  homePageService: HomeService;
  signInPageService: SignInPageService;
  customer: Customer;
  signInService: SignInService;
  product: Product;
  productsPageService: ProductsPageService;
}

export const test = base.extend<ISalesPortalServices>({
  customersPageService: async ({ page, customer }, use) => {
    await use(new CustomersPageService(page, customer));
  },

  homePageService: async ({ page }, use) => {
    await use(new HomeService(page));
  },

  signInPageService: async ({ page }, use) => {
    await use(new SignInPageService(page));
  },

  customer: async ({ signInService }, use) => {
    await use(new Customer(signInService));
  },

  signInService: async ({ page }, use) => {
    await use(new SignInService(page));
  },

  product: async ({ signInService }, use) => {
    await use(new Product(signInService));
  },

  productsPageService: async ({ page, product }, use) => {
    await use(new ProductsPageService(page, product));
  },
});

test.beforeEach(async () => {
  resetMetadataFlag();
});

test.afterEach(async () => {
  checkMetadataIsSet();
});

export { expect } from '@playwright/test';
