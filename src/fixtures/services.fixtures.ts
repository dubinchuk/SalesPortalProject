import { test as base } from '@playwright/test';

import { CustomersPageService } from '../ui/services/customers.service';
import { HomeService } from '../ui/services/home.service';
import { SignInPageService } from '../ui/services/signIn.service';
import { SignInService } from '../services/signIn.service';
import { Product } from '../services/product.service';
import { Customer } from '../services/customer.service';
import { ProductsPageService } from '../ui/services/products.service';

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
  customersPageService: async ({ page, signInService }, use) => {
    await use(new CustomersPageService(page, signInService));
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

  productsPageService: async ({ page, signInService }, use) => {
    await use(new ProductsPageService(page, signInService));
  },
});

export { expect } from '@playwright/test';
