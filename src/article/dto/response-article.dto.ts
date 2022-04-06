import { UserWithRelationsIds } from 'src/users/dto/response-user.dto';
import { Expose, Type } from 'class-transformer';
import { BaseEntity } from 'src/base/entities/base-entities';

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
