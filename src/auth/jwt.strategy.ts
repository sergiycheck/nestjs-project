import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PRIVATE_JWT_KEY } from './constants';
import { UsersService } from './../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    const configObj = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: PRIVATE_JWT_KEY,
    };
    super(configObj);
  }

  async validate(payload: any) {
    const userObj = { userId: payload.sub, username: payload.username };

    const user = await this.usersService.findOne({
      username: userObj.username,
    });

    if (!user) {
      throw new NotFoundException(
        `user with username ${userObj.username} is not found`,
      );
    }
    return user;
  }
}
