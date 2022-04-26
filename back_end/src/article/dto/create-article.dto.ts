import {
  Length,
  IsNotEmpty,
  IsString,
  IsEnum,
  Validate,
} from 'class-validator';
import { BaseEntity } from '../../base/entities/base-entities';
import { ArticleGenre } from '../entities/article.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsPropObjectId } from './is-prop-objectid.validator';

//use plugin for swagger instead of manually defining api types
export class CreateArticleDto extends BaseEntity {
  @ApiProperty({
    description: 'title of the article',
    minLength: 5,
    maxLength: 400,
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 400)
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  public subtitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5, 5000)
  public description: string;

  @ApiProperty({ enum: ArticleGenre })
  @IsNotEmpty()
  @IsEnum(ArticleGenre)
  public category: ArticleGenre;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsPropObjectId)
  public ownerId: string;
}
