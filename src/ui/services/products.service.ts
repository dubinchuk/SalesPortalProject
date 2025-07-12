import { expect, Page } from '@playwright/test';
import _ from 'lodash';

import { ProductsListPage } from '../pages/products/products.page';
import { AddNewProductPage } from '../pages/products/addNewProduct.page';
import { generateNewProduct } from '../../data/products/generateProduct';
import { IProduct, IProductResponse } from '../../data/types/product.types';
import { apiConfig } from '../../config/apiConfig';
import { Product } from '../../services/product.service';
import { logStep } from '../../utils/report/decorator';
import { SignInService } from '../../services/signIn.service';
import { TOAST_MESSAGES } from '../../data/messages/messages';

import { SalesPortalPageService } from './salesPortal.service';

export class ProductsPageService {
  private productsListPage: ProductsListPage;
  private addNewProductPage: AddNewProductPage;
  private product: Product;
  private salesPortalService: SalesPortalPageService;
  constructor(page: Page, signInService: SignInService) {
    this.productsListPage = new ProductsListPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
    this.product = new Product(signInService);
    this.salesPortalService = new SalesPortalPageService(page);
  }

  @logStep('Open Add New Product Page')
  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.addNewProductPage.waitForOpened();
  }

  @logStep('Create product')
  async create(customProductData?: IProduct) {
    await this.populateProduct(customProductData);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints.Products;
    const response = await this.addNewProductPage.interceptResponse<IProductResponse>(
      responseUrl,
      this.addNewProductPage.clickOnSaveNewProductButton.bind(this.addNewProductPage),
    );

    this.product.validateCreateProductResponseStatus(response);
    this.product.createFromExisting(response.body.Product);
    await this.addNewProductPage.waitForButtonSpinnerToHide();
    await this.productsListPage.waitForOpened();
    await this.productsListPage.waitForTableSpinnerToHide();
    await this.validateProductCreatedMessage();
    await this.checkProductInTable();
  }

  async populateProduct(customProductData?: IProduct) {
    const data = customProductData ?? generateNewProduct();
    await this.addNewProductPage.fillProductInputs(data);
    return data;
  }
  @logStep('Validate product created message')
  async validateProductCreatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.productsListPage,
      TOAST_MESSAGES.PRODUCT.CREATED,
    );
  }

  @logStep('Check product in table')
  async checkProductInTable(data?: IProduct) {
    const expectedProduct = data ?? this.product.getSettings();
    const actualProduct = await this.productsListPage.getDataByName(expectedProduct.name);
    expect(actualProduct).toEqual(_.pick(expectedProduct, 'name', 'price', 'manufacturer'));
  }

  @logStep('Delete product')
  async delete() {
    await this.product.delete();
  }

  //TODO: delete product UI
  // @logStep('Delete product UI')
  // async deleteUI() {
  //   await this.productsListPage.openDeleteProduct(this.product.getSettings().name);
  // }
}
