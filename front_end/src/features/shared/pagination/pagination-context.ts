import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QueryGetPaginationListType } from "../types";
import { PaginationData } from "../../../app/web-api.types";
import Joi from "joi";

type Concrete<Type> = {
  [Prop in keyof Type]: NonNullable<Type[Prop]>;
};

export type PaginationContextType = Concrete<QueryGetPaginationListType> &
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

export const availableSearchParams = { page: "page", searchText: "searchText" };

const numPageSchema = Joi.object({
  numPage: Joi.number().integer().min(1).max(999),
});

export const useSearchParamsToPassInAndPaginationContext = ({
  searchParamsNames,
}: {
  searchParamsNames: string;
}) => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get(searchParamsNames);

  const [initialPaginationData, setPaginationContextData] = useState<PaginationContextType>(
    willBePassedToPaginationData
  );
  const { limit } = initialPaginationData;

  useEffect(() => {
    const numPage = Number(page);
    const { error } = numPageSchema.validate({ numPage });
    if (!error) {
      const skip = numPage * limit - limit;
      setPaginationContextData((prev) => ({ ...prev, page: numPage, skip }));
    }
  }, [page, limit]);

  const contextDataAndHandler = { initialPaginationData, setPaginationContextData };

  return { contextDataAndHandler };
};
