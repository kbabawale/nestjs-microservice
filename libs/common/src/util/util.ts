export interface PaginatedResponse<T> {
  total: number;
  data: T;
  limit: number;
  skip: number;
}
