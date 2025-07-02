import { IProduct } from '../../../data/types/product.types.js';
import { SalesPortalPage } from '../salesPortal.page.js';

export class AddNewProductPage extends SalesPortalPage {
  readonly uniqueElement = '//h2[.="Add New Product "]';

  readonly 'Save New Product button' = '#save-new-product';
  readonly 'Clear all button' = '#clear-inputs';
  readonly 'Name input' = '#inputName';
  readonly 'Price input' = '#inputPrice';
  readonly 'Amount input' = '#inputAmount';
  readonly 'Manufacturer input' = '#inputManufacturer';
  readonly 'Manufacturer options' = `${this['Manufacturer input']} option`;
  readonly 'Notes input' = '#textareaNotes';
  readonly 'Back button' = '#back-to-products-page';

  async fillProductInputs(product: IProduct) {
    await this.setValue(this['Name input'], product.name);
    await this.selectDropdownValue(this['Manufacturer input'], product.manufacturer);
    await this.setValue(this['Price input'], product.price);
    await this.setValue(this['Amount input'], product.amount);

    if (product.notes) {
      await this.setValue(this['Notes input'], product.notes);
    }
  }

  async clickOnSaveNewProductButton() {
    await this.click(this['Save New Product button']);
  }
}
