import { expect, Page } from '@playwright/test';
import _ from 'lodash';
import moment from 'moment';

import { SalesPortalPageService } from './salesPortal.service';
import { apiConfig } from '../../config/apiConfig';
import { TOAST_MESSAGES } from '../../data/messages/messages';
import { generateNewProduct } from '../../data/products/generateProduct';
import { IResponse, IResponseFields } from '../../data/types/api.types';
import { IProduct, IProductFromResponse, IProductResponse } from '../../data/types/product.types';
import { Product } from '../../services/product.service';
import { logStep } from '../../utils/report/decorator';
import { ensureResponseBody } from '../../utils/validation/response';
import { AddNewProductPage } from '../pages/products/addNewProduct.page';
import { DeleteProductModalPage } from '../pages/products/deleteProductModal.page';
import { EditProductPage } from '../pages/products/editProduct.page';
import { ProductDetailsModalPage } from '../pages/products/productDetailsModal.page';
import { ProductsListPage } from '../pages/products/products.page';

export class ProductsPageService {
  private readonly productsListPage: ProductsListPage;
  private readonly addNewProductPage: AddNewProductPage;
  private readonly editProductPage: EditProductPage;
  private readonly productDetailsModalPage: ProductDetailsModalPage;
  private readonly deleteProductModalPage: DeleteProductModalPage;
  private readonly product: Product;
  private readonly salesPortalService: SalesPortalPageService;

  constructor(page: Page, product: Product) {
    this.productsListPage = new ProductsListPage(page);
    this.addNewProductPage = new AddNewProductPage(page);
    this.editProductPage = new EditProductPage(page);
    this.productDetailsModalPage = new ProductDetailsModalPage(page);
    this.deleteProductModalPage = new DeleteProductModalPage(page);
    this.product = product;
    this.salesPortalService = new SalesPortalPageService(page);
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
    await this.validateProductInTable();
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
    await this.validateProductInTable();
  }

  @logStep('Delete product')
  async delete() {
    await this.product.delete();
  }

  @logStep('Delete product from Products List')
  async deleteFromProductsList(productName?: string) {
    const name = productName ?? this.product.getSettings().name;
    await this.openDeleteProduct(name);
    await this.deleteInModalPage();
  }

  @logStep('Delete Product from Edit')
  async deleteProductFromEdit() {
    await this.editProductPage.clickOnDeleteButton();
    await this.deleteInModalPage();
  }

  @logStep('Delete with Modal exit')
  async deleteWithModalExit() {
    await this.confirmDeleteProduct();
    await this.deleteProductModalPage.waitForButtonSpinnerToHide();
    await this.deleteProductModalPage.waitForModalToClose();
    await this.productsListPage.waitForOpened();
    this.product.createFromExisting(undefined);
  }

  async populateProduct(customProductData?: IProduct, isAddPage: boolean = true) {
    const data = customProductData ?? generateNewProduct();
    const formPage = isAddPage ? this.addNewProductPage : this.editProductPage;
    await formPage.fillProductInputs(data);
    return data;
  }

  async save() {
    await this.addNewProductPage.clickOnSaveNewProductButton();
  }

  @logStep('Open Add New Product Page')
  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.addNewProductPage.waitForOpened();
  }

  @logStep('Open Delete Product Modal')
  async openDeleteProduct(productName?: string) {
    const name = productName ?? this.product.getSettings().name;
    await this.productsListPage.clickOnDeleteProduct(name);
    await this.deleteProductModalPage.waitForOpened();
  }

  @logStep('Open Details Modal')
  async openProductDetails(productName?: string) {
    const name = productName ?? this.product.getSettings().name;
    await this.productsListPage.clickOnProductDetails(name);
    await this.productDetailsModalPage.waitForOpened();
  }

  @logStep('Open Edit from Details Modal')
  async openEditFromDetails() {
    await this.productDetailsModalPage.clickOnEditProduct();
    await this.productDetailsModalPage.waitForModalToClose();
    await this.editProductPage.waitForOpened();
  }

  @logStep('Open Edit from Products List')
  async openEditProduct(productName?: string) {
    const name = productName ?? this.product.getSettings().name;
    await this.productsListPage.clickOnEditProduct(name);
    await this.editProductPage.waitForOverlaySpinnersToHide();
    await this.editProductPage.waitForOpened();
  }

  @logStep('Cancel Delete Modal')
  async cancelDeleteModal() {
    await this.deleteProductModalPage.clickOnCancelDeletion();
    await this.deleteProductModalPage.waitForModalToClose();
    await this.productsListPage.waitForOpened();
  }

  @logStep('Cancel Details Modal')
  async cancelDetailsModal() {
    await this.productDetailsModalPage.clickOnCancelViewDetails();
    await this.productDetailsModalPage.waitForModalToClose();
    await this.productsListPage.waitForOpened();
  }

  @logStep('Close Delete Modal')
  async closeDeleteModal() {
    await this.deleteProductModalPage.clickOnCloseDeletion();
    await this.deleteProductModalPage.waitForModalToClose();
    await this.productsListPage.waitForOpened();
  }

  @logStep('Close Details Modal')
  async closeDetailsModal() {
    await this.productDetailsModalPage.clickOnCloseViewDetails();
    await this.productDetailsModalPage.waitForModalToClose();
    await this.productsListPage.waitForOpened();
  }

  @logStep('Validate created product by details')
  async validateProductByDetails(productData?: Omit<IProductFromResponse, '_id'>) {
    const expectedProduct = productData ?? this.product.getProductDataTransformedToDetails();
    if (!expectedProduct.notes) expectedProduct.notes = '-';
    await this.openProductDetails(expectedProduct.name);
    await this.productDetailsModalPage.waitForProductDetailsTitle(expectedProduct.name);
    const actualProduct = await this.productDetailsModalPage.getProductDetails();
    expect(actualProduct).toEqual(expectedProduct);
    await this.closeDetailsModal();
    await this.productDetailsModalPage.waitForModalToClose();
    await this.productsListPage.waitForOpened();
  }

  @logStep('Validate product in table')
  async validateProductInTable(productData?: IProductFromResponse) {
    const expectedProduct = productData ?? this.product.getSettings();
    expectedProduct.createdOn = moment(expectedProduct.createdOn).format('YYYY/MM/DD HH:mm:ss');
    const actualProduct = await this.productsListPage.getProductByName(expectedProduct.name);
    expect(actualProduct).toEqual(
      _.pick(expectedProduct, 'name', 'price', 'manufacturer', 'createdOn'),
    );
  }

  @logStep('Check product not in table')
  private async checkProductNotInTable(name?: string) {
    const productName = name ?? this.product.getSettings().name;
    await this.productsListPage.waitForProductToDetached(productName);
  }

  @logStep('Confirm Delete Product')
  private async confirmDeleteProduct() {
    await this.deleteProductModalPage.clickOnDeleteProduct();
  }

  @logStep('Delete product in Modal')
  private async deleteInModalPage() {
    const responseUrl =
      apiConfig.baseUrl + apiConfig.endpoints['Get Product By Id'](this.product.getSettings()._id);
    const response = await this.deleteProductModalPage.interceptResponse<IResponseFields>(
      responseUrl,
      this.confirmDeleteProduct.bind(this),
    );
    this.product.validateDeleteProductResponseStatus(response as IResponse<IProductResponse>);
    await this.deleteProductModalPage.waitForButtonSpinnerToHide();
    await this.deleteProductModalPage.waitForModalToClose();
    await this.productsListPage.waitForOpened();
    await this.validateProductDeletedMessage();
    await this.checkProductNotInTable();
    if (!response.body) {
      this.product.createFromExisting(undefined);
    }
  }

  private async saveProductChanges() {
    await this.editProductPage.clickOnSaveButton();
  }

  @logStep('Validate product created message')
  private async validateProductCreatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.productsListPage,
      TOAST_MESSAGES.PRODUCT.CREATED,
    );
  }

  @logStep('Validate product updated message')
  private async validateProductUpdatedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.productsListPage,
      TOAST_MESSAGES.PRODUCT.UPDATED,
    );
  }

  @logStep('Validate product deleted message')
  private async validateProductDeletedMessage() {
    await this.salesPortalService.validateToastMessageAndClose(
      this.productsListPage,
      TOAST_MESSAGES.PRODUCT.DELETED,
    );
  }
}
