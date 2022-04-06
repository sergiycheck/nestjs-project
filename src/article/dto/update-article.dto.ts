import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseEntity } from 'src/base/entities/base-entities';
import { ArticleGenre } from '../entities/article.enum';

//validators aren't executed if we extend from PartialType
export class UpdateArticleDto extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public ownerId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 400)
  public title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  public subtitle: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 5000)
  public description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ArticleGenre)
  public category: ArticleGenre;
}
