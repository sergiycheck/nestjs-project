import { apiSlice } from "../../app/apiSlice";
import { EndPointResponse, ListResponse } from "../../app/web-api.types";
import { getResultUrlWithParams } from "../shared/pagination/query-utils";
import { QueryGetPaginationListType } from "../shared/types";
import { ArticleResponseWithRelations } from "./types";
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
  }),
});

export const { useGetPostsQuery } = extendedPostsApiSlice;
