import { NestFactory } from '@nestjs/core';
import { TutorialModule } from './tutorial.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create(TutorialModule, new FastifyAdapter());
  await app.listen(4001);
}
bootstrap();
