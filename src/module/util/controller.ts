/**
 * A common paginated list of items sufficient for a contoller to generate a
 * response.
 */
export interface PaginatedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
