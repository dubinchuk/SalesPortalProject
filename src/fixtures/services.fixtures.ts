import { test as base } from '@playwright/test';

import { AddCustomerService } from '../ui/services/customers/addNewCustomer.service';
import { CustomersListService } from '../ui/services/customers/customers.service';
import { HomeService } from '../ui/services/home.service';
import { SignInPageService } from '../ui/services/signIn.service';
import { CustomersApiService } from '../api/services/customers.service';
import { SignInService } from '../services/signIn.service';
import { Product } from '../services/product.service';
import { ProductsPageService } from '../ui/services/products.service';

interface ISalesPortalServices {
  customersPageService: CustomersListService;
  addNewCustomerPageService: AddCustomerService;
  homePageService: HomeService;
  signInPageService: SignInPageService;
  customersApiService: CustomersApiService;
  signInService: SignInService;
  product: Product;
  productsPageService: ProductsPageService;
}

export const test = base.extend<ISalesPortalServices>({
  customersPageService: async ({ page }, use) => {
    await use(new CustomersListService(page));
  },

  homePageService: async ({ page }, use) => {
    await use(new HomeService(page));
  },

  signInPageService: async ({ page }, use) => {
    await use(new SignInPageService(page));
  },

  addNewCustomerPageService: async ({ page }, use) => {
    await use(new AddCustomerService(page));
  },

  customersApiService: async ({}, use) => {
    await use(new CustomersApiService());
  },

  signInService: async ({ page }, use) => {
    await use(new SignInService(page));
  },

  product: async ({ page }, use) => {
    await use(new Product(page));
  },

  productsPageService: async ({ page }, use) => {
    await use(new ProductsPageService(page));
  },
});

export { expect } from '@playwright/test';
