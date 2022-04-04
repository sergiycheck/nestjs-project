import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleMapperService } from './article-mapper.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private articleMapper: ArticleMapperService,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    return `this method creates article ${JSON.stringify(createArticleDto)}`;
  }

  findAll() {
    return `this action gets all articles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article ${JSON.stringify(
      updateArticleDto,
    )}`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
