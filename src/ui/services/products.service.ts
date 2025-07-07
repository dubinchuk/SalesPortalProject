import { expect, Page } from '@playwright/test';
import _ from 'lodash';

import { ProductsListPage } from '../pages/products/products.page';
import { AddNewProductPage } from '../pages/products/addNewProduct.page';
import { generateNewProduct } from '../../data/products/generateProduct';
import { IProduct, IProductResponse } from '../../data/types/product.types';
import { apiConfig } from '../../config/apiConfig';
import { STATUS_CODES } from '../../data/types/api.types';
import { validateResponse } from '../../utils/validation/response';
import { Product } from '../../services/product.service';
import { logStep } from '../../utils/report/decorator';

import { SalesPortalPageService } from './salesPortal.service';

export class ProductsPageService {
  private productsListPage: ProductsListPage;
  private addNewProductPage: AddNewProductPage;
  private product: Product;
  private salesPortalService: SalesPortalPageService;
  constructor(page: Page) {
    this.productsListPage = new ProductsListPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
    this.product = new Product(page);
    this.salesPortalService = new SalesPortalPageService(page);
  }

  @logStep('Open Add New Product Page')
  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.addNewProductPage.waitForOpened();
  }

  @logStep('Create product')
  async createProduct(productData?: IProduct) {
    const data = generateNewProduct(productData);
    await this.addNewProductPage.fillProductInputs(data);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints.Products;
    const response = await this.addNewProductPage.interceptResponse<IProductResponse>(
      responseUrl,
      this.addNewProductPage.clickOnSaveNewProductButton.bind(this.addNewProductPage),
    );
    validateResponse<IProductResponse>(response, STATUS_CODES.CREATED, true, null);
    this.product.createFromExisting(response.body.Product);
    await this.productsListPage.waitForOpened();
    await this.salesPortalService.validateToastMessageAndClose(
      this.productsListPage,
      'Product was successfully created',
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
}
