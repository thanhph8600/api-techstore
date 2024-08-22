import { Test, TestingModule } from '@nestjs/testing';
import { SearchQueryService } from './search-query.service';

describe('SearchQueryService', () => {
  let service: SearchQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchQueryService],
    }).compile();

    service = module.get<SearchQueryService>(SearchQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
