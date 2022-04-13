import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { MappedUserResponse } from '../users/dto/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<MappedUserResponse> {
    const user = await this.usersService.findOne({ username });

    if (!user)
      throw new UnauthorizedException({
        message: 'user was not found for props',
        props: { username },
      });

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (user && isMatch) {
      return this.getResponseForUser(user);
    }
    return null;
  }

  getResponseForUser(user: LeanDocument<User>) {
    return this.usersService.userObjToPlain(user);
  }

  async login(user: MappedUserResponse) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      userResponse: user,
    };
  }
}
