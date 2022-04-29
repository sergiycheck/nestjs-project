import { Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { FailedAuthException } from './responses/response.exceptions';

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

  async login(user: MappedUserResponse) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      userResponse: user,
    };
  }
}
