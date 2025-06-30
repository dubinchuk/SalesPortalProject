import { logStep } from '../../utils/report/decorator.js';

import { BasePage } from './base.page.js';

export abstract class SalesPortalPage extends BasePage {
  abstract readonly uniqueElement: string;
  private readonly 'Toast message' = this.findElement('.toast-body');
  private readonly 'Close toast button' = this.findElement('//button[@title="Close"]');
  private readonly 'Button Spinner' = this.findElement('button .spinner-border');
  private readonly 'Table spinner' = this.findElement('#table-container .spinner-border');

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

  async getToastMessage() {
    const text = await this.getText(this['Toast message']);
    return text;
  }

  @logStep('Close toast message')
  async closeToastMessage() {
    await this.click(this['Close toast button']);
    await this.waitForElement(this['Toast message'], 'hidden');
  }
}
