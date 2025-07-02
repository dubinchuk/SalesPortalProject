import { Page } from '@playwright/test';

import { ProductsListPage } from '../pages/products/products.page';
import { AddNewProductPage } from '../pages/products/addNewProduct.page';
import { generateNewProduct } from '../../data/products/generateProduct';
import { IProduct, IProductResponse } from '../../data/types/product.types';
import { apiConfig } from '../../config/apiConfig';
import { STATUS_CODES } from '../../data/types/api.types';
import { validateResponse } from '../../utils/validation/response';
import { Product } from '../../services/product.service';

import { SalesPortalPageService } from './salesPortal.service';

export class ProductsPageService extends SalesPortalPageService {
  private productsListPage: ProductsListPage;
  private addNewProductPage: AddNewProductPage;
  private product: Product;
  constructor(page: Page) {
    super(page);
    this.productsListPage = new ProductsListPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
    this.product = new Product(page);
  }

  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.addNewProductPage.waitForOpened();
  }

  async populateProduct(productData?: IProduct) {
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
    await this.validateNotification('Product was successfully created');
  }

  async delete() {
    await this.product.delete();
  }
}
