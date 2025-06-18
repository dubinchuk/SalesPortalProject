import { expect } from 'allure-playwright';

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../config/environment';
import { SignInApiClient } from '../clients/signIn.client';
import { STATUS_CODES } from '../../data/types/api.types';

class SignInApiService {
  private token?: string;

  constructor(private signInClient = new SignInApiClient()) {}

  async loginAsAdmin() {
    const response = await this.signInClient.login({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });
    expect(response.status).toBe(STATUS_CODES.OK);
    const headers = new Headers(response.headers);
    const token = headers.get('authorization');
    this.token = `Bearer ${token}`;
    return response.headers.authorization;
  }

  async getToken() {
    if (!this.token) {
      await this.loginAsAdmin();
    }
    if (!this.token) {
      throw new Error('Token is not available after login');
    }
    return this.token;
  }
}

export default new SignInApiService();
