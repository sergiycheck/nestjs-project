import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../article/types/types';

export const GetUserFromReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as RequestWithUser;
    const { user } = req;
    return user ?? user;
  },
);
