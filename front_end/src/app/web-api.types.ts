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

export type GetUserFromJwtResponse<T> = {
  message: string;
  userResponse: T;
  successfulAuth: boolean;
};

export type LoginResponse<T> = GetUserFromJwtResponse<T> & {
  user_jwt: string;
};
