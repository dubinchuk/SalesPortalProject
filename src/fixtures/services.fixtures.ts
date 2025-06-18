import { test as base } from '@playwright/test';

import { AddCustomerService } from '../ui/services/customers/addNewCustomer.service';
import { CustomersListService } from '../ui/services/customers/customers.service';
import { HomeService } from '../ui/services/home.service';
import { SignInService } from '../ui/services/signIn.service';
import { CustomersApiService } from '../api/services/customers.service';

interface ISalesPortalServices {
  customersPageService: CustomersListService;
  addNewCustomerPageService: AddCustomerService;
  homePageService: HomeService;
  signInPageService: SignInService;
  customersApiService: CustomersApiService;
}

export const test = base.extend<ISalesPortalServices>({
  customersPageService: async ({ page }, use) => {
    await use(new CustomersListService(page));
  },

  homePageService: async ({ page }, use) => {
    await use(new HomeService(page));
  },

  signInPageService: async ({ page }, use) => {
    await use(new SignInService(page));
  },

  addNewCustomerPageService: async ({ page }, use) => {
    await use(new AddCustomerService(page));
  },

  customersApiService: async ({}, use) => {
    await use(new CustomersApiService());
  },
});
