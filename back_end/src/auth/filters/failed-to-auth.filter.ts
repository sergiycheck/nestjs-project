import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { FailedAuthException } from '../responses/response.exceptions';
import { UserLoginResponse } from '../responses/responses.dto';
import { Response } from 'express';

@Catch(FailedAuthException)
export class FailedToAuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    // const status = exception.getStatus();

    // const [req, res, next] = host.getArgs();

    const message = exception.message;

    const loginResponse = new UserLoginResponse({
      message,
      successfulAuth: false,
    });

    return response.status(200).json(loginResponse);
  }
}
