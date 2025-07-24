import { logStep } from '../../utils/report/decorator.js';

import { BasePage } from './base.page.js';

export abstract class SalesPortalPage extends BasePage {
  abstract readonly uniqueElement: string;
  private readonly 'Toast message' = this.findElement('.toast-body');
  private readonly 'Close toast button' = this.findElement('//button[@title="Close"]');
  private readonly 'Button Spinner' = this.findElement('button .spinner-border');
  private readonly 'Table spinner' = this.findElement('#table-container .spinner-border');
  private readonly 'Overlay spinner' = this.findElement('.overlay-spinner .spinner-border');
  private readonly 'Active modal window' = this.findElement('.modal-open');
  private readonly headerMenuElement = (
    itemName: 'Home' | 'Products' | 'Customers' | 'Orders' | 'Managers',
  ) => `//a[contains(@class, 'justify-content-start')]/text()[.='${itemName}']`;

  async openHeaderModule(moduleName: 'Home' | 'Products' | 'Customers' | 'Orders' | 'Managers') {
    await this.click(this.headerMenuElement(moduleName));
  }

  @logStep('Wait for unique page element')
  async waitForOpened() {
    await this.waitForElement(this.uniqueElement);
  }

  @logStep('Wait for button spinner to hide')
  async waitForButtonSpinnerToHide() {
    await this.waitForSpinnerToHide(this['Button Spinner']);
  }

  @logStep('Wait for table spinner to hide')
  async waitForTableSpinnerToHide() {
    await this.waitForSpinnerToHide(this['Table spinner']);
  }

  @logStep('Wait for overlay spinner to hide')
  async waitForOverlaySpinnerToHide() {
    await this.waitForSpinnerToHide(this['Overlay spinner']);
  }

  async getToastMessage() {
    const text = await this.getText(this['Toast message']);
    return text;
  }

  @logStep('Close toast message')
  async closeToastMessage() {
    await this.click(this['Close toast button']);
    await this.waitForElement(this['Toast message'], 'hidden');
  }

  @logStep('Wait for modal window to close')
  async waitForModalToClose() {
    await this.waitForElementToBeDetached(this['Active modal window']);
  }
}
