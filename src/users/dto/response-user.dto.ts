import { Exclude, Expose, Type } from 'class-transformer';
import { ArticleWithRelationsIds } from '../../article/dto/response-article.dto';
import { BaseEntity } from '../../base/entities/base-entities';

class UserResponseRootData extends BaseEntity {
  @Expose({ name: 'id' })
  public _id: string;

  public username: string;

  public firstName: string;

  public lastName: string;

  @Exclude()
  public passwordHash: string;

  public role: string;

  public createdAt: string;

  public numberOfArticles: string;
}

export class UserWithRelationsIds extends UserResponseRootData {
  @Expose({ name: 'articleIds' })
  public articles: string[];
}

export class UserWithIncludedRelations extends UserResponseRootData {
  @Type(() => ArticleWithRelationsIds)
  public articles: ArticleWithRelationsIds[];
}

@Exclude()
export class UserWithExcludedProps extends UserResponseRootData {}

class UserNonChangeableData extends BaseEntity {
  public username: string;
  public firstName: string;
  public lastName: string;
  public role: string;
  public createdAt: string;
  public numberOfArticles: string;
}

export class MappedUserResponse extends UserNonChangeableData {
  public id: string;
  public articleIds: string[];
}

export class MappedUserResponseWithRelations extends UserNonChangeableData {
  public id: string;
  public articles: ArticleWithRelationsIds[];
}

export type UserDeleteResult = {
  userId: string;
  acknowledged: boolean;
  deletedCount: number;
};
