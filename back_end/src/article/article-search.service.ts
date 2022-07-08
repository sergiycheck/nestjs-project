import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/services/base.service';
import { MappedArticleResponseWithRelations } from './dto/response-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';
import { ArticleSearchQueryTextDto, searchArticleFilterProps } from './dto/article-requests.dto';
import { PaginatedResponseDto } from '../base/responses/response.dto';
import * as _ from 'lodash';
import { ArticleResponseGetterService } from './article-response-getter.service';

@Injectable()
export class ArticleSearchService extends BaseService {
  constructor(
    @InjectModel(Article.name) public articleModel: Model<ArticleDocument>,
    private articleResponseGetterService: ArticleResponseGetterService,
  ) {
    super();
  }

  async findAll(
    requestQuery: ArticleSearchQueryTextDto,
  ): Promise<PaginatedResponseDto<MappedArticleResponseWithRelations[]>> {
    let resultQueryFromDb;
    let totalDocsInDbForQuery;

    if (requestQuery && Object.keys(requestQuery).length) {
      const requestQueryFilterKeysPresent = _.intersection(
        Object.keys(requestQuery),
        Object.keys(searchArticleFilterProps),
      );

      const findArgsArr = this.getFindArgsArr(requestQuery);
      const [query, projection, options] = findArgsArr;

      const requestQueryIncludesSearchTextProp = Boolean(
        requestQueryFilterKeysPresent.includes(searchArticleFilterProps.searchText),
      );
      const requestQueryIncludesAnyFilterProp = Boolean(requestQueryFilterKeysPresent.length);

      if (requestQueryIncludesSearchTextProp) {
        resultQueryFromDb = await this.articleModel
          .find(...findArgsArr)
          .sort({ score: { $meta: 'textScore' } })
          .populate({ path: 'owner' })
          .exec();
        totalDocsInDbForQuery = await this.articleModel.count(query);
      } else if (requestQueryIncludesAnyFilterProp) {
        resultQueryFromDb = await this.articleModel
          .find(...findArgsArr)
          .sort({ _id: 'desc' })
          .populate({ path: 'owner' })
          .exec();
        totalDocsInDbForQuery = await this.articleModel.count(query);
      } else {
        //request query does not include any filter prop only options
        resultQueryFromDb = await this.articleModel
          .find(...findArgsArr)
          .sort({ _id: 'desc' })
          .populate({ path: 'owner' })
          .exec();
        totalDocsInDbForQuery = await this.articleModel.estimatedDocumentCount();
      }
    } else {
      resultQueryFromDb = await this.articleModel
        .find({})
        .sort({ _id: 'desc' })
        .populate({ path: 'owner' })
        .exec();
      totalDocsInDbForQuery = await this.articleModel.estimatedDocumentCount();
    }

    const { total_pages, per_page, page, total } = this.getPaginatedProps(
      totalDocsInDbForQuery,
      requestQuery,
    );

    //losing this if we pass only method call
    const resArr = resultQueryFromDb.map((resQuery) =>
      this.articleResponseGetterService.getResponseWithRelations(resQuery),
    ) as MappedArticleResponseWithRelations[];

    return {
      page,
      per_page,
      total,
      total_pages,
      data: resArr,
    };
  }
}
