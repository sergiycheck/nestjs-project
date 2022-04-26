import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { UserWithRelationsIds } from "../users/types";
import { extendedUserApiSlice } from "../users/usersApi";

export enum StatusData {
  loading = "loading",
  succeeded = "succeeded",
  failed = "failed",
  idle = "idle",
}

type AuthStateType = {
  user: null | UserWithRelationsIds;
  token: string | null;
  isAuthenticated: boolean;
  status: keyof typeof StatusData;
};

const initialState: AuthStateType = {
  status: StatusData.idle,
  user: null,
  token: null,
  isAuthenticated: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
    setCredentials: (
      state: AuthStateType,
      { payload: { user, token } }: PayloadAction<{ user: UserWithRelationsIds; token: string }>
    ) => {
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.status = StatusData.succeeded;
    },
    updateUserCredentials: (
      state: AuthStateType,
      { payload: { user, token } }: PayloadAction<{ user: UserWithRelationsIds; token: string }>
    ) => {
      const ifWeUpdatingCurrentUser = Boolean(
        state.isAuthenticated && user && state.user && user.id === state.user.id
      );
      if (ifWeUpdatingCurrentUser) {
        state.user = user;
        state.token = token;
      }
    },
    deleteUserCredentials: (
      state: AuthStateType,
      { payload: { userId } }: PayloadAction<{ userId: string }>
    ) => {
      const ifWeUpdatingCurrentUser = Boolean(
        state.isAuthenticated && state.user && userId === state.user.id
      );
      if (ifWeUpdatingCurrentUser) {
        Object.assign(state, initialState);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(extendedUserApiSlice.endpoints.loginUser.matchPending, (state, action) => {
        state.status = StatusData.loading;
      })
      .addMatcher(extendedUserApiSlice.endpoints.loginUser.matchFulfilled, (state, action) => {
        state.user = action.payload.userResponse;
        state.token = action.payload.user_jwt;
        state.isAuthenticated = true;
        state.status = StatusData.succeeded;
      })
      .addMatcher(extendedUserApiSlice.endpoints.loginUser.matchRejected, (state, action) => {
        state.status = StatusData.failed;
      });
  },
});

export const { logout, setCredentials, updateUserCredentials, deleteUserCredentials } =
  slice.actions;
export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthStatus = (state: RootState) => state.auth.status;
