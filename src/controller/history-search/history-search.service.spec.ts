import { Test, TestingModule } from '@nestjs/testing';
import { HistorySearchService } from './history-search.service';

describe('HistorySearchService', () => {
  let service: HistorySearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorySearchService],
    }).compile();

    service = module.get<HistorySearchService>(HistorySearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
