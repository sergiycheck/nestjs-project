import { Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { User } from './entities/user.entity';
import { UserMapperService } from './user-mapper.service';
import { BaseService, ToObjectContainingQuery } from '../base/services/base.service';
import { MappedUserResponse, MappedUserResponseWithRelations } from './dto/response-user.dto';

@Injectable()
export class UsersResponseGetterService extends BaseService {
  constructor(public userMapper: UserMapperService) {
    super();
  }

  public getResponse(entityQuery: ToObjectContainingQuery<User>): MappedUserResponse | null {
    if (!entityQuery) return null;

    const entityDoc = super.queryToObj(entityQuery);
    return this.userObjToPlain(entityDoc);
  }

  public userObjToPlain(user: LeanDocument<User>) {
    return this.userMapper.userToUserResponse(user) as MappedUserResponse;
  }

  public getResponseWithRelations(
    entityQuery: ToObjectContainingQuery<User>,
  ): MappedUserResponseWithRelations | null {
    if (!entityQuery) return null;

    const entityDoc = super.queryToObj(entityQuery);
    return this.userMapper.userToUserResponseWithRelations(
      entityDoc,
    ) as MappedUserResponseWithRelations;
  }
}
