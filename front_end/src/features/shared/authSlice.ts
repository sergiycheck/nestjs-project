import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../app/store";
import { UserWithRelationsIds } from "../users/types";
import { extendedUserApiSlice } from "../users/usersApi";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
} as { user: null | UserWithRelationsIds; token: string | null; isAuthenticated: boolean };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(extendedUserApiSlice.endpoints.loginUser.matchPending, (state, action) => {
        console.log("pending", action);
      })
      .addMatcher(extendedUserApiSlice.endpoints.loginUser.matchFulfilled, (state, action) => {
        console.log("fulfilled", action);
        state.user = action.payload.userResponse;
        state.token = action.payload.user_jwt;
      })
      .addMatcher(extendedUserApiSlice.endpoints.loginUser.matchRejected, (state, action) => {
        console.log("rejected", action);
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;

// export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
