import Ajv from 'ajv';
import { expect } from '@playwright/test';

import { IResponse } from '../../data/types/api.types';
import { IResponseFields } from '../../data/types/api.types';

export function validateSchema<T = object>(response: IResponse<T>, schema: object) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValidSchema = validate(response.body);
  if (validate.errors) {
    console.log(validate.errors);
  }
  expect(isValidSchema).toBe(true);
}

export function validateResponse<T extends object>(
  response: IResponse<T>,
  status: number,
  IsSuccess: boolean,
  ErrorMessage: null | string,
) {
  expect(response.status).toBe(status);
  if (isResponseWithIsSuccessAndErrorMessage(response)) {
    expect(response.body.IsSuccess).toBe(IsSuccess);
    expect(response.body.ErrorMessage).toBe(ErrorMessage);
  }
}

function isResponseWithIsSuccessAndErrorMessage(
  response: IResponse<object>,
): response is IResponse<IResponseFields> {
  return 'IsSuccess' in response && 'ErrorMessage' in response;
}
