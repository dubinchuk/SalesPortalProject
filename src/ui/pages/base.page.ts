import { Locator, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { IResponse } from '../../data/types/api.types';
import { logAction } from '../../utils/report/decorator';

const DEFAULT_TIMEOUT = 15000;

type LocatorOrSelector = Locator | string;

function isSelector(elementOrSelector: LocatorOrSelector): elementOrSelector is string {
  return typeof elementOrSelector === 'string';
}

export class BasePage {
  constructor(protected page: Page) {}

  protected findElement(locator: LocatorOrSelector) {
    return isSelector(locator) ? this.page.locator(locator) : locator;
  }

  protected async waitForElement(
    locator: LocatorOrSelector,
    state: 'attached' | 'detached' | 'visible' | 'hidden' = 'visible',
    timeout = DEFAULT_TIMEOUT,
  ) {
    const element = this.findElement(locator);
    await element.waitFor({ state, timeout });
    return element;
  }

  protected async waitForElementAndScroll(locator: LocatorOrSelector, timeout = DEFAULT_TIMEOUT) {
    const element = await this.waitForElement(locator, 'visible');
    await element.scrollIntoViewIfNeeded({ timeout });
    return element;
  }

  protected async waitForSpinnerToHide(
    spinnerOrSpinners: LocatorOrSelector | LocatorOrSelector[],
    skipVisibilityCheck: boolean = true,
  ) {
    const spinners = Array.isArray(spinnerOrSpinners) ? spinnerOrSpinners : [spinnerOrSpinners];
    const randomIndex = faker.number.int(spinners.length - 1);

    // Оставляем возможность проверки видимости спиннера
    if (!skipVisibilityCheck) {
      try {
        await this.waitForElement(spinners[randomIndex], 'visible', 3000);
      } catch (error) {
        if (spinners.length > 1) {
          throw new Error(`Random spinner at index ${randomIndex} was not visible: ${error}`);
        } else {
          throw new Error(`Spinner was not visible: ${error}`);
        }
      }
    }

    try {
      for (const spinner of spinners) {
        await this.waitForElement(spinner, 'hidden');
      }
    } catch (error) {
      throw new Error(`Failed waiting spinner(s) to hide: ${error}`);
    }
  }

  @logAction('Click on element with selector {selector}')
  protected async click(locator: LocatorOrSelector, timeout = DEFAULT_TIMEOUT) {
    const element = await this.waitForElement(locator, 'visible', timeout);
    await element.isEnabled();
    await element.click();
  }

  @logAction('Set {text} into element with selector {selector}')
  protected async setValue(
    locator: LocatorOrSelector,
    value: string | number,
    timeout = DEFAULT_TIMEOUT,
  ) {
    const element = await this.waitForElement(locator, 'visible', timeout);
    await element.fill(String(value), { timeout });
  }

  protected async getText(locator: LocatorOrSelector, timeout = DEFAULT_TIMEOUT) {
    const element = await this.waitForElementAndScroll(locator, timeout);
    return await element.innerText({ timeout });
  }

  @logAction('Select dropdown value from {selector}')
  protected async selectDropdownValue(
    dropdownLocator: LocatorOrSelector,
    value: string | number,
    timeout = DEFAULT_TIMEOUT,
  ) {
    const element = await this.waitForElement(dropdownLocator, 'visible', timeout);
    await element.selectOption(String(value), { timeout });
  }

  @logAction('Open URL {selector}')
  async openPage(url: string) {
    await this.page.goto(url);
  }

  async deleteCookies() {
    await this.page.context().clearCookies();
  }

  async interceptResponse<T>(
    url: string,
    triggerAction: () => Promise<void>,
  ): Promise<IResponse<T>> {
    const [response] = await Promise.all([this.page.waitForResponse(url), triggerAction()]);
    return {
      body: (await response.json()) as T,
      status: response.status(),
      headers: response.headers(),
    };
  }

  async getCookies() {
    return this.page.context().cookies();
  }

  async clearCookies() {
    await this.page.context().clearCookies();
  }
}
