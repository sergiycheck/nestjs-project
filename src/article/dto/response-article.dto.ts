import {
  MappedUserResponse,
  UserWithRelationsIds,
  UserWithExcludedProps,
} from '../../users/dto/response-user.dto';
import { Expose, Type } from 'class-transformer';
import { BaseEntity } from '../../base/entities/base-entities';

export class ArticleResponseRootData extends BaseEntity {
  @Expose({ name: 'id' })
  public _id: string;

  public title: string;

  public subtitle: string;

  public description: string;

  public category: string;

  public createdAt: string;

  public updatedAt: string;
}

export class ArticleWithRelationsIds extends ArticleResponseRootData {
  @Expose({ name: 'ownerId' })
  public owner: string;
}

export class ArticleWithIncludedRelations extends ArticleResponseRootData {
  @Type(() => UserWithRelationsIds)
  public owner: UserWithRelationsIds;
}

export class ArticleWithRelationsIdsExcludedUserProps extends ArticleResponseRootData {
  @Expose({ name: 'ownerId' })
  @Type(() => UserWithExcludedProps)
  public owner: UserWithExcludedProps;
}

class ArticleNonChangeableData extends BaseEntity {
  public title: string;
  public subtitle: string;
  public description: string;
  public category: string;
  public createdAt: string;
  public updatedAt: string;
}

export class MappedArticleResponse extends ArticleNonChangeableData {
  public id: string;
  public ownerId: string;
}

export class MappedArticleResponseWithRelations extends ArticleNonChangeableData {
  public id: string;
  public owner: MappedUserResponse;
}

export type CreateArticleResponse = {
  updatedUser: MappedUserResponse;
  newArticle: MappedArticleResponse;
};

export type ArticleDeleteResult = {
  articleId: string;
  updatedUser: MappedUserResponse;
  acknowledged: boolean;
  deletedCount: number;
};
