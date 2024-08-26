import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisShopController } from './analysis-shop.controller';
import { AnalysisShopService } from './analysis-shop.service';

describe('AnalysisShopController', () => {
  let controller: AnalysisShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisShopController],
      providers: [AnalysisShopService],
    }).compile();

    controller = module.get<AnalysisShopController>(AnalysisShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
