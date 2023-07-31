export interface String {
  type: 'string';
  enum?: string[];
  format?: string;
  pattern?: string;
}

export const string = (
  enumeration?: string[],
  format?: string,
  pattern?: string
): String => {
  return {type: 'string', enum: enumeration, format, pattern};
};

export interface Number {
  type: 'number';
  minimum?: number;
  maximum?: number;
  default?: number;
}

export const number = (
  minimum?: number,
  maximum?: number,
  defaultVal?: number
): Number => {
  return {type: 'number', minimum, maximum, default: defaultVal};
};

export interface Boolean {
  type: 'boolean';
}

export const boolean = (): Boolean => {
  return {type: 'boolean'};
};

export interface Array {
  type: 'array';
  items: String | Number | Boolean | Object | OneOf;
}

export const array = (
  items: String | Number | Boolean | Object | OneOf
): Array => {
  return {type: 'array', items};
};

export interface Object {
  type: 'object';
  properties?: {
    [name: string]: String | Number | Boolean | Array | Object | Buffer | OneOf;
  };
  required?: string[];
  additionalProperties?: boolean;
}

export interface OneOf {
  oneOf?: (String | Number | Boolean | Array | Object | Buffer | OneOf)[];
}

export interface Buffer {
  instanceOf: 'Buffer';
}

export const buffer = (): Buffer => {
  return {instanceOf: 'Buffer'};
};

export const oneOf = (
  ...schemas: (String | Number | Boolean | Array | Object | Buffer | OneOf)[]
): OneOf => ({
  oneOf: schemas,
});

export const object = (
  properties?: {
    [name: string]: String | Number | Boolean | Array | Object | Buffer | OneOf;
  },
  required?: string[],
  additionalProperties = false
): Object => {
  return {type: 'object', properties, required, additionalProperties};
};
