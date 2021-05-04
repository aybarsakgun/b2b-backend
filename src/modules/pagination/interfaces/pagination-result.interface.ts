export interface IPaginationResult<T> {
  total?: number;
  totalPage?: number;
  page?: number;
  limit?: number;
  items: T[];
}
