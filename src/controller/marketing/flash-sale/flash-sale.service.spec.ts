import { Test, TestingModule } from '@nestjs/testing';
import { FlashSaleService } from './flash-sale.service';

describe('FlashSaleService', () => {
  let service: FlashSaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashSaleService],
    }).compile();

    service = module.get<FlashSaleService>(FlashSaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
