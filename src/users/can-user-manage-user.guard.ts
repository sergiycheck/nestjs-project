import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { GetUserFromReqInner } from '../base/decorators/get-user-from-req.decorator';

@Injectable()
export class CanUserManageUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = GetUserFromReqInner(context);
    const userIdFromBearerToken = user.id;
    const userId = request.params['id'] as string;

    if (userIdFromBearerToken !== userId) {
      throw new UnauthorizedException(
        `user with id ${userIdFromBearerToken} is not authorized to delete user with id ${userId}`,
      );
    }
    return true;
  }
}
