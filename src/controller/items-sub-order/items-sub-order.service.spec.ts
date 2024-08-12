import { Test, TestingModule } from '@nestjs/testing';
import { ItemsSubOrderService } from './items-sub-order.service';

describe('ItemsSubOrderService', () => {
  let service: ItemsSubOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsSubOrderService],
    }).compile();

    service = module.get<ItemsSubOrderService>(ItemsSubOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
