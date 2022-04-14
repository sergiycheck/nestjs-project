import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ArticleSearchText {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public searchText: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public limit: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public skip: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public lessThanCreatedAt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public greaterThanCreatedAt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public lessThanUpdatedAt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  public greaterThanUpdatedAt: string;
}
export const searchArticlePropsNames = {
  searchText: 'searchText',
  limit: 'limit',
  skip: 'skip',
  lessThanCreatedAt: 'lessThanCreatedAt',
  greaterThanCreatedAt: 'greaterThanCreatedAt',
  lessThanUpdatedAt: 'lessThanUpdatedAt',
  greaterThanUpdatedAt: 'greaterThanUpdatedAt',
};
