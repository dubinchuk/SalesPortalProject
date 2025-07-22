import { ModalButtonRole } from '../../data/types/modal.types';

import { SalesPortalPage } from './salesPortal.page';

export abstract class ModalPage extends SalesPortalPage {
  abstract buttonSelectors: Record<ModalButtonRole, string>;

  protected async clickOnModalPageButton(buttonKey: ModalButtonRole) {
    const locator = this.findElement(this.buttonSelectors[buttonKey]);
    await this.click(locator);
  }
}
