import { Middleware } from 'redux';

export const loggerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  logmMiddleware('dispatching', action);
  let result = next(action);
  logmMiddleware('next state', storeAPI.getState());
  return result;
};

export const logmMiddleware = (...args: unknown[]) => {
  if (process.env.REACT_APP_LOGGING === 'log') {
    console.log(...args);
  }
};
export const logm = (...args: unknown[]) => {
  if (process.env.REACT_APP_LOGGING === 'log') {
    console.log('----------------------------- ', ...args, '-------------------------');
  }
};
