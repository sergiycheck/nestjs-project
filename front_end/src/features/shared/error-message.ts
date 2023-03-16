export function getErrorMessageFromReduxError(error: any) {
  let msg: string = 'An error occured';
  if (typeof error === 'object' && typeof error.error === 'string') {
    msg = error.error;
  }

  return msg;
}
