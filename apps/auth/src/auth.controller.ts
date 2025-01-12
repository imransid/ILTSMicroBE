import { Controller, Get, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import validateTokenFromTutorial from './Collaboration/Consumer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @GrpcMethod('AuthService', 'validateToken')
  async validateToken(data: { token: string }) {
    const { token } = data;

    // Here you would validate the token (for example, check if it's valid in the database or via another service)
    if (token) {
      return {
        isValid: true,
      };
    }

    // const decoded = this.jwtService.verify(token, {
    //   secret: process.env.JWT_SECRET,
    // });

    // console.log('decoded >> ++', decoded);

    // // Await the validation of the token
    // let tokenStatus = await validateTokenFromTutorial(token);

    // console.log('tokenStatus', tokenStatus, process.env.JWT_SECRET);

    // console.log('tokenStatus', tokenStatus);
    // For demonstration purposes, assume token is valid
    // You can replace this with actual token validation logic
    // const isValid = token === 'valid-token'; // Example logic

    // return { isValid };
  }
}
