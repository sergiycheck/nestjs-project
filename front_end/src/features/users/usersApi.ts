import { apiSlice } from "../../app/apiSlice";
import { usersEndPointName } from "../../app/api-endpoints";
import { CreateUserDto, UpdateUserDto, UserDeleteResult, UserWithRelationsIds } from "./types";
import { EndPointResponse, ListResponse } from "../../app/web-api.types";
import { providesList } from "../../app/rtk-query-utils";
import { QueryGetPaginationListType } from "../shared/types";
import { getResultUrlWithParams } from "../shared/pagination/query-utils";

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ListResponse<UserWithRelationsIds>, QueryGetPaginationListType>({
      query: (queryParams: QueryGetPaginationListType) => {
        const resultUrl = getResultUrlWithParams(usersEndPointName, queryParams);
        return {
          url: resultUrl,
          method: "GET",
        };
      },
      transformResponse: (
        response: EndPointResponse<ListResponse<UserWithRelationsIds>>,
        meta,
        arg
      ) => {
        return response.data;
      },
      providesTags: (result, error, id) => providesList(result!.data, "User"),
    }),
    addUser: builder.mutation<EndPointResponse<UserWithRelationsIds>, CreateUserDto>({
      query: (body) => ({
        url: `/${usersEndPointName}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getUser: builder.query<UserWithRelationsIds, string>({
      query: (userId) => ({
        url: `/${usersEndPointName}/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: UserWithRelationsIds }, meta, arg) => {
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUser: builder.mutation<EndPointResponse<UserWithRelationsIds>, UpdateUserDto>({
      query: (data) => {
        return {
          url: `/${usersEndPointName}/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "User", id: "LIST" }],
    }),

    deleteUser: builder.mutation<EndPointResponse<UserDeleteResult>, string>({
      query: (userId) => ({
        url: `/${usersEndPointName}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = extendedApiSlice;
