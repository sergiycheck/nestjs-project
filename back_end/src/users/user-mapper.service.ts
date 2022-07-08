import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { ArticleMapperService } from '../article/article-mapper.service';
import { BaseMapper } from '../base/mappers/base.mapper';
import { UserWithRelationsIds, UserWithIncludedRelations } from './dto/response-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserMapperService extends BaseMapper {
  constructor(
    @Inject(forwardRef(() => ArticleMapperService))
    private articleMapper: ArticleMapperService,
  ) {
    super();
  }

  public userToUserResponse(user: User) {
    const obj = this.getConvertedFromJson(user);
    const userResp = new UserWithRelationsIds(obj);
    const userResponse = instanceToPlain(userResp);

    return userResponse;
  }

  public userToUserResponseWithRelations(user: User) {
    const obj = this.getConvertedFromJson(user) as User;
    const userResp = new UserWithIncludedRelations(obj);
    const userResponse = instanceToPlain(userResp);
    return userResponse;
  }
}
