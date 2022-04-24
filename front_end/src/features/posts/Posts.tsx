import React, { useEffect, useContext, Suspense } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TimeAgo } from "../shared/TimeAgo";
import {
  PaginationContext,
  useSearchParamsToPassInAndPaginationContext,
  availableSearchParams,
} from "../shared/pagination/pagination-context";

import { PaginationComponent } from "../shared/pagination/PaginationComponent";
import { Divider, Typography } from "@mui/material";
import { useGetPostsQuery } from "./postsApi";
import Link from "@mui/material/Link";
import { CircularIndeterminate } from "../shared/mui-components/Loader";

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

const PostsList = () => {
  const { initialPaginationData, setPaginationContextData } = useContext(PaginationContext);
  const { limit, skip } = initialPaginationData;

  const {
    data: itemsResponse,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
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

  const items = itemsResponse?.data.map((item) => (
    <PostExcerpt key={item.id} itemId={item.id}></PostExcerpt>
  ));

  if (isLoading) return <CircularIndeterminate />;
  if (isError) return <div>Error occurred {error}</div>;
  if (!itemsResponse || !Object.keys(itemsResponse).length) return <div>No posts found</div>;

  if (isSuccess) return <div className="row gy-2">{items}</div>;

  return <div>unknown response</div>;
};

const PostExcerpt = ({ itemId }: { itemId: string }) => {
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

  return (
    <div className="col-12 border rounded">
      <div className="row g-3">
        <div className="col-12">
          <Typography variant="h5">{item?.title}</Typography>
        </div>
        <div className="col-12">
          <Typography variant="h6">subtitle: {item?.subtitle}</Typography>
        </div>
        <div className="col-12">
          <Typography variant="body2">
            created: <TimeAgo timeStamp={item?.createdAt}></TimeAgo>
          </Typography>
        </div>
        <div className="col-12">category: {item?.category}</div>
      </div>
      <div className="row">
        <div className="col">
          <Typography variant="body1">{item?.description}</Typography>
        </div>
      </div>
      <div className="row">
        <div className="col-auto">
          <Typography variant="overline">
            <Link href={`/users/${item?.owner.id}`}>
              author: {item?.owner.firstName} {item?.owner.lastName}
            </Link>
          </Typography>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Divider></Divider>
        </div>
      </div>
    </div>
  );
};
