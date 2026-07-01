import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not set');
  app.enableCors({ origin: process.env.FRONTEND_URL });
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
