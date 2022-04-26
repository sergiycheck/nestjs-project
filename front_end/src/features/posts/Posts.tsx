import React, { useEffect, useContext, Suspense } from "react";
import {
  PaginationContext,
  useSearchParamsToPassInAndPaginationContext,
  availableSearchParams,
} from "../shared/pagination/pagination-context";
import { PaginationComponent } from "../shared/pagination/PaginationComponent";
import { Typography } from "@mui/material";
import { useGetPostsQuery } from "./postsApi";
import { CircularIndeterminate } from "../shared/mui-components/Loader";
import { PostsListContent, PostExcerptContent } from "./PostsContent";

export const Posts = () => {
  const { contextDataAndHandler } = useSearchParamsToPassInAndPaginationContext({
    searchParamsNames: availableSearchParams,
  });

  return (
    <PaginationContext.Provider value={contextDataAndHandler}>
      <div className="container-md d-flex flex-column flex-grow-1">
        <div className="row flex-grow-1">
          <div className="col-12">
            <Suspense fallback={<CircularIndeterminate />}>
              <Typography variant="h4">Posts</Typography>
              <PostsList></PostsList>
            </Suspense>
          </div>
        </div>
        <div className="row">
          <PaginationComponent></PaginationComponent>
        </div>
      </div>
    </PaginationContext.Provider>
  );
};

export const PostsList = () => {
  const { initialPaginationData, setPaginationContextData } = useContext(PaginationContext);
  const { limit, skip } = initialPaginationData;

  const {
    data: itemsResponse,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery({ limit, skip });

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
    <PostsListContent
      data={itemsResponse?.data}
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      error={error}
    />
  );
};

export const PostExcerpt = ({ itemId }: { itemId: string }) => {
  const { initialPaginationData } = useContext(PaginationContext);
  const { limit, skip } = initialPaginationData;
  const { item } = useGetPostsQuery(
    { limit, skip },
    {
      selectFromResult: ({ data }) => ({
        item: data?.data.find((item) => item.id === itemId),
      }),
    }
  );

  return <PostExcerptContent item={item} />;
};
