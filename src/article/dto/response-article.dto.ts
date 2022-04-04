import { IsDefined } from 'class-validator';
import { UserWithRelationsIds } from 'src/users/dto/response-user.dto';

export class ArticleResponseRootData {
  @IsDefined()
  public id: string;

  @IsDefined()
  public title: string;

  @IsDefined()
  public subtitle: string;

  @IsDefined()
  public description: string;

  @IsDefined()
  public category: string;

  @IsDefined()
  public createdAt: string;

  @IsDefined()
  public updatedAt: string;
}

export class ArticleWithRelationsIds extends ArticleResponseRootData {
  @IsDefined()
  public ownerId: string;
}

export class ArticleWithIncludedRelations extends ArticleResponseRootData {
  @IsDefined()
  public owner: UserWithRelationsIds;
}
