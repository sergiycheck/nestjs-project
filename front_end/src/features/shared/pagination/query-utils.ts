import { QueryGetPaginationListType } from "../types";

export const getResultUrlWithParams = (
  endPointNameToSetParams: string,
  queryParams: QueryGetPaginationListType
) => {
  let urlSearchParams = "";
  if (queryParams) {
    const { limit, skip } = queryParams;
    const urlParams = new URLSearchParams();
    urlParams.set("limit", `${limit}`);
    urlParams.set("skip", `${skip}`);
    urlSearchParams = urlParams.toString();
  }
  const resultUrl = urlSearchParams
    ? `/${endPointNameToSetParams}?`.concat(urlSearchParams)
    : `/${endPointNameToSetParams}`;
  return resultUrl;
};
