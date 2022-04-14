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
import { MyLogger } from './injecting-custom-logger/my-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, expandVariables: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule, MyLoggerModule],
      useFactory: async (configService: ConfigService, logger: MyLogger) => {
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbHost = configService.get<string>('DB_HOST');
        const dbName = configService.get<string>('DB_NAME');
        const dbPort = configService.get<string>('DB_PORT');
        const dbAuthMechanism = configService.get<string>('AUTH_MECHANISM');
        const dbAuthSource = configService.get<string>('AUTH_SOURCE');

        const uri = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authMechanism=${dbAuthMechanism}&authSource=${dbAuthSource}`;
        logger.log(`got uri ${uri}`);

        return { uri };
      },
      inject: [ConfigService, MyLogger],
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
