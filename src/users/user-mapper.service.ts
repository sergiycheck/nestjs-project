import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { UserWithRelationsIds } from './dto/response-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserMapperService {
  public userToUserResponse(user: User) {
    //we have to stringify and parse because we can not map array of  buffer Object ids
    const obj = JSON.parse(JSON.stringify(user));
    const userResp = new UserWithRelationsIds(obj);
    const userResponse = instanceToPlain(userResp);
    return userResponse;
  }
}
