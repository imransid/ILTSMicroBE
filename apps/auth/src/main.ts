import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import path, { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: 'auth_service:50052',
      package: 'userproto',
      protoPath: join(__dirname, '../../../proto/message.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
