
export interface Dictionary {
  [prop: string]: any;
}

/**
 * @deprecated Please use the JSON Schema based validator
 */
export function id(r: Dictionary, k: string): string {
  return string(r, k);
}


/**
 * @deprecated Please use the JSON Schema based validator
 */
export function page(page: any): number {
  if (typeof page !== 'number' || page < 1) {
    throw new Error('invalid parameter: page');
  }
  return page as number;
}

/**
 * @deprecated Please use the JSON Schema based validator
 */
export function pageSize(pageSize: any): number {
  if (typeof pageSize !== 'number' || pageSize < 1) {
    throw new Error('invalid parameter: pageSize');
  }
  return pageSize as number;
}

/**
 * @deprecated Please use the JSON Schema based validator
 */
export function string(r: Dictionary, k: string): string {
  if (!!k && typeof r[k] !== 'string') {
    throw new Error(`invalid parameter: ${k}`);
  }
  return r[k];
}

/**
 * @deprecated Please use the JSON Schema based validator
 */
export function object(r: Dictionary, k: string): object {
  const o = r[k];
  if (typeof o !== 'object') {
    throw new Error(`invalid parameter: ${k}`);
  }
  return o as object;
}


export function url(value: string, requireHttps = true): boolean {
  const re = requireHttps
    ? /^https:\/\/(www)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,63}(:[0-9]{1,5})?(\/.*)?$/
    : /^(http|https):\/\/(www)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,63}(:[0-9]{1,5})?(\/.*)?$/;
  return re.test(value);
}

