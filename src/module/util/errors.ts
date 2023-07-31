export class UnauthorizedError {
  name: string;
  error: any;
  constructor(error: any, options: { message?: string } = {}) {
    this.name = 'UnauthorizedError';
    this.error = error;
  }
}

export class ResourceNotFoundError {
  name: string;
  error: any;
  constructor(error: any, options = {}) {
    this.error = error;
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * Represents a service error
 * @extends FortellisError
 */
export class ResourceAlreadyExistsError {
  name: string;
  error: any;
  constructor(error: any, options = {}) {
    this.error = error;
    this.name = 'ResourceAlreadyExistsError';
  }
}

export class RequestError {
  name: string;
  error: any;
  statusCode: any;
  constructor(error: any, options: any = {}) {
    this.error = error;
    this.name = 'RequestError';
    this.error = error;
    this.statusCode = options.statusCode;
  }
}

export class ControllerError {
  name: string;
  error: any;
  options: any;
  message: any;
  statusCode: any;
  constructor(error: any, options: any = {}) {
    this.name = 'ControllerError';
    this.error = error;
    this.statusCode = options.statusCode;
  }
}
