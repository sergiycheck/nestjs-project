export interface EndPointResponse<T> {
  message: string;
  data: T;
}

export interface ListResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}
