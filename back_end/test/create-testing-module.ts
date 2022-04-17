import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MyLoggerModule } from '../src/injecting-custom-logger/myLogger.module';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { ArticleModule } from '../src/article/article.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';
import { CustomConnectionService } from '../src/custom-conn.service';
import { AppController } from '../src/app-initial/app.controller';
import { AppService } from '../src/app-initial/app.service';

export const createAndCompileTestingModule = async ({
  partOfTheDbName,
}: {
  partOfTheDbName: string;
}) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ cache: true, expandVariables: true }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          let uri = configService.get<string>('MONGO_TESTING_DB_URI');
          uri = uri.concat(partOfTheDbName);
          return { uri };
        },
        inject: [ConfigService],
      }),
      MyLoggerModule,
      // ThrottlerModule.forRoot({ ttl: 5, limit: 10 }),
      AuthModule,
      UsersModule,
      ArticleModule,
    ],
    controllers: [AppController],
    providers: [
      // { provide: APP_GUARD, useExisting: ThrottlerGuard },
      { provide: APP_FILTER, useExisting: AllExceptionsFilter },
      // ThrottlerGuard,
      AllExceptionsFilter,
      CustomConnectionService,
      AppService,
    ],
  }).compile();

  return moduleFixture;
};
