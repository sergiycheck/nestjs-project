import { Length, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { BaseEntity } from '../../base/entities/base-entities';
import { ArticleGenre } from '../entities/article.enum';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsString()
  public ownerId: string;
}
