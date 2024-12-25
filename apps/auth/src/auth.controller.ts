import { Controller, Get, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ClientKafka,
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AuthController {
  // constructor(private readonly authService: AuthService) {}

  constructor(private readonly authService: AuthService) {}

  @MessagePattern('medium.rocks')
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response =
      `Receiving a new message from topic: medium.rocks: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }
}
