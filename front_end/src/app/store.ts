import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { loggerMiddleware } from "./middewares";
import { apiSlice } from "./apiSlice";
import usersQueryPropsReducer from "../features/users/usersApi";

export const store = configureStore({
  reducer: {
    usersQueryProps: usersQueryPropsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(loggerMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
