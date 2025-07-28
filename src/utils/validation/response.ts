import { expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import _ from 'lodash';

import { IResponse, STATUS_CODES } from '../../data/types/api.types';
import { IResponseFields } from '../../data/types/api.types';
import { CustomError } from '../errors/errors';

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

export function validateResponseBody<T extends object, U extends object>(
  response: IResponse<T>,
  IsSuccess?: boolean,
  ErrorMessage?: null | string,
  expectedBodyData?: U,
  targetKey?: keyof typeof response.body,
) {
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

export function validateResponseStatus<T, C>(
  response: IResponse<T>,
  expectedStatus: STATUS_CODES,
  ErrorClass: new (message: string, cause: C) => CustomError<C>,
  message: string,
  cause: C,
) {
  if (response.status !== expectedStatus) {
    throw new ErrorClass(message, cause);
  }
}

function isResponseWithIsSuccessAndErrorMessage(
  response: IResponse<object>,
): response is IResponse<IResponseFields> {
  return 'IsSuccess' in response && 'ErrorMessage' in response;
}

export function ensureResponseBody<T>(
  response: IResponse<T | null>,
): asserts response is IResponse<T> {
  if (!response.body) {
    throw new Error('Response body is null');
  }
}
