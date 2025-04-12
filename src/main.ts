import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as serveStatic from 'serve-static';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use('/uploads', serveStatic(join(__dirname, '..', 'uploads')));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
