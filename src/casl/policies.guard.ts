import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';
import { PolicyHandler } from './policy-handler';
import { CHECK_POLICIES_KEY } from './check-policies.decorat';
import { User } from 'src/users/entities/user.entity';
import { CreateArticleDto } from 'src/article/dto/create-article.dto';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user: user0, body } = context.switchToHttp().getRequest();

    const user = new User(user0);
    const article = new CreateArticleDto(body);

    const ability = this.caslAbilityFactory.createForUser(user);

    const policiesHandlersRes = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, article),
    );

    return policiesHandlersRes;
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    article: CreateArticleDto,
  ) {
    if (typeof handler === 'function') {
      const abilityFuncRes = handler(ability);
      return abilityFuncRes;
    }

    const abilityHandlerRes = handler.handle(ability, article);
    return abilityHandlerRes;
  }
}
