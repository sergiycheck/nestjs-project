import React from "react";
import { useParams } from "react-router-dom";
import { useGetPostWithRelationsQuery } from "./postsApi";
import { CircularIndeterminate } from "../shared/mui-components/Loader";
import { PostExcerptContent } from "./PostsContent";

export const SinglePost = () => {
  const { postId } = useParams();

  const { data, isLoading, isSuccess, isError } = useGetPostWithRelationsQuery(postId!, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <CircularIndeterminate />;

  if (!data && (isSuccess || isError)) return <div>post with id {postId} was not found</div>;

  return (
    <div className="container-md">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8">
          <PostExcerptContent item={data} />
        </div>
      </div>
    </div>
  );
};
