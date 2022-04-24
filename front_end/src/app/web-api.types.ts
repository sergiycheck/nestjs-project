export interface EndPointResponse<T> {
  message: string;
  data: T;
}

export type PaginationData = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type ListResponse<T> = PaginationData & {
  data: T[];
};

export type LoginResponse<T> = {
  message: string;
  user_jwt: string;
  userResponse: T;
};
