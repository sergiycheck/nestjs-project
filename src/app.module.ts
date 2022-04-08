import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MyLoggerModule } from './injecting-custom-logger/myLogger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { CustomConnectionService } from './custom-conn.service';
import { AppController } from './app-initial/app.controller';
import { AppService } from './app-initial/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, expandVariables: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        return { uri };
      },
      inject: [ConfigService],
    }),
    MyLoggerModule,
    ThrottlerModule.forRoot({ ttl: 5, limit: 10 }),
    AuthModule,
    UsersModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useExisting: ThrottlerGuard },
    { provide: APP_FILTER, useExisting: AllExceptionsFilter },
    ThrottlerGuard,
    AllExceptionsFilter,
    CustomConnectionService,
    AppService,
  ],
})
export class AppModule {}
