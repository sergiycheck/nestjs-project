import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BaseService,
  ToObjectContainingQuery,
} from '../base/services/base.service';
import { ArticleMapperService } from './article-mapper.service';
import {
  MappedArticleResponse,
  MappedArticleResponseWithRelations,
} from './dto/response-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';

@Injectable()
export class ArticleResponseGetterService extends BaseService {
  constructor(
    @InjectModel(Article.name) public articleModel: Model<ArticleDocument>,
    private articleMapper: ArticleMapperService,
  ) {
    super();
  }
  public getResponse(articleQuery: ToObjectContainingQuery<Article>) {
    const articleDoc = super.queryToObj(articleQuery);
    return this.articleMapper.articleToArticleResponse(
      articleDoc,
    ) as MappedArticleResponse;
  }

  public getResponseWithRelations(
    articleQuery: ToObjectContainingQuery<Article>,
  ) {
    const articleDoc = super.queryToObj(articleQuery);
    return this.articleMapper.articleToArticleResponseWithRelations(
      articleDoc,
    ) as MappedArticleResponseWithRelations;
  }

  public getResponseWithExcludedRelations(
    articleQuery: ToObjectContainingQuery<Article>,
  ) {
    const articleDoc = super.queryToObj(articleQuery);

    return this.articleMapper.articleToArticleResponseWithExcludedRelations(
      articleDoc,
    ) as MappedArticleResponse;
  }
}
