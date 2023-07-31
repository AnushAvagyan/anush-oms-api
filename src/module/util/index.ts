import {ParsedUrlQuery, stringify as queryStringify} from 'querystring';

import {PaginationLinks} from '../../models/common-v1.js';

export type ResultOk<T> = {
  readonly value: T;
  readonly isError: false;
};

export type ResultErr<E> = {
  readonly error: E;
  readonly isError: true;
};

export type Result<T, E> = ResultOk<T> | ResultErr<E>;

export function Ok<T>(value: T): ResultOk<T> {
  return {value, isError: false};
}

export function Err<E>(error: E): ResultErr<E> {
  return {error, isError: true};
}

export function createPaginationLinks(
  requestUrl: string,
  requestPath: string,
  query: ParsedUrlQuery,
  page: number,
  totalPages: number
): PaginationLinks {
  const first = queryStringify({
    ...query,
    page: 1,
  });

  const previous = queryStringify({
    ...query,
    page: Math.max(1, page - 1),
  });

  const next = queryStringify({
    ...query,
    page: Math.min(totalPages, page + 1),
  });

  const last = queryStringify({
    ...query,
    page: totalPages,
  });

  return {
    self: {href: requestUrl},
    first: {href: `${requestPath}?${first}`},
    previous: {href: `${requestPath}?${previous}`},
    next: {href: `${requestPath}?${next}`},
    last: {href: `${requestPath}?${last}`},
  };
}

/**
 *
 * @param requestUrl  - request url
 * @param requestPath - request path
 * @param query       - query object
 * @param page        - page
 * @param pageSize    - page size
 * @param totalItems  - total items is the results set
 *
 * Returns paginated hateos link accounting for input pageSize
 * TO DO - This module should replace createPaginationLinks module defined above
 */
export function createPaginatedLinks(
  requestUrl: string,
  requestPath: string,
  query: ParsedUrlQuery,
  page: number,
  pageSize: number,
  totalItems: number
): PaginationLinks {
  const lastPage = Math.max(Math.floor(totalItems / pageSize), 1);
  const first = queryStringify({
    ...query,
    page: 1,
    pageSize,
  });

  const last = queryStringify({
    ...query,
    page: lastPage,
    pageSize: pageSize,
  });

  const previous = queryStringify({
    ...query,
    page: page <= lastPage ? Math.max(1, page - 1) : lastPage,
    pageSize,
  });

  const next = queryStringify({
    ...query,
    page: Math.min(lastPage, page + 1),
    pageSize,
  });

  return {
    self: {href: requestUrl},
    first: {href: `${requestPath}?${first}`},
    previous: {href: `${requestPath}?${previous}`},
    next: {href: `${requestPath}?${next}`},
    last: {href: `${requestPath}?${last}`},
  };
}
