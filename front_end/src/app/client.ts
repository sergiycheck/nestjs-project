import { logmMiddleware } from "./middewares";

export async function client(endpoint: string, { body, ...customConfig }: any = {}) {
  const headers = { "Content-Type": "application/json" };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  logmMiddleware("client config", config);
  logmMiddleware("client endpoint", endpoint);

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    console.error("An error occurred", err);
    return Promise.reject(err.message ? err.message : data);
  }
}

client.get = function (endpoint: string, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" });
};

client.post = function (endpoint: string, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, body });
};

client.update = function (endpoint: string, body: any, customConfig = {}) {
  return client(endpoint, { method: "PATCH", ...customConfig, body });
};

client.delete = function (endpoint: string, customConfig = {}) {
  return client(endpoint, { method: "DELETE", ...customConfig });
};
