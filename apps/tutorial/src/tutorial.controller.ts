import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TutorialService } from './tutorial.service';

@Controller()
export class TutorialController implements OnModuleInit, OnModuleDestroy {
  constructor(
    // private readonly tutorialService: TutorialService,
    @Inject('any_client_id_i_want') private readonly client: ClientKafka, // Ensure the token is correct
  ) {}

  async onModuleInit() {
    console.log('ok');
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
      foo: 'bar2334',
      data: new Date().toString(),
    });
  }
}
