import { Injectable } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<LeanDocument<User>> {
    const user = await this.usersService.findOne({ username });

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user._id };

    return {
      //generate JWT token
      access_token: this.jwtService.sign(payload),
    };
  }
}
