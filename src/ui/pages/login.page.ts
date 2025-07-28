import { SalesPortalPage } from './salesPortal.page';
import { logStep } from '../../utils/report/decorator';
import { PASSWORD_INPUT_SELECTOR } from '../../utils/security/sensitiveData';

import type { IUserCredentials } from '../../data/types/user.types';

export class SignInPage extends SalesPortalPage {
  uniqueElement = '//form[.//input[@id="emailinput"]]';

  readonly 'Email input' = this.findElement('#emailinput');
  readonly 'Password input' = PASSWORD_INPUT_SELECTOR;
  readonly 'Login button' = this.findElement('button.btn-primary');
  readonly 'Login form' = this.findElement('.container-fluid form');

  @logStep('Fill credentials')
  async fillCredentialsInputs(credentials: IUserCredentials) {
    await this.setValue(this['Email input'], credentials.username);
    await this.setValue(this['Password input'], credentials.password);
  }

  @logStep('Click on Login button')
  async clickSubmitButton() {
    await this.click(this['Login button']);
  }
}
