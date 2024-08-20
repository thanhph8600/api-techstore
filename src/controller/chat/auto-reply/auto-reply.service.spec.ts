import { Test, TestingModule } from '@nestjs/testing';
import { AutoReplyService } from './auto-reply.service';

describe('AutoReplyService', () => {
  let service: AutoReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoReplyService],
    }).compile();

    service = module.get<AutoReplyService>(AutoReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
