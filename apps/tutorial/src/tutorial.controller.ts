import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { TutorialService } from './tutorial.service';
import { Observable } from 'rxjs';

interface AuthService {
  validateToken(data: { token: string }): Observable<{ isValid: boolean }>;
}

@Controller()
export class TutorialController implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('USERPROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Get()
  async getProtoUsers() {
    return await this.authService.validateToken({ token: 'okkk' }).toPromise();
  }
}
