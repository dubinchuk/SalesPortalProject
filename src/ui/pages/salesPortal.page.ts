import { BasePage, LocatorOrSelector } from './base.page';
import { urls } from '../../config/routes';
import { logStep } from '../../utils/report/decorator';

export abstract class SalesPortalPage extends BasePage {
  abstract readonly uniqueElement: LocatorOrSelector;
  readonly pageUrl?: string | ((id: string) => string);

  private readonly 'Toast message' = this.findElement('.toast-body');
  private readonly 'Close toast button' = this.findElement('//button[@title="Close"]');
  private readonly 'Button Spinner' = this.findElement('button .spinner-border');
  private readonly 'Table spinner' = this.findElement('#table-container .spinner-border');
  private readonly 'Overlay spinners' = this.findElement('.overlay-spinner .spinner-border');
  private readonly 'Active modal window' = this.findElement('.modal-open');
  private readonly headerMenuElement = (
    itemName: 'Home' | 'Products' | 'Customers' | 'Orders' | 'Managers',
  ) => `//a[contains(@class, 'justify-content-start')]/text()[.='${itemName}']`;

  async openHeaderModule(moduleName: 'Home' | 'Products' | 'Customers' | 'Orders' | 'Managers') {
    await this.click(this.headerMenuElement(moduleName));
  }

  async openPageByUrl(id?: string) {
    if (this.pageUrl) {
      const url =
        typeof this.pageUrl === 'string'
          ? urls.baseUrl + this.pageUrl
          : urls.baseUrl + this.pageUrl(id!);
      await this.openPage(url);
    }
  }

  @logStep('Wait page for opened')
  async waitForOpened(id?: string) {
    if (this.pageUrl) {
      const url =
        typeof this.pageUrl === 'string'
          ? urls.baseUrl + this.pageUrl
          : urls.baseUrl + this.pageUrl(id!);
      await this.waitForUrl(url);
    }
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

  @logStep('Wait for overlay spinner(s) to hide')
  async waitForOverlaySpinnersToHide() {
    await this.waitForSpinnerToHide(this['Overlay spinners']);
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
