import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import LoadingButton from "@mui/lab/LoadingButton";
import { PaginationContext, availableSearchParams } from "./pagination-context";

// TODO: move is to the pagination element and not waiting for all children to render
// React.useLayoutEffect(() => {
//   if (isSuccess) {
//     window.scrollTo(0, document.documentElement.scrollHeight);
//   }
// }, [isSuccess]);

const increment = 5;
export const PaginationDetailedComponent = () => {
  const setSearchParams = useSearchParams()[1];

  const { initialPaginationData, setPaginationContextData } = useContext(PaginationContext);
  const { limit, skip, page, per_page, total, total_pages, isFetching } = initialPaginationData;

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

  const handlePreviousPageChange = () => {
    if (page - 1 <= 0) return;
    const previousPage = { page: page - 1 };
    setSearchParamsAndContextData(previousPage.page);
  };

  const handleNextPageChange = () => {
    const nextPage = { page: page + 1 };
    if (nextPage.page > total_pages) return;
    setSearchParamsAndContextData(nextPage.page);
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
      <div className="row justify-content-center">
        <div className="col">
          <div className="row">
            <div className="col-auto">page: {page}</div>
            <div className="col-auto">per_page: {per_page}</div>
            <div className="col-auto">total: {total}</div>
            <div className="col-auto">total_pages:{total_pages}</div>
            <div className="col-auto">limit:{limit}</div>
            <div className="col-auto">skip:{skip}</div>
          </div>
        </div>
        <div className="col-auto">
          <LoadingButton
            size="small"
            disabled={Boolean(page - 1 <= 0)}
            onClick={handlePreviousPageChange}
            loading={isFetching}
            variant="outlined"
          >
            previous
          </LoadingButton>
        </div>
        <div className="col-auto">
          {" "}
          <LoadingButton
            size="small"
            disabled={Boolean(page === total_pages)}
            onClick={handleNextPageChange}
            loading={isFetching}
            variant="outlined"
          >
            next
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};
