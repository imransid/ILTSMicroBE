import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AuthService {
  validateToken(data: { token: string }): Observable<{ isValid: boolean }>;
}

@Injectable()
export class TokenValidationService {
  private authService: AuthService;

  constructor(
    @Inject('USERPROTO_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.authService
        .validateToken({ token })
        .toPromise();

      if (!response.isValid) {
        throw new UnauthorizedException('Invalid or expired token.');
      }

      return response.isValid;
    } catch (error) {
      console.error('Token validation failed:', error);
      throw new UnauthorizedException('Token validation error.');
    }
  }
}
