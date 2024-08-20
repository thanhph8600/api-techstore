import { Test, TestingModule } from '@nestjs/testing';
import { MessageShortCutService } from './message-short-cut.service';

describe('MessageShortCutService', () => {
  let service: MessageShortCutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageShortCutService],
    }).compile();

    service = module.get<MessageShortCutService>(MessageShortCutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
