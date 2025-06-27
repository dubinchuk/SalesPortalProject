import { expect, request } from '@playwright/test';

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../config/environment';
import { SignInApiClient } from '../clients/signIn.client';
import { STATUS_CODES } from '../../data/types/api.types';
import { logStep } from '../../utils/report/decorator';
import { apiConfig } from '../../config/apiConfig';

class SignInApiService {
  private token?: string;

  constructor(private signInClient = new SignInApiClient()) {}

  @logStep('Sign in via API')
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

  // Метод без test.step для использования в globalSetup
  async loginAsAdminForGlobalSetup() {
    const requestContext = await request.newContext({
      baseURL: apiConfig.baseUrl,
    });

    const response = await requestContext.post(apiConfig.endpoints.Login, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      },
    });

    if (response.status() !== STATUS_CODES.OK) {
      const body = await response.text();
      throw new Error(`Login failed with status ${response.status()} and body: ${body}`);
    }

    const responseHeaders = response.headers();
    const token = responseHeaders['authorization'];

    if (!token) {
      throw new Error('Authorization token not found in login response headers');
    }

    await requestContext.dispose();

    this.token = `Bearer ${token}`;
    return responseHeaders['authorization'];
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
