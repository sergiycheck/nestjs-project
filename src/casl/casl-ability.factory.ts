import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { ActionAbility } from 'src/authorization/actions.enum';
import { User } from '../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from 'src/article/dto/create-article.dto';
import { Role } from 'src/authorization/roles.enum';

type Subjects = InferSubjects<typeof CreateArticleDto | typeof User> | 'all';

export type AppAbility = Ability<[ActionAbility, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.role === Role.Admin) {
      can(ActionAbility.Manage, 'all');
    } else {
      can(ActionAbility.Read, 'all');
    }

    const userId = user._id.valueOf().toString();
    can(ActionAbility.Update, CreateArticleDto, { ownerId: { $eq: userId } });

    const buildedAbility = build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
    return buildedAbility;
  }
}
