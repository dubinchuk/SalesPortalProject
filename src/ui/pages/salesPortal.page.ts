import { BasePage } from './base.page.js';

export abstract class SalesPortalPage extends BasePage {
  protected readonly spinner = this.findElement('div.spinner-border');
  abstract readonly uniqueElement: string;
  private readonly 'Toast message' = '.toast-body';
  private readonly 'Close toast button' = '.d-flex .btn-close';

  async waitForOpened() {
    await this.waitForElement(this.uniqueElement);
  }

  async waitForSpinnerToHide() {
    await this.waitForElement(this.spinner, 'hidden', 15000);
  }

  async getToastMessage() {
    const text = await this.getText(this['Toast message']);
    return text;
  }

  async closeToastMessage() {
    await this.click(this['Close toast button']);
    await this.waitForElement(this['Toast message'], 'hidden');
  }
}
