const protocol = "http";
const host = process.env.REACT_APP_WEB_API_HOST;
const port = "3027";
export const baseEndpoint = `${protocol}://${host}:${port}`;

export const usersEndPointName = "users";

export const postsEndPointName = "articles";

export const authEndPointName = "auth";
