import { QueryGetPaginationListType } from "../types";

const existingSearchParams = ["limit", "skip", "searchText"];

export function getResultUrlWithParams<QueryParamType extends QueryGetPaginationListType>(
  endPointNameToSetParams: string,
  queryParams: QueryParamType
) {
  let urlSearchParams = "";
  if (queryParams) {
    const urlParams = new URLSearchParams();
    for (let queryProp in queryParams) {
      if (existingSearchParams.includes(queryProp)) {
        const queryValue = queryParams[queryProp] as unknown as string;
        if (queryValue !== undefined) urlParams.set(queryProp, queryValue);
      }
    }

    urlSearchParams = urlParams.toString();
  }
  const resultUrl = urlSearchParams
    ? `/${endPointNameToSetParams}?`.concat(urlSearchParams)
    : `/${endPointNameToSetParams}`;
  return resultUrl;
}

export const getObjectFromSearchParams = (searchParams: URLSearchParams) => {
  const searchParamsObj: { [key: string]: string } = {};
  searchParams.forEach((value, key) => {
    searchParamsObj[`${key}`] = value;
  });
  return searchParamsObj;
};
