import { Controller, Get } from '@nestjs/common';
import { TutorialService } from './tutorial.service';

@Controller()
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  // @Get()
  // getHello(): string {
  //   return this.tutorialService.getHello();
  // }
}
