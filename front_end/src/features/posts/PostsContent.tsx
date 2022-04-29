import React from 'react';
import { Divider, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { CircularIndeterminate } from '../shared/mui-components/Loader';
import { ArticleResponseWithRelations } from './types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';
import { TimeAgo } from '../shared/TimeAgo';

export const PostsListContent = ({
  data,
  isLoading,
  isFetching,
  isError,
  isSuccess,
  error,
}: {
  data: ArticleResponseWithRelations[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}) => {
  const items = data?.map((item) => <PostExcerptContent key={item.id} item={item} />);

  if (isLoading || isFetching) return <CircularIndeterminate />;
  if (isError) return <div>Error occurred {error}</div>;
  if (!data || !Object.keys(data).length) return <div>No posts found</div>;

  if (isSuccess) return <div className="row gy-2">{items}</div>;

  return <div>unknown response</div>;
};

export const PostExcerptContent = ({
  item,
}: {
  item: ArticleResponseWithRelations | undefined;
}) => {
  return (
    <div className="col-12 border rounded">
      <div className="row g-3">
        <div className="col-12">
          <Typography variant="h5">
            <Link sx={{ fontWeight: 'inherit', fontSize: 'inherit' }} href={`/posts/${item?.id}`}>
              {item?.title}
            </Link>
          </Typography>
        </div>
        <div className="col-12">
          <Typography variant="h6">subtitle: {item?.subtitle}</Typography>
        </div>
        <div className="col-12">
          <Typography variant="body2">
            created: <TimeAgo timeStamp={item?.createdAt}></TimeAgo>
          </Typography>
        </div>
        <div className="col-12">
          category:
          <Link href={`/posts?searchText=${item?.category}`}>{item?.category}</Link>
        </div>
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
