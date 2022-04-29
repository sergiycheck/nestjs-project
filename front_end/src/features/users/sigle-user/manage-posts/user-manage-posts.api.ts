import { apiSlice } from "./../../../../app/apiSlice";
import { EndPointResponse } from "./../../../../app/web-api.types";
import {
  CreateArticleResponse,
  CreatePostReqType,
  ArticleDeleteResponse,
  UpdatePostReqType,
} from "./types";
import { postsEndPointName } from "../../../../app/api-endpoints";
import { ArticleResponse } from "../../../posts/types";

const extendedUserManagePostsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //add new post to user posts
    // and all posts lists
    addPost: builder.mutation<EndPointResponse<CreateArticleResponse>, CreatePostReqType>({
      query: (newPost) => {
        return {
          url: `/${postsEndPointName}`,
          method: "POST",
          body: newPost,
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "User", id: args.ownerId },
        { type: "Post", id: "LIST" },
      ],
    }),

    deletePost: builder.mutation<
      EndPointResponse<ArticleDeleteResponse>,
      { postId: string; ownerId: string }
    >({
      query: (arg) => ({
        url: `/${postsEndPointName}/${arg.postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "User", id: args.ownerId },
        { type: "Post", id: "LIST" },
      ],
    }),

    updatePost: builder.mutation<EndPointResponse<ArticleResponse>, UpdatePostReqType>({
      query: (arg) => ({
        url: `/${postsEndPointName}/${arg.id}`,
        method: "PATCH",
        body: arg,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "User", id: args.ownerId },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
});

export const { useAddPostMutation, useDeletePostMutation, useUpdatePostMutation } =
  extendedUserManagePostsApi;
