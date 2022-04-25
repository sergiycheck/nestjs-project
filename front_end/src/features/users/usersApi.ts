import { apiSlice } from "../../app/apiSlice";
import { authEndPointName, usersEndPointName } from "../../app/api-endpoints";
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  UserDeleteResult,
  UserWithIncludedRelations,
  UserWithRelationsIds,
} from "./types";
import {
  EndPointResponse,
  GetUserFromJwtResponse,
  ListResponse,
  LoginResponse,
} from "../../app/web-api.types";
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

    loginUser: builder.mutation<LoginResponse<UserWithRelationsIds>, LoginUserDto>({
      query: (body) => ({
        url: `/${authEndPointName}/login`,
        method: "POST",
        body,
      }),
    }),

    getUserFromJwt: builder.mutation<GetUserFromJwtResponse<UserWithRelationsIds>, string>({
      query: (jwt_token) => {
        const headersProvided: Record<string, string> = {
          Authorization: `Bearer ${jwt_token}`,
        };
        return {
          headers: headersProvided,
          url: `/${authEndPointName}/get-user-from-jwt`,
          method: "GET",
        };
      },
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

    getUserWithRelations: builder.query<UserWithIncludedRelations, string>({
      query: (userId) => ({
        url: `/${usersEndPointName}/with-relations/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: UserWithIncludedRelations }, meta, arg) => {
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
  useGetUserWithRelationsQuery,
  useLoginUserMutation,
  useGetUserFromJwtMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = extendedApiSlice;
