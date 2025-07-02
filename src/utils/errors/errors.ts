import { ErrorResponseCause } from '../../data/types/api.types';

export class CustomError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
  }
}

export class ResponseError extends CustomError {
  constructor(message: string, cause: ErrorResponseCause) {
    super(
      `${message} - Status code: ${cause.status}, IsSuccess: ${cause.IsSuccess}, ErrorMessage: ${cause.ErrorMessage}`,
    );
  }
}

export class DeleteResponseError extends CustomError {
  constructor(message: string, cause: { status: number }) {
    super(`${message} - Status code: ${cause.status}`);
  }
}
