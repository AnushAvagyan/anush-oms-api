import * as validator from './validate-x.js';

export interface ExpressRequest {
  query?: validator.Dictionary;
  params?: validator.Dictionary;
  headers?: validator.Dictionary;
  body?: validator.Dictionary;
}

/**
 * Creates an express request validator for your API request model
 *
 * @param schema The JSON Schema object for your API request model
 */
export function generate<T extends validator.Dictionary>(
  schema: Object
): validator.ValidatorFn<ExpressRequest, T> {
  return validator.generate(schema);
}
