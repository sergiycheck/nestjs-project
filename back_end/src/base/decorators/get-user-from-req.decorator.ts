import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../article/types/types';

export const GetUserFromReqInner = (ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as RequestWithUser;
  const { user } = req;
  return user;
};

export const GetUserFromReqDec = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return GetUserFromReqInner(ctx);
});
