import { EndPointResponse } from '../responses/response.dto';

export class BaseController {
  protected getResponse<T>(successfulMessage: string, failMessage: string, res?: T) {
    if (!res) {
      return new EndPointResponse({
        message: failMessage,
      });
    }

    return new EndPointResponse<T>({
      message: successfulMessage,
      data: res,
    });
  }
}
