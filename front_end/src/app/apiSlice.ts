import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseEndpoint } from "./api-endpoints";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndpoint}` }),
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({
    getDefaultResponse: builder.query<string, string>({
      query: () => "/",
    }),
  }),
});

export const { useGetDefaultResponseQuery } = apiSlice;
