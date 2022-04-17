import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

export const configSwagger = async (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Auth app example')
    .setDescription('The auth app API description')
    .setVersion('1.0')
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
};
