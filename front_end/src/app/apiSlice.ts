import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { schemaTokenValidation } from "../features/shared/token_validator";
import { baseEndpoint } from "./api-endpoints";
import { RootState } from "./store";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseEndpoint}`,
    prepareHeaders: (headers, { getState }) => {
      // const jwt_token = window.localStorage.getItem("jwt");
      const token = (getState() as RootState).auth.token;
      if (token) {
        const { error } = schemaTokenValidation.validate(token);
        if (!Boolean(error)) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({
    getDefaultResponse: builder.query<string, string>({
      query: () => "/",
    }),
  }),
});

export const { useGetDefaultResponseQuery } = apiSlice;
