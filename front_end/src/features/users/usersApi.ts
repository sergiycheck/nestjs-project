import { apiSlice } from "../../app/apiSlice";
import { usersEndPointName } from "../../app/api-endpoints";
import { CreateUserDto, UpdateUserDto, UserDeleteResult, UserWithRelationsIds } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { EndPointResponse, ListResponse } from "../../app/web-api.types";
import { providesList } from "../../app/rtk-query-utils";

type QueryGetUsersType = { limit: number | null; skip: number | null };
type UsersQueryPropsInitialStateType = { name: string } & {
  getUsersQueryParams: QueryGetUsersType;
};

const increment = 5;
const initialSkip = 0;

export const usersQueryPropsInitialState: UsersQueryPropsInitialStateType = {
  name: "usersQueryProps",
  getUsersQueryParams: { limit: increment, skip: initialSkip },
};

export const usersQueryPropsReducer = createSlice({
  name: usersQueryPropsInitialState.name,
  initialState: usersQueryPropsInitialState,
  reducers: {
    setGetUsersQueryParams: (
      state: UsersQueryPropsInitialStateType,
      action: PayloadAction<QueryGetUsersType>
    ) => {
      state.getUsersQueryParams = {
        ...state.getUsersQueryParams,
        ...action.payload,
      };
    },
  },
});

export default usersQueryPropsReducer.reducer;
export const { setGetUsersQueryParams } = usersQueryPropsReducer.actions;
export const selectGetUsersQueryParams = (state: RootState) =>
  state.usersQueryProps.getUsersQueryParams;

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ListResponse<UserWithRelationsIds>, QueryGetUsersType>({
      query: (queryParams: QueryGetUsersType) => {
        let urlSearchParams = "";
        if (queryParams) {
          const { limit, skip } = queryParams;
          const urlParams = new URLSearchParams();
          urlParams.set("limit", `${limit}`);
          urlParams.set("skip", `${skip}`);
          urlSearchParams = urlParams.toString();
        }

        const resultUrl = urlSearchParams
          ? `/${usersEndPointName}?`.concat(urlSearchParams)
          : `/${usersEndPointName}`;
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
