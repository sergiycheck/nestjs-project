import { Controller, Post, UseFilters } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Public } from './metadata.decorators';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { GetUserFromReqDec } from '../base/decorators/get-user-from-req.decorator';
import { UserLoginResponse } from './responses/responses.dto';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/auth.dto';
import { AuthEndPoint } from '../api/endpoints';
import { FailedToAuthExceptionFilter } from './filters/failed-to-auth.filter';

@UseFilters(FailedToAuthExceptionFilter)
@ApiTags(AuthEndPoint)
@Controller(AuthEndPoint)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginAuthDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUserFromReqDec() user: MappedUserResponse) {
    const { access_token, userResponse } = await this.authService.login(user);
    return new UserLoginResponse({
      message: 'successfully logged in',
      user_jwt: access_token,
      userResponse,
      successfulAuth: true,
    });
  }
}
