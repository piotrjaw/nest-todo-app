import { NestFactory } from '@nestjs/core';
import { createDatabase } from 'typeorm-extension';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const { database } = configuration();
  await createDatabase({ ifNotExist: true }, database as any);

  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
