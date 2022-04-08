import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { MyLogger } from './injecting-custom-logger/my-logger.service';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DbInitializer } from './seedDb';
import { CustomConnectionService } from './custom-conn.service';
import mongoose from 'mongoose';

export const configApp = async (app: INestApplication, seedDb = false) => {
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV');
  if (nodeEnv === 'dev') {
    mongoose.set('debug', { shell: true });
  }

  const logger = new MyLogger(configService);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  app.use(helmet());
  app.enableCors();

  if (seedDb) {
    const connection = app.get(CustomConnectionService).getConnection();
    const dbInitializer = new DbInitializer(connection, logger);
    await dbInitializer.seedDb();
  }
};
