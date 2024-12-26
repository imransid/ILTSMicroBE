import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  // Create Kafka microservice
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['kafka:9092'], //['kafka:9092'],
        },
      },
    });

  // Start Kafka microservice
  await microservice.listen();

  // Create and start HTTP service on port 4000
  const httpApp = await NestFactory.create(AuthModule);
  await httpApp.listen(4000);
}
bootstrap();
