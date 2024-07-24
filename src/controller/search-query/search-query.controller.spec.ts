import { Test, TestingModule } from '@nestjs/testing';
import { SearchQueryController } from './search-query.controller';
import { SearchQueryService } from './search-query.service';

describe('SearchQueryController', () => {
  let controller: SearchQueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchQueryController],
      providers: [SearchQueryService],
    }).compile();

    controller = module.get<SearchQueryController>(SearchQueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
