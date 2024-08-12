import { Test, TestingModule } from '@nestjs/testing';
import { ItemsOrderService } from './items-order.service';

describe('ItemsOrderService', () => {
  let service: ItemsOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsOrderService],
    }).compile();

    service = module.get<ItemsOrderService>(ItemsOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
