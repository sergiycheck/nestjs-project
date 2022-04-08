import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { ArticleId } from '../dto/update-article.dto';
import { ArticleService } from '../article.service';

//user will be added to request later, after middleware
@Injectable()
export class CheckIfUserPossessesArticleMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly articleService: ArticleService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const articleIdParam = req.params['id'];

    const articleId = new ArticleId({ id: articleIdParam });
    const errors = await validate(articleId);
    if (errors.length) {
      return next(new BadRequestException({ message: errors }));
    }

    const article = await this.articleService.findByIdWithRelationsIds(
      articleId.id,
    );
    if (!article || !Object.keys(article).length) {
      return next(
        new BadRequestException({
          message: `article with id ${articleId} was not found`,
        }),
      );
    }

    const { ownerId } = article;

    const userFromArticle = await this.usersService.findByIdWithRelationsIds(
      ownerId,
    );

    if (!userFromArticle)
      return next(
        new BadRequestException({
          message: `userFromArticle with id ${ownerId} does not exist`,
          ownerId,
        }),
      );

    const articleFromUserArticlesArr = userFromArticle.articleIds.find(
      (articleId) => articleId === article.id,
    );

    if (!articleFromUserArticlesArr) {
      return next(
        new BadRequestException({
          message: `user ${userFromArticle.username} does not possess article with id ${article.id}`,
        }),
      );
    }

    return next();
  }
}
