import { Test, TestingModule } from '@nestjs/testing';
import { MessageShortCutController } from './message-short-cut.controller';
import { MessageShortCutService } from './message-short-cut.service';

describe('MessageShortCutController', () => {
  let controller: MessageShortCutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageShortCutController],
      providers: [MessageShortCutService],
    }).compile();

    controller = module.get<MessageShortCutController>(
      MessageShortCutController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
