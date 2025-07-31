import { ProductFormPage } from './productForm.page';

export class AddNewProductPage extends ProductFormPage {
  readonly uniqueElement = '//h2[.="Add New Product "]';
  readonly 'Add New Product form' = this.findElement('#add-new-product-form');
  private readonly 'Save New Product button' = this.findElement('#save-new-product');

  async clickOnSaveNewProductButton() {
    await this.click(this['Save New Product button']);
  }
}
