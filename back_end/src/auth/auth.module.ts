import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { JwtRefreshTokenAuthGuard } from './jwt-refresh-token-auth.guard';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRES_SECONDS')}s`,
        },
        secret: configService.get<string>('PRIVATE_JWT_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    { provide: APP_GUARD, useExisting: JwtRefreshTokenAuthGuard },
    JwtRefreshTokenAuthGuard,
    JwtAuthGuard,
  ],

  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
