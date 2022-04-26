import { apiSlice } from "../../app/apiSlice";
import { EndPointResponse, ListResponse } from "../../app/web-api.types";
import { getResultUrlWithParams } from "../shared/pagination/query-utils";
import { QueryGetPaginationListType } from "../shared/types";
import { ArticleResponse, ArticleResponseWithRelations } from "./types";
import { postsEndPointName } from "../../app/api-endpoints";
import { providesList } from "../../app/rtk-query-utils";

const extendedPostsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<ListResponse<ArticleResponseWithRelations>, QueryGetPaginationListType>(
      {
        query: (queryParams: QueryGetPaginationListType) => {
          const resultUrl = getResultUrlWithParams(postsEndPointName, queryParams);
          return {
            url: resultUrl,
            method: "GET",
          };
        },
        transformResponse: (
          response: EndPointResponse<ListResponse<ArticleResponseWithRelations>>,
          meta,
          arg
        ) => {
          return response.data;
        },
        providesTags: (result, error, id) => providesList(result!.data, "Post"),
      }
    ),

    getPost: builder.query<ArticleResponse, string>({
      query: (postId) => ({
        url: `/${postsEndPointName}/${postId}`,
        method: "GET",
      }),
      transformResponse: (response: EndPointResponse<ArticleResponse>, meta, arg) => response.data,
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),
  }),
});

export const { useGetPostsQuery, useGetPostQuery } = extendedPostsApiSlice;
