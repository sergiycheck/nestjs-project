import { Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { FailedAuthException } from './responses/response.exceptions';
import { ConfigService } from '@nestjs/config';
import * as cookie from 'cookie';
import { cookieValues } from './constants';

export type AuthTokenPayload = {
  username: string;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    public usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<MappedUserResponse> {
    const user = await this.usersService.findOne({ username });

    if (!user)
      throw new FailedAuthException(
        `user was not found for username ${username}`,
      );

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (user && isMatch) {
      return this.getResponseForUser(user);
    }

    throw new FailedAuthException(
      `password is incorrect for username ${username}`,
    );
  }

  getResponseForUser(user: LeanDocument<User>) {
    return this.usersService.usersResponseGetterService.userObjToPlain(user);
  }

  getAuthTokenWithItsCookie(payload: AuthTokenPayload) {
    const expiresSeconds = this.configService.get('JWT_EXPIRES_SECONDS');
    const access_token = this.jwtService.sign(payload);
    const authCookieValue = cookie.serialize(
      cookieValues.Authentication,
      String(access_token),
      {
        httpOnly: true,
        maxAge: expiresSeconds,
        path: '/',
      },
    );

    return {
      access_token,
      authCookieValue,
    };
  }

  async login(user: MappedUserResponse) {
    const payload = { username: user.username, sub: user.id };

    const { access_token, authCookieValue } =
      this.getAuthTokenWithItsCookie(payload);

    return {
      // generate JWT token
      access_token,
      userResponse: user,
      authCookieValue,
    };
  }

  getRefreshTokenAndCookieWithIt(
    username: MappedUserResponse['username'],
    id: MappedUserResponse['id'],
  ) {
    const payload = { username: username, sub: id };
    const expiresSeconds = this.configService.get(
      'REFRESH_JWT_EXPIRES_SECONDS',
    );

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_JWT_TOKEN_SECRET'),
      expiresIn: `${expiresSeconds}s`,
    });

    const refreshCookieValue = cookie.serialize(
      cookieValues.Refresh,
      String(refreshToken),
      {
        httpOnly: true,
        maxAge: expiresSeconds,
        path: '/',
      },
    );

    return {
      refreshToken,
      refreshCookieValue,
    };
  }

  getCookiesForLogOut() {
    const logOuthAuthenticatioCookieValue = cookie.serialize(
      cookieValues.Authentication,
      String(''),
      {
        httpOnly: true,
        maxAge: 0,
        path: '/',
      },
    );

    const logOuthRefreshCookieValue = cookie.serialize(
      cookieValues.Refresh,
      String(''),
      {
        httpOnly: true,
        maxAge: 0,
        path: '/',
      },
    );

    return [logOuthAuthenticatioCookieValue, logOuthRefreshCookieValue];
  }
}
