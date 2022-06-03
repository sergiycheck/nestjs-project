import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './../users/users.service';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { FailedAuthException } from './responses/response.exceptions';
import { Request } from 'express';
import { cookieValues } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService, private configService: ConfigService) {
    const configObj: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies[cookieValues.Authentication];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('PRIVATE_JWT_KEY'),
      passReqToCallback: true,
    };
    super(configObj);
  }

  async validate(req: Request, payload: any): Promise<MappedUserResponse> {
    const userObj = { userId: payload.sub, username: payload.username };

    const user = await this.usersService.findOne({
      username: userObj.username,
    });

    if (!user) {
      throw new FailedAuthException(`user with username ${userObj.username} was not found`);
    }
    const userResponse = this.usersService.usersResponseGetterService.userObjToPlain(user);
    return userResponse;
  }
}
