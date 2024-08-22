import { Test, TestingModule } from '@nestjs/testing';
import { HistorySearchController } from './history-search.controller';
import { HistorySearchService } from './history-search.service';

describe('HistorySearchController', () => {
  let controller: HistorySearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorySearchController],
      providers: [HistorySearchService],
    }).compile();

    controller = module.get<HistorySearchController>(HistorySearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
