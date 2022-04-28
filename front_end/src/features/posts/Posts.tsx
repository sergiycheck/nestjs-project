import React, { useEffect, useContext, Suspense } from "react";
import {
  PaginationContext,
  useSearchParamsToPassInAndPaginationContext,
  availableSearchParams,
} from "../shared/pagination/pagination-context";
import { PaginationComponent } from "../shared/pagination/PaginationComponent";
import { Button, TextField, Typography } from "@mui/material";
import { useGetPostsQuery } from "./postsApi";
import { CircularIndeterminate } from "../shared/mui-components/Loader";
import { PostsListContent } from "./PostsContent";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Joi from "joi";
import { getObjectFromSearchParams } from "../shared/pagination/query-utils";

export const Posts = () => {
  const { contextDataAndHandler } = useSearchParamsToPassInAndPaginationContext({
    searchParamsNames: availableSearchParams.page,
  });

  return (
    <PaginationContext.Provider value={contextDataAndHandler}>
      <div className="container-md d-flex flex-column" style={{ minHeight: "100vh" }}>
        <div className="row mt-2 gy-2 justify-content-center align-items-start">
          <Suspense fallback={<CircularIndeterminate />}>
            <PostListParamGetter />
          </Suspense>
        </div>
        <div className="mt-auto row">
          <PaginationComponent></PaginationComponent>
        </div>
      </div>
    </PaginationContext.Provider>
  );
};

type SearchTextType = {
  searchText?: string | undefined;
};
const searchTextSchemaValidation = Joi.object({
  searchTextValue: Joi.string().required().max(50),
});
export const PostListParamGetter = () => {
  const searchParams = useSearchParams()[0];
  const searchTextValue = searchParams.get(availableSearchParams.searchText);

  const { error } = React.useMemo(() => {
    return searchTextSchemaValidation.validate({ searchTextValue });
  }, [searchTextValue]);

  return !error ? <PostsList searchTextFromQuery={searchTextValue!} /> : <PostsList />;
};

export const PostsList = ({
  searchTextFromQuery,
}: {
  searchTextFromQuery?: string | undefined;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { initialPaginationData, setPaginationContextData } = useContext(PaginationContext);
  const { limit, skip } = initialPaginationData;

  const [searchText, setSearchText] = React.useState<string | undefined>(searchTextFromQuery);

  const { control, handleSubmit } = useForm<SearchTextType>({
    defaultValues: {
      searchText: searchTextFromQuery,
    },
  });

  const {
    data: itemsResponse,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPostsQuery(
    { limit, skip, searchText: searchTextFromQuery },
    { refetchOnMountOrArgChange: true }
  );

  const onSearch: SubmitHandler<SearchTextType> = (data: SearchTextType) => {
    const { searchText } = data;
    if (searchText) {
      setSearchText(searchText);
      const searchParamsObj = getObjectFromSearchParams(searchParams);
      setSearchParams({ ...searchParamsObj, [availableSearchParams.searchText]: searchText });
      refetch();
    }
  };

  useEffect(() => {
    if (itemsResponse) {
      const { page, per_page, total, total_pages } = itemsResponse;

      setPaginationContextData((prev) => ({
        ...prev,
        page,
        per_page,
        total,
        total_pages,
        isFetching,
      }));
    }
  }, [isFetching, setPaginationContextData, itemsResponse]);

  return (
    <React.Fragment>
      <div className="col-12 col-md-8">
        <div className="row">
          <div className="col-12">
            <form className="row" autoComplete="off" onSubmit={handleSubmit(onSearch)}>
              <div className="col">
                <Controller
                  control={control}
                  name="searchText"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField size="small" fullWidth {...field} placeholder="search for a post" />
                  )}
                />
              </div>
              <div className="col-auto d-flex align-items-center">
                <Button variant="contained" type="submit">
                  search
                </Button>
              </div>
            </form>

            <div className="row">
              {searchText && (
                <Typography variant="subtitle1">search results for: {searchText}</Typography>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-8">
        <Typography variant="h4">Posts</Typography>
        <PostsListContent
          data={itemsResponse?.data}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          isSuccess={isSuccess}
          error={error}
        />
      </div>
    </React.Fragment>
  );
};
