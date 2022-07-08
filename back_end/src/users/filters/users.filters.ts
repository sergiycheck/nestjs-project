import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';
import { UsernameIsNotAccessibleException } from '../dto/exceptions/username-accessible.dto';
import { Response } from 'express';
import { isUsernameAccessible } from '../dto/response-user.dto';

@Catch(UsernameIsNotAccessibleException)
export class UsernameIsNotAccessibleFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = exception.message;

    return response.status(200).json(new isUsernameAccessible({ isAccessible: false, message }));
  }
}
