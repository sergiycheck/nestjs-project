import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { RequestWithUser } from '../types/types';
import { UpdateArticleDto } from './../dto/update-article.dto';

@Injectable()
export class CheckIfUserPossessesArticleMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const articleDto = new UpdateArticleDto(req.body);

    const errors = await validate(articleDto);
    if (errors.length) {
      return next(new BadRequestException({ message: errors }));
    }

    const { ownerId } = articleDto;

    const user = await this.usersService.findByIdWithRelationsIds(ownerId);

    if (!user)
      return next(
        new BadRequestException({
          message: `user with id ${ownerId} does not exist`,
          ownerId,
        }),
      );

    const articleFromUserArticlesArr = user.articles.find(
      (a) => a._id.valueOf().toString() === articleDto.id,
    );

    if (!articleFromUserArticlesArr) {
      return next(
        new BadRequestException({
          message: `user ${user.username} does not possess article with id ${articleDto.id}`,
        }),
      );
    }

    //user is added by jwt auth guard
    // req.user = user;
    return next();
  }
}
