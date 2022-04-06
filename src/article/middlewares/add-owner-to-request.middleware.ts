import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Response, NextFunction } from 'express';
import { CreateArticleDto } from '../dto/create-article.dto';
import { validate } from 'class-validator';
import { RequestWithUser } from '../types/types';

@Injectable()
export class AddOwnerToRequestMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const createArticleDto = new CreateArticleDto(req.body);

    if (!createArticleDto || Object.keys(createArticleDto).length === 0)
      return next(new BadRequestException('no article was provided'));

    const errors = await validate(createArticleDto);
    if (errors.length) {
      return next(new BadRequestException({ message: errors }));
    }

    const { ownerId } = createArticleDto;

    const user = await this.usersService.findByIdWithRelationsIds(ownerId);

    if (!user)
      return next(
        new BadRequestException({
          message: `user with id ${ownerId} does not exist`,
          ownerId,
        }),
      );

    // req.user = user;
    return next();
  }
}
