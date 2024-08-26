import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisShopService } from './analysis-shop.service';

describe('AnalysisShopService', () => {
  let service: AnalysisShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisShopService],
    }).compile();

    service = module.get<AnalysisShopService>(AnalysisShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
