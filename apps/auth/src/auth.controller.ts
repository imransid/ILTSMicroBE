import { Controller, Get, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ClientKafka,
  Ctx,
  GrpcMethod,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import validateTokenFromTutorial from './Collaboration/kafkaConsumer';

@Controller()
export class AuthController {
  // constructor(private readonly authService: AuthService) {}

  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'validateToken')
  validateToken(data: { token: string }) {
    const { token } = data;

    // Here you would validate the token (for example, check if it's valid in the database or via another service)
    if (!token) {
      return {
        isValid: false,
      };
    }

    // For demonstration purposes, assume token is valid
    // You can replace this with actual token validation logic
    const isValid = token === 'valid-token'; // Example logic

    return { isValid };
  }
}
