import { Injectable } from '@nestjs/common';

@Injectable()
export class TutorialService {
  getHello(): string {
    return 'Hello World!';
  }
}
