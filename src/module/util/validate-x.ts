import ajv, { ValidateFunction } from 'ajv';
import pkg from 'lodash';
const { cloneDeep } = pkg;
import {ErrorX, ErrorResultX} from '../../models/common-v1.js';

const AJV = new ajv({
  allErrors: true, // report all errors
  coerceTypes: true, // automatically coerce input properties to the type in the schema for validation
  removeAdditional: true, // scrub all extra properties
  useDefaults: true, // insert default values according to the supplied schema
});

export interface Dictionary {
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Validates an object against a JSON Schema.
 *
 * @param obj the object validation will be performed against.
 * @returns the validated object or an error result.  The returns object may be modified according to the JSON schema rules.
 */
export type ValidatorFn<T extends Dictionary, R extends Dictionary> = (
  obj: T
) => R | ErrorResultX;

/**
 * Generates a JSON Schema validator function.
 *
 * @param schema {Object} A JSON Schema object.
 * @returns {ValidatorFn<T>} a function that validates an input object against the supplied schema.
 */
export function generate<T extends Dictionary, R extends Dictionary>(
  schema: Object
): ValidatorFn<T, R> {
  // pre compile the validator
  const validate = AJV.compile(schema);

  return (obj: T) => {
    // Create a clone of the input to prevent side effects since ajv will
    // modify the clone with default values.
    // TODO: Need to figure out some meta-programming type coersion tricks here...
    const clone = cloneDeep(obj as any as R);
    const valid = validate(clone);
    return valid
      ? clone
      : {
          message: 'invalid request',
          errors: (validate.errors || []).map(prettyError),
        };
  };
}

export function prettyError(error: any): ErrorX {
  switch (error.keyword) {
    case 'required':
      return prettyRequiredError(error);

    case 'format':
      return prettyFormatError(error);

    case 'maximum':
    case 'minimum':
    case 'exclusiveMaximum':
    case 'exclusiveMinimum':
      return prettyLimitError(error);

    // TODO
    // case 'dependencies':
    // case 'addtionalItems':
    // case 'additionalProperties':
    // case 'multipleOf':
    // case 'pattern':
    // case 'propertyNames':
    default:
      return prettyDefaultError(error);
  }
}

export function prettyPrintSource(error: any): string {
  console.log('!!!!', error)
  return error.schemaPath.split('.').slice(0, -1).join('.') || '.';
}

export function prettyPrintName(error: any): string {
  return error.schemaPath.split('.').pop() || '.';
}

export function prettyRequiredError(error: any): ErrorX {
  const source = prettyPrintSource(error);
  const name = (error.params).missingProperty;
  return {
    source,
    type: 'missing_required_property',
    message: `${name} is mandatory`,
  };
}

export function prettyLimitError(error: any): ErrorX {
  const source = prettyPrintSource(error);
  const name = prettyPrintName(error);
  const limitDesc = error.message || '';
  return {
    source,
    type: 'invalid_value',
    message: `${name} ${limitDesc}`,
  };
}

export function prettyFormatError(error: any): ErrorX {
  const source = prettyPrintSource(error);
  const name = prettyPrintName(error);
  const format = (error.params).format.replace('"', '');
  return {
    source,
    type: 'invalid_format',
    message: `${name} should be a valid ${format}`,
  };
}

export function prettyDefaultError(error: any): ErrorX {
  const source = prettyPrintSource(error);
  const name = prettyPrintName(error);
  return {
    source,
    type: 'invalid_value',
    message: `${name} is invalid`,
  };
}
