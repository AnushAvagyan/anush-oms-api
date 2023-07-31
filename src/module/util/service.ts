/**
 * This is where commomn service layer functions and data structures reside.
 */

/**
 * A common service layer paginated list
 */
export interface PaginatedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * A common error structure
 */
export interface Error<E> {
  code: E;
  message: string;
}
