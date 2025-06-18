import type { IUserCredentials } from '../../data/types/user.types.js';

import { SalesPortalPage } from './salesPortal.page.js';

export class SignInPage extends SalesPortalPage {
  uniqueElement = '//form[.//input[@id="emailinput"]]';

  readonly 'Email input' = this.findElement('#emailinput');
  readonly 'Password input' = this.findElement('#passwordinput');
  readonly 'Login button' = this.findElement('button.btn-primary');
  readonly 'Login form' = this.findElement('.container-fluid form');

  async fillCredentialsInputs(credentials: IUserCredentials) {
    await this.setValue(this['Email input'], credentials.username);
    await this.setValue(this['Password input'], credentials.password);
  }

  async clickSubmitButton() {
    await this.click(this['Login button']);
  }
}
