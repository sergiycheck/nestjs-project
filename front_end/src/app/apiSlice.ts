import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { schemaTokenValidation } from "../features/shared/token_validator";
import { baseEndpoint } from "./api-endpoints";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseEndpoint}`,
    prepareHeaders: (headers, { getState }) => {
      const jwt_token = window.localStorage.getItem("jwt");
      if (jwt_token) {
        const { error } = schemaTokenValidation.validate(jwt_token);
        if (!Boolean(error)) {
          headers.set("Authorization", `Bearer ${jwt_token}`);
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
