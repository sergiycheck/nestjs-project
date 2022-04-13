import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { GetUserFromReqInner } from '../base/decorators/get-user-from-req.decorator';
import { UsersService } from '../users/users.service';

@Injectable()
export class CanUserManageArticleGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    const userFromBearerToken = GetUserFromReqInner(context);

    const articleId = request.params['id'] as string;

    const userFromDb = await this.usersService.findByIdWithRelationsIds(
      userFromBearerToken.id,
    );

    if (!userFromDb.articleIds.includes(articleId)) {
      throw new UnauthorizedException(
        `user with username ${userFromDb.username} is not authorized to manage article with id ${articleId}`,
      );
    }
    return true;
  }
}
