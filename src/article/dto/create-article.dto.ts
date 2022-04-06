import { Length, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { BaseEntity } from 'src/base/entities/base-entities';
import { ArticleGenre } from '../entities/article.enum';

export class CreateArticleDto extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @Length(5, 400)
  public title: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  public subtitle: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 5000)
  public description: string;

  @IsNotEmpty()
  @IsEnum(ArticleGenre)
  public category: ArticleGenre;

  @IsNotEmpty()
  @IsString()
  public ownerId: string;
}
