import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './../users/users.service';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { Request } from 'express';
import { cookieValues } from './constants';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    const configObj: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies[cookieValues.Refresh];
        },
      ]),
      secretOrKey: configService.get<string>('REFRESH_JWT_TOKEN_SECRET'),
      passReqToCallback: true,
    };
    super(configObj);
  }

  //validate is called by Mixin in super parent class
  async validate(req: Request, payload: any): Promise<MappedUserResponse> {
    const refreshToken = req.cookies['Refresh'];
    const userObj = { userId: payload.sub, username: payload.username };

    const userResponse = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      userObj.userId,
    );
    return userResponse;
  }
}
