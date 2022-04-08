import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp } from './configApp';
import { configSwagger } from './configSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  await configApp(app, true);
  await configSwagger(app);

  await app.listen(3000);
}
bootstrap();
