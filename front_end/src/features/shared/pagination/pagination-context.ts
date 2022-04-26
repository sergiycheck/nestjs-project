import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QueryGetPaginationListType } from "../types";
import { PaginationData } from "../../../app/web-api.types";

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

export const availableSearchParams = "page";

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
    if (Number.isInteger(numPage) && numPage > 0 && numPage < 1000) {
      const skip = numPage * limit - limit;
      setPaginationContextData((prev) => ({ ...prev, page: numPage, skip }));
    }
  }, [page, limit]);

  const contextDataAndHandler = { initialPaginationData, setPaginationContextData };

  return { contextDataAndHandler };
};
