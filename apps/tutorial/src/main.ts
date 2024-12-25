import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TutorialModule } from './tutorial.module';

async function bootstrap() {
  const app = await NestFactory.create(TutorialModule);
  await app.listen(4001);
}
bootstrap();
