import { ErrorResponseCause } from '../../data/types/api.types';

export class CustomError<T = unknown> extends Error {
  constructor(message: string, cause?: T) {
    super(message, { cause });
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
  }
}

export class ResponseError extends CustomError<ErrorResponseCause> {
  constructor(message: string, cause: ErrorResponseCause) {
    super(
      `${message} - Status code: ${cause.status}, IsSuccess: ${cause.IsSuccess}, ErrorMessage: ${cause.ErrorMessage}`,
      cause,
    );
  }
}

export class DeleteResponseError extends CustomError<{ status: number }> {
  constructor(message: string, cause: { status: number }) {
    super(`${message} - Status code: ${cause.status}`, cause);
  }
}
