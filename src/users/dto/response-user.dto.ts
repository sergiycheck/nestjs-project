import { Expose, Type } from 'class-transformer';
import { IsDefined } from 'class-validator';
import mongoose from 'mongoose';
import { ArticleResponseRootData } from 'src/article/dto/response-article.dto';
import { BaseEntity } from 'src/base/entities/base-entities';

class UserResponseRootData extends BaseEntity {
  @Expose({ name: 'id' })
  @IsDefined()
  public _id: string;

  @IsDefined()
  public username: string;

  @IsDefined()
  public firstName: string;

  @IsDefined()
  public lastName: string;

  @IsDefined()
  public role: string;

  @IsDefined()
  public createdAt: string;

  @IsDefined()
  public numberOfArticles: string;
}

export class UserWithRelationsIds extends UserResponseRootData {
  @Expose({ name: 'articleIds' })
  @IsDefined()
  public articles: string[];

  constructor(attrs: any) {
    super(attrs);
  }
}

export class UserWithIncludedRelations extends UserResponseRootData {
  @IsDefined()
  public articles: ArticleResponseRootData[];

  constructor(attrs: any) {
    super(attrs);
  }
}
