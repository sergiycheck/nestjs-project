import { apiSlice } from "../../app/apiSlice";
import { usersEndPointName } from "../../app/api-endpoints";
import { CreateUserDto, UpdateUserDto, UserDeleteResult, UserWithRelationsIds } from "./types";
import { createEntityAdapter, createSelector, EntityState } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { EndPointResponse } from "../../app/web-api.types";

const usersAdapter = createEntityAdapter<UserWithRelationsIds>();

const initialState = usersAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<UserWithRelationsIds>, void>({
      query: () => ({
        url: `/${usersEndPointName}`,
        method: "GET",
      }),
      transformResponse: (response: { data: UserWithRelationsIds[] }, meta, arg) => {
        return usersAdapter.upsertMany(initialState, response.data);
      },
      providesTags: (result, error, id) =>
        result
          ? //successful query
            [
              ...Object.values(result).map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : // error occurred
            [{ type: "User", id: "LIST" }],
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

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select();

export const selectUsersData = createSelector(selectUsersResult, (usersResult) => {
  return usersResult.data;
});

export const {
  selectAll: selectAllUsers,
  selectIds: selectUserIds,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state: RootState) => {
  const usersSelected = selectUsersData(state) ?? initialState;
  return usersSelected;
});