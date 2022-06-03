import { InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';
import {
  ArticleSearchQueryTextDto,
  searchArticleQueryPropsNames,
} from '../../article/dto/article-requests.dto';
import { PaginatedRequestDto, paginatedRequestPropsNames } from '../requests/requests.dto';

export type ToObjectContainingQuery<T> = {
  toObject: (args: mongoose.ToObjectOptions) => mongoose.LeanDocument<T>;
};

export class BaseService {
  protected queryToObj<T>(query: ToObjectContainingQuery<T>) {
    if (!query)
      throw new InternalServerErrorException('query was not provided for calling toObject method');

    return query.toObject({
      getters: true,
      virtuals: true,
      versionKey: false,
      flattenMaps: true,
    });
  }

  private getInitialFindArgs() {
    const query = {} as any;
    const projection = null;
    const options = {} as any;

    return { query, projection, options };
  }

  private getComputedLimit(requestQuery: PaginatedRequestDto, queryProp: string): number {
    const defaultLimitValue = Number(Reflect.getMetadata('limit', requestQuery, 'limit'));
    const resultLimit = requestQuery[queryProp] ? requestQuery[queryProp] : defaultLimitValue;

    return resultLimit;
  }

  protected getFindArgsArr(requestQuery: ArticleSearchQueryTextDto) {
    const { query, projection, options } = this.getInitialFindArgs();
    for (const queryProp in requestQuery) {
      switch (queryProp) {
        case searchArticleQueryPropsNames.searchText:
          query['$text'] = { $search: requestQuery[queryProp] };
          break;
        case searchArticleQueryPropsNames.lessThanCreatedAt:
          query['createdAt'] = { $lte: requestQuery[queryProp] };
          break;
        case searchArticleQueryPropsNames.greaterThanCreatedAt:
          query['createdAt'] = { $gte: requestQuery[queryProp] };
          break;
        case searchArticleQueryPropsNames.lessThanUpdatedAt:
          query['updatedAt'] = { $lte: requestQuery[queryProp] };
          break;
        case searchArticleQueryPropsNames.greaterThanUpdatedAt:
          query['updatedAt'] = { $gte: requestQuery[queryProp] };
          break;
        case searchArticleQueryPropsNames.limit:
          const resultLimit = this.getComputedLimit(requestQuery, queryProp);
          options['limit'] = resultLimit;
          break;
        case searchArticleQueryPropsNames.skip:
          options['skip'] = requestQuery[queryProp];
          break;

        default:
          break;
      }
    }
    return [query, projection, options];
  }

  protected getFindArgsArrUsers(requestQuery: PaginatedRequestDto) {
    const { query, projection, options } = this.getInitialFindArgs();

    for (const queryProp in requestQuery) {
      switch (queryProp) {
        case paginatedRequestPropsNames.limit:
          const resultLimit = this.getComputedLimit(requestQuery, queryProp);
          options['limit'] = resultLimit;
          break;
        case paginatedRequestPropsNames.skip:
          options['skip'] = requestQuery[queryProp];
          break;

        default:
          break;
      }
    }
    return [query, projection, options];
  }

  protected getPaginatedProps(total: number, requestQuery: PaginatedRequestDto) {
    const defaultLimitValue = Number(Reflect.getMetadata('limit', requestQuery, 'limit'));

    const total_pages = requestQuery.limit
      ? Math.ceil(total / requestQuery.limit)
      : Math.ceil(total / defaultLimitValue);

    const per_page = requestQuery.limit ? requestQuery.limit : defaultLimitValue;

    const defaultSkipValue = Number(Reflect.getMetadata('skip', requestQuery, 'skip'));
    const computedSkip = requestQuery.skip ?? defaultSkipValue;

    const page = Math.floor(computedSkip / per_page) + 1;

    return {
      total,
      total_pages,
      per_page,
      page,
    };
  }
}
