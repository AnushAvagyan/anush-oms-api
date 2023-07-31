import {
  ControllerError,
  UnauthorizedError,
  ResourceNotFoundError,
  ResourceAlreadyExistsError,
  RequestError,
} from './errors.js';
import { Response } from 'express';

export type ErrorLike = Error & {
  isAxiosError?: boolean;
  errors?: any[];
};

export function handleControllerError(
  res: Response,
  err: ErrorLike,
  message?: string,
  meta?: object
) {
  let error;
  if (err instanceof ControllerError) {
    error = err;
  } else if (err instanceof UnauthorizedError) {
    error = new ControllerError('User not authorized to access this resource', {
      statusCode: 403,
    });
  } else if (err instanceof ResourceNotFoundError) {
    error = new ControllerError('Resource not found', {
      statusCode: 404,
    });
  } else if (err instanceof ResourceAlreadyExistsError) {
    error = new ControllerError('Resource already exists', {
      statusCode: 400,
    });
  } else if (err instanceof RequestError) {
    error = new ControllerError(err || 'Request malformed', {
      statusCode: 400,
    });
  } else {
    error = new ControllerError(err, {
      statusCode: 500,
      message: message || 'Internal server error',
    });
  }
  console.error({
    Name: error.name,
    Body: error,
    Attributes: { meta },
  });
  res.status(error.statusCode).json({
    code: error.statusCode,
    message: message,
    error: error?.error?.errors || error?.error
  });
}

export function handleError(err: ErrorLike, meta?: object) {
  console.error({ Name: err.name, Body: err.message || err, Attributes: meta });
  return err;
}

export const errorHandler = {
  handleControllerError,
  handleError,
};
