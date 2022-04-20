import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  PaginatedRequestDto,
  paginatedRequestPropsNames,
} from '../../base/requests/requests.dto';

export class ArticleSearchQueryTextDto extends PaginatedRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public searchText?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public lessThanCreatedAt?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public greaterThanCreatedAt?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public lessThanUpdatedAt?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public greaterThanUpdatedAt?: string;
}

export const searchArticleFilterProps = {
  searchText: 'searchText',
  lessThanCreatedAt: 'lessThanCreatedAt',
  greaterThanCreatedAt: 'greaterThanCreatedAt',
  lessThanUpdatedAt: 'lessThanUpdatedAt',
  greaterThanUpdatedAt: 'greaterThanUpdatedAt',
};

export const searchArticleQueryPropsNames = {
  ...searchArticleFilterProps,
  ...paginatedRequestPropsNames,
};
