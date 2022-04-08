import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PRIVATE_JWT_KEY } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '99999s' },
      secret: PRIVATE_JWT_KEY,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    { provide: APP_GUARD, useExisting: JwtAuthGuard },
    JwtAuthGuard,
  ],

  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
