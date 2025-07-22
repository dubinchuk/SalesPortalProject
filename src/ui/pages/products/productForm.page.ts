import { IProduct } from '../../../data/types/product.types';
import { logStep } from '../../../utils/report/decorator';
import { SalesPortalPage } from '../salesPortal.page';

export abstract class ProductFormPage extends SalesPortalPage {
  readonly 'Clear all button' = this.findElement('#clear-inputs');
  readonly 'Name input' = this.findElement('#inputName');
  readonly 'Price input' = this.findElement('#inputPrice');
  readonly 'Amount input' = this.findElement('#inputAmount');
  readonly 'Manufacturer input' = this.findElement('#inputManufacturer');
  readonly 'Manufacturer options' = this.findElement(`${this['Manufacturer input']} option`);
  readonly 'Notes input' = this.findElement('#textareaNotes');
  readonly 'Back button' = this.findElement('#back-to-products-page');

  @logStep('Fill product inputs')
  async fillProductInputs(product: Partial<IProduct>) {
    product.name && (await this.setValue(this['Name input'], product.name));
    product.manufacturer &&
      (await this.selectDropdownValue(this['Manufacturer input'], product.manufacturer));
    product.price && (await this.setValue(this['Price input'], product.price));
    product.amount && (await this.setValue(this['Amount input'], product.amount));
    product.notes && (await this.setValue(this['Notes input'], product.notes));
  }
}
