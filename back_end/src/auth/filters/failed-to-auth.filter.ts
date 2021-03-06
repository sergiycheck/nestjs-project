import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';
import { FailedAuthException } from '../responses/response.exceptions';
import { UserLoginResponse } from '../responses/responses.dto';
import { Response } from 'express';

@Catch(FailedAuthException)
export class FailedToAuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = exception.message;

    const loginResponse = new UserLoginResponse({
      message,
      successfulAuth: false,
    });

    return response.status(403).json(loginResponse);
  }
}
