import { Test, TestingModule } from '@nestjs/testing';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';

describe('TutorialController', () => {
  let tutorialController: TutorialController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TutorialController],
      providers: [TutorialService],
    }).compile();

    tutorialController = app.get<TutorialController>(TutorialController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tutorialController.getHello()).toBe('Hello World!');
    });
  });
});
