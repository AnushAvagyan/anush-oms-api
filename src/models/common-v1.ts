export interface PaginatedList<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  links: PaginationLinks;
}

export interface PaginationLinks {
  self: Link;
  first: Link;
  previous: Link;
  next: Link;
  last: Link;
}

export interface Link {
  href: string;
}

export interface Error {
  code: string;
  message: string;
}

export interface ApiGatewayContext {
  apiGateway: AuthContext;
}

export interface AuthContext {
  event: {
    requestContext?: {
    };
  };
}

export interface ErrorResultX {
  message: string;
  errors: ErrorX[];
}

export interface ErrorX {
  source: string;
  type: string;
  message: string;
}
