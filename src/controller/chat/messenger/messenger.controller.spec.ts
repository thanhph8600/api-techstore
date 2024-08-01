import { Test, TestingModule } from '@nestjs/testing';
import { MessengerController } from './messenger.controller';
import { MessengerService } from './messenger.service';

describe('MessengerController', () => {
  let controller: MessengerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessengerController],
      providers: [MessengerService],
    }).compile();

    controller = module.get<MessengerController>(MessengerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
