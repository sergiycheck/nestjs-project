import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './../users/users.service';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { FailedAuthException } from './responses/response.exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    const configObj = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('PRIVATE_JWT_KEY'),
    };
    super(configObj);
  }

  async validate(payload: any): Promise<MappedUserResponse> {
    const userObj = { userId: payload.sub, username: payload.username };

    const user = await this.usersService.findOne({
      username: userObj.username,
    });

    if (!user) {
      throw new FailedAuthException(
        `user with username ${userObj.username} was not found`,
      );
    }
    const userResponse =
      this.usersService.usersResponseGetterService.userObjToPlain(user);
    return userResponse;
  }
}
