import { ProductFormPage } from './productForm.page';
import { urls } from '../../../config/routes';

export class EditProductPage extends ProductFormPage {
  uniqueElement = '#edit-product-form';
  pageUrl = urls.pages['Edit Product'];

  private readonly 'Edit Product form' = this.findElement('#edit-product-form');
  private readonly 'Save Changes button' = this.findElement('#save-product-changes');
  private readonly 'Delete Product button' = this.findElement('#delete-product-btn');
  private readonly 'Back to products list page button' = this.findElement('.back-link');

  async clickOnSaveButton() {
    await this.click(this['Save Changes button']);
  }

  async clickOnDeleteButton() {
    await this.click(this['Delete Product button']);
  }

  async clickOnGoBackButton() {
    await this.click(this['Back to products list page button']);
  }
}
