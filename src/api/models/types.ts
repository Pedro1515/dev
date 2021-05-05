export interface Sort {
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  sort: Sort;
  pageSize: number;
  pageNumber: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Response<T> {
  content: T;
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
}
