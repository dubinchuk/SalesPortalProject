import { IResponseFields } from './api.types';

export interface IUserCredentials {
  username: string;
  password: string;
}

export interface ILoginResponse extends IResponseFields {
  token: string;
}
