import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';
import _ from 'lodash';

import { IResponse } from '../../data/types/api.types';
import { IResponseFields } from '../../data/types/api.types';

export function validateSchema<T = object>(response: IResponse<T>, schema: object) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const isValidSchema = validate(response.body);
  let message: string;

  if (!isValidSchema && validate.errors) {
    const errorsJson = JSON.stringify(validate.errors, null, 2);
    message = `Schema validation failed:\n${errorsJson}`;
  } else {
    message = 'Schema validation';
  }

  expect(isValidSchema, message).toBe(true);
}

export function validateResponse<T extends object>(
  response: IResponse<T>,
  status: number,
  IsSuccess?: boolean,
  ErrorMessage?: null | string,
  expectedBodyData?: object,
  targetKey?: keyof typeof response.body,
) {
  validateResponseStatus(response, status);

  if (isResponseWithIsSuccessAndErrorMessage(response)) {
    expect.soft(response.body.IsSuccess, `Check IsSuccess to be ${IsSuccess}`).toBe(IsSuccess);
    expect
      .soft(response.body.ErrorMessage, `Check ErrorMessage to be ${ErrorMessage}`)
      .toBe(ErrorMessage);
  }
  if (expectedBodyData && targetKey && response.body[targetKey]) {
    const actualBodyData = response.body[targetKey] as Record<string, unknown>;
    expect
      .soft(_.omit(actualBodyData, ['createdOn', '_id']), `Check ${String(targetKey)} in response`)
      .toEqual({ ...expectedBodyData });
  }
}

export function validateResponseStatus<T extends object>(
  response: IResponse<T>,
  expectedStatus: number,
) {
  const actualStatus = response.status;
  expect(actualStatus, `Check response status to be ${expectedStatus}`).toBe(expectedStatus);
}

function isResponseWithIsSuccessAndErrorMessage(
  response: IResponse<object>,
): response is IResponse<IResponseFields> {
  return 'IsSuccess' in response && 'ErrorMessage' in response;
}
