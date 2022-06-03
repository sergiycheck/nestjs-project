import { JwtAuthGuard } from './jwt-auth.guard';
import { Controller, Get, Post, Res, UseFilters } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Public, ForRefreshingPublic } from './metadata.decorators';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { GetUserFromReqDec } from '../base/decorators/get-user-from-req.decorator';
import { UserAuthResponse, UserLoginResponse } from './responses/responses.dto';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/auth.dto';
import { AuthEndPoint } from '../api/endpoints';
import { FailedToAuthExceptionFilter } from './filters/failed-to-auth.filter';
import { Response } from 'express';

// TODO: remove for testing
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

@UseFilters(FailedToAuthExceptionFilter)
@ApiTags(AuthEndPoint)
@Controller(AuthEndPoint)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginAuthDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUserFromReqDec() user: MappedUserResponse, @Res() response: Response) {
    const { access_token, userResponse, authCookieValue } = await this.authService.login(user);

    const { refreshToken, refreshCookieValue } = this.authService.getRefreshTokenAndCookieWithIt(
      userResponse.username,
      userResponse.id,
    );

    await this.authService.usersService.setRefreshToken(refreshToken, userResponse.id);

    response.setHeader('Set-Cookie', [authCookieValue, refreshCookieValue]);

    response.status(201).json(
      new UserLoginResponse({
        message: 'successfully logged in',
        user_jwt: access_token,
        userResponse,
        successfulAuth: true,
      }),
    );
  }

  @ApiCookieAuth()
  @Get('get-user-from-jwt')
  async getUserFromJwt(@GetUserFromReqDec() user: MappedUserResponse) {
    await sleep(1000);
    return new UserAuthResponse({
      message: 'user was found from jwt',
      successfulAuth: true,
      userResponse: user,
    });
  }

  @ForRefreshingPublic()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Get('refresh-token-get-user')
  async refreshToken(@GetUserFromReqDec() user: MappedUserResponse, @Res() res: Response) {
    const { refreshCookieValue } = this.authService.getRefreshTokenAndCookieWithIt(
      user.username,
      user.id,
    );

    const { authCookieValue } = this.authService.getAuthTokenWithItsCookie({
      username: user.username,
      sub: user.id,
    });

    res.setHeader('Set-Cookie', [refreshCookieValue, authCookieValue]);

    res.json(
      new UserAuthResponse({
        message: 'user was found from refresh jwt token',
        successfulAuth: true,
        userResponse: user,
      }),
    );
  }

  @ApiCookieAuth()
  @Post('log-out')
  async logOut(@GetUserFromReqDec() user: MappedUserResponse, @Res() res: Response) {
    await this.authService.usersService.removeRefreshToken(user.id);

    const logOutCookies = this.authService.getCookiesForLogOut();

    res.setHeader('Set-Cookie', [...logOutCookies]);

    res.json({
      message: 'user was successfully logged out',
      successfulAuth: true,
      userId: user.id,
    });
  }
}
