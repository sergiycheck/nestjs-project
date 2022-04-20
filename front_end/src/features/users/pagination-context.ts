import React from "react";
import { QueryGetUsersType } from "./types";
import { PaginationData } from "../../app/web-api.types";

type Concrete<Type> = {
  [Prop in keyof Type]: NonNullable<Type[Prop]>;
};

export type PaginationContextType = Concrete<QueryGetUsersType> &
  PaginationData & {
    isFetching: boolean;
  };

export const willBePassedToPaginationData = {
  limit: 5,
  skip: 0,
  page: 1,
  per_page: 0,
  total: 0,
  total_pages: 0,
  isFetching: false,
};

const initialPaginationData: PaginationContextType = {
  ...willBePassedToPaginationData,
};

type UpdatePaginationContextDataType = React.Dispatch<React.SetStateAction<PaginationContextType>>;
const setPaginationContextData: UpdatePaginationContextDataType = () => {};

const initialPaginationContextData = {
  initialPaginationData,
  setPaginationContextData,
};
export const PaginationContext = React.createContext(initialPaginationContextData);
