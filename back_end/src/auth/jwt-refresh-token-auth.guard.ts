import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY, FOR_REFRESHING_KEY } from './constants';

@Injectable()
//associate with strategy type that is passed to AuthGuard constructor
export class JwtRefreshTokenAuthGuard extends AuthGuard('jwt-refresh-token') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isForRefreshing = this.reflector.getAllAndOverride<boolean>(
      FOR_REFRESHING_KEY,
      [context.getHandler(), context.getClass()],
    );

    if ([isPublic, isForRefreshing].includes(true)) return true;

    const superCanActivateRes = super.canActivate(context);
    return superCanActivateRes;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
