import { expect, Page } from '@playwright/test';
import _ from 'lodash';

import { ProductsListPage } from '../pages/products/products.page';
import { AddNewProductPage } from '../pages/products/addNewProduct.page';
import { generateNewProduct } from '../../data/products/generateProduct';
import { IProduct, IProductResponse } from '../../data/types/product.types';
import { apiConfig } from '../../config/apiConfig';
import { Product } from '../../services/product.service';
import { logStep } from '../../utils/report/decorator';
import { TOAST_MESSAGES } from '../../data/messages/messages';
import { EditProductPage } from '../pages/products/editProduct.page';
import { ProductDetailsModalPage } from '../pages/products/productDetailsModal.page';
import { DeleteProductModalPage } from '../pages/products/deleteProductModal.page';
import { IResponse, IResponseFields } from '../../data/types/api.types';
import { ensureResponseBody } from '../../utils/validation/response';

import { SalesPortalPageService } from './salesPortal.service';

export class ProductsPageService {
  private productsListPage: ProductsListPage;
  private addNewProductPage: AddNewProductPage;
  private product: Product;
  private salesPortalService: SalesPortalPageService;
  private productDetailsPage: ProductDetailsModalPage;
  private editProductPage: EditProductPage;
  private deleteProductModalPage: DeleteProductModalPage;

  constructor(page: Page, product: Product) {
    this.productsListPage = new ProductsListPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
    this.product = product;
    this.salesPortalService = new SalesPortalPageService(page);
    this.productDetailsPage = new ProductDetailsModalPage(page);
    this.editProductPage = new EditProductPage(page);
    this.deleteProductModalPage = new DeleteProductModalPage(page);
  }

  @logStep('Open Add New Product Page')
  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.addNewProductPage.waitForOpened();
  }

  @logStep('Open View Product details')
  async openProductDetails(productName: string) {
    await this.productsListPage.clickOnProductDetails(productName);
  }

  @logStep('Open Edit Product from Products list')
  async openEditProduct(productName: string) {
    await this.productsListPage.clickOnEditProduct(productName);
    await this.editProductPage.waitForOverlaySpinnerToHide();
    await this.editProductPage.waitForOpened();
  }

  @logStep('Open Delete product modal page')
  async openDeleteProduct(productName: string) {
    await this.productsListPage.clickOnDeleteProduct(productName);
    await this.deleteProductModalPage.waitForOpened();
  }

  async save() {
    await this.addNewProductPage.clickOnSaveNewProductButton();
  }

  @logStep('Create product')
  async create(customProductData?: IProduct) {
    await this.populateProduct(customProductData);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints.Products;
    const response = await this.addNewProductPage.interceptResponse<IProductResponse>(
      responseUrl,
      this.save.bind(this),
    );

    ensureResponseBody(response);
    this.product.validateCreateProductResponseStatus(response);
    this.product.createFromExisting(response.body.Product);
    await this.addNewProductPage.waitForButtonSpinnerToHide();
    await this.productsListPage.waitForOpened();
    await this.productsListPage.waitForTableSpinnerToHide();
    await this.validateProductCreatedMessage();
    await this.checkProductInTable();
  }

  async populateProduct(customProductData?: IProduct, isAddPage: boolean = true) {
    const data = customProductData ?? generateNewProduct();
    const formPage = isAddPage ? this.addNewProductPage : this.editProductPage;
    await formPage.fillProductInputs(data);
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
  async checkProductInTable(productData?: IProduct) {
    const expectedProduct = productData ?? this.product.getSettings();
    const actualProduct = await this.productsListPage.getDataByName(expectedProduct.name);
    expect(actualProduct).toEqual(_.pick(expectedProduct, 'name', 'price', 'manufacturer'));
  }

  @logStep('Check product not in table')
  async checkProductNotInTable(name?: string) {
    const productName = name ?? this.product.getSettings().name;
    await this.productsListPage.waitForProductToDetached(productName);
  }

  @logStep('Delete product')
  async delete() {
    await this.product.delete();
  }

  @logStep('Delete product from products list page')
  async deleteFromProductsList(productName: string) {
    await this.openDeleteProduct(productName);
    await this.deleteInModalPage();
  }

  @logStep('Delete product from Edit product page')
  async deleteProductFromEdit() {
    await this.editProductPage.clickOnDeleteButton();
    await this.deleteInModalPage();
  }

  @logStep('Delete product in modal page')
  private async deleteInModalPage() {
    const responseUrl =
      apiConfig.baseUrl + apiConfig.endpoints['Get Product By Id'](this.product.getSettings()._id);
    const response = await this.deleteProductModalPage.interceptResponse<IResponseFields>(
      responseUrl,
      this.confirmDeleteProduct.bind(this),
    );

    this.product.validateDeleteProductResponseStatus(response as IResponse<IProductResponse>);
    await this.deleteProductModalPage.waitForButtonSpinnerToHide();
    await this.productsListPage.waitForOpened();
    await this.validateProductDeletedMessage();
    await this.checkProductNotInTable();
  }

  @logStep('Validate product updated message')
  async validateProductUpdatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.productsListPage,
      TOAST_MESSAGES.PRODUCT.UPDATED,
    );
  }

  @logStep('Validate product deleted message')
  async validateProductDeletedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.productsListPage,
      TOAST_MESSAGES.PRODUCT.DELETED,
    );
  }

  @logStep('Open Edit product from View Details modal page')
  async openEditProductFromDetails() {
    await this.productDetailsPage.clickOnEditProduct();
    await this.editProductPage.waitForOpened();
  }

  @logStep('Update product')
  async update(customProductData?: IProduct) {
    const settings = this.product.getSettings();
    await this.populateProduct(customProductData, false);
    const responseUrl = apiConfig.baseUrl + apiConfig.endpoints['Get Product By Id'](settings._id);
    const response = await this.editProductPage.interceptResponse<IProductResponse>(
      responseUrl,
      this.saveProductChanges.bind(this),
    );

    ensureResponseBody(response);
    this.product.validateEditProductResponseStatus(response);
    this.product.createFromExisting(response.body.Product);
    await this.editProductPage.waitForButtonSpinnerToHide();
    await this.productsListPage.waitForOpened();
    await this.productsListPage.waitForTableSpinnerToHide();
    await this.validateProductUpdatedMessage();
    await this.checkProductInTable();
  }

  async saveProductChanges() {
    await this.editProductPage.clickOnSaveButton();
  }

  async confirmDeleteProduct() {
    await this.deleteProductModalPage.clickOnDeleteProduct();
  }
}
