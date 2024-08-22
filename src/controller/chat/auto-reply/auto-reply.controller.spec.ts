import { Test, TestingModule } from '@nestjs/testing';
import { AutoReplyController } from './auto-reply.controller';
import { AutoReplyService } from './auto-reply.service';

describe('AutoReplyController', () => {
  let controller: AutoReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoReplyController],
      providers: [AutoReplyService],
    }).compile();

    controller = module.get<AutoReplyController>(AutoReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
