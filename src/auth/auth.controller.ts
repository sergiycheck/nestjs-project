import { Controller, Post, Req, Request } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Public } from './metadata.decorators';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { GetUserFromReq } from 'src/base/decorators/get-user-from-req.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUserFromReq() user: User) {
    const access_token = await this.authService.login(user);
    return {
      message: 'successfully logged in ',
      user_jwt: access_token,
    };
  }
}
