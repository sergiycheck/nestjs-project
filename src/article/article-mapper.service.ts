import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { BaseMapper } from '../base/mappers/base.mapper';
import { UserMapperService } from '../users/user-mapper.service';
import {
  ArticleWithRelationsIds,
  ArticleWithIncludedRelations,
} from './dto/response-article.dto';
import { Article } from './entities/article.entity';

//TODO: https://stackoverflow.com/questions/31776949/create-object-from-class-name-in-javasscript-ecmascript-6

@Injectable()
export class ArticleMapperService extends BaseMapper {
  constructor(
    @Inject(forwardRef(() => UserMapperService))
    private userMapper: UserMapperService,
  ) {
    super();
  }

  public articleToArticleResponse(entity: Article) {
    const obj = this.getConvertedFromJson(entity);
    const entityResp = new ArticleWithRelationsIds(obj);
    const entityResponse = instanceToPlain(entityResp);
    return entityResponse;
  }

  public articleToArticleResponseWithRelations(entity: Article) {
    const obj = this.getConvertedFromJson(entity);
    const entityResp = new ArticleWithIncludedRelations(obj);
    const entityResponse = instanceToPlain(entityResp);
    return entityResponse;
  }
}
