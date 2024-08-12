import { Test, TestingModule } from '@nestjs/testing';
import { ItemsSubOrderController } from './items-sub-order.controller';
import { ItemsSubOrderService } from './items-sub-order.service';

describe('ItemsSubOrderController', () => {
  let controller: ItemsSubOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsSubOrderController],
      providers: [ItemsSubOrderService],
    }).compile();

    controller = module.get<ItemsSubOrderController>(ItemsSubOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
