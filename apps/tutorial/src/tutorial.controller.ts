import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class TutorialController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('any_client_id_i_want') private readonly client: ClientKafka,
  ) {} // @Inject('any_client_id_i_want') private readonly client: ClientKafka, // Ensure the token is correct // private readonly tutorialService: TutorialService,

  async onModuleInit() {
    ['medium.rocks'].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get('kafka-test')
  testKafka() {
    return this.client.emit('medium.rocks', {
      foo: 'bar22',
      data: new Date().toString(),
    });
  }

  @Get('kafka-test-with-response')
  testKafkaWithResponse() {
    return this.client.send('medium.rocks', {
      foo: 'bar23op34',
      data: new Date().toString(),
    });
  }

  @Get('kafka-test-auth')
  authTestKafkaWithResponse() {
    return this.client.send('medium.rocks', {
      Token: 'i am rafa',
      data: new Date().toString(),
    });
  }
}
