import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  PaginatedRequestDto,
  paginatedRequestPropsNames,
} from 'src/base/requests/requests.dto';

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
export const searchArticlePropsNames = Object.assign(
  {
    searchText: 'searchText',
    lessThanCreatedAt: 'lessThanCreatedAt',
    greaterThanCreatedAt: 'greaterThanCreatedAt',
    lessThanUpdatedAt: 'lessThanUpdatedAt',
    greaterThanUpdatedAt: 'greaterThanUpdatedAt',
  },
  paginatedRequestPropsNames,
);
