import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { PaginationContext, availableSearchParams } from "./pagination-context";

const increment = 5;
export const PaginationComponent = () => {
  const setSearchParams = useSearchParams()[1];

  const { initialPaginationData, setPaginationContextData } = useContext(PaginationContext);
  const { limit, page, total_pages, isFetching } = initialPaginationData;

  const setSearchParamsAndContextData = (pageToSet: number) => {
    const searchParamObj = { [availableSearchParams]: `${pageToSet}` };
    setSearchParams(searchParamObj);
    const nextParams = { limit: increment, skip: pageToSet * limit - limit };
    setPaginationContextData((prev) => ({
      ...prev,
      page: pageToSet,
      ...nextParams,
    }));
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParamsAndContextData(value);
  };

  return (
    <div className="row">
      <div className="row justify-content-center">
        <div className="col-auto">
          <Pagination
            count={total_pages}
            page={page}
            onChange={handleChange}
            disabled={isFetching}
          />
        </div>
      </div>
    </div>
  );
};
