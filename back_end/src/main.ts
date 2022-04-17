import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp } from './configApp';
import { configSwagger } from './configSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  await configApp(app, true);
  await configSwagger(app);

  const configService = app.get(ConfigService);
  const port = +configService.get('WEB_API_APP_PORT');

  await app.listen(port);
}
bootstrap();
