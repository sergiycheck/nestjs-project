import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { MyLogger } from './injecting-custom-logger/my-logger.service';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DbInitializer } from './seedDb';
import { CustomConnectionService } from './custom-conn.service';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  mongoose.set('debug', { shell: true });

  const logger = new MyLogger(app.get(ConfigService));
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

  const config = new DocumentBuilder()
    .setTitle('Auth app example')
    .setDescription('The auth app API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'My API Docs',
  };
  SwaggerModule.setup('api', app, document, customOptions);

  const connection = app.get(CustomConnectionService).getConnection();
  const dbInitializer = new DbInitializer(connection, logger);
  await dbInitializer.seedDb();

  await app.listen(3000);
}
bootstrap();
